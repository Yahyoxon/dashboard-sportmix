import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Courses = () => {
    const [courseVideos, setCourseVideos] = useState([])
    const [courseCategories, setCourseCategories] = useState([])
    const [active, setActive] = useState()
    const [catChanger, setCatChanger] = useState()

    //Course videos
    async function getCourseVideos(catID) {
        const response = await axios.post('https://api.sport-mix.uz/api/course/videos/read', { "u_id": 16, "category_id": catID })
        setCourseVideos(response.data)
    }
    useEffect(() => {
        getCourseVideos(catChanger)
        setCourseVideos([])
    }, [catChanger])
    //Course categories
    async function getCourseCategories() {
        const response = await axios.post('https://api.sport-mix.uz/api/course/categories/read', { "u_id": 16 })
        setCourseCategories(response.data)
        setActive(response.data[0].id)
        setCatChanger(response.data[0].id)
    }
    useEffect(() => {
        getCourseCategories()
        setCourseCategories([])
    }, [])




    //delete video
    const deleteCourseVideos = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/course/videos/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            await getCourseVideos(catChanger)
        } else {
            console.log("Not deleted");
        }

    }
    const divStyle = (src) => ({
        backgroundImage: 'url(' + src + ')'
    })



    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Уроки
                </h2>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="tabCategory">
                            {
                                courseCategories.map((cat, i) => {
                                    return <div className="category__item" key={i}>

                                        <div className={`category__item-inner borderRadius bgBtn ${active === cat.id ? "active" : ""}`}
                                            onClick={() => { setCatChanger(cat.id); setActive(cat.id); }}>
                                            <span>
                                                {cat.name}
                                            </span>
                                            <div className="catEdit">
                                                <Link className="bx bx-edit" to={`/tutorials/edit-course-category/${cat.id}`} />
                                            </div>
                                            <div className="forBg" style={divStyle(cat.poster)}></div>
                                        </div>
                                    </div>
                                })
                            }
                            <div className="category__item">
                                <Link to="/tutorials/add-course-category" className={`category__item-inner borderRadius bgBtn add`}>
                                    <span>+</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="row">
                            {courseVideos.map((vid, v) => {
                                return <div key={v} className="col-4">
                                    <div className="card">
                                        <div className="videoShow">
                                            <video className="borderRadius" src={vid.link} controls />
                                            <button className="floatDel badge badge-danger" onClick={() => { deleteCourseVideos(vid.id, vid.name) }}>Удалить</button>
                                            <h3>{vid.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="col-4">
                                <div className="card full-height">
                                    <Link to="/tutorials/add-course-video" className="addNew">
                                        <span className="bx bx-plus"></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/*             <div className="row">
                <div className="col-7">
                    <div className="card">
                        <div className="tableHeader">
                            <p className="page-header">
                                Уроки
                            </p>
                            <Link to="/course/add-video"><button className="badge badge-success">Добавить</button></Link>
                        </div>
                        <div className="topnav__select">
                            <select name="category" onChange={(e) => { setCatChanger(e.target.value); getCourseVideos() }} id="categorySelect">
                                {
                                    props.categories.map((cat, s) => {
                                        return <option key={s} value={cat.id} >{cat.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="card__body">
                            <Table
                                limit='21'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={courseVideos.length > 0 ? courseVideos : []}
                                // bodyData={props.videos.length > 0 ? props.videos : []}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="card">
                        <div className="tableHeader">
                            <p className="page-header">
                                Категории
                            </p>
                            <Link to="/course/add-category"><button className="badge badge-success">Добавить</button></Link>
                        </div>

                        <div className="card__body">
                            <Table
                                limit='21'
                                headData={customerTableCategoryHead}
                                renderHead={(item, index) => renderCategoryHead(item, index)}
                                bodyData={courseCategories.length > 0 ? courseCategories : []}
                                renderBody={(item, index) => renderCategoryBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div> */}
        </div >
    )
}

export default Courses
