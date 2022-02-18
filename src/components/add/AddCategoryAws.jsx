import React, { useState } from "react";
import axios from "axios";
import "../../assets/css/products.scss";
import S3FileUpload from "react-s3";
import uploadImg from "../../assets/images/photo (1).png";
import { useHistory } from "react-router-dom";
import CKEditor from "react-ckeditor-component";
import { ckEditorConfig } from "../../ckEditorConfig";
global.Buffer = global.Buffer || require("buffer").Buffer;

const AddCategory = () => {
  const history = useHistory();
  const [isUpload, setIsUpload] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLink, setCategoryLink] = useState("");
  const [description, setDescription] = useState("");
  const [categoryNewImage, setCategoryNewImage] = useState([]);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [categoryPreviewImage, setCategoryPreviewImage] = useState("");

  const config = {
    bucketName: "sportmix",
    dirName: "categories",
    region: "ap-northeast-1",
    accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
    secretAccessKey: "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",
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length > 0) {
      setIsImageUploaded(true);
      setCategoryNewImage(e.target.files[0]);
      setCategoryPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const publishCategory = async (e) => {
    e.preventDefault();
    if (isImageUploaded) {
      setIsUpload(true);
      S3FileUpload.uploadFile(categoryNewImage, config)
        .then((data) => {
          axios
            .post(`https://api.sport-mix.uz/api/categories/create`, {
              name: categoryName,
              link: categoryLink,
              description: description || "",
              image: data.location,
            })
            .then((res) => {
              if (res.data === true) {
                history.goBack();
              } else {
                console.log(res);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsUpload(false);
      alert("Select an image.");
    }
  };

  return (
    <div>
      <div className="tableHeader">
        <h2 className="page-header">Добавить категории</h2>
      </div>
      <div className="card">
        <div className="card__body">
          <form onSubmit={publishCategory}>
            <div className="topnav__input" style={{ marginBottom: "15px" }}>
              <input
                type="text"
                id="name"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
                placeholder="Название категории"
                required
              />
            </div>
            <div className="topnav__input" style={{ marginBottom: "15px" }}>
              <input
                type="text"
                id="link"
                value={categoryLink}
                onChange={(e) => {
                  setCategoryLink(e.target.value);
                }}
                placeholder="Ссылка для категории"
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <CKEditor
                activeClass="topnav__textarea"
                config={ckEditorConfig}
                content={description}
                events={{
                  change: (e) => setDescription(e.editor.getData()),
                }}
              />
            </div>

            <div className="images-labels">
              {isUpload === false ? (
                <div className="imgActions">
                  {categoryPreviewImage ? (
                    <>
                      <label htmlFor="img">
                        <img
                          className="writeImg borderRadius"
                          src={categoryPreviewImage}
                          alt="addImage"
                        />
                      </label>
                      <div className="overlay borderRadius">
                        <label
                          title="Replace image"
                          className="actionButtons edi bx bx-edit"
                        >
                          <input
                            accept="image/jpg,image/jpeg,image/gif,image/png"
                            style={{ display: "none" }}
                            type="file"
                            id="img"
                            onChange={handleChangeImage}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label htmlFor="img">
                      <img
                        className="writeImg"
                        src={uploadImg}
                        alt="addImage"
                      />
                      <input
                        accept="image/jpg,image/jpeg,image/gif,image/png"
                        style={{ display: "none" }}
                        type="file"
                        id="img"
                        onChange={handleChangeImage}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="imgActions">
                  <img
                    className="writeImg borderRadius"
                    src={
                      categoryPreviewImage ? categoryPreviewImage : uploadImg
                    }
                    alt="addImage"
                  />
                </div>
              )}
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
export default AddCategory;
