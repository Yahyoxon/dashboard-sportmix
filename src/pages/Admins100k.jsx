import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import testRasm from "../assets/images/pngegg.png";
import axios from "axios";
import { Link } from "react-router-dom";

const Admins100k = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [reports, setReports] = useState([]);
  const [info, setInfo] = useState([]);
  const customerTableHead = [
    "ФИО",
    "Телефон",
    "Область",
    "Район",
    "Адресс",
    "Oqim",
    "Оплата",
    "Фото",
    "",
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "https://api.sport-mix.uz/api/market/auth/read"
        );
        setAdminsData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "https://api.sport-mix.uz/api/order/read"
        );
        const filtered = response.data.filter((order) => order.oqim !== null);
        setReports(filtered);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    let totalCount = 0;
    let totalSum = 0;
    let totalCash = 0;
    let totalNotPaid = 0;
    reports.map(
      (report) => report.paid === 1 && (totalCount += report.quantity)
    );
    reports.map((cash) => cash.paid === 1 && (totalCash += cash.cashback));
    reports.map((sum) => (totalSum += sum.total_price));
    reports.map(
      (notPaid) => notPaid.paid === 0 && (totalNotPaid += notPaid.cashback)
    );
    setInfo([totalCount, totalCash, totalNotPaid, totalSum]);
  }, [reports]);

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (admin, indexOfAdmin) => (
    <tr key={indexOfAdmin}>
      <td>{admin.name}</td>
      <td>{admin.phone}</td>
      <td>{admin.region}</td>
      <td>{admin.city}</td>
      <td>{admin.address}</td>
      <td>{admin.oqim_count}</td>
      <td>{Number(admin.payment).toLocaleString()}</td>
      <td>
        <img
          className="imgProduct"
          width="60px"
          src={admin.image || testRasm}
          alt=""
        />
      </td>
      <td>
        <Link to={`/market-admins/${admin.id}`} className="badge badge-waiting">
          Подробнее
        </Link>
      </td>
    </tr>
  );

  const reportData = [
    { id: 1, title: "Количество проданных товаров", value: info && info[0] },
    {
      id: 2,
      title: "Всего выплачено (so'm)",
      value: info[1] && info[1].toLocaleString(),
    },
    {
      id: 3,
      title: "Общая задолженность (so'm)",
      value: info[2] && info[2].toLocaleString(),
    },
    { id: 4, title: "Итого (so'm)", value: info[3] && info[3].toLocaleString() },
  ];

  return (
    <div>
      <div className="row-custom">
        {reportData.map((item) => {
          return (
            <div className="column-custom" key={item.id}>
              <div className="report-card">
                <div className="report-card__info">
                  <h4>{item.value}</h4>
                  <span>{item.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tableHeader">
        <h2 className="page-header">Админы маркета</h2>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <div className="count">
                Количество админов: {adminsData.length}
              </div>
              <Table
                limit="20"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={adminsData}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins100k;
