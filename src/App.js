import './App.css';
import React, { useState } from 'react';
import UserStore from './stores/UserStore';
import LoginForm from './components-login/LoginForm';
import Navbar from './components-graphic/Navbar';
import NavbarUser from './components-graphic/NavbarUser';
import NavbarAdmin from './admin-graphic/NavbarAdmin';
import HomePage from './HomePage';
import HomePageAdmin from './admin-graphic/HomePageAdmin';
import ScannerPage from './ScannerPage';
import ResourceComputers from './admin-graphic/api-call-computers/ModifyComputerStatus';
//import ResourceComputers from '.admin-graphic/api-call-computers/ResourceComputers'; //importa il componente ResourceComputers


export default function App() { //facciata principale 

  const [userStore, setUserStore] = useState({
    loading: false,
    isLoggedIn: false,
    username: ''
  })

  //metodo che userà la API
  const setLogin = (username) => {
    setUserStore({
      loading: false,
      isLoggedIn: true,
      username: username
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
      {userStore.isLoggedIn ? <NavbarUser/> : <Navbar />}
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
                {/*<div>BENVENUTO, per effettuare le sue azioni da ADMIN apra il menù in alto a sinistra</div>*/}
                <div className='app'>
                  <HomePage />
                  {/*<HomePageAdmin />*/}
                  <div className='container'>
                  </div>
                </div></>)}
            </>)}
        </div>
      </div>
    </>)
}

