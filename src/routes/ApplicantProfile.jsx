import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ApplicantProfile = () => {
  const { userId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [processing, setProcessing] = useState({
    summarize: false,
    extract: false,
  });

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/applicant/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setApplicant(response.data.user);
        }
      } catch (error) {
        console.log("Error fetching applicant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [userId]);

  const jobNumber = applicant?.jobNumber || "UNKNOWN";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleSummarize = async () => {
    setProcessing((prev) => ({ ...prev, summarize: true }));
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_PYTHON}/summarize`,
        { userId, jobNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.summary || "Summary not available.");
    } catch (err) {
      console.error("Summarize error:", err);
      setSummary("Failed to generate summary.");
    } finally {
      setProcessing((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleKeywordExtract = async () => {
    setProcessing((prev) => ({ ...prev, extract: true }));
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_PYTHON}/extractkeywords`,
        { userId, jobNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setKeywords(res.data.keywords || "No keywords found.");
    } catch (err) {
      console.error("Keyword extraction error:", err);
      setKeywords("Failed to extract keywords.");
    } finally {
      setProcessing((prev) => ({ ...prev, extract: false }));
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning">Applicant not found.</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Applicant Profile</h3>

      <div className="row mb-4">
        <div className="col-md-6">
          <button
            className="btn btn-primary w-100"
            onClick={handleSummarize}
            disabled={processing.summarize}
          >
            {processing.summarize ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Summarizing...
              </>
            ) : (
              "Summarize Applicant"
            )}
          </button>
        </div>
        <div className="col-md-6">
          <button
            className="btn btn-secondary w-100"
            onClick={handleKeywordExtract}
            disabled={processing.extract}
          >
            {processing.extract ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Extracting...
              </>
            ) : (
              "Extract Keywords"
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-journal-text me-2"></i>Summary
            </h5>
            <p style={{ textAlign: "justify", lineHeight: "1.6" }}>{summary}</p>
          </div>
        </div>
      )}

      {/* Keywords */}
      {keywords && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-tags me-2"></i>Top Keywords & Importance
            </h5>
            {Array.isArray(keywords) && keywords.length > 0 ? (
              <div className="list-group">
                {keywords.map((kw, idx) => {
                  const label = Array.isArray(kw) ? kw[0] : kw;
                  const score = Array.isArray(kw) ? kw[1] : null;

                  return (
                    <div
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="fw-bold">{label}</span>
                      {score !== null && (
                        <span className="badge bg-primary rounded-pill">
                          {(score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No keywords available.</p>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{applicant.applicantName}</h5>
          <p>
            <strong>Email:</strong> {applicant.email}
          </p>
          <p>
            <strong>Phone:</strong> {applicant.phone}
          </p>
        </div>
      </div>

      {/* Education */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Education</h5>
          <p>
            <strong>Institution:</strong> {applicant.institution}
          </p>
          <p>
            <strong>Degree:</strong> {applicant.highestEdu}
          </p>
          <p>
            <strong>Field:</strong> {applicant.fieldOfStudy}
          </p>
          <p>
            <strong>Dates:</strong> {formatDate(applicant.educationStartDate)}{" "}
            to {formatDate(applicant.educationEndDate)}
          </p>
        </div>
      </div>

      {/* Experience */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Experience</h5>
          {[1, 2, 3].map(
            (num) =>
              applicant[`company${num}`] && (
                <div key={num} className="mb-3">
                  <p>
                    <strong>Company:</strong> {applicant[`company${num}`]}
                  </p>
                  <p>
                    <strong>Position:</strong> {applicant[`position${num}`]}
                  </p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {formatDate(applicant[`experienceStartDate${num}`])} to{" "}
                    {formatDate(applicant[`experienceEndDate${num}`])}
                  </p>
                  <p>
                    <strong>Responsibilities:</strong>{" "}
                    {applicant[`responsibilities${num}`]}
                  </p>
                </div>
              )
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Skills</h5>
          <p>{applicant.skills}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
