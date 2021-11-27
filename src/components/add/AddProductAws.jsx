import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/products.scss";
import { useHistory } from "react-router-dom";
import S3FileUpload from "react-s3";
import CKEditor from "react-ckeditor-component";
import { ckEditorConfig } from "../../ckEditorConfig";
import uploadImg from "../../assets/images/photo (1).png";
import uploadVideo from "../../assets/images/61+zmrkLowL.png";
import TodoForm from "./addProductCharacter/TodoForm";
import Todo from "./addProductCharacter/Todo";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./addProductCharacter/todo.scss";

const AddProduct = (props) => {
  const history = useHistory();
  //product details(Inputs)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cashback, setCashback] = useState("");
  const [category_name, setCategory_name] = useState("");
  const [brand_name, setBrand_name] = useState("");
  const [installment, setInstallment] = useState("");
  const [images, setImages] = useState([]);
  //characters of products(Inputs)
  //video(Inputs)
  const [video, setVideo] = useState([]);
  const [videoDescription, setVideoDescription] = useState("")
  //SEO(Inputs)
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  //telegram post link(Inputs)
  const [tgPostLink, setTgPostLink] = useState("");

  const [urls, setUrls] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isSeoTitleGood, setisSeoTitleGood] = useState("seoTransparent");
  const [isSeoDescGood, setisSeoDescGood] = useState("seoTransparent");
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (45 <= seoTitle.length && seoTitle.length <= 60) {
      setisSeoTitleGood("seoTitleGood");
    } else if (seoTitle.length === 0) setisSeoTitleGood("seoTransparent");
    else setisSeoTitleGood("seoTitleNotGood");
  }, [seoTitle]);

  useEffect(() => {
    if (110 <= seoDescription.length && seoDescription.length <= 160) {
      setisSeoDescGood("seoTitleGood");
    } else if (seoDescription.length === 0) setisSeoDescGood("seoTransparent");
    else setisSeoDescGood("seoTitleNotGood");
  }, [seoDescription]);

  const ins_arr = [
    { link: "all", name: "Все" },
    { link: "order", name: "Заказать" },
    { link: "market", name: "Маркет" },
    { link: "none", name: "Скрыть" },
  ];

  const config = (dirName) => {
    return {
      bucketName: "sportmix",
      dirName: dirName,
      region: "ap-northeast-1",
      accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
      secretAccessKey: "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",
    };
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        setImages((prevState) => [...prevState, e.target.files[i]]);
        setIsImageUploaded(true);
        setIsDeleted(true);
      }
    }
  };
  const handleChangeVideo = (e) => {
    if (e.target.files.length > 0) {
      setVideo(e.target.files[0]);
      setVideoPreview(URL.createObjectURL(e.target.files[0]));
      setIsVideoUploaded(true);
    }
  };

  //delete image
  const deleteImage = (image) => {
    var index = images.indexOf(image);
    setIsDeleted(!isDeleted);
    if (~index) {
      images.splice(index, 1);
    }
  };

  const uploadDataToS3 = async (e) => {
    e.preventDefault();
    if (isImageUploaded) {
      setIsUpload(true);
      images.map((perImage) =>
        S3FileUpload.uploadFile(perImage, config("products"))
          .then((data) => {
            setUrls((prevState) => [...prevState, data.location]);
          })
          .catch((err) => {
            console.log(err);
          })
      );
      if (isVideoUploaded) {
        const uploadedVideo = await S3FileUpload.uploadFile(
          video,
          config("products/video")
        );
        setVideoUrl(uploadedVideo.location);
      } else {
        setVideoUrl(null);
      }
    } else {
      setIsUpload(false);
      alert("Select an image.");
    }
  };

  useEffect(() => {
    async function addProduct() {
      if (
        urls.length === images.length &&
        (isVideoUploaded ? videoUrl.length > 0 : true)
      ) {
        const response = await axios.post(
          `https://api.sport-mix.uz/api/products/create`,
          {
            name: name,
            description: description,
            price: price,
            cashback: cashback || 0,
            category_name: category_name,
            brand_name: brand_name,
            installment: installment,
            images: urls,
            link_for_ads: tgPostLink || null,
            characters: characters,
            video: videoUrl,
            meta_title: seoTitle || name,
            meta_description: seoDescription || description,
          }
        );
        if (response.data === true) {
          history.goBack();
        } else {
          console.log(response);
        }
      } else {
        return null;
      }
    }
    addProduct();
  }, [
    urls,
    videoUrl,
    name,
    description,
    price,
    cashback,
    category_name,
    brand_name,
    installment,
    tgPostLink,
    seoTitle,
    seoDescription,
    images.length,
    isVideoUploaded,
    history,
  ]);

  const [characters, setCharacters] = useState([]);

  const addTodo = (character) => {
    const newCharacters = [character, ...characters];

    if (!character.textName || /^\s*$/.test(character.textName)) {
      return;
    }
    setCharacters(newCharacters);
  };

  const removeCharacter = (id) => {
    const removeArr = [...characters].filter(
      (character) => character.id !== id
    );

    setCharacters(removeArr);
  };

  return (
    <div>
      <div className="tableHeader">
        <h2 className="page-header">Добавить товар</h2>
      </div>
      <div className="card">
        <div className="card__body">
          <Tabs>
            <TabList>
              <Tab>RU</Tab>
              <Tab>UZ</Tab>
              <Tab>ENG</Tab>
            </TabList>

            <form onSubmit={uploadDataToS3}>
              <TabPanel>
                <h3 className="h3-headline">Информация о продукте</h3>
                <div className="topnav__input">
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
                <div className="topnav__input">
                  <CKEditor
                    activeClass="topnav__textarea"
                    config={ckEditorConfig}
                    content={description}
                    events={{
                      change: (e) => setDescription(e.editor.getData()),
                    }}
                  />
                </div>

                <div className="row-character-seo">
                  <div className="characters">
                    <h3 className="h3-headline">Характеристики</h3>
                    <div className="row-3-inputs">
                      <div className="todo">
                        <TodoForm
                          onSubmit={addTodo}
                          name="Название"
                          value="Цинеть"
                          add="Добавить"
                        />
                        <Todo todos={characters} removeTodo={removeCharacter} />
                      </div>
                    </div>
                  </div>
                  <div className="seo-section">
                    <h3 className="h3-headline">SEO</h3>
                    <div
                      className="topnav__input seoInputs"
                      style={{ marginBottom: "15px" }}
                    >
                      <input
                        type="text"
                        id="seoTitle"
                        maxlength="70"
                        value={seoTitle}
                        placeholder="Title"
                        onChange={(e) => setSeoTitle(e.target.value)}
                        title="SEO Title"
                      />
                      <div className={isSeoTitleGood}>
                        <p>{seoTitle.length}</p>
                      </div>
                    </div>
                    <div
                      className="topnav__input seoInputs"
                      style={{ marginBottom: "15px" }}
                    >
                      <input
                        type="text"
                        id="description"
                        placeholder="Description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        title="SEO Description"
                      />
                      <div className={isSeoDescGood}>
                        <p>{seoDescription.length}</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <div
                      className="topnav__textarea seoInputs"
                    >
                      <textarea
                      rows='3'
                        id="video-description"
                        placeholder="Видео описание"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        title="Video Description"
                      />
                      <div className={isSeoDescGood}>
                        <p>{seoDescription.length}</p>
                      </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
              </TabPanel>

              <TabPanel>
                <h3 className="h3-headline">Tovar ma'lumotlari</h3>
                <div className="topnav__input">
                  <input
                    type="text"
                    id="name"
                    placeholder="Tovar nomi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    title="Название товара"
                    required
                  />
                </div>
                <div className="topnav__input">
                  <CKEditor
                    activeClass="topnav__textarea"
                    config={ckEditorConfig}
                    content={description}
                    events={{
                      change: (e) => setDescription(e.editor.getData()),
                    }}
                  />
                </div>

                <div className="row-character-seo">
                  <div className="characters">
                    <h3 className="h3-headline">Xarakteristikasi</h3>
                    <div className="row-3-inputs">
                      <div className="todo" style={{ marginBottom: "15px" }}>
                        <TodoForm
                          onSubmit={addTodo}
                          name="Nomi"
                          value="Qiymati"
                          add="Qo'shish"
                        />
                        <Todo todos={characters} removeTodo={removeCharacter} />
                      </div>
                    </div>
                  </div>
                  <div className="seo-section">
                    <h3 className="h3-headline">SEO</h3>
                    <div className="topnav__input seoInputs">
                      <input
                        type="text"
                        id="seoTitle"
                        maxlength="70"
                        value={seoTitle}
                        placeholder="Title"
                        onChange={(e) => setSeoTitle(e.target.value)}
                        title="SEO Title"
                      />
                      <div className={isSeoTitleGood}>
                        <p>{seoTitle.length}</p>
                      </div>
                    </div>
                    <div
                      className="topnav__input seoInputs"
                      style={{ marginBottom: "15px" }}
                    >
                      <input
                        type="text"
                        id="description"
                        placeholder="Description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        title="SEO Description"
                      />
                      <div className={isSeoDescGood}>
                        <p>{seoDescription.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <h3 className="h3-headline">Product Details</h3>
                <div className="topnav__input">
                  <input
                    type="text"
                    id="name"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    title="Название товара"
                    required
                  />
                </div>
                <div className="topnav__input">
                  <CKEditor
                    activeClass="topnav__textarea"
                    config={ckEditorConfig}
                    content={description}
                    events={{
                      change: (e) => setDescription(e.editor.getData()),
                    }}
                  />
                </div>

                <div className="row-character-seo">
                  <div className="characters">
                    <h3 className="h3-headline">Characters</h3>
                    <div className="row-3-inputs">
                      <div className="todo" style={{ marginBottom: "15px" }}>
                        <TodoForm
                          onSubmit={addTodo}
                          name="Name"
                          value="Value"
                          add="Add"
                        />
                        <Todo todos={characters} removeTodo={removeCharacter} />
                      </div>
                    </div>
                  </div>
                  <div className="seo-section">
                    <h3 className="h3-headline">SEO</h3>
                    <div
                      className="topnav__input seoInputs"
                      style={{ marginBottom: "15px" }}
                    >
                      <input
                        type="text"
                        id="seoTitle"
                        maxlength="70"
                        value={seoTitle}
                        placeholder="Title"
                        onChange={(e) => setSeoTitle(e.target.value)}
                        title="SEO Title"
                      />
                      <div className={isSeoTitleGood}>
                        <p>{seoTitle.length}</p>
                      </div>
                    </div>
                    <div
                      className="topnav__input seoInputs"
                      style={{ marginBottom: "15px" }}
                    >
                      <input
                        type="text"
                        id="description"
                        placeholder="Description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        title="SEO Description"
                      />
                      <div className={isSeoDescGood}>
                        <p>{seoDescription.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <div className="row-3-inputs">
                <div
                  className="topnav__input col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
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
                <div
                  className="topnav__input col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
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
                <div
                  className="topnav__select col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
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
                <div
                  className="topnav__select col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
                  <select
                    onChange={(e) => setBrand_name(e.target.value)}
                    required
                  >
                    <option selected value="">
                      Выбрать
                    </option>
                    {props.brands &&
                      props.brands.map((brand, o) => {
                        return (
                          <option key={o} value={brand.link}>
                            {brand.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div
                  className="topnav__select col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
                  <select
                    onChange={(e) => setInstallment(e.target.value)}
                    required
                  >
                    <option selected value="">
                      Выбрать
                    </option>
                    {ins_arr &&
                      ins_arr.map((ins, q) => {
                        return (
                          <option key={q} value={ins.link}>
                            {ins.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div
                  className="topnav__input col-3-inputs"
                  style={{ marginBottom: "15px" }}
                >
                  <input
                    type="text"
                    id="price"
                    value={tgPostLink}
                    placeholder="Телеграм ссилка для рекламы"
                    title="Телеграм ссилка для рекламы"
                    onChange={(e) => setTgPostLink(e.target.value)}
                  />
                </div>
              </div>
              <h3 className="h3-headline">Изображение</h3>
              <div className="images-labels">
                {isDeleted
                  ? images &&
                    images.map((imgFile, i) => {
                      return (
                        <div key={i}>
                          <div className="imgActions">
                            <img
                              className="writeImg borderRadius"
                              src={URL.createObjectURL(imgFile)}
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
                        </div>
                      );
                    })
                  : images &&
                    images.map((imgFile, i) => {
                      return (
                        <div key={i}>
                          <div className="imgActions">
                            <img
                              className="writeImg borderRadius"
                              src={URL.createObjectURL(imgFile)}
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

              {/*the start video section */}
              <h3 className="h3-headline">Видео</h3>
              <div className="images-labels">
                {videoPreview ? (
                  <div className="restoreVideo">
                    <video
                      className="addVideo borderRadius"
                      src={videoPreview}
                      controls
                    />
                    <label htmlFor="video">
                      <div className="updateVideo bx bx-edit "></div>
                    </label>
                  </div>
                ) : (
                  <label htmlFor="video">
                    <img
                      src={uploadVideo}
                      width="100px"
                      style={{ marginRight: "5px" }}
                      alt="noImage"
                    />
                  </label>
                )}

                <input
                  accept="video/mp4,video/x-m4v,video/*"
                  style={{ display: "none" }}
                  type="file"
                  id="video"
                  onChange={handleChangeVideo}
                />
                <br />
              </div>
              {/* the end video section */}

              <div className="topnav__input">
                {isUpload ? (
                  <div
                    style={{
                      width: "100%",
                      padding: "7px",
                      textAlign: "center",
                    }}
                    className="badge badge-primary "
                  >
                    <div className="bx bx-loader-circle animLoader"></div>
                    Загрузка...
                  </div>
                ) : (
                  <button
                    style={{ width: "100%", padding: "12px" }}
                    type="submit"
                    className="badge badge-primary"
                  >
                    Добавить
                  </button>
                )}
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default AddProduct;
