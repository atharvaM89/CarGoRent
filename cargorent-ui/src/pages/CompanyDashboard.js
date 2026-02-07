import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Car, TrendingUp, DollarSign, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function CompanyDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalCars: 0,
    activeBookings: 0,
    revenue: 0,
    recentOrders: []
  });
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

  // Local state for company status to allow refreshing without page reload
  const [isCompanyActive, setIsCompanyActive] = useState(false);

  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch latest company status explicitly to fix "Pending Approval" bug
      try {
        const meRes = await api.get("/auth/me");
        const active = meRes.data.isCompanyActive ?? meRes.data.companyActive ?? false;
        setIsCompanyActive(Boolean(active));
      } catch (err) {
        console.error("Failed to refresh company status", err);
        if (user) setIsCompanyActive(Boolean(user.isCompanyActive ?? user.companyActive));
      }

      const [carsRes, ordersRes] = await Promise.all([
        api.get("/company/cars"),
        api.get("/orders/company")
      ]);

      setCars(carsRes.data);
      setOrders(ordersRes.data);

      // Calculate revenue
      const revenue = ordersRes.data
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        totalCars: carsRes.data.length,
        activeBookings: ordersRes.data.filter(o => o.status === 'PLACED' || o.status === 'CONFIRMED').length,
        revenue: revenue,
        recentOrders: ordersRes.data.slice(0, 5)
      });

    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh company status when user returns to tab (e.g. after admin approved in another tab)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        api.get("/auth/me").then(meRes => {
          const active = meRes.data.isCompanyActive ?? meRes.data.companyActive ?? false;
          setIsCompanyActive(Boolean(active));
        }).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/company/cars", newCar);
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
        await fetchData(); // Force refresh list
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
      await api.delete(`/company/cars/${carId}`);
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
        <h1 className="text-3xl font-bold tracking-tight">{t("companyDashboard.title")}</h1>

        <div className="space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md ${activeTab === "overview" ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {t("companyDashboard.overview")}
          </button>
          <button
            onClick={() => setActiveTab("cars")}
            className={`px-4 py-2 rounded-md ${activeTab === "cars" ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {t("companyDashboard.myCars")}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {t("companyDashboard.orders")}
          </button>
        </div>
      </div>

      {!loading && !isCompanyActive && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
          <p className="font-bold">{t("companyDashboard.pendingApproval")}</p>
          <p>{t("companyDashboard.pendingApprovalMsg")}</p>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("companyDashboard.totalCars")}</CardTitle>
              <Car className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-slate-500">{t("companyDashboard.inFleet")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("companyDashboard.totalOrders")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-slate-500">{t("companyDashboard.lifetimeBookings")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("companyDashboard.revenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.revenue}</div>
              <p className="text-xs text-slate-500">{t("companyDashboard.totalEarnings")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "cars" && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("companyDashboard.vehicleFleet")}</h2>
            <button
              onClick={() => setShowAddCarModal(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" /> {t("companyDashboard.addCar")}
            </button>
          </div>

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
                      {car.isActive ? t("companyDashboard.active") : t("companyDashboard.hidden")}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> {t("common.delete")}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {cars.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">{t("companyDashboard.noCarsYet")}</p>}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("companyDashboard.incomingOrders")}</h2>
          {orders.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg">
              <p className="text-slate-500">{t("companyDashboard.noOrdersYet")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">Order #{order.id}</p>
                      <p className="text-sm text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm">Total: <span className="font-semibold">₹{order.totalAmount}</span></p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Car Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{t("companyDashboard.addNewCar")}</h3>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("companyDashboard.brand")}</label>
                  <input
                    type="text"
                    value={newCar.brand}
                    onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("companyDashboard.model")}</label>
                  <input
                    type="text"
                    value={newCar.model}
                    onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("landing.carType")}</label>
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
                  <label className="block text-sm font-medium mb-1">{t("companyDashboard.pricePerDay")}</label>
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
                  <label className="block text-sm font-medium mb-1">{t("landing.location")}</label>
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
                <label className="block text-sm font-medium mb-1">{t("companyDashboard.description")}</label>
                <textarea
                  value={newCar.description}
                  onChange={e => setNewCar({ ...newCar, description: e.target.value })}
                  className="w-full border p-2 rounded h-24"
                  placeholder="Describe the car features..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("companyDashboard.imageUrl")}</label>
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
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {t("companyDashboard.saveCar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;