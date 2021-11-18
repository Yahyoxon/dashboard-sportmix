import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import logo from "../../assets/images/sportmix-logo.png";
import logo2 from "../../assets/images/logo_without_text.png";
import sidebar_items from "../../assets/JsonData/sidebar_routes.json";
import { VscMenu, VscClose } from "react-icons/vsc";
const SidebarItem = (props) => {
  const active = props.active ? "active" : "";

  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const [isSideBar, setIsSideBar] = useState("sidebar");
  const [isOpen, setIsOpen] = useState(true);
  const activeItem = sidebar_items.findIndex(
    (item) => item.route === props.location.pathname
  );
  const handleOpener = () => {
    if (isOpen) {
      setIsSideBar("sidebarClosed");
      setIsOpen(!isOpen);
    } else {
      setIsSideBar("sidebar");
      setIsOpen(!isOpen);
    }
  };
  return (
    <div className={isSideBar}>
      <div className="sidebarOpener">
        {isSideBar === "sidebar" ? (
          <VscClose className="vsc" onClick={handleOpener} />
        ) : (
          <VscMenu className="vsc" onClick={handleOpener} />
        )}
      </div>
      <div className="sidebar__logo">
        <img src={isOpen?logo:logo2} alt="" />
      </div>
      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index}>
            {isOpen?
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />:
          <SidebarItem
          title={""}
          icon={item.icon}
          active={index === activeItem}
        />}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
