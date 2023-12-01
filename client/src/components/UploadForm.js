import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {

  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);

  const [file, setFile] = useState(null);
  const defaultFileName = "이미지 파일을 업로드 해주세요."
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
      // console.log(imageFile)
      setFile(imageFile);
      setFileName(imageFile.name);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);
      fileReader.onload = (e) => setImgSrc(e.target.result);
  }
  const onSubmit = async(e) => {
    e.preventDefault();
    // formData는 key-value값을 가질수 있음
    const formData = new FormData();
    formData.append("image", file);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type" : "multipart/form-data" },
        onUploadProgress: (e) => {
          // console.log(e)
          setPercent(Math.round((100 * e.loaded) / e.total));
        }
      });
      // console.log(res);
      if(isPublic) {
        setImages([...images, res.data]);
      } else{
        setMyImages([...myImages, res.data]);
      }
      toast.success("이미지 업로드 성공")
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
    }
  }

  return(
    <form onSubmit={onSubmit}>
      <div className="img-wrap">
        <img src={imgSrc} alt="" className={`image-preview ${imgSrc && "image-preview-show"}`} />
      </div>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input 
          id="image" 
          type="file"
          accept="image/*" 
          onChange={imageSelectHandler}
        />
      </div>
      <div className="flex-row">
        <div className="comm-checkbox">
          <input type="checkbox" id="public-check" value={!isPublic} onChange={() => setIsPublic(!isPublic)} />
          <label htmlFor="public-check">비공개</label>
        </div>
        <button type="submit" className="btn-submit ml-auto">제출</button>
      </div>


    </form>
  )
}

export default UploadForm;