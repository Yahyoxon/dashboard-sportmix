import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import "../assets/css/admins-account.scss";
import { useSelector } from "react-redux";
import testRasm from "../assets/images/pngegg.png";
import { useParams } from "react-router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Chart from "react-apexcharts";
import axios from "axios";

const AdminAccount = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState([]);
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  const [oqimData, setOqimData] = useState([]);
  const [totalSold, setTotalSold] = useState(0);
  const [totalCancel, setTotalCancel] = useState(0);
  const [orders, setOrders] = useState([]);
  const customerTableHead = [
    "Oqim nomi",
    "yaratilgan vaqti",
    "sotilgan soni",
    "Ko'rildi",
    "Oqim linki"
  ];
  const orderTable = [
    "order ID",
    "Tovar nomi",
    "Rasm",
    "Soni",
    "Tovar narxi",
    "Vaqti",
    "Holati",
    "Oqim",
    "To'lov",
    "To'lov holati",
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://api.sport-mix.uz/api/market/auth/readSingle?id=${id}`
        );
        setAdmin(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://api.sport-mix.uz/api/market/vawes/readForStatistics?id=${id}`
        );
        setOqimData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);
  
  useEffect(() => {
    let totalSold = [];
    let totalCancel = [];
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status === "куплен") {
        totalSold[i] = orders[i].status;
      }
      if (orders[i].status === "отменен") {
        totalCancel[i] = orders[i].status;
      }
    }
    setTotalSold(totalSold);
    setTotalCancel(totalCancel);
  }, [orders]);

  
  const getOrders =async(id)=>{
    try {
      const response = await axios.get(
        `https://api.sport-mix.uz/api/order/readByAdmin?id=${id}`
      );
      setOrders(response.data);
    } catch (error) {
       console.log(error)
    }    
  }
  useEffect(() => {
    getOrders(id)
  }, [id]);
  
  const setPaid = async (paid, order_id) => {
    if (window.confirm("To'landimi?")) {
      await axios.put(`https://api.sport-mix.uz/api/order/setPaid`, {
        paid: paid,
        order_id: order_id,
      });
      getOrders(id)
    }
  };

  //regions chart
  const chartOptionsRegion = {
    series: [totalCancel.length || 0, totalSold.length || 0],
    options: {
      chart: {
        background: "transparent",
      },
      labels: ["Bekor qilindi", "Sotildi"],
      legend: {
        position: "bottom",
      },
    },
  };
  
  const renderHead = (item, index) => <th key={index}>{item}</th>;
  const renderBody = (oqim, indexOfAdmin) => (
    <tr key={indexOfAdmin}>
      <td>{oqim.name}</td>
      <td>{oqim.created_at}</td>
      <td>{oqim.delivered}</td>
      <td>{oqim.visits}</td>
      <td>
      <a
        className="badge badge-success"
        href={oqim.link_website}
        >
          <i className="bx bx-link-external"></i>
        </a></td>
    </tr>
  );
  
  const renderHeadOrders = (item, index) => <th key={index}>{item}</th>;
  const renderBodyOrders = (order, indexOfOrder) => (
    <tr key={indexOfOrder}>
      <td>{order.order_id}</td>
      <td>{order.product}</td>
      <td>
        <img
          className="imgProduct"
          width="60px"
          src={order.image || testRasm}
          alt=""
        />
      </td>
      <td>{order.quantity}</td>
      <td>{Number(order.total_price).toLocaleString()} so'm</td>
      <td>{order.date}</td>
      <td>{order.status}</td>
      <td>{order.oqim}</td>
      <td>{Number(order.cashback * order.quantity).toLocaleString()} so'm</td>
      <td>
        {order.status === "куплен" ? (
          order.paid === 0 ? (
            <button
              className="badge badge-waiting "
              onClick={() => setPaid(true, order.order_id)}
            >
              To'landimi?
            </button>
          ) : (
            <span className="orderSelect paid">to'langan</span>
          )
        ) : (
          <span className="orderSelect notPaid">Kutishda</span>
        )}
      </td>
    </tr>
  );
  return (
    <div>
      <div className="row container-admin">
        <div className="col-3 col-md-6 left-side">
          <div className="card">
            <div className="cardbox card_body">
              <div className="img-box">
                <img src={admin.image || testRasm} alt="" />
              </div>
              <div className="admin-data">
                <p className="name">{admin.name}</p>
                <p className="phone">
                  <strong>Тел:</strong> {admin.phone}
                </p>
                <p className="adress">
                  <strong>Область: </strong> {admin.region}
                </p>
                <p className="adress">
                  <strong>Город: </strong> {admin.city}
                </p>
                <p className="adress">
                  <strong>Адресс: </strong> {admin.address}
                </p>
                <p className="adress register-date">
                  <strong>Рег.время: </strong> {admin.registired_at}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-12 mid-side">
          <div className="card full-height">
            <div className="card__body">
              <Table
                limit="6"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={oqimData.length > 0 ? oqimData : []}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
            <div className="count">Oqimlar: ({oqimData.length || 0})</div>
          </div>
        </div>
        <div className="col-3 col-md-6 right-side">
          <div className="card">
            <div className="card__body">
              <CopyToClipboard text={admin.credit_card}>
                <div className="credit-card">
                  <div className="card-info">
                    <div className="top-row">
                      <div className="card__reader">
                        <div className="card__reader--risk card__reader--risk-one"></div>
                        <div className="card__reader--risk card__reader--risk-two"></div>
                        <div className="card__reader--risk card__reader--risk-three"></div>
                        <div className="card__reader--risk card__reader--risk-four"></div>
                      </div>
                      <div className="cliet-card">Карта админа</div>
                    </div>

                    <div className="card-number">{admin.credit_card}</div>
                    <div className="expired-date">20/24</div>
                  </div>
                  <div className="copy-me">Copy me!</div>
                </div>
              </CopyToClipboard>
              
              <Chart
                className="full-height"
                options={
                  themeReducer === "theme-mode-dark"
                    ? {
                        ...chartOptionsRegion.options,
                        theme: { mode: "dark" },
                      }
                    : {
                        ...chartOptionsRegion.options,
                        theme: { mode: "light" },
                      }
                }
                series={chartOptionsRegion.series}
                type="pie"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="count">Buyurtmalar: ({orders.length || 0})</div>
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={orderTable}
                renderHead={(item, index) => renderHeadOrders(item, index)}
                bodyData={orders}
                renderBody={(item, index) => renderBodyOrders(item, index)}
              />
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default AdminAccount;
