import "./index.css";
import "./i18n";

import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ConhecaCampinaGrande from "./pages/ConhecaCampinaGrande";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conheca" element={<ConhecaCampinaGrande />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
