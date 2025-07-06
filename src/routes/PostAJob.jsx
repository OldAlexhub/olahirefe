import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostAJob = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("AdminuserId");
  const company = localStorage.getItem("company");

  const [formData, setFormData] = useState({
    userId: userId || "",
    Job_Title: "",
    Salary_Estimate: "",
    Job_Description: "",
    Company_Name: company || "",
    Location: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/postajob`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/postedjobs");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            name="Job_Title"
            value={formData.Job_Title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary Estimate</label>
          <input
            type="text"
            className="form-control"
            name="Salary_Estimate"
            value={formData.Salary_Estimate}
            onChange={handleChange}
            placeholder="e.g. $80k - $120k"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            placeholder="e.g. Orlando, FL"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Job Description</label>
          <textarea
            className="form-control"
            name="Job_Description"
            value={formData.Job_Description}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
        </div>

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Posting...
            </>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostAJob;
