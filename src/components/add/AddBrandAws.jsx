import React, { useState } from 'react'
import axios from "axios";
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'
import S3FileUpload from 'react-s3'
import { useHistory } from "react-router-dom";
const AddBrand = () => {

    const history = useHistory();
    // const [progress, setProgress] = useState(0);
    const [isUpload, setIsUpload] = useState(false);
    const [BrandName, setBrandName] = useState("")
    const [BrandLink, setBrandLink] = useState("")
    const [BrandTelegramId, setBrandTelegramId] = useState("")
    const [BrandNewImage, setBrandNewImage] = useState([])
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [BrandPreviewImage, setBrandPreviewImage] = useState("")

    const config = {
        bucketName: 'sportmix',
        dirName: "brands",
        region: 'ap-northeast-1',
        accessKeyId: 'AKIA2W4C7MZOLNVWYA5Y',
        secretAccessKey: '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'
    }

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setIsImageUploaded(true)
            setBrandNewImage(e.target.files[0]);
            setBrandPreviewImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const publishBrand = async (e) => {
        e.preventDefault()
        if (isImageUploaded) {
            setIsUpload(true)

            S3FileUpload.uploadFile(BrandNewImage, config)
                .then((data) => {
                    axios.post(`https://api.sport-mix.uz/api/brands/create`,
                        {
                            "name": BrandName,
                            "link": BrandLink,
                            "telegram_chat_id": BrandTelegramId,
                            "image": data.location
                        }
                    )
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
            setIsUpload(false)
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
                                isUpload === true ? <div style={{ width: "100%", padding: "7px", textAlign: "center" }} className="badge badge-primary ">
                                    <div className="bx bx-loader-circle animLoader"></div> Загрузка
                                    {/* <progress value={progress} max="100" />
                                    <label>{progress} %</label> */}
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
