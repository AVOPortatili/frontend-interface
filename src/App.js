import './App.css';
import React, { useState } from 'react';
import UserStore from './stores/UserStore';
import LoginForm from './components-login/LoginForm';
import Navbar from './components-graphic/Navbar';
import NavbarUser from './components-graphic/NavbarUser';
import NavbarAdmin from './admin-graphic/NavbarAdmin';
import HomePage from './HomePage';
import HomePageAdmin from './admin-graphic/HomePageAdmin';

export default function App() { //facciata principale 

  const [userStore, setUserStore] = useState({
    loading: false,
    isLoggedIn: false,
    username: '',
    role: '',
    token: ''
  })

  //metodo usato da LoginForm per popolare i dati sull'utente, dopo aver fatto il login con l'apposita API
  const setLogin = (username, role, token) => {
    setUserStore({
      loading: false,
      isLoggedIn: true,
      username: username,
      role: role,
      token: token
    })
  }

  /*const doLogout = async () => {//TODO: DA RIVEDERE
    try{
      let res = await fetch('/logout',{//controlla se l'utente è gia loggato oppure no tramite la sessione
          method: 'post',
          headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
          }

      });

      let result = await res.json();
      
      if(result && result.success){
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      }
      
    }catch(e){
      console.log(e);
    }
  }*/

  return (
    <>{/*questo è un fragment React che permette di contenere più componenti al suo interno*/}
      {/*{userStore.isLoggedIn ? <NavBarUser doLogout={doLogout} /> : <Navbar />}*/}
      <></>
      {userStore.isLoggedIn ? (userStore.role==='utente' ? <NavbarUser /> : <NavbarAdmin />): <Navbar />}
      {/*{userStore.isLoggedIn ? (userStore.role==='user' ? <NavbarUser /> : <NavbarAdmin />): <Navbar />}*/}

      {/*{userStore.isLoggedIn ? <NavbarAdmin /> : <Navbar />}*/}

      <div className='app'>
        <div className='container'>
          {userStore.loading === true ? (
            <div className='app'>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Caricamento in corso...</span>
              </div>
            </div>) : (<> {userStore.isLoggedIn === false ? (< LoginForm setLogin={setLogin} />) : (
              <>
                {/*Benvenuto {userStore.username}*/}
                <div className='app'>
                  {userStore.role==='utente' ? (<HomePage />) : (<HomePageAdmin />)}
                  <div className='container'>
                  </div>
                </div></>)}
            </>)}
        </div>
      </div>
    </>)
}

