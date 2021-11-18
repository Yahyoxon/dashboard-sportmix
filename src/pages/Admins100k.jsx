import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import testRasm from '../assets/images/pngegg.png'
import axios from "axios";
import { Link } from "react-router-dom";

const Admins100k = () => {
  const [adminsData, setAdmisData] = useState([]);
  const customerTableHead = [
    "ФИО",
    "Телефон",
    "Область",
    "Район",
    "Адресс",
    "Oqim",
    "Оплата",
    "Фото",
    ""
  ];
 
  useEffect(() => {
   (async()=>{
    try {
      const response = await axios.get("https://api.sport-mix.uz/api/market/auth/read")
      setAdmisData(response.data)
    } catch (error) {
      console.log(error)
    } 
   })();
  }, [])
  
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
      <td><Link to={`/market-admins/${admin.id}`} className="badge badge-waiting">Подробнее</Link></td>
    </tr>
  );

  return (
    <div>
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
