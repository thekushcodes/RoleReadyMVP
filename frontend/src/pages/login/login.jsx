import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-container" onSubmit={handleSubmit}>
                <h1>LOGIN</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">LOGIN</button>

                <p className="auth-link">
                    New user? <Link to="/signup">Signup</Link>
                </p>
            </form>
        </div>
    );
}