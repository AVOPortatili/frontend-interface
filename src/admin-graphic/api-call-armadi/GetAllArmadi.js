import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function GetAllArmadi({ trigger }) {
    const [show, setShow] = useState(false);
    const [armadiData, setArmadiData] = useState(null);

    const handleShow = () => {
        setShow(true);
        fetchArmadiData();
    };

    const handleClose = () => setShow(false);

    const fetchArmadiData = async () => {
        try {
            const response = await fetch("http://2.238.117.64:2759/api/armadi/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setArmadiData(data);
        } catch (error) {
            console.error("Errore durante la richiesta dei dati degli armadi:", error);
        }
    };

    return (
        <>
            <div onClick={handleShow}>{trigger}</div>

            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>ELENCO ARMADI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {armadiData ? (
                        armadiData.map((armadio) => (
                            <div key={armadio.id}>
                                <p>ID: {armadio.id}</p>
                                <p>Nome: {armadio.nome}</p>
                                <p>Capienza: {armadio.capienza}</p>
                                <p>Aula: {armadio.aula}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>Caricamento in corso...</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default GetAllArmadi;
