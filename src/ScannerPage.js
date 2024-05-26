import './App.css';
import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import HomePage from './HomePage';


const ScannerPage = () => {
  const [counter, setCounter] = useState(0);
  const [scanning, setScanning] = useState(false); //inizia la scansione dopo il caricamento
  const [confirmed, setConfirmed] = useState(false); //stato per conferma ritiro
  const [qrLoaded, setQrLoaded] = useState(false); //stato per il caricamento del lettore QR
  const [qrScanned, setQrScanned] = useState(false); //stato per tracciare se è stato scansionato almeno un QR code
  const [goBack, setGoBack] = useState(false); // Stato per il ritorno alla HomePage


  const handleScan = (data) => {
    if (data && scanning) {
      console.log(data)
      //implementazione della logica per incrementare il contatore solo se la scansione è attiva
      setCounter(prevCounter => prevCounter + 1);
      // Imposta qrScanned su true quando viene scansionato un QR code
      setQrScanned(true);
    }
  };

  //logica per confermare il ritiro dei PC
  const handleConfirm = () => {
    if (window.confirm('Sei sicuro di confermare il ritiro dei PC?')) {
      //se l'utente conferma, ferma la scansione e imposta lo stato di conferma su true
      stopScan();
      setConfirmed(true);
      //esegui altre azioni necessarie
      alert('Ritiro confermato!');
    } else {
      //se l'utente annulla
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    //attiva la scansione solo dopo che il componente è stato caricato completamente
    if (qrLoaded) {
      setScanning(true);
    }

    //funzione per fermare la scansione quando il componente viene smontato
    return () => {
      stopScan();
    };
  }, [qrLoaded]);

  //disattiva la scansione
  const stopScan = () => {
    setScanning(false);
  };

  const handleGoBack = () => {
    setGoBack(true); // Imposta il ritorno alla HomePage
  };

  //se la conferma è stata fatta o se premo sul bottone di ritorno, torna alla HomePage
  if (confirmed || goBack) {
    return <HomePage />;
  }

  return (
    <div className="scanner-page">
      <h2 style={{ textAlign: 'center' }}>Scanner QR Code</h2>
      <QrReader
        delay={3000}
        onError={handleError}
        onScan={handleScan}
        onLoad={() => setQrLoaded(true)} //imposto qrLoaded a true quando il componente è stato caricato
        style={{ width: '70vw', maxWidth: '400px', marginBottom: '20px' }}
      />
      {/*il bottone "Conferma ritiro" viene disabilitato finché non viene scansionato almeno un QR code */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>Contatore PC ritirati: {counter}</p>
      <div className="buttonContainer">
        <button
          onClick={handleConfirm}
          className={qrScanned ? 'scannerPageButton' : 'submitButtonDisabled'}
          disabled={!qrScanned}
        >
          CONFERMA RITIRO
        </button>

        <button onClick={handleGoBack} className="goBackButton">TORNA HOMEPAGE</button>
      </div>
    </div>
  );
};

export default ScannerPage;
