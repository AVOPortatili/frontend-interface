import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModifyPcStatus = ({ trigger }) => {
    const [armadi, setArmadi] = useState([]);
    const [pcs, setPcs] = useState([]);
    const [statusList, setStatusList] = useState([])
    const [selectedArmadio, setSelectedArmadio] = useState("");
    const [selectedPc, setSelectedPc] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [osservazioni, setOsservazioni] = useState("");
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () =>  {setIsOpen(true); fetchArmadi(); fetchPcs()};
    const closeModal = () => setIsOpen(false);

    const reset = () => {
        setSelectedArmadio("")
        setSelectedPc("")
        setNewStatus("")
        setOsservazioni("")
        fetchPcs()
    }

    const fetchArmadi = async () => {
        console.log("fetchato armadi")
        try {
            const response = await fetch("http://localhost:8090/api/armadi/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setArmadi(data);
        } catch (error) {
            console.error("Errore durante il fetch degli armadi:", error);
        }
    };
    
    const fetchPcs = async () => {
        console.log("fetchato armadi")
        try {
            const response = await fetch("http://localhost:8090/api/computers/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setPcs(data);
        } catch (error) {
            console.error("Errore durante il fetch degli armadi:", error);
        }
    };

    useEffect(() => {
        if (!statusList) {
            setStatusList()
        }
        if (armadi.length===0) {
            fetchArmadi();
        }
        if (pcs.length===0) {
            fetchPcs();
        }
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(selectedArmadio !== "" && selectedPc !== "" && newStatus !== "");
    }, [selectedArmadio, selectedPc, newStatus, isOpen]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
    };

    const handlePcChange = (event) => {
        setSelectedPc(event.target.value);
    };

    const handleUpdateStatus = async (event) => {
        event.preventDefault();
        try {
            if (!formComplete) {
                console.error("Per favore, compila tutti i campi");
                return;
            }
            if(newStatus==="disponibile" && selectedArmadio==="") {
                alert("Un pc dev'essere in un armadio per essere disponibile")
            }

            const response = await fetch('http://localhost:8090/api/computers', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPc,
                    new_status: newStatus,
                    armadio: selectedArmadio,
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("Status aggiornato con successo");
            } else {
                alert("Aggiornamento status fallito");
            }
            reset()
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello status:", error);
        }
    };

    //forse sarebbe utile visualizzare anche le vecchie osservazioni
    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
            <Modal.Header closeButton>
            <Modal.Title>MODIFICA LO STATO DI UN PC</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdateStatus}>
                    <div className="mb-3">
                        <Form.Label htmlFor="armadioSelect">Seleziona Armadio</Form.Label>
                        <Form.Select
                            id="armadioSelect"
                            onChange={handleArmadioChange}
                            value={selectedArmadio}
                        >
                            <option value="">Seleziona...</option>
                            {armadi.map(armadio => (
                                <option key={armadio.id} value={armadio.id}>
                                    {`${armadio.nome} - ${armadio.aula}`}
                                </option>
                            ))}
                        </Form.Select>
                    </div>

                        <div className="mb-3">
                            <Form.Label htmlFor="pcSelect">Seleziona PC</Form.Label>
                            <Form.Select
                                id="pcSelect"
                                onChange={handlePcChange}
                                value={selectedPc}
                            >
                                <option value="">Seleziona...</option>
                                {pcs.map(pc => (
                                    <option key={pc.id} value={pc.id}>
                                        {`${pc.nome} - ${pc.status}`}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>

                    {selectedPc && (
                            <div className="mb-3">
                                <Form.Label htmlFor="statusSelect">Nuovo Stato</Form.Label>
                                <Form.Select
                                    id="statusSelect"
                                    onChange={(e) => {setNewStatus(e.target.value)}}
                                    value={newStatus}
                                >
                                    <option value="">Seleziona...</option>
                                    <option key={0} value={"disponibile"}> Disponibile </option>
                                    <option key={1} value={"non disponibile"}> Non disponibile </option>
                                    <option key={2} value={"guasto"}> Guasto </option>
                                </Form.Select>
                                <br/>
                                <Form.Control id='ossevazioni' type='text' placeholder='Scrivi qui eventuali osservazioni...' onChange={(e) => {setOsservazioni(e.target.value)}} value={osservazioni} />
                            </div>
                    )}

                    <Button type="submit" variant="primary" disabled={!formComplete}>Aggiorna</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default ModifyPcStatus;
