import React from 'react'
import Table from '../components/table/Table'
import { Link } from 'react-router-dom'
import axios from 'axios'



const Videos = (props) => {

    const numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num < 900) {
            return num;
        }
    }


    const customerTableHead = [
        '№',
        'Название',
        'Ссилки',
        'Лайк',
        'Просмотр',
        'Удалить'
    ]
    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>
                <video className="borderRadius" height="200px" src={item.link} controls></video>
            </td>
            <td>❤ {numFormatter(item.likes)}</td>
            <td>👁 {numFormatter(item.views)}</td>
            <td><button className="badge-btn badge-danger" onClick={() => { deleteProduct(item.id, item.name) }}>Удалить</button></td>
        </tr>
    )




    //delete
    const deleteProduct = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/videos/delete`, {
                data: { "id": id }
            });
            await props.getVideos()
        } else {
            console.log("Not deleted");
        }

    }
    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    <span>Видео</span>
                </h2>
                <Link to="/video/add-video"><button className="badge badge-success">Добавить</button></Link>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='21'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={props.videos}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                            {
                                props.videos.length === 0 ? <span className="empty">Видео не найдены</span> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Videos
