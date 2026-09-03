import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./signup.css";

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        termsAccepted: false
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!formData.termsAccepted) {
            setError("Please accept the Terms & Conditions.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await setDoc(doc(db, "users", userCredential.user.uid), {
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role
            });

            navigate("/dashboard");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("An account with this email already exists.");
            } else {
                setError("Account creation failed. Please try again.");
            }
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-container" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="role">Professional Role</label>

                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select your professional role
                        </option>

                        <option value="Statistical Engineer">
                            Statistical Engineer
                        </option>
                        <option value="Data Analyst">
                            Data Analyst
                        </option>
                        <option value="Software Developer">
                            Software Developer
                        </option>
                        <option value="Machine Learning Engineer">
                            Machine Learning Engineer
                        </option>
                        <option value="Data Scientist">
                            Data Scientist
                        </option>
                        <option value="Researcher">
                            Researcher
                        </option>
                    </select>
                </div>

                <label className="terms">
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                    />

                    <span>I agree to the Terms & Conditions</span>
                </label>

                <button type="submit">CREATE ACCOUNT</button>

                <p className="auth-link">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );
}