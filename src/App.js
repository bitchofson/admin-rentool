import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Banner } from './components/Banner';
import RentsPage from './components/rents/Rents';
import ToolsPage from './components/tools/Tools';
import PrivateRoute from './config/auth/privateRoute';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Banner />} />
          {<Route
            path="/tools"
            element={<PrivateRoute> <div className="container"> <ToolsPage /> </div> </PrivateRoute>}
          />}
          {<Route
            path="/rents"
            element={<PrivateRoute> <div className="container"> <RentsPage /> </div> </PrivateRoute>}
          />}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
