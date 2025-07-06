import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const JobDetails = () => {
  const { jobNumber } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/ajob/${jobNumber}`
        );
        if (response.status === 200) {
          setJob(response.data.job);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [jobNumber]);

  if (!job)
    return <div className="text-center mt-5">Loading job details...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm p-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-3">
                <div>
                  <h2 className="card-title mb-1">{job.Job_Title}</h2>
                  <h5 className="text-muted">{job.Company_Name}</h5>
                </div>
                <div>
                  <span className="badge bg-primary fs-6">{job.Location}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className="fw-bold">Salary:</span>{" "}
                {job.Salary_Estimate || "Not listed"}
              </div>

              <hr />

              <div className="mb-4">
                <h5>Description</h5>
                <p style={{ whiteSpace: "pre-line" }}>
                  {job.Job_Description || "No description available."}
                </p>
              </div>

              <div className="text-end">
                <Link
                  to={`/applynow/${job.Job_Number}`}
                  className="btn btn-success btn-lg"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>

          {/* Optional: Job meta below */}
          <div className="text-center text-muted mt-4">
            <small>Job Number: {job.Job_Number}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
