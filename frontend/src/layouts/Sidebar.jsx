/* eslint-disable react/prop-types */
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { getUserInfo } from "../utils/authService";

const Sidebar = ({ collapsed }) => {
  const { role } = getUserInfo();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth="0"
      width={220}
      style={{
        background: "white",
        paddingLeft: "20px",
      }}
    >
      <img
        className="w-[80%] my-6 ml-5 bg-gray-500 p-2 rounded-lg"
        src={logo}
        alt=""
      />
      <p className="font-semibold">Menu</p>
      {role === "admin" ? (
        <Menu theme="light" mode="inline">
          <Menu.Item key="1">
            <Link to="/users">Manage Users</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/items">Items</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/meals">Meals</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/schedule">Meal Schedule</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu theme="light" mode="inline">
          <Menu.Item key="1">
            <Link to="/order">Meal Order</Link>
          </Menu.Item>
        </Menu>
      )}
    </Sider>
  );
};

export default Sidebar;
