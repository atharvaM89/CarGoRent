import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import UserRegister from "./pages/UserRegister";
import CompanyList from "./pages/CompanyList";
import CarList from "./pages/CarList";
import PlaceOrder from "./pages/PlaceOrder";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<UserRegister />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/cars/:companyId" element={<CarList />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
