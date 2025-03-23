import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import Login from './components/Login';
const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          {/* Route for the Signup page */}
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />

          {/* Route for the Dashboard page */}
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
