import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
//implementa poi React-Select con multiselect
const DeleteUser = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [ruoli, setRuoli] = useState([]);
    const [selectedRuolo, setSelectedRuolo] = useState("")
    const [selectedUser, setSelectedUser] = useState("");
    const [formComplete, setFormComplete] = useState(false)

    const openModal = () => {setIsOpen(true); getUsers(); getRuoli()};
    const closeModal = () =>  setIsOpen(false);

    useEffect(() => {
        setFormComplete(selectedUser !== "" && selectedRuolo !== "");
    }, [selectedUser, selectedRuolo]);

    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:8090/api/utenti");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const jsonData = await response.json();
            if (jsonData) {
                setUsers(jsonData);
            } else {
                throw new Error("Dati non validi nella risposta JSON");
            }
        } catch (error) {
            console.error("Errore durante la richiesta di numero user:", error);
        }
    };

    const getRuoli = async () => {
        try {
            const response = await fetch("http://localhost:8090/api/ruoli/");
            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }
            const data = await response.json();
            console.log(data)
            setRuoli(data.map((ruolo) => {return ruolo.nome}));
        } catch (error) {
            console.error("Errore durante il fetch degli armadi:", error);
        }
    }

    const reset = () => {
        setSelectedUser("")
        setSelectedRuolo("")
        getUsers() //maledetto codice poliglotta
        getRuoli()
    }

    const submit = async (event) => {
        event.preventDefault();
        try {
            if (selectedUser==="") {
                console.error("Per favore, compila tutti i campi");
                return;
            }
            const response = await fetch('http://localhost:8090/api/utenti', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedUser,
                    ruolo: selectedRuolo
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("Utente eliminato con successo");
            } else {
                alert("Eliminazione dell'utente fallita");
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione dell'utente:", error);
        }
        reset()
    };
    
    return (
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>CAMBIA IL RUOLO DI UN UTENTE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submit}>
                        <div className="mb-3">
                            <Form.Label htmlFor="userSelect">Seleziona Utente:</Form.Label>
                            <Form.Select
                                id="userSelect"
                                onChange={(e) => {setSelectedUser(e.target.value)}}
                                value={selectedUser}
                            >
                                <option value="">Seleziona...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {`${user.nome} ${user.cognome} - ${user.username}`}
                                    </option>
                                ))}
                            </Form.Select>
                            {selectedUser!=="" && (
                                <>
                                <Form.Label htmlFor="ruolo">Seleziona Ruolo:</Form.Label>
                                <Form.Select
                                    id="ruolo"
                                    onChange={(e) => {setSelectedRuolo(e.target.value)}}
                                    value={selectedRuolo}
                                >
                                    <option value="">Seleziona...</option>
                                    {ruoli.map(ruolo => (
                                        <option key={ruolo} value={ruolo}>
                                            {ruolo}
                                        </option>
                                    ))}
                                </Form.Select>
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

export default DeleteUser;