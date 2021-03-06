import { Icon } from "antd";
import { css, StyleSheet } from "aphrodite";
import React, { Fragment } from "react";
import AppContext from "../../../contexts/AppContext";
import * as mailData from "./mockData.json";

const { Consumer, Provider } = React.createContext({} as INavItem);

interface INavItem {
  activeInbox: number;
  activeMail: number;
  menu: any;
  inbox: any;
  mail: any;
  handleClick: any;
  item: any;
  // mailData: any
  mailData?: any;
}

class Email extends React.Component<any> {
  public state = {
    activeInbox: 0,
    activeMail: 0,
    menu: [
      {
        text: "New Message",
        icon: "plus",
        style: "left"
      },
      {
        text: "Delete",
        icon: "delete"
      },
      {
        text: "Junk",
        icon: "stop"
      }
    ],
    inbox: [
      {
        text: "Inbox",
        icon: "inbox"
      },
      {
        text: "Drafts",
        icon: "edit"
      },
      {
        text: "Sent",
        icon: "paper-clip"
      },
      {
        text: "Deleted",
        icon: "delete"
      },
      {
        text: "New Folder"
      }
    ],
    mail: [
      {
        from: "charl",
        subject: "hello",
        plain: "here is some plain text",
        time: "Fri 10:02 PM",
        type: "pushpin"
      },
      {
        from: "charl",
        subject: "hello",
        plain: "here is some plain text",
        time: "Fri 10:02 PM"
      },
      {
        from: "charl",
        subject: "hello",
        plain: "here is some plain text",
        time: "Fri 10:02 PM",
        type: "flag"
      }
    ]
  };

  public componentDidMount() {
    this.TestMailData();
  }

  public TestMailData = async () => {
    console.log("atleast i tried");
    await fetch("http://0.0.0.0:5000/email", {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + this.props.accessToken
      },
      body: JSON.stringify({
        studentId: this.props.userId
      }),
      method: "POST"
    });

    console.log("returned from the domain");
    // .then(data => data.json())
    // console.log("This was the reply", reply)
  };

  public handleClick = (index: any, key: any) => () => {
    console.log("clicked", index);
    if (key === "inbox") {
      this.setState({ activeInbox: index });
    } else {
      this.setState({ activeMail: index });
    }
  };

  public render() {
    return (
      <div className={css(styles.outerContainer)}>
        <div className={css(styles.topNav)}>
          <Provider
            value={{
              ...this.state,
              handleClick: this.handleClick,
              item: "menu"
            }}
          >
            <NavItem />
          </Provider>
        </div>
        <div className={css(styles.content)}>
          <div className={css(styles.left)}>
            <div className={css(styles.inboxes)}>
              <Provider
                value={{
                  ...this.state,
                  handleClick: this.handleClick,
                  item: "inbox"
                }}
              >
                <InboxItem />
              </Provider>
            </div>
          </div>
          <div className={css(styles.messageWrapper)}>
            <div className={css(styles.messages)}>
              <div className={css(styles.mailHeader)}>
                <div>
                  <span>Sort</span>
                  <Icon type="sort-ascending" />
                </div>
                <div className={css(styles.filter)}>
                  <span>Filter</span>
                  <Icon type="filter" />
                </div>
              </div>

              <Provider
                value={{
                  ...this.state,
                  mailData,
                  handleClick: this.handleClick,
                  item: "inbox"
                }}
              >
                <MailItem />
              </Provider>
            </div>
          </div>
          <div className={css(styles.bodies)}>
            <div
              className={css(styles.body)}
              dangerouslySetInnerHTML={{
                __html: mailData[this.state.activeMail].html
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const Item = (props: any) => (
  <div className={css(styles.item)}>
    {props.icon ? (
      <Icon type={props.icon} style={{ fontSize: "17.5px" }} />
    ) : (
      <span style={{ width: "17.5px" }} />
    )}
    <span
      style={{
        paddingLeft: "10px",
        color: props.text === "New Folder" ? blue : ""
      }}
    >
      {props.text}
    </span>
  </div>
);

const MailItem = () => (
  <Consumer>
    {value => (
      <Fragment>
        {value.mailData.slice(0, 20).map((item: any, index: number) => (
          <div
            key={index}
            className={css(
              styles.mailItem,
              value.activeMail === index && styles.active
            )}
            style={{
              borderBottom:
                index + 1 === value.mail.length ? `solid 1px ${gray}` : "none"
            }}
            onClick={value.handleClick(index, "mail")}
          >
            <div>{item.timeDate}</div>
            <div>
              <span>
                <strong>{item.From}</strong>
              </span>
              {item.type && (
                <span style={{ float: "right" }}>
                  <Icon type={item.type} />
                </span>
              )}
            </div>

            <div className={css(styles.middle)}>
              <span>{item.Subject}</span>
              <span style={{ float: "right" }}>{item.dateTime}</span>
            </div>
            <span>{item.plain}</span>
          </div>
        ))}
      </Fragment>
    )}
  </Consumer>
);

const NavItem = () => (
  <Consumer>
    {value => (
      <Fragment>
        {value[value.item].map((item: any, index: number) => (
          <div
            key={index}
            className={css(styles[item.style ? item.style : ""])}
          >
            <Item icon={item.icon} text={item.text} class="" />
          </div>
        ))}
      </Fragment>
    )}
  </Consumer>
);

const InboxItem = () => (
  <Consumer>
    {value => (
      <Fragment>
        {value[value.item].map((item: any, index: number) => (
          <div
            key={index}
            className={css(
              styles.inboxItem,
              value.activeInbox === index && styles.active
            )}
            onClick={value.handleClick(index, "inbox")}
          >
            <Item icon={item.icon} text={item.text} class="" />
          </div>
        ))}
      </Fragment>
    )}
  </Consumer>
);

export default (props: any) => (
  <AppContext.Consumer>
    {value => (
      <Email userId={value.userId} {...props} accessToken={value.token} />
    )}
  </AppContext.Consumer>
);

const blue = "rgba(3, 131, 220, 1)";
const lightBlue = "rgba(187, 219, 244, 0.5)";
const gray = "rgb(245,245,245)";
const grayBorder = "solid 1px rgb(230,230,230)";

const styles = StyleSheet.create({
  mailItem: {
    flexGrow: 1,
    overflow: "auto",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px 20px",
    lineHeight: "1.2",
    borderTop: `1px solid ${gray}`
  },
  middle: {},
  active: {
    color: blue,
    backgroundColor: lightBlue
  },
  mailHeader: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: blue
  },
  filter: {
    marginLeft: "50px"
  },
  outerContainer: {
    margin: "-48px -24px",
    height: "calc(100% + 96px)"
  },
  topNav: {
    width: "100%",
    backgroundColor: gray,
    borderBottom: grayBorder,
    height: "50px",
    display: "flex",
    alignItems: "center",
    color: blue
  },
  content: {
    display: "flex",
    flesDirection: "row",
    height: "calc(100% - 50px)",
    width: "100%"
  },
  left: {
    width: "20%",
    minWidth: "150px"
  },
  inboxes: {
    height: "100%",
    backgroundColor: gray,
    borderRight: grayBorder
  },
  inboxItem: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    ":hover": {
      backgroundColor: "rgba(187, 219, 244, 0.1)",
      cursor: "pointer"
    }
  },
  messageWrapper: {
    height: "100%",
    width: "30%",
    minWidth: "225px",
    backgroundColor: "white",
    borderBottom: grayBorder,
    borderRight: grayBorder,
    display: "flex",
    flexDirection: "column"
  },
  messages: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "0"
  },
  bodies: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    maxHeight: "100%",
    width: "50%",
    minWidth: "375px",
    backgroundColor: gray,
    overflow: "scroll"
  },
  body: {
    marginTop: "30px",
    backgroundColor: "white",
    width: "95%",
    height: "80%",
    maxHeight: "925px",
    overflow: "scroll"
  },
  item: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    ":hover": {
      cursor: "pointer"
    }
  }
});
