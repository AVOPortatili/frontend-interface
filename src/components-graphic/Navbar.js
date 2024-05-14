import pcPortatili from '../Images/pcPortatili.jpg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //importa il file JavaScript di Bootstrap
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <a className="navbar-brand d-flex align-items-center">
                    <img src={pcPortatili} className="img-thumbnail mr-2" alt="..." />
                </a>
                <span className="navbar-brand mb-0 h1" style={{ fontSize: '30px', textAlign: 'center', flexGrow: 1 }}>RITIRO PORTATILI</span>
                 {/*Lascio vuoto per far rimanere il titolo al centro*/}
            </div>
        </nav>
    )
}

export default Navbar;