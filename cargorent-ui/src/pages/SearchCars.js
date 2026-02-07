import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Car, Fuel, Gauge, IndianRupee, MapPin, Users } from "lucide-react";

function SearchCars() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Optional filters
    const location = searchParams.get("location");
    const carType = searchParams.get("carType");
    const seatingCapacity = searchParams.get("seatingCapacity");

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (startDate && endDate) {
            fetchCars();
        } else {
            setLoading(false);
        }
    }, [startDate, endDate, location, carType, seatingCapacity]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({ startDate, endDate });
            if (location) params.append("location", location);
            if (carType) params.append("carType", carType);
            if (seatingCapacity) params.append("seatingCapacity", seatingCapacity);

            const response = await api.get(`/cars/search?${params.toString()}`);
            setCars(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch available cars.");
        } finally {
            setLoading(false);
        }
    };

    const handleRent = (car) => {
        navigate("/order", {
            state: {
                carId: car.id,
                companyId: car.companyId,
                pricePerDay: car.pricePerDay,
                carName: `${car.brand} ${car.model}`,
                startDate,
                endDate
            },
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                <p className="text-slate-500 mt-1">
                    Available from <span className="font-semibold">{startDate}</span> to <span className="font-semibold">{endDate}</span>
                    {location && <span> • in <span className="font-semibold">{location}</span></span>}
                    {carType && <span> • Type: <span className="font-semibold">{carType}</span></span>}
                    {seatingCapacity && <span> • Min Seats: <span className="font-semibold">{seatingCapacity}</span></span>}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cars.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg">
                            <p className="text-slate-500 mb-4">No cars available for these criteria.</p>
                            <Button variant="outline" onClick={() => navigate('/')}>Try different search</Button>
                        </div>
                    )}
                    {cars.map((car) => (
                        <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="h-48 bg-slate-100 flex items-center justify-center relative group">
                                <img
                                    src={car.url || car.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                                    alt={car.model}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image" }}
                                />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold shadow-sm">
                                    {car.carType}
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-start">
                                    <span>{car.brand} {car.model}</span>
                                </CardTitle>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {car.location}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-primary font-bold text-xl mb-4">
                                    <IndianRupee className="h-5 w-5" />
                                    {car.pricePerDay} <span className="text-sm text-slate-500 font-normal ml-1">/ day</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2" title="Seating Capacity">
                                        <Users className="h-4 w-4" /> {car.seatingCapacity} Seats
                                    </div>
                                    <div className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Petrol</div>
                                    {/* Fuel type hardcoded for now or add to entity later */}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button
                                    className="w-full bg-black hover:bg-gray-800 text-white"
                                    onClick={() => handleRent(car)}
                                >
                                    Book Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchCars;
