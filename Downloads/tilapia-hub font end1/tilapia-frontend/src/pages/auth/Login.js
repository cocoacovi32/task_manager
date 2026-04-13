import { useState } from "react";
import API from "../../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await API.post("token/", { email, password });
        localStorage.setItem("token", res.data.access);
        alert("Login success!");
    };

    return (
        <div className="p-6">
            <h2>Login</h2>

            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" onChange={e => setPassword(e.target.value)} />

            <button onClick={login}>Login</button>
        </div>
    );
}

export default Login;