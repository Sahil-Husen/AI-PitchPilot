import React from "react";
// import { useAuth } from "./context/authContext";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";

function App() {
  // const { user, loading } = useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;