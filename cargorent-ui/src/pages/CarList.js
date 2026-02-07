import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Car, Fuel, Gauge, IndianRupee, Star } from "lucide-react";

import { useCart } from "../context/CartContext";

function CarList() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchCars();
  }, [companyId]);

  const fetchCars = async () => {
    try {
      const response = await api.get(`/cars/company/${companyId}`);
      setCars(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (car) => {
    if (!startDate || !endDate) {
      alert("Please select dates first"); // Ideally use a toast
      return;
    }
    addToCart(car, startDate, endDate);
    alert("Added to cart!");
  };

  const handleRent = (car) => {
    // Legacy single rent or use cart flow
    if (!startDate || !endDate) {
      alert("Please select dates first");
      return;
    }
    addToCart(car, startDate, endDate);
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Fleet</h1>
          <p className="text-slate-500 mt-1">Select a vehicle for your next adventure</p>
        </div>

        <div className="flex gap-2 items-end bg-slate-50 p-4 rounded-lg border">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">From</label>
            <input
              type="date"
              className="border p-2 rounded text-sm"
              min={new Date().toISOString().split('T')[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">To</label>
            <input
              type="date"
              className="border p-2 rounded text-sm"
              min={startDate || new Date().toISOString().split('T')[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={car.url || car.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span>{car.brand} {car.model}</span>
                  <span className="text-sm font-normal px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {car.availability ? 'Available' : 'Booked'}
                  </span>
                  {car.companyType === 'SYSTEM' && (
                    <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-full ml-2">
                      Individual Owners
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className={`h-4 w-4 ${car.averageRating > 0 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                  <span className="font-medium text-sm">
                    {car.averageRating ? car.averageRating.toFixed(1) : "New"}
                  </span>
                </div>
                <div className="flex items-center text-primary font-bold text-xl mb-4">
                  <IndianRupee className="h-5 w-5" />
                  {car.pricePerDay} <span className="text-sm text-slate-500 font-normal ml-1">/ day</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Petrol</div>
                  <div className="flex items-center gap-2"><Gauge className="h-4 w-4" /> Automatic</div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button
                  variant="outline"
                  className="w-1/2"
                  disabled={!car.availability}
                  onClick={() => handleAddToCart(car)}
                >
                  Add to Cart
                </Button>
                <Button
                  className="w-1/2"
                  disabled={!car.availability}
                  onClick={() => handleRent(car)}
                >
                  Rent Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && cars.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Car className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-900">No cars available</p>
          <p className="text-slate-500">This company currently has no vehicles listed.</p>
        </div>
      )}
    </div>
  );
}

export default CarList;