import './App.css';
import React, { useState, useEffect } from 'react';
import ScannerPage from './ScannerPage';

const HomePage = () => {
    const [showScanner, setShowScanner] = useState(false); //stato per controllare se mostrare o meno ScannerPage
    const [numeroPc, setNumeroPc] = useState(null); //stato per memorizzare il numero di PC
    //const [caratteristichePc, setCaratteristichePc] = useState(null); //stato per memorizzare le caratteristiche del PC

    //funzione per gestire il clic sul bottone "Ritira PC" o "Posa PC"
    const handleClick = () => {
        setShowScanner(true);
    };

    useEffect(() => { //viene utilizzato qui per garantire che la chiamata API venga eseguita solo una volta all'inizio, quando visualizzo il componente per la prima volta
    //funzione per ottenere il numero di PC
        const getNumeroPc = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/computers/");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();

                console.log("Mostra numero pc totali nel db");
                if (jsonData && typeof jsonData.count !== 'undefined') {
                    setNumeroPc(jsonData.count);
                } else {
                    throw new Error("Dati non validi nella risposta JSON");
                }
            } catch (error) {
                console.error("Errore durante la richiesta di numero PC:", error);
            }
        };
        getNumeroPc();
    }, []);

    //se showScanner è true, mostra ScannerPage
    if (showScanner) {
        return <ScannerPage />;
    }

    //altrimenti, mostra i pulsanti nella home page
    return (
        <div style={{ paddingTop: '5px', textAlign: 'center' }}>
            {numeroPc !== null ? (
                <p>Numero PC disponibili: {numeroPc}</p>
            ) : (
                <p>Caricamento...</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '170px' }}>
                <button className="btn btn-primary btn-lg mb-3 submitButton" style={{ fontSize: '2.0rem', padding: '25px 50px' }} onClick={handleClick}>RITIRA PC</button> 
                <div style={{ marginBottom: '80px' }}></div> 
                <button className="btn btn-primary btn-lg submitButton" style={{ fontSize: '2.0rem', padding: '25px 50px' }} onClick={handleClick}>RESO PC</button>
            </div>
        </div>
    );
};

export default HomePage;
