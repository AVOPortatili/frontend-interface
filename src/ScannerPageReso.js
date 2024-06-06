import './App.css';
import React, { useState, useEffect } from 'react';
//import QrReader from 'react-qr-reader';
import HomePage from './HomePage';
import { Form} from 'react-bootstrap';
import {Scanner} from "@yudiel/react-qr-scanner";


const ScannerPageReso = () => {
  const [counter, setCounter] = useState(0);
  const [armadi, setArmadi] = useState([]);
  const [selectedArmadio, setSelectedArmadio] = useState("");
  const [scanning, setScanning] = useState(false); //inizia la scansione dopo il caricamento
  const [confirmed, setConfirmed] = useState(false); //stato per conferma ritiro
  const [qrLoaded, setQrLoaded] = useState(false); //stato per il caricamento del lettore QR
  const [qrScanned, setQrScanned] = useState(false); //stato per tracciare se è stato scansionato almeno un QR code
  const [goBack, setGoBack] = useState(false); // Stato per il ritorno alla HomePage
  const [scannedPcs, setScannedPcs] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [newStatus, setNewStatus] = useState("disponibile")

  const handleScan = (scannedData) => {
    console.log("handle scan")
    console.log(scannedData);
    let alreadyTaken = false
    let data = scannedData[0].rawValue
    if (data) {
      console.log(data)
      if (!scannedPcs.includes(data)) {
        for (let index = 0; index < pcs.length; index++) {
          console.log(pcs[index].status)
          if(pcs[index].id==data && pcs[index].status==="disponibile") {
            console.log("verificato")
            alreadyTaken = true;
            break;
          }
        }
        if (alreadyTaken) {
          alert("il computer scansionato risulta essere già disponibile")
        } else {
          scannedPcs.push(data)
          setCounter(prevCounter => prevCounter + 1);
        }
      }
      //implementazione della logica per incrementare il contatore solo se la scansione è attiva
      // Imposta qrScanned su true quando viene scansionato un QR code
      setQrScanned(true);
    }
  };

  useEffect(() => {
    if (pcs.length===0) {
      getPcs();
    }
    if(armadi.length===0) {
      getArmadi()
    }
  })

    const getArmadi = async () => {
        console.log("fetchato armadi")
        try {
            const response = await fetch("http://192.168.1.204:8090/api/armadi/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setArmadi(data);
        } catch (error) {
            console.error("Errore durante il fetch degli armadi:", error);
        }
    };
  const getPcs = async () => {
      try {
          const response = await fetch("http://192.168.1.204:8090/api/computers");
          if (!response.ok) {
              throw new Error("Errore nella richiesta HTTP: " + response.status);
          }
          const jsonData = await response.json();
          for (let index = 0; index < jsonData.length; index++) {
            console.log(jsonData[index].status!=="disponibile")
          }
          if (jsonData) {
              setPcs(jsonData);
          } else {
              throw new Error("Dati non validi nella risposta JSON");
          }
      } catch (error) {
          console.error("Errore durante la richiesta di numero PC:", error);
      }
  };



  //logica per confermare il ritiro dei PC
  const handleConfirm = () => {
    if (window.confirm('Sei sicuro di confermare il reso dei PC?')) {
      //se l'utente conferma, ferma la scansione e imposta lo stato di conferma su true
      stopScan();
      setConfirmed(true);
      for (let index = 0; index < scannedPcs.length; index++) {
        updatePcStatus(scannedPcs[index])
      }
      alert('Restituzione confermata!');
    } else {
      //se l'utente annulla
    }
  };

  const updatePcStatus = async (id) => {
          if(selectedArmadio==="") {
            alert("seleziona l'armadio in cui riporre i pc")
            return
          }
            const response = await fetch('http://192.168.1.204:8090/api/computers', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    new_status: newStatus,
                    armadio: selectedArmadio,
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            // if (result.message === 'success') {
            //     alert("Status aggiornato con successo");
            // } else {
            //     alert("Aggiornamento status fallito");
            // }
  }

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
        <div style={{ width: '70vw', maxWidth: '400px', marginBottom: '300px' }}>
          <Scanner
              onScan={handleScan}
              scanDelay={500}
          />
        </div>

        {/*
      <QrReader
        delay={3000}
        scanDelay={500}
        onError={handleError}
        onScan={handleScan}
        onLoad={() => setQrLoaded(true)} //imposto qrLoaded a true quando il componente è stato caricato
        style={{ width: '70vw', maxWidth: '400px', marginBottom: '20px' }}
      />
*/}
      {/*il bottone "Conferma ritiro" viene disabilitato finché non viene scansionato almeno un QR code */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>PC scansionati: {counter}</p>
      <div className="buttonContainer">
                        <Form.Label htmlFor="armadioSelect"><h3>Seleziona armadio:</h3></Form.Label>
                        <Form.Select
                            id="armadioSelect"
                            onChange={(e) => {setSelectedArmadio(e.target.value)}}
                            value={selectedArmadio}
                        >
                            <option value="">Seleziona...</option>
                            {armadi.map(armadio => (
                                <option key={armadio.id} value={armadio.id}>
                                    {`${armadio.nome} - ${armadio.aula}`}
                                </option>
                            ))}
                        </Form.Select>
        <button
          onClick={handleConfirm}
          className={scannedPcs.length!==0 && selectedArmadio!=="" ? 'scannerPageButton' : 'submitButtonDisabled'}
          disabled={scannedPcs.length===0 || selectedArmadio===""}
        >
          CONFERMA RESO
        </button>

        <button onClick={handleGoBack} className="goBackButton">TORNA HOMEPAGE</button>
      </div>
    </div>
  );
};

export default ScannerPageReso;
