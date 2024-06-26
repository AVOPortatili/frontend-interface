import React, { useState } from 'react';
import { TiThMenuOutline } from "react-icons/ti";
import Modal from 'react-bootstrap/Modal';
import LoginForm from '../components-login/LoginForm';
import GetNumberPc from './api-call-computers/GetNumberPc';
import GetSinglePc from './api-call-computers/GetSinglePc';
import GetNumberPcPerArmadi from './api-call-armadi/GetNumberPcPerArmadi';
import GetAllArmadi from './api-call-armadi/GetAllArmadi';
import CreateNewUser from './api-call-utenti/CreateNewUser';
import DeleteUser from './api-call-utenti/DeleteUser';
import ModifyPcStatus from './api-call-computers/ModifyPcStatus';
import AddNewPc from './api-call-computers/AddNewPc';
import DeletePc from './api-call-computers/DeletePc';
import { Accordion, Button, ListGroup, Offcanvas } from 'react-bootstrap';
import AddNewArmadio from './api-call-armadi/AddNewArmadio';
import ModifyArmadio from './api-call-armadi/ModifyArmadio';
import ModifyUserRole from './api-call-utenti/ModifyUserRole';
import LogoutModal from './LogoutModal'; //per futuro logout

function NavbarAdmin() {
    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);

    // const openModal = (content, showButtons = false) => {
    //     setModalContent(content);
    //     setShowLogoutButtons(showButtons);
    //     setShowModal(true);
    // };

    // const closeModal = () => {
    //     setShowModal(false);
    // };

    // const openPcStatusModal = () => {
    //     setShowPcStatusModal(true);
    // };

    // const closePcStatusModal = () => {
    //     setShowPcStatusModal(false);
    // };


    //ORA FUNZIONA ANCHE REACT-SELECT, oltre al testo
    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                {/* <a className="btn btn-dark"  role="button"  autoFocus={false} > */}
                    <Button style={{backgroundColor:"#212529", borderColor:"#212529"}} onClick={handleShow}>
                        <TiThMenuOutline style={{ fontSize: '28px' }} />
                    </Button>
                {/* </a> */}
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <span className="navbar-brand mb-0 h1" style={{ fontSize: '30px' }}>HOMEPAGE ADMIN</span>
                </div>
                <Offcanvas show={showOffCanvas} onHide={handleClose} autoFocus={false} enforceFocus={false}>
                    <Offcanvas.Body>
                        <Accordion>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Header>GESTISCI PC</Accordion.Header>
                                <Accordion.Body bsPrefix='collapse show'>
                                    <ListGroup>
                                        <GetNumberPc trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza numero totale di PC
                                            </button>
                                        } />
                                        <GetSinglePc trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza caratteristiche di un singolo PC
                                            </button>
                                        } />
                                        <ModifyPcStatus trigger ={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Aggiorna lo stato di un PC
                                            </button>
                                        } />
                                        <AddNewPc trigger ={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Aggiungi un nuovo PC
                                            </button>
                                        } />
                                        <DeletePc trigger ={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Rimuovi PC
                                            </button>
                                        } />
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='1'>
                                <Accordion.Header>GESTISCI ARMADI</Accordion.Header>
                                <Accordion.Body bsPrefix='collapse show'>
                                    <ListGroup>
                                        <GetAllArmadi trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza tutti gli armadi
                                            </button>
                                        } />
                                        <GetNumberPcPerArmadi trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza numero di pc presenti in ciascun armadio
                                            </button>
                                        } />
                                        <AddNewArmadio trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Aggiungi un nuovo armadio
                                            </button>
                                        } />
                                        <ModifyArmadio trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Modifica un armadio
                                            </button>
                                        } />
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='2'>
                                <Accordion.Header>GESTISCI UTENTI</Accordion.Header>
                                <Accordion.Body bsPrefix='collapse show'>
                                    <ListGroup>
                                        <CreateNewUser trigger ={
                                                <button type="button" className="list-group-item list-group-item-action">
                                                    Inserisci nuovo utente
                                                </button>
                                        } />
                                        <DeleteUser trigger={
                                                <button type="button" className="list-group-item list-group-item-action">
                                                    Elimina utente
                                                </button>
                                        } />
                                        <ModifyUserRole trigger={
                                                <button type="button" className="list-group-item list-group-item-action">
                                                    Cambia il ruolo di un utente
                                                </button>
                                        } />
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Offcanvas.Body>
                </Offcanvas>
            </nav>
        </>
    );
}

export default NavbarAdmin;