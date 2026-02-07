import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Trash2 } from "lucide-react";

function CartPage() {
    const { cartItems, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate("/order", { state: { fromCart: true } });
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-slate-500 mb-8">Looks like you haven't added any cars yet.</p>
                <Button onClick={() => navigate("/companies")}>Browse Cars</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => {
                        const days = Math.max(1, Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)));
                        const total = item.pricePerDay * days;

                        return (
                            <Card key={item.cartId} className="flex flex-col md:flex-row overflow-hidden">
                                <div className="w-full md:w-1/3 h-48 md:h-auto bg-slate-100">
                                    <img
                                        src={item.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                                        alt={item.model}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image" }}
                                    />
                                </div>
                                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold">{item.brand} {item.model}</h3>
                                            <p className="text-slate-500">₹{item.pricePerDay} / day</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500 block">From</span>
                                            <span className="font-medium">{new Date(item.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">To</span>
                                            <span className="font-medium">{new Date(item.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-between items-end border-t pt-4">
                                        <span className="text-slate-500">{days} days</span>
                                        <span className="text-xl font-bold text-primary">₹{total}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Items</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
