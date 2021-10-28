import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/products.scss";
import { useParams, useHistory } from "react-router-dom";
import { uploadFile, deleteFile } from "react-s3";
import uploadImg from "../../assets/images/photo (1).png";

const EditProduct = (props) => {
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [cashback, setCashback] = useState("");
  const [category_name, setCategory_name] = useState("");
  const [brand_name, setBrand_name] = useState("");
  const [installment, setInstallment] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newUrl, setNewUrl] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const ins_arr = [
    { link: "all", name: "Все" },
    { link: "order", name: "Заказать" },
    { link: "market", name: "Маркет" },
    { link: "none", name: "Скрыть" },
  ];

  const getOldData = async (id) => {
    console.log(id)
    const response = await axios.get(
      `https://api.sport-mix.uz/api/products/readSingle?id=${id}`
    );
    setName(response.data[0].name);
    setDescription(response.data[0].description);
    setPrice(response.data[0].price);
    setCashback(response.data[0].cashback);
    setCategory_name(response.data[0].category_name);
    setBrand_name(response.data[0].brand_name);
    setInstallment(response.data[0].installment);
    setImages(response.data[0].images);
    setPreviewImages(response.data[0].images);
  };
  useEffect(() => {
    getOldData(id);
  }, [id]);

  const config = {
    bucketName: "sportmix",
    dirName: "products",
    region: "ap-northeast-1",
    accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
    secretAccessKey: "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",
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        setNewImages((prevState) => [...prevState, e.target.files[i]]);
        setPreviewImages((prevState) => [
          ...prevState,
          URL.createObjectURL(e.target.files[i]),
        ]);
        setIsDeleted(true);
      }
    }
  };

  //delete image
  const deleteImage = (image) => {
    var index = images.indexOf(image);
    setIsDeleted(!isDeleted);
    if (~index) {
      images.splice(index, 1);
      deleteFile(image.split("/")[4], config)
        .then((response) =>
          console.log(`${response.message} : ${response.fileName}`)
        )
        .catch((err) => console.error(err));
    }
  };

  const uploadImages = async (e) => {
    e.preventDefault();
    if (newImages.length > 0) {
      setIsUpload(true);
      newImages.map((perImage) => {
        uploadFile(perImage, config)
          .then((data) => {
            setNewUrl((prevState) => [...prevState, data.location]);
          })
          .catch((err) => {
            console.log(err);
          });
        return perImage;
      });
    } else {
      axios
        .put(`https://api.sport-mix.uz/api/products/update`, {
          id: id,
          name: name,
          description: description,
          price: price,
          cashback: cashback,
          category_name: category_name,
          brand_name: brand_name,
          installment: installment,
          images: images,
        })
        .then((res) => {
          if (res.data === true) {
            history.goBack();
          } else {
            console.log(res);
            alert("Select an image.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const addProduct = () => {
    if (newImages.length + images.length === [...newUrl, ...images].length) {
      axios
        .put(`https://api.sport-mix.uz/api/products/update`, {
          id: id,
          name: name,
          description: description,
          price: price,
          cashback: cashback,
          category_name: category_name,
          brand_name: brand_name,
          installment: installment,
          images: [...images, ...newUrl],
        })
        .then((res) => {
          if (res.data === true) {
            history.goBack();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsUpload(false);
      return null;
    }
  };
  useEffect(() => {
    addProduct();
  }, [newUrl]);

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
              <select onChange={(e) => setCategory_name(e.target.value)}>
                {props.categories.map((cat, l) => {
                  if (category_name === cat.link) {
                    return (
                      <option selected key={l} value={cat.link}>
                        {cat.name}
                      </option>
                    );
                  } else {
                    return (
                      <option key={l} value={cat.link}>
                        {cat.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="topnav__select" style={{ marginBottom: "15px" }}>
              <select onChange={(e) => setBrand_name(e.target.value)}>
                {props.brands.map((brand, o) => {
                  if (brand_name === brand.name) {
                    return (
                      <option selected key={o} value={brand.link}>
                        {" "}
                        {brand.name}
                      </option>
                    );
                  } else {
                    return (
                      <option key={o} value={brand.link}>
                        {" "}
                        {brand.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="topnav__select" style={{ marginBottom: "15px" }}>
              <select onChange={(e) => setInstallment(e.target.value)}>
                {ins_arr.map((ins, q) => {
                  if (installment === ins.link) {
                    return (
                      <option selected key={q} value={ins.link}>
                        {" "}
                        {ins.name}
                      </option>
                    );
                  } else {
                    return (
                      <option key={q} value={ins.link}>
                        {" "}
                        {ins.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="images-labels">
              {/* {() => setIsDeleted(true)} */}
              {isDeleted
                ? previewImages &&
                  previewImages.map((imgFile, i) => {
                    return (
                      <div key={i}>
                        <div className="imgActions">
                          <img
                            className="writeImg borderRadius"
                            src={imgFile}
                            alt="addImage"
                          />
                          <div className="overlay borderRadius">
                            <div
                              title="Delete image"
                              onClick={() => {
                                window.confirm(`Are you sure?`) === true
                                  ? deleteImage(imgFile)
                                  : console.log("not deleted");
                              }}
                              className="actionButtons del bx bx-trash"
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : previewImages &&
                  previewImages.map((imgFile, i) => {
                    return (
                      <div key={i}>
                        <div className="imgActions">
                          <img
                            className="writeImg borderRadius"
                            src={imgFile}
                            alt="addImage"
                          />
                          <div className="overlay borderRadius">
                            <div
                              title="Delete image"
                              onClick={() => {
                                window.confirm(`Are you sure?`) === true
                                  ? deleteImage(imgFile)
                                  : console.log("not deleted");
                              }}
                              className="actionButtons del bx bx-trash"
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              <label htmlFor="img">
                <img
                  src={uploadImg}
                  width="100px"
                  style={{ marginRight: "5px" }}
                  alt=""
                />
              </label>
              <input
                accept="image/jpg,image/jpeg,image/gif,image/png"
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
              {isUpload === true ? (
                <div
                  style={{ width: "100%", padding: "7px", textAlign: "center" }}
                  className="badge badge-primary "
                >
                  <div className="bx bx-loader-circle animLoader"></div>{" "}
                  Загрузка...
                </div>
              ) : (
                <button
                  onClick={uploadImages}
                  style={{ width: "100%", padding: "12px" }}
                  type="submit"
                  className="badge badge-primary"
                >
                  Добавить
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditProduct;
