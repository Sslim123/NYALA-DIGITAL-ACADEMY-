import { Container } from 'react-bootstrap';
import { translations }  from '../translations';

const Footer = ({ isEnglish}) => {
  const content = isEnglish ? translations.en : translations.ar;
  return (
    <footer id="footer" className="py-4 mt-5" style={{ backgroundColor: 'var(--primary-blue)', color: 'white' }}>
      <Container className="text-center">
        <p className="mb-1">  {content.copyrights} </p>
        <small style={{ opacity: 0.7 }}>  {content.nyala} </small>
        <div className="mt-3">
          <a href="#" className="text-white mx-2">Twitter</a>
          <a href="#" className="text-white mx-2">Facebook</a>
          <a href="#" className="text-white mx-2">LinkedIn</a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;