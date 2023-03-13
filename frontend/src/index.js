import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css';
import App from './App';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { VerifyUser } from './components/VerifyUser';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
// import Sample from './components/Sample';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<App/>}/>
      <Route path='login' element = {<Login/>}/>
      <Route path='register' element = {<Register/>}/>
      <Route path='verify-user' element = {<VerifyUser/>}/>
      <Route path='forgot-password' element = {<ForgotPassword/>}/>
      <Route path='reset-password' element = {<ResetPassword/>}/>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
