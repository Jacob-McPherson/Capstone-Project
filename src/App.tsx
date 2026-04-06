import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";

// Inline Home component for testing
function Home() { 
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Success! Redirect worked.</h1>
    </div>
  ); 
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}