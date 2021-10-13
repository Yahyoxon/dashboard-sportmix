import React, { useState, useEffect } from 'react'
import axios from "axios";
import { storage } from '../../firebase/index';
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'

const AddCourseVideo = () => {
    const [name, setName] = useState("")
    const [video, setVideo] = useState([])
    const [videoPreview, setVideoPreview] = useState("")
    const [progress, setProgress] = useState(0);
    const [isUpload, setIsUpload] = useState(false);

    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState()


    //Course categories
    async function getCourseCategories() {
        const response = await axios.post('https://api.sport-mix.uz/api/course/categories/read', { "u_id": 16 })
        setCategories(response.data)
    }
    useEffect(() => {
        getCourseCategories()
    }, [])


    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            setVideo(e.target.files[0]);
            setVideoPreview(URL.createObjectURL(e.target.files[0]));
        }
    }


    const publishVideo = async (e) => {
        e.preventDefault()
        setIsUpload(true)
        const uploadTask = storage.ref(`courseVideos/${video.name}`).put(video);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                console.log(error);
            },
            async () => {
                const u = await storage.ref("courseVideos").child(video.name).getDownloadURL()
                const response = await axios.post(`https://api.sport-mix.uz/api/course/videos/create`,
                    {
                        "name": name,
                        "category_id": categoryId,
                        "link": u
                    }
                )
                if (response.data === true) {
                    window.location = "/tutorials"
                } else {
                    console.log(response);
                }
            }
        )

    }
    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">Добавить Видео для курса</h2>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={publishVideo}>
                        <div className="topnav__select" style={{ marginBottom: "15px" }}>
                            <select onChange={(e) => setCategoryId(e.target.value)} required>
                                <option selected value="">Выбрать категории курса</option>
                                {categories.map((cat, l) => {
                                    return <option key={l} value={cat.id}>{cat.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="name" placeholder="Название видео" required value={name} onChange={(e) => setName(e.target.value)} title="Название видео" />
                        </div>
                        <div className="images-labels">
                            {videoPreview ? <div className="restoreVideo">
                                <video
                                    className="addVideo borderRadius"
                                    src={videoPreview}
                                    controls
                                />
                                <label htmlFor="video"><div className="updateVideo bx bx-edit "></div></label>
                            </div> : <label htmlFor="video"><img src={uploadImg} width="100px" style={{ marginRight: "5px" }} alt="noImage" /></label>}
                            <input accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} type="file" id="video" onChange={handleChange} />
                        </div>

                        <div className="topnav__input">
                            {isUpload ?
                                <div className="prg">
                                    <progress value={progress} max="100" />
                                    <label>{progress} %</label>
                                </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary" >Добавить</button>
                            }

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCourseVideo
