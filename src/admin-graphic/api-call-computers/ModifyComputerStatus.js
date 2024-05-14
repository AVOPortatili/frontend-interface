//import './App.css';
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../NavbarAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

const ModifyComputerStatus = () => {
    const [selectedPc, setSelectedPc] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [pcOptions, setPcOptions] = useState([]);
    const [pcData, setPcData] = useState(null);

    useEffect(() => {
        // Carica le opzioni dei PC dal tuo backend
        const fetchPcOptions = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/computers/");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
                console.log("Dati ricevuti:", jsonData); // Aggiungi questo console.log per visualizzare la risposta del server
                if (Array.isArray(jsonData)) {
                    setPcOptions(jsonData.map(pc => pc.id));
                } else {
                    console.error("I dati ricevuti non sono un array:", jsonData);
                }
            } catch (error) {
                console.error("Errore durante il recupero delle opzioni PC:", error);
            }
        };

        fetchPcOptions();
    }, []);

    useEffect(() => {
        // Recupera i dettagli del PC selezionato
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/computers/${selectedPc}`);
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
                setPcData(jsonData);
            } catch (error) {
                console.error("Errore durante la richiesta dei dettagli del PC:", error);
            }
        };

        if (selectedPc) {
            fetchData();
        }
    }, [selectedPc]);

    const handleSelectChange = (event) => {
        setSelectedPc(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/computers/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedPc, status: selectedStatus })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            // Aggiorna i dati del PC con il nuovo stato
            const updatedPcData = { ...pcData, status: selectedStatus };
            setPcData(updatedPcData);
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello stato del PC:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Modifica lo stato del PC</h2>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="pcSelect" className="form-label">Seleziona un PC:</label>
                    <select id="pcSelect" className="form-select" value={selectedPc} onChange={handleSelectChange}>
                        <option value="">Seleziona PC</option>
                        {pcOptions.map(pcId => (
                            <option key={pcId} value={pcId}>PC {pcId}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="statusSelect" className="form-label">Seleziona lo stato:</label>
                    <select id="statusSelect" className="form-select" value={selectedStatus} onChange={handleStatusChange}>
                        <option value="">Seleziona stato</option>
                        <option value="disponibile">Disponibile</option>
                        <option value="non disponibile">Non disponibile</option>
                    </select>
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={!selectedPc || !selectedStatus}>
                Aggiorna Stato
            </button>
            {pcData && (
                <div className="mt-4">
                    <h3>Dettagli del PC {selectedPc}</h3>
                    <p><strong>Stato:</strong> {pcData.status}</p>
                </div>
            )}
        </div>
    );
};

export default ModifyComputerStatus;