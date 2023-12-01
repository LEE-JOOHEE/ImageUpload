import React, { useContext } from "react";
import { ImageContext } from '../context/ImageContext'
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ImageList = () => {
  
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imgList = (isPublic ? images : myImages).map((image) => {
    return(
      <Link to={`/images/${image._id}`} key={image.key}>
        <div className="comm-img-wrap">
          <img 
            src={`http://localhost:5000/uploads/${image.key}`} 
            alt=""
          />
        </div>
      </Link>
    )
  });

  return(
    <>
      <div>
        <div className="flex-row-center">
          <h2 className="comm-title mt-80 mb-50">ImageList</h2>
        </div>
        <div className="flex-row flex-wrap item-end gap-20 mb-24">
          <div className="fs-22 fw-700 text-blue2">
            ▣ {isPublic ? "공개 사진" : "개인 사진"}
          </div>
          { me && 
            <button className="btn-basic ml-auto" onClick={() => setIsPublic(!isPublic)}>
              {isPublic ? "개인" : "공개"} 사진 보기
            </button>
          }
        </div>
        <div className="img-list grid-col-5 gap-20">
          {imgList}
        </div>
      </div>
    </>
  )
}

export default ImageList;