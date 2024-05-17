import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

const GetSinglePc = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pcs, setPcs] = useState();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const getPcs = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/computers");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
                if (jsonData) {
                    let temp = jsonData.map((element) => { return { label: element.nome, value: element.id } });
                    setPcs(temp);
                } else {
                    throw new Error("Dati non validi nella risposta JSON");
                }
            } catch (error) {
                console.error("Errore durante la richiesta di numero PC:", error);
            }
        };

        if (isOpen) {
            getPcs();
        }
    }, [isOpen]);

    return (
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>SPECIFICHE DI UN SINGOLO PC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center' }}>
                        {pcs ? (
                            <Select isSearchable options={pcs} isClearable />
                        ) : (
                            <p>Caricamento...</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default GetSinglePc;