import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'
import { useParams } from 'react-router-dom';
import S3FileUpload from 'react-s3'
import { useHistory } from "react-router-dom";

const EditCategory = () => {
    const { id } = useParams();
    const history = useHistory();

    const [isUpload, setIsUpload] = useState(false);
    const [categoryName, setCategoryName] = useState("")
    const [categoryLink, setCategoryLink] = useState("")
    const [categoryNewImage, setCategoryNewImage] = useState([])
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [categoryOldImage, setCategoryOldImage] = useState("")
    const [categoryPreviewImage, setCategoryPreviewImage] = useState("")

    const config = {
        bucketName: 'sportmix',
        dirName: "categories",
        region: 'ap-northeast-1',
        accessKeyId: 'AKIA2W4C7MZOLNVWYA5Y',
        secretAccessKey: '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'
    }
    
    const getResponse = async (id) => {
        const response = await axios.get(`https://api.sport-mix.uz/api/categories/readSingle?id=${id}`)
        setCategoryName(response.data.name)
        setCategoryLink(response.data.link)
        setCategoryOldImage(response.data.image)
    }
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

        if (isImageUploaded) {

            S3FileUpload.uploadFile(categoryNewImage, config)
                .then((data) => {
                    axios.put(`https://api.sport-mix.uz/api/categories/update`,
                        {
                            "id": id,
                            "name": categoryName,
                            "link": categoryLink,
                            "image": data.location
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
            const response = await axios.put(`https://api.sport-mix.uz/api/categories/update`,
                {
                    "id": id,
                    "name": categoryName,
                    "link": categoryLink,
                    "image": categoryOldImage
                }
            )
            if (response.data === true) {
                window.location = "/categories"
            } else {
                console.log(response);
            }
        }

    }

    useEffect(() => {
        getResponse(id);
    }, [id])


    //edit image
    // const editImage = (image) => {
    //     console.log(previewImages);
    //     // if (editedImage) {
    //     //     var index = previewImages.indexOf(image);
    //     //     if (~index) {
    //     //         previewImages[index] = editedImage;

    //     //     }
    //     //     var temp = previewImages
    //     //     setPreviewImages(temp)
    //     //     console.log(temp);
    //     // }
    // }



    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Изменить категории
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
                                    <label htmlFor="img">
                                        <img
                                            className="writeImg borderRadius"
                                            src={categoryOldImage || categoryPreviewImage ? (categoryPreviewImage ? categoryPreviewImage : categoryOldImage) : uploadImg}
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
                                            src={categoryOldImage || categoryPreviewImage ? (categoryPreviewImage ? categoryPreviewImage : categoryOldImage) : uploadImg}
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
export default EditCategory
