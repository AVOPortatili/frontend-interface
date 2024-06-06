import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModifyPcStatus = ({ trigger }) => {
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
    const closeModal = () => { setIsOpen(false); setFormComplete(false) };

    useEffect(() => {
        if (ruoli.length===0) {
            fetchRuoli() 
        }
        //vado a verificare se tutti i campi sono stati compilati
        setFormComplete(nome !== "" && cognome !== "" && email !== "" && ruolo!== "");
    }, [ruoli, ruolo, nome, cognome, email, password]);

    
    const fetchRuoli = async () => {
        console.log("fetchato ruoli")
        try {
            const response = await fetch("http://192.168.1.204:8090/api/ruoli/");
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
            const response = await fetch('http://192.168.1.204:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    cognome: cognome.trim(),
                    email: email.trim(),
                    ruolo: ruolo.trim(),
                })}).then((response) => {
                    console.log("IN")
                    if (!response.ok) {
                        throw new Error("Errore nella richiesta HTTP: " + response.status);
                    }
                    const result = response.json();
                    console.log(result.message)
                    alert("Utente creato con successo");
                    reset();
                });
        } catch (error) {
            alert("Creazione utente fallita")
            console.error("Errore durante l'aggiornamento dello status:", error);
        }
    };

    const reset = () => {
        const nome =  document.getElementById("nome");
        const cognome =  document.getElementById("cognome");
        const email =  document.getElementById("email");
        const ruolo =  document.getElementById("ruolo");
        nome.value = "";
        cognome.value = "";
        email.value = "";
        ruolo.selectedIndex = 0;
        setNome("")
        setCognome("")
        setEmail("")
        setRuolo("")
    }

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
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Crea utente</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default ModifyPcStatus;
