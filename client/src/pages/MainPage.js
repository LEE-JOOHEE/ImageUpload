import React, { useContext } from 'react';
import UploadForm from "../components/UploadForm"
import ImageList from "../components/ImageList";
import { AuthContext } from '../context/AuthContext';

const MainPage = () => {
  const [me] = useContext(AuthContext);

  return (
    <div className='wrap'>
      <h2 className='comm-title fs-30 mb-60'>이미지 업로드</h2>
      {me ? <UploadForm /> : 
        <div className='f-20-500 text-gray-600'>
          ○ 회원가입 및 로그인 후에 이미지 업로드를 할수있습니다.
        </div>
      }
      <ImageList />
    </div>
  );
};

export default MainPage;