import { useState, useEffect } from "react";
import axios from "axios";

const MyJobs = () => {
  const [data, myData] = useState([]);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/getapps/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API raw response:", response.data);

        const jobs = response.data?.jobs;

        if (Array.isArray(jobs)) {
          // Sort by match_percent descending
          const sorted = jobs.sort(
            (a, b) => (b.match_percent || 0) - (a.match_percent || 0)
          );
          myData(sorted);
        } else {
          console.warn("Expected jobs to be array but got:", jobs);
          myData([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        myData([]);
      }
    };

    fetchMyJobs();
  }, []);

  const renderJudgment = (percent) => {
    if (percent < 0.5) return "❌ Will not be considered";
    if (percent < 0.65) return "⚠️ Might get a call";
    return "✅ High chance of interview";
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Hi {name}, here are your job applications</h2>
      {data.length === 0 ? (
        <p>No job applications found.</p>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-bordered table-striped"
            style={{ textAlign: "center" }}
          >
            <thead className="table-dark">
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Match %</th>
                <th>Years of Experience</th>
                <th>Judgment</th>
              </tr>
            </thead>
            <tbody>
              {data.map((job, index) => (
                <tr key={index}>
                  <td>{job.jobTitle}</td>
                  <td>{job.company}</td>
                  <td>{(job.match_percent * 100).toFixed(1)}%</td>
                  <td>{job.years_of_experience || 0}</td>
                  <td>{renderJudgment(job.match_percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
