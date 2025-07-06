import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Admins = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or danger
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/adminlogin`,
        formData
      );

      if (response.status === 200) {
        const { name, token, Isadmin, company, userId } = response.data;
        localStorage.setItem("adminName", name);
        localStorage.setItem("adminToken", token);
        localStorage.setItem("IsAdmin", Isadmin);
        localStorage.setItem("company", company);
        localStorage.setItem("AdminuserId", userId);
        setMessage("Login successful. Redirecting...");
        setMessageType("success");

        setTimeout(() => {
          navigate("/adminpage");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Invalid email or password.");
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center bg-light"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f0f4f8, #d9e2ec)",
      }}
    >
      <div
        className="card p-4 shadow-sm border-0"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h3 className="text-center mb-3 text-primary fw-bold">Admin Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          {message && (
            <div className={`alert alert-${messageType} mt-2`} role="alert">
              {message}
            </div>
          )}

          <div className="d-grid mt-3">
            <button
              type="submit"
              className="btn btn-primary fw-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admins;
