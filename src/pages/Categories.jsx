import React from 'react'
import Table from '../components/table/Table'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Categories = (props) => {

    //delete
    const deleteCategory = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/categories/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            await props.getCategories()
        } else {
            console.log("Not deleted");
        }

    }

    const customerTableHead = [
        '',
        '№',
        'Название',
        // 'Ссилки',
        'Изображение',
        'Изменить',
        'Удалить'
    ]

    const setUp = async (id, sort_id) => {
        await axios.put(`https://api.sport-mix.uz/api/categories/move`, { "id": id, "sort_id": sort_id, "type": "up" }
        );
        await props.getCategories()
    }
    const setDown = async (id, sort_id) => {
        await axios.put(`https://api.sport-mix.uz/api/categories/move`, { "id": id, "sort_id": sort_id, "type": "down" }
        );
        await props.getCategories()
    }

    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
        <tr className="tabRow" key={index}>
            <td style={{ padding: "0" }}>
                <div className="drags">
                    <button className="up bx bx-up-arrow" title="move to up" onClick={() => setUp(item.id, item.sort_id)}></button>
                    <button className="down bx bx-down-arrow" title="move to down" onClick={() => setDown(item.id, item.sort_id)}></button>
                </div>
            </td>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            {/* <td>{item.link}</td> */}
            <td><img src={item.image} className="borderRadius" alt="category img" height="80px" /></td>
            <td>
                <Link to={`/categories/edit-category/${item.id}`}>
                    <button className="badge-btn badge-primary">Изменить</button>
                </Link>
            </td>
            <td><button className="badge-btn badge-danger" onClick={() => { deleteCategory(item.id, item.name) }}>Удалить</button></td>
        </tr>
    )
    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Категории
                </h2>
                <Link to="/categories/add-category"><button className="badge badge-success">Добавить</button></Link>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                // limit='20'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={props.categories}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Categories
