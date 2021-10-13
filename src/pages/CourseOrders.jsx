import React, { useState, useEffect } from 'react'
import Table from '../components/table/Table'
import axios from "axios";

const CourseOrders = () => {
    
    const shortString = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };
    const [orders, setOrders] = useState([])
    const [searchOrder, setSearchOrder] = useState("#")
    const [foundOrders, setFoundOrders] = useState([])
    const [error, setError] = useState("")

    //orders
    async function getOrdersData() {
        const response = await axios.post('https://api.sport-mix.uz/api/courseOrder/read');
        if (response.data.message) {
            setOrders([])
            console.log(response.data.message);
        } else {
            setOrders(response.data.reverse())

        }
    }
    useEffect(() => {
        getOrdersData()
    }, [])




    const orderStatus = {
        "новый": "primary",
        "принято": "accepted",
        "ожидающий": "waiting",
        "отменен": "canceled",
        "куплен": "purchased"
    }

    const customerTableHead = [
        'order ID',
        'Device ID',
        'Пользователь',
        'Телефон',
        'Дата',
        'Статус',
        'Действие'
    ]

    const orderMenu = [
        {
            typeTxt: "новый",
            type: "new"
        },
        {
            typeTxt: "принято",
            type: "accepted"
        },
        {
            typeTxt: "ожидающий",
            type: "waiting"
        },
        {
            typeTxt: "отменен",
            type: "canceled"
        },
        {
            typeTxt: "куплен",
            type: "purchased"
        }
    ]

    const setStatus = async (status, order_id) => {
        const response = await axios.put(`https://api.sport-mix.uz/api/courseOrder/setStatus`,
            {
                "status": status,
                "order_id": order_id
            }
        )
        if (response.data.message) {
            console.log(response.data.message);
        } else {
            console.log(response.data);
        }
        getOrdersData()
        getFoundOrder("#")
    }



    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{item.order_id}</td>
            <td title={item.device_id}>{shortString(item.device_id, 20)}</td>
            {/* <td>{item.product}</td> */}
            <td>{item.username}</td>
            <td>{item.phone}</td>
            {/* <td>{item.region}</td> */}
            <td>{item.date}</td>
            <td>
                <select className={`orderSelect badge badge-${orderStatus[item.status]}`} onChange={(e) => setStatus(e.target.value, item.order_id)} required>
                    {orderMenu.map((orderAction, o) => {
                        return item.status === orderAction.typeTxt ? <option key={o} selected value={orderAction.typeTxt}  >{orderAction.typeTxt}</option> : <option key={o} value={orderAction.typeTxt}  >{orderAction.typeTxt}</option>
                    })}
                </select>
            </td>
            <td>
                {/* <Link to={`order/edit-order/${item.id}`} className="badge-btn badge-primary bx bx-edit editBtnMargin"></Link> */}
                <button className="badge-btn badge-danger bx bx-trash" onClick={() => { deleteProduct(item.order_id, item.product) }}></button>
            </td>

        </tr>
    )



    //delete
    const deleteProduct = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/courseOrder/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "order_id": id }
            });
            await getOrdersData()
            await getFoundOrder("#")
        } else {
            console.log("Not deleted");
        }

    }


    //search order
    async function getFoundOrder(findOrder) {
        const response = await axios.post('https://api.sport-mix.uz/api/courseOrder/readFromOrderId', { "o_id": findOrder })
        if (response.data.message) {
            setFoundOrders([])
            setError(response.data.message)
        } else {
            setError("")
            setFoundOrders(response.data.reverse())
        }
    }
    useEffect(() => {
        getFoundOrder(searchOrder)
    }, [searchOrder])

    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Заказы
                </h2>
                <div className="topnav__search">
                    <input type="text" value={searchOrder} onChange={(e) => { setSearchOrder(e.target.value) }} placeholder='Search here...' />
                    <i className='bx bx-search'></i>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='20'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={foundOrders || orders}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                            {error ? <span className="empty">{error}</span> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseOrders
