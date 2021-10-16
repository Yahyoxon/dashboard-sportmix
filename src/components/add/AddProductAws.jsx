import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../../assets/css/products.scss'
import { useHistory } from "react-router-dom";
import S3FileUpload from 'react-s3'
import uploadImg from '../../assets/images/photo (1).png'


const AddProduct = (props) => {

    const history = useHistory();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category_name, setCategory_name] = useState("")
    const [brand_name, setBrand_name] = useState("")
    const [installment, setInstallment] = useState("")
    const [images, setImages] = useState([])
    const [urls, setUrls] = useState([])
    const [isUpload, setIsUpload] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const ins_arr = [{ link: "all", name: "Все" }, { link: "order", name: "Заказать" }, { link: "none", name: "Скрыть" }];

    const config = {
        bucketName: 'sportmix',
        dirName: "products",
        region: 'ap-northeast-1',
        accessKeyId: 'AKIA2W4C7MZOLNVWYA5Y',
        secretAccessKey: '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'
    }

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            for (let i = 0; i < e.target.files.length; i++) {
                setImages((prevState) => [...prevState, e.target.files[i]]);
                setIsImageUploaded(true)
                setIsDeleted(true)
            }
        }
    }

    //delete image
    const deleteImage = (image) => {
        var index = images.indexOf(image);
        setIsDeleted(!isDeleted)

        if (~index) {
            images.splice(index, 1);
        }
    }



    const uploadImages = async (e) => {
        e.preventDefault()
        if (isImageUploaded) {
            setIsUpload(true)
            images.map((perImage) => (
                S3FileUpload.uploadFile(perImage, config)
                    .then((data) => {
                        setUrls((prevState) => [...prevState, data.location])
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            ))

        }
        else {
            setIsUpload(false)
            alert("Select an image.")
        }

    }


    useEffect(() => {
        function addProduct() {
            if (urls.length === images.length) {
                axios.post(`https://api.sport-mix.uz/api/products/create`,
                    {
                        "name": name,
                        "description": description,
                        "price": price,
                        "category_name": category_name,
                        "brand_name": brand_name,
                        "installment": installment,
                        "images": urls
                    })
                    .then((res) => {
                        if (res.data === true) {
                            // window.location = "/products"
                            history.goBack();
                        } else {
                            console.log(res);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            else {
                setIsUpload(false)
                return null
            }
        };
        addProduct()
    }, [urls])

    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Добавить товар
                </h2>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={uploadImages}>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="text" id="name" placeholder="Название товара" value={name} onChange={(e) => setName(e.target.value)} title="Название товара" required />
                        </div>
                        <div className="topnav__textarea" style={{ marginBottom: "15px" }}>
                            <textarea rows="8" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание товара" title="Описание товара" required />

                        </div>
                        <div className="topnav__input" style={{ marginBottom: "15px" }}>
                            <input type="number" id="price" value={price} placeholder="Цена товара" title="Цена товара" onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div className="topnav__select" style={{ marginBottom: "15px" }}>
                            <select onChange={(e) => setCategory_name(e.target.value)} required>
                                <option selected value="">Выбрать</option>
                                {props.categories.map((cat, l) => {
                                    return <option key={l} value={cat.link}>{cat.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="topnav__select" style={{ marginBottom: "15px" }} >
                            <select onChange={(e) => setBrand_name(e.target.value)} required>
                                <option selected value="">Выбрать</option>
                                {props.brands.map((brand, o) => {
                                    return <option key={o} value={brand.link}  >{brand.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="topnav__select" style={{ marginBottom: "15px" }}>
                            <select onChange={(e) => setInstallment(e.target.value)} required>
                                <option selected value="">Выбрать</option>
                                {ins_arr.map((ins, q) => {
                                    return <option key={q} value={ins.link} >{ins.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="images-labels">
                            {/* {() => setIsDeleted(true)} */}
                            {
                                isDeleted ?
                                    images && images.map((imgFile, i) => {
                                        return <div key={i}>
                                            <div className="imgActions">
                                                <img
                                                    className="writeImg borderRadius"
                                                    src={URL.createObjectURL(imgFile)}
                                                    alt="addImage"
                                                />
                                                <div className="overlay borderRadius">
                                                    <div title="Delete image" onClick={() => { deleteImage(imgFile) }} className="actionButtons del bx bx-trash"></div>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                    : images && images.map((imgFile, i) => {
                                        return <div key={i}>
                                            <div className="imgActions">
                                                <img
                                                    className="writeImg borderRadius"
                                                    src={URL.createObjectURL(imgFile)}
                                                    alt="addImage"
                                                />
                                                <div className="overlay borderRadius">
                                                    <div title="Delete image" onClick={() => { deleteImage(imgFile) }} className="actionButtons del bx bx-trash"></div>
                                                </div>
                                            </div>
                                        </div>
                                    })
                            }
                            <label htmlFor="img">
                                <img src={uploadImg} width="100px" style={{ marginRight: "5px" }} alt="" />
                            </label>
                            <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" multiple required onChange={handleChange} /><br />
                        </div>
                        <div className="topnav__input">
                            {
                                isUpload === true ? <div style={{ width: "100%", padding: "7px", textAlign: "center" }} className="badge badge-primary ">
                                    <div className="bx bx-loader-circle animLoader"></div> Загрузка...
                                </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary">Добавить</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddProduct

