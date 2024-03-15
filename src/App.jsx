import './App.css'
import {Route,Routes,useNavigate} from 'react-router-dom';
import ChatPage from './pages/ChatPage/ChatPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebase';
import React, { useEffect } from 'react';
import { clearUser } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { userSlice } from './store/userSlice';

function App() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      if(user){
        navigate('/');
        dispatch(userSlice.actions.setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL : user.photoURL
        }))
      }else{
        navigate('/login');
        dispatch(clearUser());
      }
    })
    return () =>{
      unsubscribe();
    }
  },[auth])

  return (
    <Routes>
      <Route path='/' element={<ChatPage/>} />
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>

    </Routes>
  )
}

export default App
