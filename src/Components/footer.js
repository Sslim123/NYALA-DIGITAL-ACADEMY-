import { Container } from 'react-bootstrap';
import { Translations }  from '../TranslateContent/Translations';

const Footer = ({ isEnglish}) => {
  const content = isEnglish ? Translations.en : Translations.ar;
  
  return (
    <footer id="footer" className="py-4 mt-5" style={{ backgroundColor: 'var(--primary-blue)', color: 'white' }}>
      <Container className="text-center">
        <p className="mb-1">    {isEnglish? "All rights reserved © 2026 Nyala Digital Academy ": "جميع الحقوق محفوظة © 2026 أكاديمية نيالا الرقمية"} </p>
        <small style={{ opacity: 0.7 }}> {isEnglish? " Nyala - South Darfur State - Sudan": "نيالا - ولاية جنوب دارفور - السودان"} </small>
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