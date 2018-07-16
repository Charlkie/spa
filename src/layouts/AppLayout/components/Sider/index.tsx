import { Layout } from "antd";
import React from "react";

interface ISiderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  navigation: React.SFC;
}

/**
 * Sider for the main layout.
 * It is the vertical sider which contains a menu (navigation).
 */
const Sider: React.SFC<ISiderProps> = ({
  collapsed,
  onCollapse,
  navigation
}) => {
  const Navigation = navigation;
  return (
    <Layout.Sider
      breakpoint="lg"
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapsible={true}
      className="main-layout-sider"
    >
      <div className="logo" style={{ height: "64px", paddingLeft: "24px" }}>
        <a href="#/">
          <img style={{ height: "32px" }} src="/gngc.png" alt="Logo" />
          <h1>@ School</h1>
        </a>
      </div>

      <Navigation />
    </Layout.Sider>
  );
};

export default Sider;
