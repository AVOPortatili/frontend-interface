import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function GetNumberPcPerArmadi({ trigger }) {
    const [show, setShow] = useState(false);
    const [numeroPc, setNumeroPc] = useState(null);

    const handleShow = () => {
        setShow(true);
        getNumeroPc();
    };

    const handleClose = () => setShow(false);

    const getNumeroPc = async () => {
        try {
            const response = await fetch("http://localhost:8090/api/armadi/count");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const jsonData = await response.json();
            if (jsonData) {
                let temp = jsonData.map((element) => (
                    <p key={element.nome}>
                        PC disponibili nel cassetto {element.nome} nell'aula {element.aula}: {element.count}
                    </p>
                ));
                setNumeroPc(temp);
            } else {
                throw new Error("Dati non validi nella risposta JSON");
            }
        } catch (error) {
            console.error("Errore durante la richiesta di numero PC:", error);
        }
    };

    return (
        <>
            <div onClick={handleShow}>{trigger}</div>

            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Numero di PC per Armadio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {numeroPc ? numeroPc : <p>Caricamento in corso...</p>}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default GetNumberPcPerArmadi;