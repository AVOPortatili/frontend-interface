import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const DeletePc = ({ trigger }) => {
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
        if (isOpen===true) {
            getPcs();
        }
        if (isOpen===false) {
            setSelectedPc(0)
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
    
    const submit = async (event) => {
        event.preventDefault();
        try {
            if (selectedPc==="") {
                console.error("Per favore, compila tutti i campi");
                return;
            }

            const response = await fetch('http://localhost:8090/api/computers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPc.id,
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("PC rimosso con successo");
            } else {
                alert("Rimozione del PC fallita");
            }
        } catch (error) {
            console.error("Errore durante la rimozione del PC:", error);
        }
        setSelectedPc()
        getPcs()
    };
    return (
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>RIMUOVI UN PC</Modal.Title>
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
                                <>&#x2022;Numero inventario: {selectedPc.numero_inventario}</>
                                <br/>
                                <>&#x2022;Indirizzo MAC: {selectedPc.mac_address_wifi}</>
                                <br/>
                                <>&#x2022;Specifiche: {selectedPc.note}</>
                                <br/>
                                <>&#x2022;Data dell'ultimo aggiornamento: {new Date(selectedPc.data_ultimo_aggiornamento).toLocaleString('it-IT', {dateStyle: "short"})}</>
                                <br/>
                                {selectedPc.osservazioni!=="" && selectedPc.osservazioni ? (<>&#x2022;Osservazioni: {selectedPc.osservazioni}<br/></>) : (<></>)}
                                <>&#x2022;Status corrente: {selectedPc.status}</>
                                <br/>
                                {selectedPc.status==="disponibile" ? (<>&#x2022;Armadio corrente: {selectedPc.armadio}<br/></>) : (<></>)}
                            </div>
                            
                        ) : (
                            <></>
                        )
                        }
                    </div>
                    <Button variant="primary" disabled={!selectedPc} onClick={submit}>Rimuovi</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DeletePc;