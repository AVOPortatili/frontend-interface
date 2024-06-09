import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModifyArmadio = ({ trigger }) => {
    const [armadi, setArmadi] = useState([]);
    const [selectedArmadio, setSelectedArmadio] = useState("");
    const [capienza, setCapienza] = useState("");
    const [aula, setAula] = useState("")
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () =>  {setIsOpen(true); fetchArmadi()};
    const closeModal = () => setIsOpen(false);

    const reset = () => {
        setSelectedArmadio("")
        setCapienza("")
        setAula("")
        fetchArmadi()
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
    

    useEffect(() => {
        setFormComplete(selectedArmadio !== "" && capienza !== "" && aula !== "");
    }, [selectedArmadio, capienza, aula, isOpen]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
    };

    const handleUpdateStatus = async (event) => {
        event.preventDefault();
        try {
            if (!formComplete) {
                console.error("Per favore, compila tutti i campi");
                return;
            }

            const response = await fetch('http://localhost:8090/api/armadi', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedArmadio,
                    aula: aula,
                    capienza: capienza,
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
            const response = await fetch(`http://localhost:8090/api/computers/armadionum/${selectedArmadio}`);
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            reset()
        } catch (error) {
            console.error("Errore durante il fetch dei PCs:", error);
        }
    };

    //forse sarebbe utile visualizzare anche le vecchie capienza
    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
            <Modal.Header closeButton>
            <Modal.Title>MODIFICA LE CARATTERISTICHE DI UN ARMADIO</Modal.Title>
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
                        {selectedArmadio!=="" && (
                            <>
                                <label htmlFor='capienza'>Capienza: </label>
                                <Form.Control id='capienza' type='text' placeholder='Capienza...' value={capienza} onChange={(e) => {setCapienza(e.target.value)}} onKeyDown={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }}} />
                                <label htmlFor='aula'>Aula: </label>
                                <Form.Control id='aula' type='text' placeholder='Aula...' value={aula} onChange={(e) => {setAula(e.target.value)}} />
                            </>
                        )}
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Aggiorna</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default ModifyArmadio;
