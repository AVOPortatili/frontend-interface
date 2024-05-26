import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';

const LogoutModal = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
            <Modal show={isOpen} onHide={closeModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>CONFERMA LOGOUT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Sei sicuro di voler effettuare il logout?
                </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-center">
                        <button className="btn btn-secondary mr-2" onClick={closeModal}>NO</button>
                        <button className="btn btn-primary" onClick={window.location.reload()}>Sì</button>
                    </Modal.Footer>
            </Modal>
    );
};

export default LogoutModal;