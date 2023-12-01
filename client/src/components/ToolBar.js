import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../components/ToolBar.css';

const ToolBar = () => {
  const [ me, setMe ] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      setMe();
      toast.success("로그아웃!!");
    } catch (err) {
      console.err(err);
      toast.error(err.message);
    }
  }

  return (
    <div className='toolbar'>
      <Link to="/">
        <span>HOME</span>
      </Link>

      {me ? (
        <>
          <span className='ml-auto pr-4'>{me.name} 님</span>
          <span className='line mlr-20'></span>
          <Link to="/">
            <span onClick={logoutHandler}>로그아웃</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/auth/register" className='ml-auto'>
            <span>회원가입</span>
          </Link>
          <span className='line mlr-20'></span>
          <Link to="/auth/login">
            <span>로그인</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;