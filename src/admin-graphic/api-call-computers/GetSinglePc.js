import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; // Importa il componente Modal di Bootstrap
import Select  from 'react-select';

const GetSinglePc = ({ isOpen, onClose }) => {
    const [pcs, setPcs] = useState();
    console.log("sono entrato single")

    useEffect(() => {
        const getPcs = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/computers/count");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const jsonData = await response.json();
                console.log(jsonData)
                console.log("Mostra lista pc");
                if (jsonData && typeof jsonData.count !== 'undefined') {
                    let temp = jsonData.map((element) => {return {label: element.nome, value:element.id}})
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
        <Modal
            show={isOpen} // Utilizza la prop 'show' per mostrare/nascondere il modal
            onHide={onClose} // Usa la prop 'onHide' per gestire la chiusura del modal
            dialogClassName="custom-modal" // Opzionale: aggiungi classi personalizzate al modal
        >
            <Modal.Header closeButton>
                <Modal.Title>SPECIFICHE DI UN SINGOLO PC</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: 'center' }}>
                    {pcs ? (
                            <Select isSearchable options={pcs} isClearable/>
                    ) : (
                        <p>Caricamento...</p>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GetSinglePc;