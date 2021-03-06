import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import testRasm from "../assets/images/pngegg.png";
import axios from "axios";
import { Link } from "react-router-dom";

const Admins100k = () => {
  const [adminsData, setAdminsData] = useState([])
  const [debtorsData, setDebtorsData] = useState([])
  const [isDebt, setIsDebt] = useState(false)
  const [reports, setReports] = useState([])
  const [renderHeadIndex, setRenderHeadIndex] = useState()
  const [info, setInfo] = useState([])
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
        const filtered = response.data.filter((order) => order.oqim !== null && order.status ==="куплен");
        setReports(filtered);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  console.log(reports)
  // console.log(adminsData)
const debtorGenerator=()=>{
 let index = 0
 const DebtorsList = []
  for (let i = 0; i < adminsData.length; i++) {
    if (adminsData[i].payment !== null) {
      DebtorsList[index++] = adminsData[i];
    }
  } 
  setDebtorsData(DebtorsList)
  setIsDebt(true)
}
console.log(debtorsData)
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

  const renderHead = (item, index) => (
    <th key={index} onClick={() => setRenderHeadIndex(item)}>
      {item}
    </th>
  );

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
        {console.log(admin)}
        <Link to={`/market-admins/${admin.id}`} className={admin.payment === null?"badge badge-waiting":"badge badge-danger"}>
          Подробнее
        </Link>
      </td>
    </tr>
  );


  return (
    <div>
      <div className="row-custom">
        <div className="column-custom" >
          <div className="report-card">
            <div className="report-card__info">
              <h4>{info && info[0]}</h4>
              <span>Количество проданных товаров</span>
            </div>
          </div>
        </div>
        <div className="column-custom">
          <div className="report-card">
            <div className="report-card__info">
              <h4>{info[1] && info[1].toLocaleString()}</h4>
              <span>Всего выплачено (so'm)</span>
            </div>
          </div>
        </div>
        <div className="column-custom" >
          <div
            className="report-card"
            style={{
              background: info[2] !== 0 && "red",
              color: "#fff",
            }}
          >
            <div className="report-card__info" onClick={()=>debtorGenerator()}>
              <h4>{info[2] && info[2].toLocaleString()}</h4>
              <span>Общая задолженность (so'm)</span>
            </div>
          </div>
        </div>
        <div className="column-custom" >
          <div className="report-card">
            <div className="report-card__info">
              <h4>{info[3] && info[3].toLocaleString()}</h4>
              <span>Итого (so'm)</span>
            </div>
          </div>
        </div>
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
                headData={customerTableHead && customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={isDebt? debtorsData: adminsData}
                renderBody={(item, index) => renderBody(item, index)}
                renderHeadIndex={renderHeadIndex && renderHeadIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins100k;
