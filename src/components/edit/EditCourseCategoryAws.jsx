import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'
import { useParams } from 'react-router-dom';
import S3FileUpload from 'react-s3'
import { useHistory } from "react-router-dom";

const EditCourseCategory = () => {
    const { id } = useParams();
    const history = useHistory();

    // const [progress, setProgress] = useState(0);
    const [isUpload, setIsUpload] = useState(false);
    const [CourseCategoryName, setCourseCategoryName] = useState("")
    const [CourseCategoryNewImage, setCourseCategoryNewImage] = useState([])
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [CourseCategoryOldImage, setCourseCategoryOldImage] = useState("")
    const [CourseCategoryPreviewImage, setCourseCategoryPreviewImage] = useState("")

    const config = {
        bucketName: 'sportmix',
        dirName: "courseCategories",
        region: 'ap-northeast-1',
        accessKeyId: 'AKIA2W4C7MZOLNVWYA5Y',
        secretAccessKey: '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'
    }
    
    const getResponse = async (id) => {
        const response = await axios.get(`https://api.sport-mix.uz/api/course/categories/readSingle?id=${id}`)
        setCourseCategoryName(response.data[0].name)
        setCourseCategoryOldImage(response.data[0].poster)
    }
    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setIsImageUploaded(true)
            setCourseCategoryNewImage(e.target.files[0]);
            setCourseCategoryPreviewImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const publishCourseCategory = async (e) => {


        e.preventDefault()
        setIsUpload(true)
        if (isImageUploaded) {

            S3FileUpload.uploadFile(CourseCategoryNewImage, config)
                .then((data) => {
                    axios.put(`https://api.sport-mix.uz/api/course/categories/update`,
                        {
                            "id": id,
                            "name": CourseCategoryName,
                            "poster": data.location
                        })
                        .then((res) => {
                            // console.log(res)
                            if (res.data === true) {
                                history.goBack();
                            } else {
                                console.log(res);
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            const response = await axios.put(`https://api.sport-mix.uz/api/course/categories/update`,
                {
                    "id": id,
                    "name": CourseCategoryName,
                    "poster": CourseCategoryOldImage
                }
            )
            if (response.data === true) {
                history.goBack();
            } else {
                console.log(response);
            }
        }

    }

    useEffect(() => {
        getResponse(id);
    }, [id])

    //delete
    const deleteCategory = async () => {
        const confirm = window.confirm(`Do you really want to delete ${CourseCategoryName}?`);
        if (confirm === true) {
            const response = await axios.delete(`https://api.sport-mix.uz/api/course/categories/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            console.log(response);
            if (response.data === true) {
                window.location = "/tutorials"
            }
        } else {
            console.log("Not deleted");
        }

    }

    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Изменить категории курса
                </h2>
                <button className="badge badge-danger" onClick={deleteCategory}>удалить</button>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={publishCourseCategory}>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="name" value={CourseCategoryName} onChange={(e) => { setCourseCategoryName(e.target.value) }} placeholder="Название категории" required />
                        </div>
                        <div className="images-labels">
                            {
                                isUpload === false ? <div className="imgActions">
                                    <label htmlFor="img">
                                        <img
                                            className="writeImg borderRadius"
                                            src={CourseCategoryOldImage || CourseCategoryPreviewImage ? (CourseCategoryPreviewImage ? CourseCategoryPreviewImage : CourseCategoryOldImage) : uploadImg}
                                            alt="addImage"
                                        />
                                    </label>
                                    <div className="overlay borderRadius">
                                        <label title="Replace image" className="actionButtons edi bx bx-edit">
                                            <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" onChange={handleChangeImage} />
                                        </label>
                                    </div>

                                </div>
                                    :
                                    <div className="imgActions">
                                        <img
                                            className="writeImg borderRadius"
                                            src={CourseCategoryOldImage || CourseCategoryPreviewImage ? (CourseCategoryPreviewImage ? CourseCategoryPreviewImage : CourseCategoryOldImage) : uploadImg}
                                            alt="addImage"
                                        />
                                    </div>
                            }
                        </div>

                        <div className="topnav__input">
                            {
                                isUpload === true ? <div style={{ width: "100%", padding: "7px", textAlign: "center" }} className="badge badge-primary ">
                                    <div className="bx bx-loader-circle animLoader"></div> Загрузка
                                    {/* <progress value={progress} max="100" />
                                    <label>{progress} %</label> */}
                                </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary">Изменить</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default EditCourseCategory
