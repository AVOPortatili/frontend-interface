import React from 'react';

const RitiroModal = ({ ritiroInfo, onChange, onSubmit, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Informazioni Ritiro</h2>
        <form onSubmit={onSubmit}>
          <label>Ora Consegna:</label>
          <input
            type="time"
            name="oraConsegna"
            value={ritiroInfo.oraConsegna}
            onChange={onChange}
          />
          <label>Data:</label>
          <input
            type="date"
            name="data"
            value={ritiroInfo.data}
            onChange={onChange}
          />
          <label>Classe:</label>
          <input
            type="text"
            name="classe"
            value={ritiroInfo.classe}
            onChange={onChange}
          />
          <label>Aula Utilizzo:</label>
          <input
            type="text"
            name="aulaUtilizzo"
            value={ritiroInfo.aulaUtilizzo}
            onChange={onChange}
          />
          <button type="submit">Salva</button>
        </form>
      </div>
    </div>
  );
};

export default RitiroModal;