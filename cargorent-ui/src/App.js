import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import CompanyList from "./pages/CompanyList";
import CarList from "./pages/CarList";
import PlaceOrder from "./pages/PlaceOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserRegister />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/cars/:companyId" element={<CarList />} />
        <Route path="/order" element={<PlaceOrder />} />
      </Routes>
    </Router>
  );
}

export default App;