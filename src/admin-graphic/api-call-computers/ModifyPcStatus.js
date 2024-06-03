import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';

const ModifyPcStatus = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pcs, setPcs] = useState();
    const [pcsData, setPcsData] = useState();
    const [selectedPc, setSelectedPc] = useState();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleOptionChange = (selectedOption) => { //aggiorna osservazioni e data ultimo aggiornamento
        console.log(selectedOption.target.value)
        setSelectedPc(pcsData[selectedOption.target.value])
    }

    useEffect(() => {
        if (!pcs && isOpen) {
            getPcs();
        }
    }, [isOpen, pcs]);

    const getPcs = async () => {
        try {
            const response = await fetch("http://localhost:8090/api/computers");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const jsonData = await response.json();
            if (jsonData) {
                setPcsData(jsonData)
                setPcs(jsonData.map((element, index) => {return <><option value={index}>{element.nome}</option></>}));
            } else {
                throw new Error("Dati non validi nella risposta JSON");
            }
        } catch (error) {
            console.error("Errore durante la richiesta di numero PC:", error);
        }
    };

    const [status, setStatus] = useState(false)
    const [osservazioni, setOsservazioni] = useState("")

    const sendData = async () => {
        const res = await fetch("http://localhost:8090/api/pc",{
            method:"POST",
            mode:"cors",
            body: {
                "new_status" : status,
                "osservazioni" : osservazioni
            }
        })
        //REMINDER: RIPARTIRE DA QUI
    }
    
    return (
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>AGGIORNA LO STATO DI UN PC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center' }}>
                        {pcs ? (
                            <Form.Select onChange={handleOptionChange}>
                                {pcs}
                            </Form.Select>
                        ) : (
                            <p>Caricamento...</p>
                        )}
                        { selectedPc ? (
                            <div style={{margin: "30px"}}>
                                <input type="checkbox" name="isBroken" onChange={(e) => {setStatus(e.target.value)}} />
                                <input type="text" placeholder="inserisci osservazioni" onChange={(e) => {setOsservazioni(e.target.value)}}></input>
                                <button type="button" onClick={sendData}>change</button>
                            
                            </div>
                            
                        ) : (
                            <></>
                        )
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModifyPcStatus;