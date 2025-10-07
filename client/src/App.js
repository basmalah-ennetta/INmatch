import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Login />} />
          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
