import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModifyComputerStatus = ({ trigger }) => {
    const [nome, setNome] = useState("")
    const [cognome, setCognome] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [ruoli, setRuoli] = useState([])
    const [ruolo, setRuolo] = useState("")
    const [formComplete, setFormComplete] = useState(false); //aggiunto uno stato per controllare se tutti i campi sono stati compilati
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (ruoli.length===0) {
            fetchRuoli() 
        }
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(nome !== "" && cognome !== "" && email !== "" && username !== "" && password !== "" && ruolo!== "");
    }, [ruoli, nome, cognome, email, username, password]);

    
    const fetchRuoli = async () => {
        console.log("fetchato ruoli")
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
    };

    const submit = async (event) => {
        event.preventDefault();
        try {
            if (!formComplete) { //controllo inutile, non so perche' sia qui
                console.error("Per favore, compila tutti i campi");
                return;
            }

            const response = await fetch('http://localhost:8090/api/utenti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    cognome: cognome,
                    email: email,
                    ruolo: ruolo,
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            console.log(result.message)
            alert("Utente creato con successo");
        } catch (error) {
            alert("Creazione utente fallita")
            console.error("Errore durante l'aggiornamento dello status:", error);
        }
    };

    return (
        <>
        {React.cloneElement(trigger, {onClick: openModal})}
        <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal" >
            <Modal.Header closeButton>
                <Modal.Title>Aggiungi nuovo utente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor='nome'>Nome: </label>
                        <Form.Control id='nome' type='text' placeholder='Nome...' onChange={(e) => {setNome(e.target.value)}} />
                        <label htmlFor='cognome'>Cognome: </label>
                        <Form.Control id='cognome' type='text' placeholder='Cognome...' onChange={(e) => {setCognome(e.target.value)}} />
                        <label htmlFor='email'>Email: </label>
                        <Form.Control id='email' type='email' placeholder='Email...' onChange={(e) => {setEmail(e.target.value)}} />
                        <Form.Label htmlFor="ruolo">Seleziona Ruolo:</Form.Label>
                        <Form.Select
                            id="ruolo"
                            onChange={(e) => {setRuolo(e.target.value)}}
                            value={ruolo}
                        >
                            <option value="">Seleziona...</option>
                            {ruoli.map(ruolo => (
                                <option key={ruolo} value={ruolo}>
                                    {ruolo}
                                </option>
                            ))}
                        </Form.Select>
                        <label htmlFor='username'>Nome utente: </label>
                        <Form.Control id='username' type='text' placeholder='Nome Utente...' onChange={(e) => {setUsername(e.target.value)}} />
                        <label htmlFor='password'>Password: </label>
                        <Form.Control id='password' type='password' placeholder='Password...' onChange={(e) => {setPassword(e.target.value)}} />
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Crea utente</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default ModifyComputerStatus;
