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
  const [statusEdits, setStatusEdits] = useState({}); // unsaved changes

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
        //console.log("Fetched applicants:", data); // ✅ Confirm status exists
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

  const getKey = (userId, jobNumber) => `${userId}|${jobNumber}`;

  const handleStatusChange = (userId, jobNumber, newStatus) => {
    const key = getKey(userId, jobNumber);
    setStatusEdits((prev) => ({
      ...prev,
      [key]: newStatus,
    }));
  };

  const saveStatus = async (userId, jobNumber, idx) => {
    const key = getKey(userId, jobNumber);
    const newStatus = statusEdits[key];
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${process.env.REACT_APP_BASE_LINK}/updateapplicantstatus/${userId}/${jobNumber}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI locally
      const updated = [...sortedApplicants];
      updated[idx].status = newStatus;
      setSortedApplicants(updated);

      // Clear the edit buffer
      setStatusEdits((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update status");
    }
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplicants.map((app, idx) => {
                const key = getKey(app.userId, app.jobNumber);
                const currentStatus =
                  statusEdits[key] !== undefined
                    ? statusEdits[key]
                    : app.status || "";

                return (
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
                    <td>
                      <select
                        className="form-select"
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            app.userId,
                            app.jobNumber,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="received">Received</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="considered">Considered</option>
                        <option value="not selected">Not Selected</option>
                        <option value="selected for interview">
                          Selected for Interview
                        </option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        disabled={!statusEdits[key]}
                        onClick={() =>
                          saveStatus(app.userId, app.jobNumber, idx)
                        }
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applied;
