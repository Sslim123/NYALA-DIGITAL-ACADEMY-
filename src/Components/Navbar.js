import React, { useState } from 'react';
import { Modal, Form, Navbar, Nav, Container, Button } from 'react-bootstrap';
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
    if (password === 'Nyala2026') { 
      onLogin(true); handleClose();
    } else {
      alert("password inccorect")
    }
  };

  if (window.location.pathname === "/free-course-entry") {
    return null;
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/nyala-academy-logo.png"
            alt="NDA Logo"
            style={{
              height: "80px",
              width: "auto",
              objectFit: "contain"
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">
              {isEnglish ? "Home" : "الرئيسية"}
            </Nav.Link>

            <Nav.Link as={Link} to="/portal">
              {isEnglish ? "Student Portal" : "بوابة الطلاب"}
            </Nav.Link>

            <Nav.Link as={Link} to="/path">
              {isEnglish ? "Success Roadmap" : "خارطة طريق النجاح"}
            </Nav.Link>

            <Nav.Link as={Link} to="/verify">
              {isEnglish ? "Verify" : "التحقق"}
            </Nav.Link>

            <Link className="btn btn-primary ms-lg-3 mt-2 mt-lg-0" to="/apply">
              {isEnglish ? "Apply" : "تقديم"}
            </Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">

            {!isAdmin ? (
              <Button
                onClick={() => setShowModal(true)}
                variant="primary"
                size="sm"
              >
                {isEnglish ? "Admin Login" : "دخول المسؤول"}
              </Button>
            ) : (
              <Button
                onClick={HandleLogout}
                variant="danger"
                size="sm"
              >
                {isEnglish ? "Logout" : "خروج"}
              </Button>
            )}

            <Button
              onClick={toggleLanguage}
              variant="outline-secondary"
              size="sm"
            >
              {isEnglish ? "العربية" : "English"}
            </Button>

          </div>

        </Navbar.Collapse>
        {isAdmin && (
          <Nav.Link as={Link} to="/admin" className="text-danger fw-bold ms-2 d-none d-lg-block order-lg-5">
            | Dashboard  </Nav.Link>)}
      </Container>

      <Modal show={showModal} onHide={handleClose}
        backdrop="static"   
        keyboard={false}    
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