import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModifyComputerStatus = ({ show, onHide }) => {
    const [armadi, setArmadi] = useState([]);
    const [pcs, setPcs] = useState([]);
    const [selectedArmadio, setSelectedArmadio] = useState("");
    const [selectedPc, setSelectedPc] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati

    useEffect(() => {
        const fetchArmadi = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/armadi/all");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const data = await response.json();
                setArmadi(data);
            } catch (error) {
                console.error("Errore durante il fetch degli armadi:", error);
            }
        };

        if (show) {
            fetchArmadi();
        }
    }, [show]);

    useEffect(() => {
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(selectedArmadio !== "" && selectedPc !== "" && newStatus !== "");
    }, [selectedArmadio, selectedPc, newStatus]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
        try {
            const response = await fetch(`http://localhost:8090/api/computers/armadionum/${selectedOption}`);
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
            if (!selectedArmadio || !selectedPc || !newStatus) {
                console.error("Per favore, compila tutti i campi");
                return;
            }

            const response = await fetch('http://localhost:8090/api/computers', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPc,
                    new_status: newStatus,
                    armadio: selectedArmadio
                }),
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("Status aggiornato con successo");
                onHide();
            } else {
                alert("Aggiornamento status fallito");
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello status:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName="custom-modal">
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
                            <Form.Label htmlFor="newStatus">Nuovo Stato</Form.Label>
                            <Form.Control
                                type="text"
                                id="newStatus"
                                value={newStatus}
                                onChange={e => setNewStatus(e.target.value)}
                            />
                        </div>
                    )}

                    <Button type="submit" variant="primary" disabled={!formComplete}>Aggiorna</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModifyComputerStatus;
