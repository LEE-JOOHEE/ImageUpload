import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ImagePage from "./pages/ImagePage";

import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";

function App() {

  return (
    <>
      <ToastContainer />
      <ToolBar />

      <Routes>
        <Route path="auth/login" exact Component={LoginPage} />
        <Route path="/auth/register" exact Component={RegisterPage} />
        <Route path="/images/:imageId" exact Component={ImagePage} />
        <Route path="/" Component={MainPage} />
      </Routes>
    </>
  );
}

export default App;
