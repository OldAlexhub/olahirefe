import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null); // Added error state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added authentication state

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/login`,
        formData
      );

      if (response.status === 200) {
        const { name, userId, token } = response.data;

        localStorage.setItem("name", name);
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);

        setIsAuthenticated(true);
        setTimeout(() => {
          navigate("/jobs");
        }, 1000); // Reduced timeout for better UX
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          {/* Left: Hero Text */}
          <div className="col-md-6 text-start">
            <h1 className="display-4 fw-bold">OlaHire: Hiring Reimagined</h1>
            <p className="lead mt-4">
              Whether you're an applicant or a recruiter, OlaHire understands
              you — not just your keywords. This is contextual recruiting built
              for fairness, precision, and connection.
            </p>
            <a href="#learn-more" className="btn btn-primary btn-lg mt-3">
              Learn More
            </a>
            {isAuthenticated && (
              <Link to="/jobs" className="btn btn-success btn-lg mt-3 ms-2">
                Go to Jobs
              </Link>
            )}
          </div>

          {/* Right: Login Form (shown only if not authenticated) */}
          {!isAuthenticated && (
            <div className="col-md-6">
              <div className="bg-white shadow rounded p-4">
                <h3 className="mb-4 text-center">Login to OlaHire</h3>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
                <div className="text-center mt-3">
                  <small>
                    Don't have an account?{" "}
                    <Link to="/signup">Sign up here</Link>
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Features */}
      <section className="container py-5" id="learn-more">
        <h2 className="text-center mb-5">What Makes OlaHire Different?</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-4 bg-white shadow rounded">
              <h4>🔍 Context-Aware Job Matching</h4>
              <p>
                Your job history isn't just a list of titles. OlaHire reads
                between the lines to truly understand your career path and match
                you to jobs based on meaning — not keyword tricks.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white shadow rounded">
              <h4>🤖 Smart Resume Interpretation</h4>
              <p>
                No more playing buzzword bingo. Our system uses AI to grasp the
                actual context of your experience, comparing it to job
                descriptions with deep semantic understanding.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white shadow rounded">
              <h4>🎯 Recruiter Search, Reinvented</h4>
              <p>
                Recruiters can tap into the entire applicant pool, run
                AI-powered matching scores, and surface candidates who may have
                been overlooked by keyword-based systems.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white shadow rounded">
              <h4>🔁 Mutual Discovery Model</h4>
              <p>
                Looking for a job or a candidate shouldn't be one-sided. OlaHire
                promotes discovery from both ends: candidates can see best-fit
                jobs, and recruiters can see best-fit people.
              </p>
            </div>
          </div>

          <div className="col-12">
            <div className="p-4 bg-white shadow rounded">
              <h4>🧠 Built-In Fairness</h4>
              <p>
                OlaHire is committed to removing bias from hiring. No name-based
                filtering, no unfair screening. Just a clear picture of what you
                bring to the table — ethically and objectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Highlight */}
      {/* AI Technology Highlight */}
      <section className="container py-5">
        <h2 className="text-center mb-4">
          Powered by AI That Understands Context
        </h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="bg-secondary rounded-3 overflow-hidden">
              <img
                src="https://www.ismartrecruit.com/upload/blog/main_image/Artificial_Intelligence_(AI)_for_a_Recruitment_Software.webp"
                alt="AI in Recruitment"
                className="img-fluid w-100"
              />
            </div>
          </div>
          <div className="col-md-6">
            <p className="lead">
              OlaHire’s matching engine is powered by state-of-the-art AI models
              that go beyond keyword matching. We use transformer-based language
              models to compare applicant experience and job descriptions with
              real semantic understanding. Your skills, career progression, and
              experience context are all factored in — not just words on a
              resume.
            </p>
            <ul className="mt-3">
              <li>Semantic similarity via transformer encoders</li>
              <li>Bias-resistant applicant matching</li>
              <li>Real-time recruiter scoring engine</li>
              <li>Multilingual candidate support coming soon</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-3">Ready to experience the future of hiring?</h2>
          <p className="lead">
            Whether you're looking for your next role or your next hire —
            OlaHire is built to work both ways.
          </p>
          {isAuthenticated ? (
            <Link to="/jobs" className="btn btn-light btn-lg mt-3">
              Go to Jobs
            </Link>
          ) : (
            <Link to="/signup" className="btn btn-light btn-lg mt-3">
              Get Started
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
