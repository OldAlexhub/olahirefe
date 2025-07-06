import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    userId: userId || "",
    applicantName: name || "",
    email: "",
    phone: "",
    institution: "",
    highestEdu: "",
    fieldOfStudy: "",
    educationStartDate: "",
    educationEndDate: "",
    company1: "",
    position1: "",
    experienceStartDate1: "",
    experienceEndDate1: "",
    responsibilities1: "",
    company2: "",
    position2: "",
    experienceStartDate2: "",
    experienceEndDate2: "",
    responsibilities2: "",
    company3: "",
    position3: "",
    experienceStartDate3: "",
    experienceEndDate3: "",
    responsibilities3: "",
    skills: "",
  });

  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/applicant/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200 && res.data.user) {
          const formatted = formatDates(res.data.user);
          setFormData({ ...formData, ...formatted });
          setOriginalData({ ...formData, ...formatted });
          setHasProfile(true);
        }
      } catch (error) {
        setHasProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const formatDates = (data) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (key.toLowerCase().includes("date") && data[key]) {
        data[key] = data[key].split("T")[0];
      }
    });
    return data;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = `${process.env.REACT_APP_BASE_LINK}/applicant${
        isEditing ? `/${userId}` : ""
      }`;
      const method = isEditing ? "put" : "post";

      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        const updated = formatDates(res.data.updated || res.data);
        setFormData(updated);
        setOriginalData(updated);
        setHasProfile(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_LINK}/applicant/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasProfile(false);
      setFormData({
        userId: userId || "",
        applicantName: name || "",
        email: "",
        phone: "",
        institution: "",
        highestEdu: "",
        fieldOfStudy: "",
        educationStartDate: "",
        educationEndDate: "",
        company1: "",
        position1: "",
        experienceStartDate1: "",
        experienceEndDate1: "",
        responsibilities1: "",
        company2: "",
        position2: "",
        experienceStartDate2: "",
        experienceEndDate2: "",
        responsibilities2: "",
        company3: "",
        position3: "",
        experienceStartDate3: "",
        experienceEndDate3: "",
        responsibilities3: "",
        skills: "",
      });
      setOriginalData(null);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/\d+/g, (m) => ` ${m}`)
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (s) => s.toUpperCase());
  };

  const displayField = (label, value) => (
    <p className="mb-2">
      <strong>{label}:</strong> {value}
    </p>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Applicant Profile</h2>

      {(!hasProfile || isEditing) && formData ? (
        <form
          onSubmit={handleSubmit}
          className="bg-light p-4 rounded shadow-sm"
        >
          <div className="mb-3 d-flex justify-content-between">
            {hasProfile && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData(originalData);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </>
            )}
          </div>

          {Object.keys(formData).map(
            (key) =>
              key !== "userId" &&
              key !== "applicantName" && (
                <div className="mb-3" key={key}>
                  <label className="form-label">{formatLabel(key)}</label>
                  {key.toLowerCase().includes("responsibilities") ||
                  key === "skills" ? (
                    <textarea
                      name={key}
                      className="form-control"
                      value={formData[key] || ""}
                      onChange={handleChange}
                    />
                  ) : key.toLowerCase().includes("date") ? (
                    <input
                      name={key}
                      type="date"
                      className="form-control"
                      value={formData[key] || ""}
                      onChange={handleChange}
                    />
                  ) : key === "highestEdu" ? (
                    <select
                      name="highestEdu"
                      className="form-select"
                      value={formData[key] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select one</option>
                      <option value="High School">High School</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor's Degree">
                        Bachelor's Degree
                      </option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      name={key}
                      type="text"
                      className="form-control"
                      value={formData[key] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
              )
          )}
        </form>
      ) : (
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="mb-4">{formData.applicantName}</h4>
          <div className="mb-3">
            {displayField("Email", formData.email)}
            {displayField("Phone", formData.phone)}
            {displayField("Highest Education", formData.highestEdu)}
            {displayField("Institution", formData.institution)}
            {displayField("Field Of Study", formData.fieldOfStudy)}
            {displayField("Education Start Date", formData.educationStartDate)}
            {displayField("Education End Date", formData.educationEndDate)}
          </div>
          <hr />
          {[1, 2, 3].map(
            (i) =>
              formData[`company${i}`] && (
                <div key={i} className="mb-3">
                  <h6>Experience #{i}</h6>
                  {displayField("Company", formData[`company${i}`])}
                  {displayField("Position", formData[`position${i}`])}
                  {displayField(
                    "Start Date",
                    formData[`experienceStartDate${i}`]
                  )}
                  {displayField("End Date", formData[`experienceEndDate${i}`])}
                  {displayField(
                    "Responsibilities",
                    formData[`responsibilities${i}`]
                  )}
                </div>
              )
          )}
          <hr />
          {formData.skills && displayField("Skills", formData.skills)}
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button className="btn btn-outline-danger" onClick={handleDelete}>
              Delete Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
