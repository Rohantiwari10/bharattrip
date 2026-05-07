import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import Layout from "./pages/Layout";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;