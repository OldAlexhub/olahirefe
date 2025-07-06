import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      const company = localStorage.getItem("company");

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_LINK}/getonecompanyjobs/${company}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobs = response.data?.jobs || [];
      setJobs(jobs);
      setFilteredJobs(jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Could not fetch posted jobs.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = jobs.filter((job) =>
      job.Job_Title.toLowerCase().includes(term)
    );
    setFilteredJobs(results);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const handleDelete = async (jobNumber) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setDeleting(jobNumber);
    try {
      const token = localStorage.getItem("AdminToken");

      await axios.delete(
        `${process.env.REACT_APP_BASE_LINK}/deletejob/${jobNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedJobs = jobs.filter((job) => job.Job_Number !== jobNumber);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      triggerToast("Job deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      triggerToast("Failed to delete job");
    } finally {
      setDeleting(null);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Posted Jobs</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search job titles..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {filteredJobs.length === 0 ? (
        <p className="text-center">No jobs found.</p>
      ) : (
        <ul className="list-group">
          {filteredJobs.map((job) => (
            <li
              key={job.Job_Number}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <Link
                  to={`/adminjobdetails/${job.Job_Number}`}
                  className="text-decoration-none fw-bold"
                >
                  {job.Job_Title}
                </Link>
                <div className="text-muted small">
                  {job.Location} | Posted: {formatDate(job.date)}
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(job.Job_Number)}
                disabled={deleting === job.Job_Number}
              >
                {deleting === job.Job_Number ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Delete"
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Toast message */}
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1055 }}
        >
          <div className="toast show align-items-center text-bg-primary border-0">
            <div className="d-flex">
              <div className="toast-body">{toastMsg}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
