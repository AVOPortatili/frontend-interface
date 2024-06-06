import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
//implementa poi React-Select con multiselect
const GetSingleuser = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const openModal = () => { setIsOpen(true); getUsers()};
    const closeModal = () =>  { setIsOpen(false); setSelectedUser("") };

    useEffect(() => {
        if (users.length===0 ) {
            getUsers();
        }
    }, [isOpen, users.length]);

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


    const submit = async (event) => {
        event.preventDefault();
        try {
            if (selectedUser==="") {
                console.error("Per favore, compila tutti i campi");
                return;
            }

            const response = await fetch('http://localhost:8090/api/utenti', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedUser,
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
        getUsers()
    };
    
    return (
        <>
            {React.cloneElement(trigger, { onClick: openModal })}
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>ELIMINA UTENTI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submit}>
                        <div className="mb-3">
                            <Form.Label htmlFor="armadioSelect">Seleziona Utente</Form.Label>
                            <Form.Select
                                id="armadioSelect"
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
                        </div>
                        <Button type="submit" variant="primary" disabled={selectedUser===""}>Elimina</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default GetSingleuser;