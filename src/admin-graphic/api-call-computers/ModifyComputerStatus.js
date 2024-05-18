import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

const ModifyComputerStatus = ({ show, onHide }) => {
    const [armadi, setArmadi] = useState([]);
    const [pcs, setPcs] = useState([]);
    const [selectedArmadio, setSelectedArmadio] = useState(null);
    const [selectedPc, setSelectedPc] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        const fetchArmadi = async () => {
            try {
                const response = await fetch("http://localhost:8090/api/armadi/all");
                if (!response.ok) {
                    throw new Error("Errore nella richiesta HTTP: " + response.status);
                }
                const data = await response.json();
                const armadiOptions = data.map(armadio => ({
                    value: armadio.id,
                    label: `${armadio.nome} - ${armadio.aula}`
                }));
                setArmadi(armadiOptions);
            } catch (error) {
                console.error("Errore durante il fetch degli armadi:", error);
            }
        };

        if (show) {
            fetchArmadi();
        }
    }, [show]);

    const handleArmadioChange = async (selectedOption) => {
        setSelectedArmadio(selectedOption);
        try {
            const response = await fetch(`http://localhost:8090/api/computers?armadio=${selectedOption.value}`);
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            const pcOptions = data.map(pc => ({
                value: pc.id,
                label: `${pc.nome} - ${pc.status}`
            }));
            setPcs(pcOptions);
            setSelectedPc(null); // Reset selected PC when changing armadio
        } catch (error) {
            console.error("Errore durante il fetch dei PCs:", error);
        }
    };

    const handlePcChange = (selectedOption) => {
        setSelectedPc(selectedOption);
    };

    const handleUpdateStatus = async (event) => {
        event.preventDefault();
        try {
            if (!selectedArmadio || !selectedPc) {
                console.error("Nessun armadio o PC selezionato");
                return;
            }

            const response = await fetch('http://localhost:8090/api/computers', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPc.value,
                    new_status: newStatus,
                    armadio: selectedArmadio.value
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
                <form onSubmit={handleUpdateStatus}>
                    <div className="mb-3">
                        <label htmlFor="armadioSelect" className="form-label">Seleziona Armadio</label>
                        <Select
                            id="armadioSelect"
                            options={armadi}
                            onChange={handleArmadioChange}
                            value={selectedArmadio}
                        />
                    </div>

                    {pcs.length > 0 && (
                        <div className="mb-3">
                            <label htmlFor="pcSelect" className="form-label">Seleziona PC</label>
                            <Select
                                id="pcSelect"
                                options={pcs}
                                onChange={handlePcChange}
                                value={selectedPc}
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="newStatus" className="form-label">Nuovo Stato</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newStatus"
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Aggiorna</button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default ModifyComputerStatus;
