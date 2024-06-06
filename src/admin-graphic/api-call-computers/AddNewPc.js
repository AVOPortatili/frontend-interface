import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker, {registerLocale} from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import it from "date-fns/locale/it"; // the locale you want
registerLocale("it", it); // register it with the name you want

const AddNewPc = ({ trigger }) => {
    const [armadi, setArmadi] = useState([]);
    const [statusList, setStatusList] = useState([])
    const [selectedArmadio, setSelectedArmadio] = useState("");
    const [status, setStatus] = useState("");
    const [nome, setNome] = useState("")
    const [numInv, setNumInv] = useState("")
    const [mac, setMac] = useState("")
    const [note, setNote] = useState("")
    const [dataUltimoAggiornamento, setDataUltimoAggiornamento] = useState(new Date())
    const [armadio, setArmadio] = useState("")
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
        setFormComplete(nome !== "" && numInv !== "" && mac !== "" && note !== "" && dataUltimoAggiornamento && status !== "");
    }, [selectedArmadio, nome, numInv, mac, note, dataUltimoAggiornamento, status, isOpen]);

    const handleArmadioChange = async (event) => {
        const selectedOption = event.target.value;
        setSelectedArmadio(selectedOption);
    };

    const submit = async (event) => {
        event.preventDefault();
        try {
            if (!formComplete) {
                console.error("Per favore, compila tutti i campi");
                return;
            }
            if (selectedArmadio==="" && status==="disponibile") {
                alert("Un PC disponibile deve per forza essere all'interno di un armadio")
                return; //questi return points multipli fanno davvero schifo
            }
            const response = await fetch('http://192.168.1.204:8090/api/computers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    numero_inventario: numInv,
                    mac_address_wifi: mac,
                    note: note,
                    data_ultimo_aggiornamento: dataUltimoAggiornamento,
                    osservazioni: osservazioni,
                    status: status,
                    armadio: selectedArmadio!=="" ? (selectedArmadio) : (undefined),
                })
            });

            if (!response.ok) {
                throw new Error("Errore nella richiesta HTTP: " + response.status);
            }

            const result = await response.json();
            if (result.message === 'success') {
                alert("PC aggiunto con successo");
            } else {
                alert("Aggiunta PC fallita");
            }
        } catch (error) {
            alert("Aggiunta PC fallita (errori nella comunicazione con il server)");
            console.error("Errore durante l'aggiunta del nuovo PC:", error);
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
                <Form onSubmit={submit}>
                    <div className="mb-3">
                        <Form.Label htmlFor="armadioSelect">Seleziona Armadio:</Form.Label>
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
                        <Form.Label htmlFor="statusSelect">Seleziona Stato:</Form.Label>
                        <Form.Select
                            id="statusSelect"
                            onChange={(e) => {setStatus(e.target.value)}}
                            value={status}
                        >
                            <option value="">Seleziona...</option>
                            <option key={0} value={"disponibile"}> Disponibile </option>
                            <option key={1} value={"non disponibile"}> Non disponibile </option>
                            <option key={2} value={"guasto"}> Guasto </option>
                        </Form.Select>
                        <label htmlFor='nome'>Nome: </label>
                        <Form.Control id='nome' type='text' placeholder='Nome...' onChange={(e) => {setNome(e.target.value)}} />
                        <label htmlFor='numInv'>Numero inventario: </label>
                        <Form.Control id='numInv' type='text' placeholder='Numero inventario...' onChange={(e) => {setNumInv(e.target.value)}} onKeyDown={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }}} />
                        <label htmlFor='mac'>Mac address: </label>
                        <Form.Control id='mac' type='text' placeholder='Mac address...' onChange={(e) => {setMac(e.target.value)}} />
                        <label htmlFor='note'>Specifiche: </label>
                        <Form.Control id='note' type='text' placeholder='Specifiche...' onChange={(e) => {setNote(e.target.value)}} />
                        <label htmlFor='data'>Data ultimo aggiornamento: </label>
                        <br />
                        <DatePicker
                            selected={dataUltimoAggiornamento}
                            onChange={(data) => setDataUltimoAggiornamento(data)}
                            locale="it"
                        /> 
                        <br />
                        <label htmlFor='osservazioni'>Osservazioni: </label>
                        <Form.Control id='ossevazioni' type='text' placeholder='Scrivi qui eventuali osservazioni...' onChange={(e) => {setOsservazioni(e.target.value)}} />
                    </div>
                    <Button type="submit" variant="primary" disabled={!formComplete}>Aggiungi Computer</Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default AddNewPc;
