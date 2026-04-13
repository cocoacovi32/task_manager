import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";

function Market() {
    const [fish, setFish] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        API.get("fish/").then(res => setFish(res.data));
    }, []);

    return (
        <div className="p-6 grid grid-cols-3 gap-4">
            {fish.map(f => (
                <div key={f.id} className="bg-white p-4 shadow">
                    <h3>{f.name}</h3>
                    <p>KES {f.price_per_kg}</p>
                    <button onClick={() => addToCart(f)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
}

export default Market;
