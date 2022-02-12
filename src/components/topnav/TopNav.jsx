import React, { useState, useEffect } from "react";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import user_image from "../../assets/images/photo_2021-07-31_23-53-26.jpg";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Topnav = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  var adm = "";
  if (localStorage.getItem("admin")) {
    adm = JSON.parse(localStorage.getItem("admin"));
  } else {
    adm = "";
  }

  const curr_user = {
    display_name: adm["username"],
    image: user_image,
  };

  const renderNotificationItem = (item, index) => (
    <Link to="/orders" className="notification-item" key={index}>
      <i className={item.icon}></i>
      <span>{item.product}</span>
    </Link>
  );

  const renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user.display_name}</div>
    </div>
  );

//   const renderUserMenu = (item, index) => (
//     <Link to={item.link} key={index}>
//       <div className="notification-item">
//         <i className={item.icon}></i>
//         <span>{item.content}</span>
//       </div>
//     </Link>
//   );

  //orders
  async function getOrdersData() {
    const NewOrders = [];
    let a = 0
    const response = await axios.post(
      "https://api.sport-mix.uz/api/order/read"
    );
    if (response.data.message) {
      setOrders([]);
      console.log(response.data.message);
    } else {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].status === "новый") {
          NewOrders[a++] = response.data[i];
        }
      }
      setOrders(NewOrders.reverse());
    }
  }
  useEffect(() => {
    getOrdersData();
  }, []);

  const logOut = () => {
    const confirm = window.confirm(`Do you really want to logout?`);
    if (confirm === true) {
      localStorage.removeItem("admin");
      history.goBack();
    }
  };

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={[0]}
            renderItems={() => (
              <div key={0}>
                <Link to="/profile">
                  <div className="notification-item">
                    <i className="bx bx-user"></i>
                    <span>Profile</span>
                  </div>
                </Link>
                <div style={{ cursor: "pointer" }} onClick={logOut}>
                  <div className="notification-item">
                    <i className="bx bx-log-out-circle bx-rotate-180"></i>
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
        {console.log(orders)}
        <div className="topnav__right-item" style={{ zIndex: 999999 }}>
          <Dropdown
            icon="bx bx-bell"
            badge={orders.length}
            contentData={orders}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => orders.length>0?<Link to="/orders">Посмотреть все</Link>:"заказов пока нет"}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;
