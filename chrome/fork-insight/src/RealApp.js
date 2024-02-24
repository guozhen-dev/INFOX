import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Logout from './Logout';


function RealApp() {
  const {user} = useAuth();
  return (
      <Navbar expand="sm" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Fork Insight</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="#home">Repositories</Nav.Link>
              <Nav.Link href="#link">Import Current</Nav.Link>
              <NavDropdown title="More Functions" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Fork Clustering</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">Fork Comparison</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.3">Conflict Detection</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link> {!user ? <Login /> : <Logout />}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default RealApp;
