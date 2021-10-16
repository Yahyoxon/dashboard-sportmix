import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Ads = () => {

    const [ads, setAds] = useState([])

    //videos
    async function getAds() {
        const response = await axios.post('https://api.sport-mix.uz/api/ads/read')

        if (response.data.message) {
            setAds([])
            console.log(response.data.message);
        } else {
            setAds(response.data.reverse())
        }
    }
    useEffect(() => {
        getAds()
        setAds([])
    }, [])



    //delete
    const deleteCategory = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/ads/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            await getAds()
        } else {
            console.log("Not deleted");
        }

    }



    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Ads Баннер
                </h2>
                <Link to="/ads/add-ads"><button className="badge badge-success">Добавить</button></Link>
            </div>
            {/* <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='20'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={ads}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="row">
                            {ads.map((item, v) => {
                                return <div key={v} className="col-4">
                                    <div className="card">
                                        <div className="videoShow">
                                            <video className="borderRadius" src={item.video} controls />
                                            <span>Создано: {item.created_at}</span>
                                            <button className="floatDel badge badge-danger" onClick={() => { deleteCategory(item.id, item.name) }}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                            })}
                            {/* <div className="col-4">
                                <div className="card full-height">
                                    <Link to="/tutorials/add-course-video" className="addNew">
                                        <span className="bx bx-plus"></span>
                                    </Link>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Ads
