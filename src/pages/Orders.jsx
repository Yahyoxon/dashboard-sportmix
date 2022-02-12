import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import axios from "axios";

const Orders = (props) => {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("#");
  const [statusForSearch, setStatusForSearch] = useState("новый");
  const [active, setActive] = useState("новый");
  const [error, setError] = useState("");
  
  
  const shortString = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  const customerTableHead = [
    "order ID",
    "Название",
    "Img",
    "Клиент",
    "Телефон",
    "Регион",
    "Кол-во",
    "Итог",
    "Магазин",
    "Дата",
    "Статус",
    "Oqim",
    // 'Действие'
  ];
  const orderStatus = {
    новый: "primary",
    принято: "accepted",
    ожидающий: "waiting",
    отменен: "canceled",
    куплен: "purchased",
  };
  const orderMenu = [
    {
      typeTxt: "новый",
      type: "new",
    },
    {
      typeTxt: "принято",
      type: "accepted",
    },
    {
      typeTxt: "ожидающий",
      type: "waiting",
    },
    {
      typeTxt: "отменен",
      type: "canceled",
    },
    {
      typeTxt: "куплен",
      type: "purchased",
    },
  ];
  //set Status
  const setStatus = async (status, order_id) => {
    await axios.put(`https://api.sport-mix.uz/api/order/setStatus`, {
      status: status,
      order_id: order_id,
    });
    getOrdersData(searchOrder,statusForSearch)

  };
  const handleOqim = async (id) => {
    try {
      const response = await axios.get(
        `https://api.sport-mix.uz/api/market/vawes/readSingle?id=${id}`
      );
      window.location = `/market-admins/${response.data.vendor_id}`
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // //search order
    getOrdersData(searchOrder,statusForSearch)
  }, [searchOrder, statusForSearch]);

  const getOrdersData =async(findOrder,statusForSearch)=>{
    const response = await axios.post(
      "https://api.sport-mix.uz/api/order/readFromOrderStatus",
      { status: statusForSearch, o_id: findOrder }
    );
    if (response.data.message) {
      setError(response.data.message);
      setOrders([]);
    } else {
      setError("");
      setOrders(response.data.reverse());
    }
  }  //set Thumb Status
  function setStatusAll(status) {
    setStatusForSearch(status);
    setActive(status);
  }

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (order, imdexOfOrder) => (
    <tr key={imdexOfOrder}>
      <td>{order.order_id}</td>
      <td title={order.product}>{shortString(order.product, 20)}</td>
      <td>
        <img
          className="imgProduct"
          width="60px"
          src={order.image}
          alt="orderImage"
        />
      </td>
      <td>{order.username}</td>
      <td>{order.phone}</td>
      <td>{order.region}</td>
      <td>{order.quantity}</td>
      <td>{Number(order.total_price).toLocaleString()}</td>
      <td>
        {props.brands && props.brands.map((brand, br) => {
          return brand.telegram_chat_id === order.send_to ? (
            <span key={br}>{brand.name}</span>
          ) : null;
        })}
      </td>
      <td style={{ maxWidth: "100px" }}>{order.date}</td>
      <td>
        {order.status !== "куплен" ? (
          <select
            className={`orderSelect badge badge-${orderStatus[order.status]}`}
            onChange={(e) => setStatus(e.target.value, order.order_id)}
            required
          >
            {orderMenu.map((orderAction, o) => {
              return order.status === orderAction.typeTxt ? (
                <option key={o} selected value={orderAction.typeTxt}>
                  {orderAction.typeTxt}
                </option>
              ) : (
                <option key={o} value={orderAction.typeTxt}>
                  {orderAction.typeTxt}
                </option>
              );
            })}
          </select>
        ) : (
          <span className="orderSelect badge badge-success">
            {order.status}
          </span>
        )}
      </td>
      <td>
        {order.oqim?
        <button
        className="badge badge-success"
        onClick={() => handleOqim(order.oqim)}
        >
          <i className="bx bx-link-external"></i>
        </button>
        :""}
      </td>
    </tr>
  );

  return (
    <div>
      <div className="tableHeader">
        <h2 className="page-header">Заказы</h2>
        <div className="filters card">
          <div
            onClick={() => setStatusAll("все")}
            className={`filter badge badge-primary ${
              active === "все" ? "active" : ""
            }`}
          >
            все
          </div>
          {orderMenu.map((orderMenus, orm) => {
            return (
              <div
                key={orm}
                onClick={() => setStatusAll(orderMenus.typeTxt)}
                className={`filter badge badge-${orderMenus.type} ${
                  active === orderMenus.typeTxt ? "active" : ""
                }`}
              >
                {orderMenus.typeTxt}
              </div>
            );
          })}
        </div>
        <div className="topnav__search">
          <input
            type="text"
            value={searchOrder}
            onChange={(e) => {
              setSearchOrder(e.target.value);
            }}
            placeholder="Search here..."
          />
          <i className="bx bx-search"></i>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <div className="count">
                Заказы ({active}): {orders.length}
              </div>
              <Table
                limit="20"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={orders}
                renderBody={(item, index) => renderBody(item, index)}
              />
              {error ? <span className="empty">{error}</span> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
