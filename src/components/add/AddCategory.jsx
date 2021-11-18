import React, { useState } from 'react'
import axios from "axios";
import { storage } from '../../firebase/index';
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'

const AddCategory = () => {
    const [progress, setProgress] = useState(0);
    const [isUpload, setIsUpload] = useState(false);
    const [categoryName, setCategoryName] = useState("")
    const [categoryLink, setCategoryLink] = useState("")
    const [categoryNewImage, setCategoryNewImage] = useState([])
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [categoryPreviewImage, setCategoryPreviewImage] = useState("")

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setIsImageUploaded(true)
            setCategoryNewImage(e.target.files[0]);
            setCategoryPreviewImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const publishCategory = async (e) => {
        e.preventDefault()
        setIsUpload(true)
        if (isImageUploaded === true) {
            const uploadTask = storage.ref(`categoriesImage/${categoryNewImage.name}`).put(categoryNewImage);
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
                    const u = await storage.ref("categoriesImage").child(categoryNewImage.name).getDownloadURL()
                    const response = await axios.post(`https://api.sport-mix.uz/api/categories/create`,
                        {
                            "name": categoryName,
                            "link": categoryLink,
                            "image": u
                        }
                    )
                    if (response.data === true) {
                        window.location = "/categories"

                    } else {
                        console.log(response);
                    }
                }
            )
        }
        else {
            alert("Select an image.")
        }

    }


    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Добавить категории
                </h2>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={publishCategory}>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="name" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} placeholder="Название категории" required />
                        </div>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="link" value={categoryLink} onChange={(e) => { setCategoryLink(e.target.value) }} placeholder="Ссылка для категории" required />
                        </div>
                        <div className="images-labels">
                            {
                                isUpload === false ? <div className="imgActions">
                                    {
                                        categoryPreviewImage ? <><label htmlFor="img">
                                            <img
                                                className="writeImg borderRadius"
                                                src={categoryPreviewImage}
                                                alt="addImage"
                                            />
                                        </label>
                                            <div className="overlay borderRadius">
                                                <label title="Replace image" className="actionButtons edi bx bx-edit">
                                                    <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" onChange={handleChangeImage} />
                                                </label>
                                            </div></> : <label htmlFor="img">
                                            <img
                                                className="writeImg"
                                                src={uploadImg}
                                                alt="addImage"
                                            />
                                            <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" onChange={handleChangeImage} />
                                        </label>
                                    }

                                </div>
                                    :
                                    <div className="imgActions">
                                        <img
                                            className="writeImg borderRadius"
                                            src={categoryPreviewImage}
                                            alt="addImage"
                                        />
                                    </div>
                            }

                        </div>
                        <div className="topnav__input">
                            {
                                isUpload === true ? <div className="prg">
                                    <progress value={progress} max="100" />
                                    <label>{progress} %</label>
                                </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary">Добавить</button>
                            }
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}
export default AddCategory

