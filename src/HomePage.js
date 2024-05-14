import './App.css';
import React, { useState, useEffect } from 'react';
import ScannerPage from './ScannerPage';

const HomePage = () => {
    const [showScanner, setShowScanner] = useState(false); //stato per controllare se mostrare o meno ScannerPage
    const [numeroPc, setNumeroPc] = useState(); //stato per memorizzare il numero di PC, PER ADAM: ricordati che in js non si usa null, ma undefined 
    //const [caratteristichePc, setCaratteristichePc] = useState(null); //stato per memorizzare le caratteristiche del PC

    //funzione per gestire il clic sul bottone "Ritira PC" o "Posa PC"
    const handleClick = () => {
        setShowScanner(true);
    };

    useEffect(() => { //viene utilizzato qui per garantire che la chiamata API venga eseguita solo una volta all'inizio, quando visualizzo il componente per la prima volta
    //funzione per ottenere il numero di PC
        if(numeroPc===undefined) {//TODO: usare un flag booleano per dire se i dati debbano essere fetchati o meno
            getNumeroPc();
        }
    }, []);
    
    const getNumeroPc = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/armadi/");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
                console.log(jsonData)
                console.log("Mostra numero pc totali nel db");
                if (jsonData) {
                    let temp = new Array(jsonData.length)
                    for (let index = 0; index < jsonData.length; index++) {
                        temp[index] = {cassetto: jsonData[index].nome, aula: jsonData[index].aula, numero: jsonData[index].count};
                    }
                    console.log(temp)
                    setNumeroPc(temp.map((element) => {return (<p>PC disponibili nel cassetto {element.cassetto} nell'aula {element.aula}: {element.numero}</p>)}))
                } else {
                    throw new Error("Dati non validi nella risposta JSON");
                }
            } catch (error) {
                console.error("Errore durante la richiesta di numero PC:", error);
            }
        };
    //se showScanner è true, mostra ScannerPage
    if (showScanner) {
        return <ScannerPage />;
    }

    //altrimenti, mostra i pulsanti nella home page
    return (
        <div style={{ paddingTop: '5px', textAlign: 'center' }}>
            {numeroPc ? (
                numeroPc
            ) : (
                <p>Caricamento in corso</p>
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
