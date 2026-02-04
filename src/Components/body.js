import { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';
const Body = ({ toggleLangauge, isEnglish }) => {
  const content = isEnglish ? translations.en : translations.ar;
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const [selectedTrack, setSelectedTrack] = useState({ title: '', details: '', features: [] });
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const trackContent = {
    cyber: {
      title: isEnglish ? "CyberSecurity" : "الأمن السيبراني",
      details: isEnglish ? "Comprehensive protection strategies for digital infrastructure." : "استراتيجيات حماية شاملة للبنية التحتية الرقمية.",
      features: isEnglish ? ["Threat Analysis", "Network Defense", "Incident Response"] : ["تحليل التهديدات", "الدفاع عن الشبكة", "الاستجابة للحوادث"]
    },
    network: {
      title: isEnglish ? "Network Architecture" : "هندسة الشبكات",
      details: isEnglish ? "Designing scalable Cisco networks for corporate environments." : "تصميم شبكات سيسكو قابلة للتوسع لبيئات الشركات.",
      features: isEnglish ? ["Routing & Switching", "VLAN Management", "CCNA Prep"] : ["التوجيه والتبديل", "إدارة VLAN", "التحضير لـ CCNA"]
    },
    archiving: {
      title: isEnglish ? "Digital Archiving" : "الأرشفة الرقمية",
      details: isEnglish ? "Modernizing government record-keeping through secure databases." : "تحديث حفظ السجلات الحكومية من خلال قواعد بيانات آمنة.",
      features: isEnglish ? ["Database Security", "Metadata Standards", "Cloud Storage"] : ["أمن قواعد البيانات", "معايير البيانات الوصفية", "التخزين السحابي"]
    }
  };
  const handleOpen = (key) => {
    setSelectedTrack(trackContent[key]);
    setShow(true);
  };
  return (
    <main>      
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" style={{ color: 'var(--primary-blue)' }}> {content.training}  </h2>
          <Row>
            {/* Card 1: Archiving */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h4 className="text-info">

                  {content.digital}      </h4>
                <p>{content.convert}</p>
                <button onClick={() => handleOpen('archiving')} className="btn btn-link mt-auto text-decoration-none">
                  ← {content.track}
                </button>
              </div>
            </div>

            {/* Card 2: Networking */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h4 className="text-info">{content.network}</h4>
                <p>{content.connect}.</p>
                <button onClick={() => handleOpen('network')} className="btn btn-link mt-auto text-decoration-none">
                  ←{content.track}
                </button>
              </div>
            </div>
            {/* Card 3: Cyber Security */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h4 className="text-info">{content.security}</h4>
                <p>{content.data}.</p>
                <button onClick={() => handleOpen('cyber')} className="btn btn-link mt-auto text-decoration-none">
                  ← {content.track}
                </button>
              </div>
            </div>
          </Row>
        </Container>
      </section>
      {/* REUSABLE MODAL FOR DETAILS */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTrack.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{selectedTrack.details}</p>
          <ul>
            {selectedTrack.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate('/apply')}>
            {isEnglish ? "Apply Now" : "قدّم الآن"}
          </Button>
        </Modal.Footer>
      </Modal>


      {/* --- HERO SECTION --- */}
      <section id="training-section" className="hero-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-end">
              <h1 style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>
                {content.title}
              </h1>
              <p className="lead mt-3">
                {content.heroDesc}
              </p>

              <div className="mt-4">
                <Button onClick={() => scrollToSection('paths')} size="lg" className="me-2" style={{ backgroundColor: 'var(--accent-blue)', border: 'none' }}>
                  {content.discover}
                </Button>
                <Button onClick={() => scrollToSection('footer')} size="lg" variant="outline-primary"> {content.contact}
                </Button>
              </div>
            </Col>
            <Col md={6} className="text-center d-none d-md-block">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
                alt="Cybersecurity"
                className="img-fluid rounded-shadow"
                style={{ borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

    </main>
  );
};

export default Body;