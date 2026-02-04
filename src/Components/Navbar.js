import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AppNavbar = ({ toggleLanguage, isEnglish, isAdmin, onLogin }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  const handleClose = () => setShowModal(false);

  const HandleLogout = () => {
    onLogin(false); setPassword(""); setShowModal(false); navigate("/");

  }
  const checkPassword = (e) => {
    e.preventDefault();
    if (password === 'Nyala2026') { // Add your logic
      onLogin(true); handleClose();
    } else {
      alert("password inccorect")
    }
  };
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top" dir={isEnglish ? 'ltr' : 'rtl'}>
      <Container>
        {/* LEFT SIDE: Admin and Language */}
        <div className="d-flex align-items-center order-lg-1">
          {!isAdmin ? (
            <Button onClick={() => setShowModal(true)} variant="primary" className="btn-sm me-2">
              {isEnglish ? "Admin Login" : "دخول المسؤول"}           </Button>
          ) : (
            <Button onClick={HandleLogout} variant="danger" className="btn-sm me-2">
              {isEnglish ? "Logout" : "خروج"}           </Button>
          )}
          <Button onClick={toggleLanguage} variant="outline-secondary" className="btn-sm">
            {isEnglish ? "العربية" : "English"}          </Button>
        </div>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="mx-lg-auto">
          <img src="/nyala-academy-logo.png" alt="NDA Logo" className="navbar-logo" style={{
            height: '100px', 
            width: 'auto',
            marginBottom: '10px',
            objectFit: 'contain'
          }} />

        </Navbar.Brand>
        {/* MOBILE TOGGLE */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-lg-4" />
        {/* RIGHT SIDE: Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav" className="order-lg-3">
          <Nav className={isEnglish ? "ms-auto" : "me-auto"}>
            <Nav.Link as={Link} to="/">{isEnglish ? "Home" : "الرئيسية"}</Nav.Link>
            <Nav.Link as={Link} to="/portal">{isEnglish ? "Student Portal" : "بوابة الطلاب"}</Nav.Link>
            <Nav.Link as={Link} to="/path">{isEnglish ? "Success Roadmap" : "خارطة طريق النجاح"}</Nav.Link>
            <Nav.Link as={Link} to="/verify">{isEnglish ? "Verify" : "التحقق"}</Nav.Link>
            <Link className="btn btn-primary ms-lg-3 mt-2 mt-lg-0" to="/apply">
              {isEnglish ? "Apply" : "تقديم"}
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/* ADMIN DASHBOARD LINK (Only if Logged In) */}
        {isAdmin && (
          <Nav.Link as={Link} to="/admin" className="text-danger fw-bold ms-2 d-none d-lg-block order-lg-5">
            | Dashboard  </Nav.Link>)}
      </Container>
      {/* LOGIN MODAL */}
      <Modal show={showModal} onHide={handleClose}
        backdrop="static"   // This prevents closing when clicking outside
        keyboard={false}    // This prevents closing with the Esc key
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEnglish ? "Admin Access Only" : "دخول الإدارة فقط"}</Modal.Title>
        </Modal.Header>   <Modal.Body>
          <Form onSubmit={checkPassword}>
            <Form.Group className="mb-3">
              <Form.Label>{isEnglish ? "Enter Password" : "أدخل كلمة المرور"}</Form.Label>
              <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Unlock</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default AppNavbar;