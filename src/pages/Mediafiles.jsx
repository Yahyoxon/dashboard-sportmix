import React, { useState, useEffect } from "react";
import S3FileUpload ,{ deleteFile } from "react-s3";
import aws from "aws-sdk";
import "../assets/css/mediafiles.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Modal from "react-modal";
import uploadImg from "../assets/images/photo (1).png";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Mediafiles = (props) => {
  const [singleImage, setSingleImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [newImage, setNewImage] = useState([]);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  //config of S3
  const config = {
    bucketName: "sportmix",
    dirName: "products",
    region: "ap-northeast-1",
    accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
    secretAccessKey: "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",
  };

  // get Images from AWS S3
  useEffect(() => {
    (async function () {
      try {
        aws.config.setPromisesDependency();
        aws.config.update({
          accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
          secretAccessKey: "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",
          region: "ap-northeast-1",
        });
        const s3 = new aws.S3();
        const response = await s3
          .listObjectsV2({
            Bucket: "sportmix",
          }).promise();
          console.log(response)
        const filteredImages = [];
        for (let i = 0; i < response.Contents.length; i++) {
          if (
            response.Contents[i].Key.split(".").pop() === "png" ||
            response.Contents[i].Key.split(".").pop() === "jpg" ||
            response.Contents[i].Key.split(".").pop() === "jpeg" ||
            response.Contents[i].Key.split(".").pop() === "gif"
          ) {
            filteredImages[i] = response.Contents[i];
          }
        }
        setFilteredData(filteredImages.reverse());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isDeleted]);
  
  const handleModal = (image) => {
    setSingleImage(image);
    setIsOpen(true);
  };

  const uploadImage = async () => {
    if (newImage) {
      setIsUpload(true);
      const data = await S3FileUpload.uploadFile(newImage, config);
      console.log(data);
    } else {
      setIsUpload(false);
      alert("Select an image.");
    }
  };

  //delete image
  const deleteImage = async() => {
    const fileName = singleImage.Key.split("/")[1];
    const dirName = singleImage.Key.split("/")[0];
    if ((dirName, fileName)) {
     const response = await deleteFile(fileName, {
        bucketName: "sportmix",
        dirName: dirName,
        region: "ap-northeast-1",
        accessKeyId: "AKIA2W4C7MZOLNVWYA5Y",
        secretAccessKey: "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"
      })
          if (response.ok) {
            setIsDeleted(!isDeleted);
            setIsOpen(false);
          } else setIsDeleted(false);
       console.log(response.message)
    } else {
      console.log("dsdas");
    }
  };

  const Box = ({ children }) => <div className="images-grid">{children}</div>;

  Modal.setAppElement("#root");
  const date = new Date(singleImage.LastModified);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}
      >
        <div className="modal-box">
          <div className="img-box">
            <img
              src={`https://sportmix.s3.amazonaws.com/${singleImage.Key}`}
              alt={singleImage.Key}
            />
          </div>
          <div className="modal-content">
            <div className="remove-icon modal-action" onClick={deleteImage}>
              <i className="bx bx-trash"></i>
            </div>
            <CopyToClipboard
              text={`https://sportmix.s3.amazonaws.com/${singleImage.Key}`}
            >
              <button className="copy-icon modal-action">Copy URL</button>
            </CopyToClipboard>
          </div>
          <div className="file-size">
            <div>
              <span>Size: </span>
              {singleImage.Size >= 1024 && singleImage.Size <= 1024 * 1024
                ? Math.round(singleImage.Size / 1024) + " KB"
                : Math.round(singleImage.Size / (1024 * 1024)) + " MB"}
            </div>
            <div className="modify-date">
              <span>Created at: </span>
              {date.toLocaleString()}
            </div>
          </div>
        </div>
      </Modal>
      <div className="add-media">
        <h2>Медиафайлы ({filteredData.length})</h2>
        <button
          className="badge badge-success"
          onClick={() => setIsAddMediaOpen(!isAddMediaOpen)}
        >
          Добавить
        </button>
      </div>
      {isAddMediaOpen === true ? (
        <div className="upload-file">
          <div className="images-labels">
            {isUpload === false ? (
              <div className="imgActions">
                {newImage.length > 0 ? (
                  <>
                    <label htmlFor="img">
                      {/* <img
                        className="writeImg borderRadius"
                        src={URL.createObjectURL(newImage)}
                        alt="addImage"
                      /> */}
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
                          onChange={(e) => setNewImage(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="img">
                    <img className="writeImg" src={uploadImg} alt="addImage" />
                    <input
                      accept="image/jpg,image/jpeg,image/gif,image/png"
                      style={{ display: "none" }}
                      type="file"
                      id="img"
                      onChange={(e) => setNewImage(e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="imgActions">
                <img
                  className="writeImg borderRadius"
                  src={newImage ? URL.createObjectURL(newImage) : uploadImg}
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
                <div className="bx bx-loader-circle animLoader"></div>
                Загрузка...
              </div>
            ) : (
              <button
                style={{ width: "100%", padding: "12px" }}
                type="submit"
                className="badge badge-primary"
                onClick={uploadImage}
              >
                Добавить
              </button>
            )}
          </div>
        </div>
      ) : null}
      <div className="media-content">
        {filteredData &&
          filteredData.map((image, i) => {
            return (
              <div key={i} className="images-grid">
                <img
                  onClick={() => handleModal(image)}
                  src={`https://sportmix.s3.amazonaws.com/${image.Key}`}
                  alt={image.Key}
                />
                <i className="bx bx-fullscreen"></i>
              </div>
            );
          })}
        {filteredData.length < 1
          ? Array.apply(null, { length: 50 }).map((value, index) => {
              return (
                <div key={index}>
                  <SkeletonTheme color="#2d2d2d00" highlightColor="#e8e8e850">
                    <Skeleton height="100%" wrapper={Box}/>
                  </SkeletonTheme>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};
