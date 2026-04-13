import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="bg-green-700 text-white p-4 flex gap-4">
            <Link to="/">Tasks</Link>
            <Link to="/market">Market</Link>
            <Link to="/checkout">Cart</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default Navbar;