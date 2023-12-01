import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImageContext } from '../context/ImageContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ImagePage = () => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [ hasLiked, setHasLiked ] = useState(false);
  const image = 
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);

  useEffect(() => {
    if(me && image && image.likes.includes(me.userId)) setHasLiked(true); 
  }, [me, image]);
  if(!image) return (
    <div className='f-20-500 text-gray-600'>
      로딩중...
    </div>
  )

  const updateImage = (images, image) => [
    ...images.filter((image) => image._id !== imageId), 
    image
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const onsubmit = async () => {
    const result = await axios.patch(`/images/${imageId}/${hasLiked ? "unlike" : "like"}`);
    if(result.data.public){
      setImages(updateImage(images, result.data));
    } else{
      setMyImages(updateImage(myImages, result.data));
    } 
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if(!window.confirm("정말 이미지를 삭제하시겠습니까?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages(images.filter(image => image._id !== imageId));
      setMyImages(myImages.filter(image => image._id !== imageId));
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='wrap'>
      <h2 className="comm-title fs-30 mb-60">이미지 상세보기</h2>
      <div className="fs-22 fw-700 text-blue2 mb-30">
        ▣ 이미지 고유 ID : {imageId}
      </div>
      <div className='comm-img-wrap-view'>
        <img alt={imageId} src={`http://localhost:5000/uploads/${image.key}`} />
      </div>
      <div className='flex-row item-center mt-20 like-bar'>
        <div className='f-20-500 pl-10'>♥ {image.likes.length}</div>
        <button className='btn-basic ml-20' onClick={onsubmit}>
          {hasLiked ? "취소" : "좋아요"}
        </button>
        {me && image.user._id === me.userId &&
          <button className='btn-basic ml-auto' onClick={deleteHandler}>
            이미지 삭제
          </button>
        }
      </div>
      
    </div>
  );
};

export default ImagePage;