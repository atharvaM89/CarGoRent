import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Car, Plus, Trash2, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function MemberDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("cars");
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddCarModal, setShowAddCarModal] = useState(false);

    // New car state with expanded fields
    const [newCar, setNewCar] = useState({
        brand: "",
        model: "",
        pricePerDay: "",
        imageUrl: "",
        location: "",
        carType: "SEDAN",
        seatingCapacity: 4,
        description: ""
    });
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const carsRes = await api.get("/member/cars");
            setCars(carsRes.data);
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const response = await api.post("/member/cars", newCar);
            if (response.status === 200 || response.status === 201) {
                setShowAddCarModal(false);
                setNewCar({
                    brand: "",
                    model: "",
                    pricePerDay: "",
                    imageUrl: "",
                    location: "",
                    carType: "SEDAN",
                    seatingCapacity: 4,
                    description: ""
                });
                const addedCar = response.data;
                if (addedCar && addedCar.id) {
                    setCars(prev => [addedCar, ...prev]);
                }
                await fetchData();
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to add car. Please check inputs.";
            setError(errorMessage);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/member/cars/${carId}`);
            fetchData();
        } catch (err) {
            console.error("Failed to delete", err);
            alert(err.response?.data?.message || "Failed to delete car");
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Member Dashboard</h1>

                <button
                    onClick={() => setShowAddCarModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4" /> Add Car
                </button>
            </div>

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map(car => (
                        <Card key={car.id} className="relative group">
                            <div className="h-48 overflow-hidden rounded-t-lg bg-gray-100">
                                <img
                                    src={car.url || car.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                                    alt={car.model}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image" }}
                                />
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
                                        <p className="text-slate-500">₹{car.pricePerDay}/day</p>
                                        <div className="text-xs text-slate-400 mt-1 flex gap-2">
                                            <span>{car.carType}</span>
                                            <span>•</span>
                                            <span>{car.seatingCapacity} Seats</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{car.location}</p>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${car.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {car.isActive ? 'Active' : 'Hidden'}
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleDeleteCar(car.id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {cars.length === 0 && <div className="col-span-full text-center py-10 bg-slate-50 rounded-lg border border-dashed"><p className="text-slate-500">You haven't listed any cars yet.</p></div>}
                </div>
            </div>

            {/* Add Car Modal */}
            {showAddCarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Add New Car</h3>
                        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                        <form onSubmit={handleAddCar} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Brand</label>
                                    <input
                                        type="text"
                                        value={newCar.brand}
                                        onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Model</label>
                                    <input
                                        type="text"
                                        value={newCar.model}
                                        onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Car Type</label>
                                    <select
                                        value={newCar.carType}
                                        onChange={e => setNewCar({ ...newCar, carType: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        required
                                    >
                                        <option value="SUV">SUV</option>
                                        <option value="SEDAN">SEDAN</option>
                                        <option value="HATCHBACK">HATCHBACK</option>
                                        <option value="LUXURY">LUXURY</option>
                                        <option value="EV">EV</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newCar.seatingCapacity}
                                        onChange={e => setNewCar({ ...newCar, seatingCapacity: parseInt(e.target.value) })}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price per Day (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newCar.pricePerDay}
                                        onChange={e => setNewCar({ ...newCar, pricePerDay: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={newCar.location}
                                        onChange={e => setNewCar({ ...newCar, location: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        placeholder="e.g. Mumbai, Delhi"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={newCar.description}
                                    onChange={e => setNewCar({ ...newCar, description: e.target.value })}
                                    className="w-full border p-2 rounded h-24"
                                    placeholder="Describe the car features..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={newCar.imageUrl}
                                    onChange={e => setNewCar({ ...newCar, imageUrl: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCarModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Save Car
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemberDashboard;
