import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ChevronLeft, Calendar, FileText, Star } from "lucide-react";

function OrderDetails() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rating State
  const [ratingCarId, setRatingCarId] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (carId) => {
    try {
      setSubmittingRating(true);
      await api.post('/ratings', {
        orderId: orderId,
        carId: carId,
        rating: ratingScore,
        comment: ratingComment
      });
      alert("Rating submitted successfully!");
      setRatingCarId(null);
      setRatingScore(5);
      setRatingComment("");
      fetchOrder(); // Refresh to update hasRated status
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Failed to submit rating.");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t("orders.orderNotFound")}</p>
        <Button variant="ghost" onClick={() => navigate('/orders')}>{t("orders.backToOrders")}</Button>
      </div>
    )
  }

  const getInvoiceBlob = async () => {
    const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
    return new Blob([response.data], { type: 'application/pdf' });
  };

  const downloadInvoice = async () => {
    try {
      const blob = await getInvoiceBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download invoice", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  const printInvoice = async () => {
    try {
      const blob = await getInvoiceBlob();
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        };
      } else {
        window.URL.revokeObjectURL(url);
        alert("Please allow pop-ups to print the invoice.");
      }
    } catch (error) {
      console.error("Failed to print invoice", error);
      alert("Failed to load invoice for printing. You can download the PDF and print it.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <ChevronLeft className="h-4 w-4 mr-1" /> {t("orders.backToOrders")}
      </Button>

      <Card className="shadow-lg border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-1">{t("orders.orderReceipt")}</p>
            <h1 className="text-2xl font-bold text-slate-900">#{order.id}</h1>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
              {order.status}
            </span>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">{t("orders.orderDate")}</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                {new Date(order.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">{t("orders.customer")}</p>
              <p className="font-medium">User ID: {order.customerId || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">{t("orders.orderItems")}</h3>
            <div className="space-y-6">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-slate-900 text-lg">{item.carModel || `Car ID: ${item.carId}`}</p>
                      <p className="text-sm text-slate-500">{item.numberOfDays} {t("orders.daysRental")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Rating Section */}
                  {order.status === 'COMPLETED' && !item.hasRated && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      {ratingCarId === item.carId ? (
                        <div className="bg-white p-4 rounded border shadow-sm">
                          <p className="font-semibold text-sm mb-2">{t("orders.rateVehicle")}</p>
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setRatingScore(star)} type="button">
                                <Star className={`h-6 w-6 ${star <= ratingScore ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                              </button>
                            ))}
                          </div>
                          <textarea
                            className="w-full border rounded p-2 text-sm mb-3"
                            placeholder="Share your experience..."
                            rows="2"
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setRatingCarId(null)}>{t("common.cancel")}</Button>
                            <Button size="sm" onClick={() => handleSubmitRating(item.carId)} disabled={submittingRating}>
                              {submittingRating ? "..." : t("orders.submitReview")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-dashed"
                          onClick={() => {
                            setRatingCarId(item.carId);
                            setRatingScore(5);
                            setRatingComment("");
                          }}
                        >
                          <Star className="h-4 w-4 mr-2" /> {t("orders.rateVehicle")}
                        </Button>
                      )}
                    </div>
                  )}

                  {item.hasRated && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-green-600" />
                      <span>{t("orders.youRated")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
            <p className="text-lg font-bold text-slate-900">{t("orders.totalAmount")}</p>
            <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            {t("common.printReceipt")}
          </Button>
          {(order.status === 'PLACED' || order.status === 'CONFIRMED' || order.status === 'COMPLETED') && (
            <>
              <Button variant="outline" onClick={printInvoice}>
                {t("common.printPdf")}
              </Button>
              <Button onClick={downloadInvoice} className="bg-black hover:bg-slate-800 text-white">
                <FileText className="h-4 w-4 mr-2" /> {t("common.downloadPdf")}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default OrderDetails;