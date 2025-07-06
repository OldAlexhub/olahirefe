import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplyNow = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { jobNumber } = useParams();

  const [profile, setProfile] = useState(null);
  const [job, setJob] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const formatDates = (data) => {
      const result = { ...data };
      for (const key in result) {
        if (
          key.toLowerCase().includes("date") &&
          result[key] &&
          typeof result[key] === "string"
        ) {
          const dateObj = new Date(result[key]);
          if (!isNaN(dateObj)) {
            result[key] = dateObj.toISOString().split("T")[0];
          }
        }
      }
      return result;
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/applicant/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data?.user) {
          const cleaned = formatDates(res.data.user);
          setProfile(cleaned);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/ajob/${jobNumber}`
        );
        if (res.data?.job) setJob(res.data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };

    if (userId && jobNumber) {
      fetchProfile();
      fetchJob();
    }
  }, [userId, jobNumber]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const { applicantName, email, ...filteredProfile } = profile;

      // Flatten job and profile data into one object
      const flatPayload = {
        userId,
        jobNumber: job.Job_Number,
        jobTitle: job.Job_Title,
        company: job.Company_Name,
        location: job.Location,
        salary: job.Salary_Estimate,
        description: job.Job_Description,
        applicationDate: new Date().toISOString().split("T")[0],
        ...filteredProfile,
      };

      console.log(flatPayload); // Optional: inspect before sending

      await axios.post(
        `${process.env.REACT_APP_BASE_PYTHON}/row-application`,
        flatPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmitted(true);

      setTimeout(() => {
        navigate("/myjobs");
      }, 3000);
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  const displayField = (label, value) =>
    value && (
      <p className="mb-2">
        <strong>{label}:</strong> {value}
      </p>
    );

  if (!profile || !job)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Full Resume */}
        <div className="col-md-6">
          <div className="p-4 bg-light rounded shadow-sm">
            <h4 className="mb-3">Your Resume</h4>
            {displayField("Name", profile.applicantName)}
            {displayField("Email", profile.email)}
            {displayField("Phone", profile.phone)}
            {displayField("Highest Education", profile.highestEdu)}
            {displayField("Institution", profile.institution)}
            {displayField("Field of Study", profile.fieldOfStudy)}
            {displayField("Education Start", profile.educationStartDate)}
            {displayField("Education End", profile.educationEndDate)}

            {[1, 2, 3].map((i) =>
              profile[`company${i}`] ? (
                <div key={i} className="mt-3 border-top pt-2">
                  <h6>Experience #{i}</h6>
                  {displayField("Company", profile[`company${i}`])}
                  {displayField("Position", profile[`position${i}`])}
                  {displayField(
                    "Start Date",
                    profile[`experienceStartDate${i}`]
                  )}
                  {displayField("End Date", profile[`experienceEndDate${i}`])}
                  {displayField(
                    "Responsibilities",
                    profile[`responsibilities${i}`]
                  )}
                </div>
              ) : null
            )}

            {displayField("Skills", profile.skills)}
          </div>
        </div>

        {/* Job Info */}
        <div className="col-md-6">
          <div className="p-4 bg-white rounded shadow-sm border">
            <h4 className="mb-3">{job.Job_Title}</h4>
            {displayField("Company", job.Company_Name)}
            {displayField("Location", job.Location)}
            {displayField("Salary", job.Salary_Estimate)}
            <p style={{ whiteSpace: "pre-line" }}>
              <strong>Description:</strong>
              <br />
              {job.Job_Description}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        {submitted ? (
          <div className="alert alert-success">
            Your application has been submitted!
          </div>
        ) : (
          <button onClick={handleSubmit} className="btn btn-success btn-lg">
            Submit Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyNow;
