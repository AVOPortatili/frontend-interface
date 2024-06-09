import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddNewArmadio = ({ trigger }) => {
    const [selectedArmadio, setSelectedArmadio] = useState("");
    const [nome, setNome] = useState("")
    const [numInv, setNumInv] = useState("")
    const [aula, setAula] = useState("")
    const [capienza, setCapienza] = useState("");
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        setFormComplete(nome !== "" && capienza !== "" && nome !== "" && aula !== "");
    }, [selectedArmadio, nome, numInv, nome, aula, isOpen]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
    };

    const reset = () => {
        setAula("")
        setNome("")
        setCapienza("")
    }

    const submit = async (event) => {
        event.preventDefault();
        try {
            if (!formComplete) {
                console.error("Per favore, compila tutti i campi");
                return;
            }
            const response = await fetch('http://localhost:8090/api/armadi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    capienza: capienza,
                    aula: aula
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("Armadio aggiunto con successo");
            } else {
                alert("Aggiunta non riuscita");
            }
            reset()
        } catch (error) {
            alert("Aggiunta fallita (errori nella comunicazione con il server)");
            console.error("Errore durante l'aggiunta del nuovo armadio:", error);
        }
    };

    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>AGGIUNGI ARMADIO</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor='nome'>Nome: </label>
                        <Form.Control id='nome' type='text' placeholder='Nome...' value={nome} onChange={(e) => {setNome(e.target.value)}} />
                        <label htmlFor='capienza'>Capienza: </label>
                        <Form.Control id='capienza' type='text' placeholder='Capienza...' value={capienza} onChange={(e) => {setCapienza(e.target.value)}} onKeyDown={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }}} />
                        <label htmlFor='aula'>Aula: </label>
                        <Form.Control id='aula' type='text' placeholder='Aula...' value={aula} onChange={(e) => {setAula(e.target.value)}} />
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Aggiungi Armadio</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default AddNewArmadio;
