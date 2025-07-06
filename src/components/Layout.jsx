import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = () => {
  const userName = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("adminName");
  const adminToken = localStorage.getItem("adminToken");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isUser = !!token;
  const isAdmin = !!adminToken;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="bg-light border-bottom py-2">
        <ul className="nav justify-content-center align-items-center">
          <li className="nav-item">
            <Link to="/" className="nav-link text-dark">
              Home
            </Link>
          </li>

          {/* User-only Links */}
          {isUser && (
            <>
              <li className="nav-item">
                <Link to="/jobs" className="nav-link text-dark">
                  Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link text-dark">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/myjobs" className="nav-link text-dark">
                  My Jobs
                </Link>
              </li>
            </>
          )}

          {/* Admin-only Link */}
          {isAdmin && (
            <>
              <li className="nav-item">
                <Link to="/adminpage" className="nav-link text-dark">
                  Admin Page
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/postajob" className="nav-link text-dark">
                  Post A Job
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/applied" className="nav-link text-dark">
                  Applied Applicants
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/postedjobs" className="nav-link text-dark">
                  Posted Jobs
                </Link>
              </li>
            </>
          )}

          {/* Auth Sections */}
          {isUser || isAdmin ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-dark">
                  Welcome, {isAdmin ? adminName : userName}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/signup" className="nav-link text-dark">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admins" className="nav-link text-dark">
                  Admin Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Page Content */}
      <div className="flex-grow-1">
        <Outlet />
      </div>

      {/* Sticky Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">
          © {new Date().getFullYear()} OlaHire. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
