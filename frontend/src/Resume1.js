import './App1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Resume from './components/Resume';

function Resume1() {
  return (
    <Container fluid className="bg-white p-0">
      <Navigation></Navigation>
      <Resume/>
      <Footer></Footer>

    </Container>
  );
}

export default Resume1;
