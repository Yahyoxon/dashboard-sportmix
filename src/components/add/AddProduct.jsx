import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage } from "../../firebase/index";
import "../../assets/css/products.scss";
import uploadImg from "../../assets/images/photo (1).png";

const AddProduct = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_name, setCategory_name] = useState("");
  const [brand_name, setBrand_name] = useState("");
  const [installment, setInstallment] = useState("");
  const [cashback, setCashback] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const ins_arr = [
    { link: "all", name: "Все" },
    { link: "order", name: "Заказать" },
    { link: "market", name: "Маркет" },
    { link: "none", name: "Скрыть" },
  ];

  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(false);

  // Collection Images
  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size < 11256000) {
          setImages((prevState) => [...prevState, e.target.files[i]]);
          setImagesPreview((prevState) => [
            ...prevState,
            URL.createObjectURL(e.target.files[i]),
          ]);
        } else {
          alert("Rasm hajmi 256 kb dan katta!!");
          return false;
        }
      }
    }
  };
  
  //Add Product to Database
  const addProduct = async (e) => {
    e.preventDefault();
    setIsUpload(true);
    const promises = [];
    images.map((image) => {
      const uploadTask = storage.ref(`productsImage/${image.name}`).put(image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const img = await storage
            .ref("productsImage")
            .child(image.name)
            .getDownloadURL();
          setUrls((prevState) => [...prevState, img]);
        }
      );
    });

    Promise.all(promises)
      .then(() => console.log("images: ", images))
      .then(() => console.log("urls: ", urls))
      .then(() => {
        const response = axios.post(
          `https://api2.sport-mix.uz/api/products/create`,
          {
            name: name,
            description: description,
            price: price,
            category_name: category_name,
            brand_name: brand_name,
            installment: installment,
            cashback:cashback,
            images: urls,
          }
        );
        console.log(response);
      })
      .then(() => setIsUpload(false))
      .catch((err) => console.log(err));
  };

  //delete image
  const restoreImage = (img) => {
    return img.map((imgFile, i) => {
      return (
        <>
          <div key={i} className="imgActions">
            <img
              className="writeImg borderRadius"
              src={imgFile}
              alt="addImage"
            />
            <div className="overlay borderRadius">
              <div
                title="Delete image"
                onClick={() => {
                  deleteImage(imgFile);
                }}
                className="actionButtons del bx bx-trash"
              ></div>
            </div>
          </div>
        </>
      );
    });
  };

  useEffect(() => {
    restoreImage(imagesPreview);
  }, [imagesPreview]);
  
  const deleteImage = (image) => {
    var index = imagesPreview.indexOf(image);
    if (~index) {
      imagesPreview.splice(index, 1);
    }
  };

  return (
    <div>
      <div className="tableHeader">
        <h2 className="page-header">Добавить товар</h2>
      </div>
      <div className="card">
        <div className="card__body">
          <form onSubmit={addProduct}>
            <div className="topnav__input" style={{ marginBottom: "15px" }}>
              <input
                type="text"
                id="name"
                placeholder="Название товара"
                value={name}
                onChange={(e) => setName(e.target.value)}
                title="Название товара"
                required
              />
            </div>
            <div className="topnav__textarea" style={{ marginBottom: "15px" }}>
              <textarea
                rows="8"
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание товара"
                title="Описание товара"
                required
              />
            </div>
            <div className="topnav__input" style={{ marginBottom: "15px" }}>
              <input
                type="number"
                id="price"
                value={price}
                placeholder="Цена товара"
                title="Цена товара"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="topnav__input" style={{ marginBottom: "15px" }}>
              <input
                type="number"
                id="cashback"
                value={cashback}
                placeholder="Кэшбек"
                title="Кэшбек"
                onChange={(e) => setCashback(e.target.value)}
                required
              />
            </div>
            <div className="topnav__select" style={{ marginBottom: "15px" }}>
              <select
                onChange={(e) => setCategory_name(e.target.value)}
                required
              >
                <option selected value="">
                  Выбрать
                </option>
                {props.categories.map((cat, l) => {
                  return (
                    <option key={l} value={cat.link}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="topnav__select" style={{ marginBottom: "15px" }}>
              <select onChange={(e) => setBrand_name(e.target.value)} required>
                <option selected value="">
                  Выбрать
                </option>
                {props.brands.map((brand, o) => {
                  return (
                    <option key={o} value={brand.link}>
                      {brand.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="topnav__select" style={{ marginBottom: "15px" }}>
              <select onChange={(e) => setInstallment(e.target.value)} required>
                <option selected value="">
                  Выбрать
                </option>
                {ins_arr.map((ins, q) => {
                  return (
                    <option key={q} value={ins.link}>
                      {ins.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="images-labels">
              {restoreImage(imagesPreview)}
              <label htmlFor="img">
                <img
                  src={uploadImg}
                  width="100px"
                  style={{ marginRight: "5px" }}
                  alt=""
                />
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                id="img"
                multiple
                required
                onChange={handleChange}
              />
              <br />
            </div>
            <div className="topnav__input">
              {isUpload === false ? (
                <button
                  style={{ width: "100%", padding: "12px" }}
                  type="submit"
                  className="badge badge-primary"
                >
                  Добавить
                </button>
              ) : (
                <div className="prg">
                  <progress value={progress} max="100" />
                  <label>{progress} %</label>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
