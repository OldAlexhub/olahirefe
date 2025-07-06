import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phoneNumber: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/signup`,
        formData
      );

      if (res.status === 201) {
        setSuccess("Signup successful! Please log in.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          phoneNumber: "",
          city: "",
          state: "",
          zipCode: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Create an Account</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>First Name</label>
                <input
                  name="firstName"
                  type="text"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 mb-3">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>City</label>
                <input
                  name="city"
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label>State</label>
                <input
                  name="state"
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label>Zip Code</label>
                <input
                  name="zipCode"
                  type="number"
                  className="form-control"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Sign Up
            </button>
            <div className="text-center mt-3">
              <small>
                Already have an account? <Link to="/">Log in here</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
