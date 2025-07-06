import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const name = localStorage.getItem("adminName");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const userId = localStorage.getItem("AdminuserId");
        //console.log("Fetching admin info for ID:", userId);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/admininfo/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setData(response.data.companyInfo);
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Welcome, {name}</h2>
        <p className="text-muted">
          Here is your company profile and quick links
        </p>
      </div>

      {data && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">{data.company}</h5>
            <p className="mb-1">
              <strong>Email:</strong> {data.email}
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {data.phoneNumber}
            </p>
            <p className="mb-1">
              <strong>City:</strong> {data.city}, {data.state} {data.zipCode}
            </p>
            <p className="mb-1">
              <strong>Admin Role:</strong>{" "}
              {data.role === "Yes" ? "Admin" : "User"}
            </p>
          </div>
        </div>
      )}

      <div className="d-grid gap-2">
        <Link to="/postajob" className="btn btn-outline-primary">
          📤 Post a Job
        </Link>
        <Link to="/applied" className="btn btn-outline-secondary">
          📄 View Applied Applicants
        </Link>
        <Link to="/postedjobs" className="btn btn-outline-success">
          🗂️ View Posted Jobs
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
