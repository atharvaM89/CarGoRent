import { useEffect, useState } from "react";
import api from "../services/api";

function CompanyDashboard() {
  const [orders, setOrders] = useState([]);
  const companyId = 1; // TEMP (JWT will replace)

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/company/${companyId}`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load company orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${status}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Company Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order.orderId}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Customer ID:</strong> {order.customerId}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> {order.status}</p>

          {order.status === "PLACED" && (
            <button onClick={() => updateStatus(order.orderId, "CONFIRMED")}>
              Confirm Order
            </button>
          )}

          {order.status === "CONFIRMED" && (
            <button onClick={() => updateStatus(order.orderId, "COMPLETED")}>
              Complete Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyDashboard;