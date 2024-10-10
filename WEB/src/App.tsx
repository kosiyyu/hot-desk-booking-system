import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import Footer from './components/Footer';
import Locations from './pages/Locations';
import Login from './pages/Login';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <NavBar />
        <div className="container mx-auto flex-grow p-4">
          <Routes>
            <Route path="/" element={<Locations />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
