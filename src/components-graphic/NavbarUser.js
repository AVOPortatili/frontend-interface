import '../App.css';
import React, { useState } from 'react';
import pcPortatili from '../Images/pcPortatili.jpg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Modal from 'react-bootstrap/Modal';
import LoginForm from '../components-login/LoginForm';
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

function NavbarUser({ doLogout }) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [showLogoutButtons, setShowLogoutButtons] = useState(false); //stato per tenere traccia della visualizzazione dei bottoni di logout
    const [logoutConfirmed, setLogoutConfirmed] = useState(false); //stato per tenere traccia se il logout è stato confermato
    const [redirectToLoginForm, setRedirectToLoginForm] = useState(false); //stato per indicare se reindirizzare al LoginForm

    // Funzione per aprire il modale con il contenuto specifico
    const openModal = (content, showButtons = false) => {
        setModalContent(content);
        setShowLogoutButtons(showButtons); //mostra i bottoni di logout solo se necessario
        setShowModal(true);
    };

    // Funzione per chiudere il modale
    const closeModal = () => {
        setShowModal(false);
    };

    // Funzione per gestire il logout confermato
    const handleLogoutConfirmed = async () => {
        setShowModal(false); // Chiudi il modale di conferma
        window.location.reload()
    };

    return (
        <>
            {redirectToLoginForm ? <LoginForm /> : null}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <div className="d-flex justify-content-start align-items-center">
                        <a className="navbar-brand">
                            <img src={pcPortatili} className="img-thumbnail mr-2" alt="..." />
                        </a>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <span className="navbar-brand mb-0 h1" style={{ fontSize: '30px' }}>HOMEPAGE</span>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <ul className="nav nav-pills">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle " data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" style={{ color: '#fff', textDecoration: 'none' }}>MENU'</a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><a className="dropdown-item" onClick={() => openModal("Email: progettoportatili@gmail.com")}>Contattaci</a></li>
                                    {/* <li className="dropdown-divider"></li>
                                    <li><a className="dropdown-item" onClick={() => openModal("Numero pc Ritirati/Orario:")}>Informazioni sul ritiro</a></li> */}
                                    <li className="dropdown-divider"></li>
                                    <li><a className="dropdown-item" onClick={() => openModal("Sei sicuro di voler effettuare il logout?", true)}>LOGOUT</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/*modal per vedere le info aggiuntive */}
            <Modal show={showModal} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{showLogoutButtons ? "CONFERMA LOGOUT" : "Informazioni aggiuntive"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent}
                </Modal.Body>
                {showLogoutButtons && (
                    <Modal.Footer className="d-flex justify-content-center">
                        <button className="btn btn-secondary mr-2" onClick={closeModal}>NO</button>
                        {/* <button className="btn btn-primary" onClick={window.location.reload()}>SI</button>messo fino a quando non funzionerà il logout */}
                        <button className="btn btn-primary" onClick={handleLogoutConfirmed}>Sì</button>
                    </Modal.Footer>
                )}
            </Modal>

        </>
    );
}

export default NavbarUser;
