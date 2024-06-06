import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const GetNumberPc = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numeroPc, setNumeroPc] = useState(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const getNumeroPc = async () => {
            try {
                const response = await fetch("http://192.168.1.204:8090/api/computers/count");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
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
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
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
        </>
    );
};

export default GetNumberPc;