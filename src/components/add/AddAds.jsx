import React, { useState } from 'react'
import axios from "axios";
import '../../assets/css/products.scss'
import uploadImg from '../../assets/images/photo (1).png'
import S3FileUpload from 'react-s3'
import { useHistory } from "react-router-dom";
global.Buffer = global.Buffer || require("buffer").Buffer;

const AddAds = () => {
    const history = useHistory();

    const [video, setVideo] = useState([])
    const [videoPreview, setVideoPreview] = useState("")
    const [isUpload, setIsUpload] = useState(false);
    const [isVideoUploaded, setIsVideoUploaded] = useState(false)


    const config = {
        bucketName: 'sportmix',
        dirName: "ads",
        region: 'ap-northeast-1',
        accessKeyId: 'AKIA2W4C7MZOLNVWYA5Y',
        secretAccessKey: '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'
    }


    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            setIsVideoUploaded(true)
            setVideo(e.target.files[0]);
            setVideoPreview(URL.createObjectURL(e.target.files[0]));
        }
    }


    const publishVideo = async (e) => {
        e.preventDefault()
        if (isVideoUploaded) {
            setIsUpload(true)
            S3FileUpload.uploadFile(video, config)
                .then((data) => {
                    axios.post(`https://api.sport-mix.uz/api/ads/create`,
                        {
                            "video": data.location
                        })
                        .then((res) => {
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
        } else {
            setIsUpload(false)
            alert("Select a video.")
        }
    }
    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">???????????????? Ads</h2>
            </div>
            <div className="card">
                <div className="card__body">
                    <form onSubmit={publishVideo}>
                        <div className="images-labels">
                            {videoPreview ? <div className="restoreVideo">
                                <video
                                    className="addVideo borderRadius"
                                    src={videoPreview}
                                    controls
                                />
                                <label htmlFor="video"><div className="updateVideo bx bx-edit "></div></label>
                            </div> : <label htmlFor="video"><img src={uploadImg} width="100px" style={{ marginRight: "5px" }} alt="noImage" /></label>}
                            <input accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} type="file" id="video" onChange={handleChange} />
                        </div>

                        <div className="topnav__input">
                            {
                                isUpload === true ? <div style={{ width: "100%", padding: "7px", textAlign: "center" }} className="badge badge-primary ">
                                    <div className="bx bx-loader-circle animLoader"></div> ????????????????
                                </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary">????????????????</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddAds
