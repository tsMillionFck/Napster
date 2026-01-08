import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "react-feather";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use configured API URL or localhost
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-swiss-bg)",
        color: "var(--color-swiss-ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-swiss-ink)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "900",
            marginBottom: "40px",
            textTransform: "uppercase",
          }}
        >
          <ArrowLeft /> Back to Player
        </button>

        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            textTransform: "uppercase",
            lineHeight: 0.9,
            marginBottom: "40px",
          }}
        >
          Member
          <br />
          Login<span style={{ color: "var(--color-swiss-orange)" }}>.</span>
        </h1>

        {error && (
          <div
            style={{
              border: "4px solid var(--color-swiss-ink)",
              background: "#ffebee",
              color: "#d32f2f",
              padding: "16px",
              fontWeight: "700",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "700", textTransform: "uppercase" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "16px",
                border: "4px solid var(--color-swiss-ink)",
                fontSize: "1.2rem",
                fontWeight: "500",
                outline: "none",
                background: "var(--color-swiss-bg)",
                color: "var(--color-swiss-ink)",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "700", textTransform: "uppercase" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "16px",
                border: "4px solid var(--color-swiss-ink)",
                fontSize: "1.2rem",
                fontWeight: "500",
                outline: "none",
                background: "var(--color-swiss-bg)",
                color: "var(--color-swiss-ink)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "20px",
              background: "var(--color-swiss-orange)",
              color: "var(--color-swiss-bg)",
              border: "4px solid var(--color-swiss-ink)",
              fontSize: "1.2rem",
              fontWeight: "900",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "8px 8px 0px var(--color-swiss-ink)",
              marginTop: "16px",
            }}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "40px",
            fontWeight: "700",
            textTransform: "uppercase",
            display: "flex",
            gap: "8px",
          }}
        >
          <span>New here?</span>
          <Link
            to="/register"
            style={{
              color: "var(--color-swiss-orange)",
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
