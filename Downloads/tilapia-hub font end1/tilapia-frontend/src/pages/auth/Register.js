import { useState } from "react";
import API from "../../services/api";

function Register() {
    const [data, setData] = useState({});

    const register = async () => {
        await API.post("register/", data);
        alert("Registered!");
    };

    return (
        <div className="p-6">
            <input placeholder="Name" onChange={e => setData({...data, name:e.target.value})} />
            <input placeholder="Email" onChange={e => setData({...data, email:e.target.value})} />
            <input placeholder="Password" onChange={e => setData({...data, password:e.target.value})} />

            <button onClick={register}>Register</button>
        </div>
    );
}

export default Register;