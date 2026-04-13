import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import API from "../../services/api";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const [phone, setPhone] = useState("");

    const total = cart.reduce((sum, item) => sum + item.price_per_kg, 0);

    const pay = async () => {
        await API.post("mpesa/stk-push/", {
            phone,
            amount: total,
        });

        await API.post("orders/", { items: cart, total });

        alert("Payment sent!");
        clearCart();
    };

    return (
        <div className="p-6">
            <h2>Checkout</h2>

            {cart.map((item, i) => (
                <p key={i}>{item.name}</p>
            ))}

            <h3>Total: {total}</h3>

            <input placeholder="2547..." onChange={e => setPhone(e.target.value)} />

            <button onClick={pay}>Pay with M-Pesa</button>
        </div>
    );
}

export default Checkout;