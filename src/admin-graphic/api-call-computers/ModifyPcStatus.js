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

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const fetchArmadi = async () => {
        console.log("fetchato armadi")
        try {
            const response = await fetch("http://192.168.1.204:8090/api/armadi/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setArmadi(data);
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
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(selectedArmadio !== "" && selectedPc !== "" && newStatus !== "");
    }, [selectedArmadio, selectedPc, newStatus, isOpen]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
        try {
            const response = await fetch(`http://192.168.1.204:8090/api/computers/armadionum/${selectedOption}`);
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setPcs(data);
            setSelectedPc("");
        } catch (error) {
            console.error("Errore durante il fetch dei PCs:", error);
        }
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

            const response = await fetch('http://192.168.1.204:8090/api/computers', {
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
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello status:", error);
        }
        try {
            const response = await fetch(`http://192.168.1.204:8090/api/computers/armadionum/${selectedArmadio}`);
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            setPcs(data);
            setSelectedPc("");
        } catch (error) {
            console.error("Errore durante il fetch dei PCs:", error);
        }
    };

    //forse sarebbe utile visualizzare anche le vecchie osservazioni
    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Aggiorna Stato PC</Modal.Title>
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

                    {selectedArmadio && (
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
                    )}

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
                                <Form.Control id='ossevazioni' type='text' placeholder='Scrivi qui eventuali osservazioni...' onChange={(e) => {setOsservazioni(e.target.value)}} />
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
