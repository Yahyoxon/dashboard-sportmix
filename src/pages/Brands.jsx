import React from 'react'
import Table from '../components/table/Table'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Brands = (props) => {

    //delete
    const deleteCategory = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/brands/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            await props.getBrands()
        } else {
            console.log("Not deleted");
        }

    }

    const customerTableHead = [
        '№',
        'Название',
        // 'Ссилки',
        'Изображение',
        'Изменить',
        'Удалить'
    ]
    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td><img src={item.image} className="borderRadius" alt="category_img" height="80px" /></td>
            <td>
                <Link to={`/brands/edit-brand/${item.id}`}>
                    <button className="badge-btn badge-primary">Изменить</button>
                </Link>
            </td>
            <td><button className="badge-btn badge-danger " onClick={() => { deleteCategory(item.id, item.name) }}>Удалить</button></td>
        </tr>
    )
    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Магазины
                </h2>
                <Link to="/brands/add-brand"><button className="badge badge-success">Добавить</button></Link>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='21'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={props.brands.length > 0 ? props.brands : []}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Brands
