import '../App.css';
import React, { useState, useEffect } from 'react';
import ScannerPageAdmin from './ScannerPageAdmin';
import ModifyComputerStatus from './api-call-computers/ModifyComputerStatus';
import LogoutModal from './LogoutModal';

const HomePageAdmin = () => {
    const [showScanner, setShowScanner] = useState(false); //stato per controllare se mostrare o meno ScannerPage
    
    //funzione per gestire il clic sul bottone "Ritira PC" o "Reso PC"
    const handleClick = () => {
        setShowScanner(true);
    };

    //se showScanner è true, mostra ScannerPage
    if (showScanner) {
        return <ScannerPageAdmin />;
    }

    //altrimenti, mostra i pulsanti nella home page
    return (
        <div style={{ paddingTop: '5px', textAlign: 'center' }}>
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '170px' }}>
            Benvenuto, clicca sul menù in alto a sinistra per vedere le operazioni possibile
                {/* <button className="btn btn-primary btn-lg mb-3 submitButton" style={{ fontSize: '2.0rem', padding: '25px 50px' }} onClick={handleClick}>RITIRA PC</button> 
                <div style={{ marginBottom: '80px' }}></div> 
                <button className="btn btn-primary btn-lg submitButton" style={{ fontSize: '2.0rem', padding: '25px 50px' }} onClick={handleClick}>RESO PC</button> */}
            </div>
        </div>
    );
};

export default HomePageAdmin;