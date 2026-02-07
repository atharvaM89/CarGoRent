import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ChevronRight, Package, FileText, Star } from "lucide-react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (e, orderId) => {
    e.stopPropagation();
    try {
      setDownloadingId(orderId);
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice", err);
      alert("Failed to download invoice. You can try from order details.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PLACED":
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="text-center py-12 bg-slate-50 border-dashed">
              <Package className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">You haven't placed any orders yet.</p>
              <Button className="mt-4" onClick={() => navigate('/companies')}>Start Booking</Button>
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium text-slate-500">Order ID</th>
                    <th className="px-6 py-4 font-medium text-slate-500">Date</th>
                    <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-right">Amount</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">#{order.orderId}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status || "Processing"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium text-right">
                        ₹{order.totalAmount != null ? order.totalAmount : "—"}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => handleDownloadPdf(e, order.orderId)}
                            disabled={downloadingId === order.orderId}
                          >
                            <FileText className="h-4 w-4" />
                            {downloadingId === order.orderId ? "..." : "PDF"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-slate-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orders/${order.orderId}`);
                            }}
                          >
                            <Star className="h-4 w-4" /> View & Rate
                          </Button>
                          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;