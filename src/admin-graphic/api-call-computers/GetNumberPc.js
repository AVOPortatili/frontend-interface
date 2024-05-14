import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; // Importa il componente Modal di Bootstrap

const GetNumberPc = ({ isOpen, onClose }) => {
    const [numeroPc, setNumeroPc] = useState(null);

    useEffect(() => {
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

        if (isOpen) {
            getNumeroPc();
        }
    }, [isOpen]);

    return (
        <Modal
            show={isOpen} // Utilizza la prop 'show' per mostrare/nascondere il modal
            onHide={onClose} // Usa la prop 'onHide' per gestire la chiusura del modal
            dialogClassName="custom-modal" // Opzionale: aggiungi classi personalizzate al modal
        >
            <Modal.Header closeButton>
                <Modal.Title>NUMERO DI PC DISPONIBILI A SCUOLA</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: 'center' }}>
                    {numeroPc !== null ? (
                        <p>Numero PC disponibili: {numeroPc}</p>
                    ) : (
                        <p>Caricamento...</p>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GetNumberPc;