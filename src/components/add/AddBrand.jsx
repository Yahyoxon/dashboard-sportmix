import React, { useState } from 'react'
import axios from "axios";
import { storage } from '../../firebase/index';
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'

const AddBrand = () => {

    const [progress, setProgress] = useState(0);
    const [isUpload, setIsUpload] = useState(false);
    const [BrandName, setBrandName] = useState("")
    const [BrandLink, setBrandLink] = useState("")
    const [BrandTelegramId, setBrandTelegramId] = useState("")
    const [BrandNewImage, setBrandNewImage] = useState([])
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [BrandPreviewImage, setBrandPreviewImage] = useState("")

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setIsImageUploaded(true)
            setBrandNewImage(e.target.files[0]);
            setBrandPreviewImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const publishBrand = async (e) => {
        e.preventDefault()
        setIsUpload(true)
        if (isImageUploaded === true) {

            const uploadTask = storage.ref(`brandsImage/${BrandNewImage.name}`).put(BrandNewImage);
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
                    const u = await storage.ref("brandsImage").child(BrandNewImage.name).getDownloadURL()
                    const response = await axios.post(`https://api.sport-mix.uz/api/brands/create`,
                        {
                            "name": BrandName,
                            "link": BrandLink,
                            "telegram_chat_id": BrandTelegramId,
                            "image": u
                        }
                    )
                    if (response.data === true) {
                        window.location = "/brands"
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
                    Добавить Магазин
                </h2>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={publishBrand}>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="name" value={BrandName} onChange={(e) => { setBrandName(e.target.value) }} placeholder="Название категории" required />
                        </div>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="link" value={BrandLink} onChange={(e) => { setBrandLink(e.target.value) }} placeholder="Ссылка для категории" required />
                        </div>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="link" value={BrandTelegramId} onChange={(e) => { setBrandTelegramId(e.target.value) }} placeholder="ID для телеграм канала" required />
                        </div>
                        <div className="images-labels">
                            {
                                isUpload === false ? <div className="imgActions">
                                    {
                                        BrandPreviewImage ? <><label htmlFor="img">
                                            <img
                                                className="writeImg borderRadius"
                                                src={BrandPreviewImage}
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
                                            src={BrandPreviewImage}
                                            alt="addImage"
                                        />
                                    </div>
                            }
                            {/* <div className="imgActions">
                                <label htmlFor="img">
                                    <img
                                        className="writeImg"
                                        src={BrandPreviewImage ? BrandPreviewImage : uploadImg}
                                        alt="addImage"
                                    />
                                </label>
                                <div className="overlay">
                                    <label title="Replace image" className="actionButtons edi bx bx-edit">
                                        <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" onChange={handleChangeImage} />
                                    </label>
                                </div>
                            </div> */}

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
            </div>
        </div>
    )
}
export default AddBrand
