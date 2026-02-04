import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { translations } from  '../translations';
const Verify = ({ isEnglish}) => {
  const content = isEnglish ? translations.en : translations.ar;
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null); // 'null', 'found', or 'not_found'

  const handleVerify = (e) => {
    e.preventDefault();
    if (certId === "NDA-2026-TEST") {
      setResult("found");
    } else {
      setResult("not_found");
    }
  };

  return (
    <Container className="py-5 text-center" style={{ minHeight: '60vh' }}>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4 fw-bold">{content.cert_title}</h2>
          <p className="text-muted mb-4">{content.cert_desc}
          </p>
          
          <Form onSubmit={handleVerify} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Control 
                size="lg"
                type="text" 
                placeholder="Ex: NDA-2026-XXXX" 
                className="text-center shadow-sm"
                onChange={(e) => setCertId(e.target.value.toUpperCase())}
              />
            </Form.Group>
            <Button variant="primary" size="lg" type="submit" className="w-100 shadow">
              {content.verify_btn}
            </Button>
          </Form>

          {/* Result Area */}
          {result === "found" && (
            <Alert variant="success" className="shadow-sm">
              <Alert.Heading>✅ Valid Certificate Found {} </Alert.Heading>
              <hr />
              <div className="text-start">
                <p className="mb-1"><strong>Student:</strong> Ahmed Abdullah</p>
                <p className="mb-1"><strong>Course:</strong> Digital Archiving & Management</p>
                <p className="mb-0"><strong>Issue Date:</strong> Jan 2026</p>
              </div>
            </Alert>
          )}

          {result === "not_found" && (
            <Alert variant="danger" className="shadow-sm">
              ❌ {content.no_record} : <strong>{certId}</strong> {content.check}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Verify;