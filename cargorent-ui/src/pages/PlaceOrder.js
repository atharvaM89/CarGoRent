import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Calendar, CreditCard, ChevronLeft, ShieldCheck } from "lucide-react";

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = require("../context/CartContext").useCart();

  // Determine mode: Cart or Single
  const isCart = location.state?.fromCart;
  const singleItem = !isCart ? location.state : null;

  // State for single item mode
  const [startDate, setStartDate] = useState(singleItem?.startDate || "");
  const [endDate, setEndDate] = useState(singleItem?.endDate || "");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const customerId = user?.id; // Backend handles if not sent, but safe to have if logic needs it locally

  useEffect(() => {
    if (!location.state) {
      navigate('/companies');
    }
  }, [location.state, navigate]);

  const placeOrder = async () => {
    setLoading(true);
    setError("");

    try {
      if (isCart) {
        // Group cart items by company?
        // Current backend: One Order per Company.
        // Requirement says "Place one order with multiple cars" but doesn't specify multi-company.
        // Assumption: Cart might have mixed companies.
        // We should group items by company and place multiple orders or block mixed cart.
        // Let's implement Grouping.

        const itemsByCompany = cartItems.reduce((acc, item) => {
          if (!acc[item.companyId]) acc[item.companyId] = [];
          acc[item.companyId].push(item);
          return acc;
        }, {});

        const promises = Object.entries(itemsByCompany).map(async ([companyId, items]) => {
          const orderPayload = {
            // customerId: customerId, // Ignored by backend now
            companyId: parseInt(companyId),
            items: items.map(item => ({
              carId: item.id,
              startDate: item.startDate,
              endDate: item.endDate
            }))
          };
          return api.post("/orders", orderPayload);
        });

        await Promise.all(promises);
        clearCart();

      } else {
        // Single Item Logic
        if (!startDate || !endDate) {
          setError("Please select dates");
          setLoading(false);
          return;
        }

        const orderPayload = {
          companyId: singleItem.companyId,
          items: [{
            carId: singleItem.carId,
            startDate,
            endDate
          }]
        };
        await api.post("/orders", orderPayload);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to place order. Date might be unavailable.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!location.state) return null;

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <ShieldCheck className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h2>
        <p className="text-slate-500 mt-2">Redirecting to your orders...</p>
      </div>
    )
  }

  // Display summary depending on mode
  const totalAmount = isCart ? getCartTotal() : ((singleItem?.pricePerDay || 0) * (Math.max(1, (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 0));

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <ChevronLeft className="h-4 w-4 mr-1" /> {isCart ? "Back to Cart" : "Back to Fleet"}
      </Button>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle>{isCart ? "Checkout" : "Complete Your Booking"}</CardTitle>
          {!isCart && <p className="text-sm text-slate-500">You are booking: <span className="font-semibold text-slate-900">{singleItem.carName}</span></p>}
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          {isCart ? (
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.brand} {item.model}</p>
                    <p className="text-xs text-slate-500">{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Existing Single Item Form Logic... simplified for brevity, assume reusing UI structure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-right text-xl font-bold mt-4">
                Total: ₹{totalAmount || 0}
              </div>
            </>
          )}

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm text-slate-600 mt-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Secure Booking</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 pt-6">
          <Button
            onClick={placeOrder}
            className="w-full text-lg h-12"
            isLoading={loading}
            disabled={(!isCart && (!startDate || !endDate)) || loading}
          >
            {loading ? "Processing..." : `Pay ₹${totalAmount}`} <CreditCard className="ml-2 h-5 w-5 opacity-80" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PlaceOrder;