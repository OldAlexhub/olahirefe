import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Applied = () => {
  const company = localStorage.getItem("company");
  const [applicants, setApplicants] = useState([]);
  const [sortedApplicants, setSortedApplicants] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/applicantcompany/${company}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data?.applicants || [];
        setApplicants(data);
        setSortedApplicants(sortByMatch(data, "desc"));
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const sortByMatch = (list, order) => {
    return [...list].sort((a, b) =>
      order === "asc"
        ? a.match_percent - b.match_percent
        : b.match_percent - a.match_percent
    );
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    setSortedApplicants(sortByMatch(applicants, order));
  };

  const interpretMatch = (percent) => {
    if (percent >= 0.9)
      return <span className="badge bg-success">Highly Qualified</span>;
    if (percent >= 0.65)
      return <span className="badge bg-primary">Qualified</span>;
    if (percent >= 0.5)
      return (
        <span className="badge bg-warning text-dark">Might Be Qualified</span>
      );
    return <span className="badge bg-danger">Not Qualified</span>;
  };

  const formatPercent = (p) => `${(p * 100).toFixed(1)}%`;

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Applicants</h3>

      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="desc">Sort: Highest Match</option>
          <option value="asc">Sort: Lowest Match</option>
        </select>
      </div>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && sortedApplicants.length === 0 && (
        <p className="text-center">No applicants found.</p>
      )}

      {!loading && sortedApplicants.length > 0 && (
        <div className="table-responsive">
          <table
            className="table table-bordered table-hover align-middle"
            style={{ textAlign: "center" }}
          >
            <thead className="table-light">
              <tr>
                <th>Applicant ID</th>
                <th>Job Title</th>
                <th>Match Score</th>
                <th>Years of Experience</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplicants.map((app, idx) => (
                <tr key={idx}>
                  <td>
                    <Link
                      to={`/applicantprofile/${app.userId}`}
                      className="fw-bold text-decoration-none"
                    >
                      {app.userId || "Unknown"}
                    </Link>
                  </td>
                  <td>{app.jobTitle}</td>
                  <td>{formatPercent(app.match_percent)}</td>
                  <td>{app.years_of_experience}</td>
                  <td>{interpretMatch(app.match_percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applied;
