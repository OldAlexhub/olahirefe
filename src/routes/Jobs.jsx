import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Jobs = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 5;

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(999999);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/alljobs`
        );
        if (res.status === 200) {
          setData(res.data.jobs);
          setFiltered(res.data.jobs);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const uniqueLocations = useMemo(
    () => [...new Set(data.map((job) => job.Location))],
    [data]
  );

  const uniqueCompanies = useMemo(
    () => [...new Set(data.map((job) => job.Company_Name))],
    [data]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredJobs = data.filter((job) => {
        const searchText = search.toLowerCase();
        const matchSearch =
          job.Job_Title.toLowerCase().includes(searchText) ||
          job.Company_Name.toLowerCase().includes(searchText) ||
          job.Job_Description.toLowerCase().includes(searchText);

        const matchLocation =
          !locationFilter || job.Location === locationFilter;
        const matchCompany =
          !companyFilter || job.Company_Name === companyFilter;
        const salary = parseInt(job.Salary_Estimate?.replace(/\D/g, "")) || 0;
        const matchSalary = salary >= minSalary && salary <= maxSalary;

        return matchSearch && matchLocation && matchCompany && matchSalary;
      });

      setFiltered(filteredJobs);
      setPage(1);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [search, locationFilter, companyFilter, minSalary, maxSalary, data]);

  const startIndex = (page - 1) * jobsPerPage;
  const currentJobs = filtered.slice(startIndex, startIndex + jobsPerPage);
  const totalPages = Math.ceil(filtered.length / jobsPerPage);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Available Jobs</h2>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search jobs or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map((comp, i) => (
              <option key={i} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <p className="text-center">Loading jobs...</p>
      ) : currentJobs.length === 0 ? (
        <p className="text-center">No jobs match your criteria.</p>
      ) : (
        currentJobs.map((job, index) => (
          <div
            key={job._id || index}
            className="mb-4 p-4 bg-white shadow-sm rounded"
          >
            <h4>{job.Job_Title}</h4>
            <p>
              <strong>Salary:</strong> {job.Salary_Estimate}
            </p>
            <p>
              <strong>Company:</strong> {job.Company_Name} |{" "}
              <strong>Location:</strong> {job.Location}
            </p>
            <p>
              <strong>Description:</strong> <br />
              {job.Job_Description?.slice(0, 200)}...
            </p>
            <Link
              to={`/jobs/${job.Job_Number}`}
              className="btn btn-primary mt-2"
            >
              Open Job
            </Link>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
