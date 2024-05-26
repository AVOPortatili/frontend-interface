import React, { useState } from 'react';
import { TiThMenuOutline } from "react-icons/ti";
import Modal from 'react-bootstrap/Modal';
import LoginForm from '../components-login/LoginForm';
import GetNumberPc from './api-call-computers/GetNumberPc';
import GetSinglePc from './api-call-computers/GetSinglePc';
import GetNumberPcPerArmadi from './api-call-armadi/GetNumberPcPerArmadi';
import GetAllArmadi from './api-call-armadi/GetAllArmadi';
import ModifyComputerStatus from './api-call-computers/ModifyComputerStatus';
import { Accordion, Button, ListGroup, Offcanvas } from 'react-bootstrap';

function NavbarAdmin() {
    const [showOffCanvas, setShowOffCanvas] = useState(false)
    const [redirectToLoginForm, setRedirectToLoginForm] = useState(false);

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
            {redirectToLoginForm ? <LoginForm /> : null}
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
                                        <ModifyComputerStatus trigger ={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Aggiorna lo stato di un PC
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
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='2'>
                                <Accordion.Header>GESTISCI UTENTI</Accordion.Header>
                                <Accordion.Body bsPrefix='collapse show'>
                                    <ListGroup>
                                                <button type="button" className="list-group-item list-group-item-action">
                                                    Invita nuovo utente
                                                </button>
                                                <button type="button" className="list-group-item list-group-item-action">
                                                    Elimina utente
                                                </button>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Offcanvas.Body>
                </Offcanvas>
                    {/* <button className="btn btn-danger btn-block my-1 d-block" onClick={() => openModal("Sei sicuro di voler effettuare il logout?", true)}>LOGOUT</button> */}
            </nav>
{/* 
            <Modal show={showModal} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{showLogoutButtons ? "CONFERMA LOGOUT" : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent}
                </Modal.Body>
                {showLogoutButtons && (
                    <Modal.Footer className="d-flex justify-content-center">
                        <button className="btn btn-secondary mr-2" onClick={closeModal}>NO</button>
                        <button className="btn btn-primary" onClick={closeModal}>SI</button>
                    </Modal.Footer>
                )}
            </Modal> */}

        </>
    );
}

export default NavbarAdmin;