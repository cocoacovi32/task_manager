import { useEffect, useState } from "react";
import API from "../../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        API.get("orders/").then(res => setOrders(res.data));
    }, []);

    return (
        <div className="p-6">
            <h2>Orders</h2>

            {orders.map((o, i) => (
                <div key={i} className="bg-white p-3 mb-2">
                    <p>Total: {o.total}</p>
                </div>
            ))}
        </div>
    );
}

export default Orders;