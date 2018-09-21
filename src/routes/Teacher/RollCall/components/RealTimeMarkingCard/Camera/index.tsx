import React from "react";
import { withApollo } from "react-apollo";
import Webcam from "react-webcam";
import AppContext from "../../../../../../contexts/AppContext";
import { withClassroomContext } from "../../../../../../contexts/Teacher/ClassroomContext";
import { getScheduleDetailsQuery } from "../../../../queries";

const uploadImage = async (
  imageData: string,
  studentList: any,
  scheduleId: string,
  token: string
) => {
  const response = await fetch("http://127.0.0.1:5000/camera/upload", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ imageData, studentList, scheduleId })
  });
  if (response.ok) {
    return response.json();
  }

  const errMessage = await response.text();
  throw new Error(errMessage);
};

class Camera extends React.Component<any, any> {
  public state = {
    sendImage: null
  };

  public sendImageInterval: any;

  private webcam: any;

  public setRef = (webcam: any) => {
    this.webcam = webcam;
  };
  public capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    return imageSrc;
  };
  public upload = () => {
    if (this.webcam) {
      const imageSrc = this.webcam.getScreenshot();
      const studentsNotInClass = this.props.classroomContext.students
        .filter((student: any) => !student.inClass)
        .map((student: any) => student.studentDetails.Id);
      if (imageSrc) {
        uploadImage(
          imageSrc,
          studentsNotInClass,
          this.props.classroomContext.scheduleId,
          this.props.token
        )
          .then(data => {
            console.log(data);
            const storeData = this.props.client.readQuery({
              query: getScheduleDetailsQuery,
              variables: {
                teacherUsername: this.props.username,
                line: this.props.classroomContext.line,
                classId: this.props.classroomContext.classId
              }
            });
            const { scheduleDetails } = storeData;
            if (
              scheduleDetails &&
              scheduleDetails.students &&
              scheduleDetails.students.length > 0
            ) {
              storeData.scheduleDetails.students = storeData.scheduleDetails.students.map(
                (student: any) => {
                  if (data.studentList.includes(student.studentDetails.Id)) {
                    return { ...student, inClass: true };
                  }
                  return { ...student };
                }
              );
            }
            this.props.client.writeQuery({
              query: getScheduleDetailsQuery,
              variables: {
                teacherUsername: this.props.username,
                line: this.props.classroomContext.line,
                classId: this.props.classroomContext.classId
              },
              data: storeData
            });
          })
          .catch(err => console.log(err));
      }
    }
  };
  public componentDidMount() {
    this.sendImageInterval = setInterval(this.upload, 500);
  }
  public componentWillUnmount() {
    clearInterval(this.sendImageInterval);
  }
  public render() {
    console.log(this.props.classroomContext);
    return (
      <div style={{ position: "fixed", zIndex: -1, visibility: "hidden" }}>
        <Webcam
          audio={false}
          ref={this.setRef}
          width="100%"
          screenshotFormat="image/jpeg"
        />
      </div>
    );
  }
}

export default withApollo(
  withClassroomContext((props: any) => (
    <AppContext.Consumer>
      {value => (
        <Camera username={value.username} {...props} token={value.token} />
      )}
    </AppContext.Consumer>
  ))
);