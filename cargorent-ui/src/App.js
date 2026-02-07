import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import CompanyList from "./pages/CompanyList";
import CarList from "./pages/CarList";
import PlaceOrder from "./pages/PlaceOrder";
import OrderHistory from "./pages/OrderHistory";
import CompanyDashboard from "./pages/CompanyDashboard";
import OrderDetails from "./pages/OrderDetails";
import SearchCars from "./pages/SearchCars";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/companies" element={<CompanyList />} />
                <Route path="/search" element={<SearchCars />} />
                <Route path="/cars/:companyId" element={<CarList />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                  <Route path="/order" element={<PlaceOrder />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/orders/:orderId" element={<OrderDetails />} />
                </Route>

                {/* Company Routes */}
                <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
                  <Route path="/company-dashboard" element={<CompanyDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Member Routes */}
                <Route element={<ProtectedRoute allowedRoles={['MEMBER']} />}>
                  <Route path="/member-dashboard" element={<MemberDashboard />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;