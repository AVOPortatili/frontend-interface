import React, { useState } from 'react';
import { TiThMenuOutline } from "react-icons/ti";
import Modal from 'react-bootstrap/Modal';
import LoginForm from '../components-login/LoginForm';
import GetNumberPc from './api-call-computers/GetNumberPc';
import GetSinglePc from './api-call-computers/GetSinglePc';
import GetNumberPcPerArmadi from './api-call-armadi/GetNumberPcPerArmadi';
import GetAllArmadi from './api-call-armadi/GetAllArmadi';
import ModifyComputerStatus from './api-call-computers/ModifyComputerStatus';

function NavbarAdmin() {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [showLogoutButtons, setShowLogoutButtons] = useState(false);
    const [redirectToLoginForm, setRedirectToLoginForm] = useState(false);
    const [showPcStatusModal, setShowPcStatusModal] = useState(false);

    const openModal = (content, showButtons = false) => {
        setModalContent(content);
        setShowLogoutButtons(showButtons);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openPcStatusModal = () => {
        setShowPcStatusModal(true);
    };

    const closePcStatusModal = () => {
        setShowPcStatusModal(false);
    };

    return (
        <>
            {redirectToLoginForm ? <LoginForm /> : null}
            <nav className="navbar navbar-dark bg-dark">
                <a className="btn btn-dark" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                    <TiThMenuOutline style={{ fontSize: '28px' }} />
                </a>
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <span className="navbar-brand mb-0 h1" style={{ fontSize: '30px' }}>HOMEPAGE ADMIN</span>
                </div>

                <div className="offcanvas offcanvas-start offcanvas-custom" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel">HOMEPAGE ADMIN</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        GESTISCI PC
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                    <div className="list-group">
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
                                        <button type="button" className="list-group-item list-group-item-action" onClick={openPcStatusModal}>
                                            Aggiorna lo stato di un PC
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        GESTISCI ARMADI
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div className="list-group">
                                    <GetAllArmadi trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza tutti gli armadi
                                            </button>
                                        } />
                                        <GetNumberPcPerArmadi trigger={
                                            <button type="button" className="list-group-item list-group-item-action">
                                                Visualizza numero di pc presente in ciascun armadio
                                            </button>
                                        } />
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        GESTISCI UTENTI
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div className="list-group">
                                        <button type="button" className="list-group-item list-group-item-action">Aggiungi Utente </button>
                                        <button type="button" className="list-group-item list-group-item-action">Elimina Utente </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-danger btn-block my-1 d-block" onClick={() => openModal("Sei sicuro di voler effettuare il logout?", true)}>LOGOUT</button>
                    </div>
                </div>
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

        <ModifyComputerStatus show={showPcStatusModal} onHide={closePcStatusModal} />

        </>
    );
}

export default NavbarAdmin;