/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button } from "antd";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { getUserInfo, removeUserInfo } from "../utils/authService";
import CustomButton from "../components/CustomButton";

const { Content } = Layout;
const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const user = getUserInfo();

  const logOut = () => {
    removeUserInfo("accessToken");

    navigate("/login");
  };

  return (
    <Layout className="h-screen">
      <Sidebar collapsed={collapsed} />
      <Layout>
        {/* header */}
        <div
          className="flex justify-between items-center pr-6"
          style={{
            padding: 0,
            background: "#F5F5F5",
            borderBottom: "3px solid white",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="text-black text-lg">
            <p> Welcome, </p>
          </div>
          <div className="">
            <CustomButton onClick={logOut} className="bg-gray-600">
              {" "}
              Log out{" "}
            </CustomButton>
          </div>
        </div>

        {/* content */}
        <Content
          style={{
            // marginTop: "5px",
            padding: 24,
            minHeight: 280,
            background: "#F5F5F5",
            // borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
