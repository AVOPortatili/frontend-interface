import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from "react-bootstrap";

export const ChangePasswordForm = ({ trigger, props }) => {
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [secondNewPassword, setSecondNewPassword] = useState()
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("")

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    
    useEffect(() => {
        console.log(props)
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(oldPassword !== "" && newPassword !== "" && secondNewPassword !== "");
    }, [oldPassword, newPassword, secondNewPassword]);
    
    const submit = async (event) => {
        event.preventDefault();
        if (formComplete && newPassword==secondNewPassword) {
            try {
                const response = await fetch('http://192.168.1.204:8080/api/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: props.username, 
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    })}).then((response) => {
                        console.log("IN")
                        if (!response.ok) {
                            throw new Error("Errore nella richiesta HTTP: " + response.status);
                        }
                        const result = response.json();
                        console.log(result.message)
                        alert("Password cambiata con successo");
                    });
            } catch (error) {
                alert("Cambio password fallito")
                console.error("Errore durante l'aggiornamento dello status:", error);
            }
        } else {
            alert("Le due password non corrispondono")
        }
    };

    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal" >
            <Modal.Header closeButton>
                <Modal.Title>Cambia password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor='nome'>Vecchia password: </label>
                        <Form.Control id='nome' type='password' onChange={(e) => {setOldPassword(e.target.value)}} />
                        <label htmlFor='cognome'>Nuova password: </label>
                        <Form.Control id='cognome' type='password' onChange={(e) => {setNewPassword(e.target.value)}} />
                        <label htmlFor='cognome'>Conferma nuova password: </label>
                        <Form.Control id='cognome' type='password' onChange={(e) => {setSecondNewPassword(e.target.value)}} />
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Cambia password</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}