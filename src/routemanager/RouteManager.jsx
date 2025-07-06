import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../routes/Home";
import Jobs from "../routes/Jobs";
import JobDetails from "../routes/JobDetails";
import ApplyNow from "../routes/ApplyNow";
import Signup from "../routes/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminsOnly from "../components/AdminsOnly"; // ✅
import Profile from "../routes/Profile";
import MyJobs from "../routes/MyJobs";
import Admins from "../routes/Admins";
import AdminPage from "../routes/AdminPage";
import PostAJob from "../routes/PostAJob";
import Applied from "../routes/Applied";
import PostedJobs from "../routes/PostedJobs";
import ApplicantProfile from "../routes/ApplicantProfile";

const RouteManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="admins" element={<Admins />} />

          {/* Admin Routes */}
          <Route element={<AdminsOnly />}>
            <Route path="adminpage" element={<AdminPage />} />
            <Route path="postajob" element={<PostAJob />} />
            <Route path="applied" element={<Applied />} />
            <Route path="postedjobs" element={<PostedJobs />} />
            <Route
              path="/adminjobdetails/:jobNumber"
              element={<JobDetails />}
            />
            <Route
              path="applicantprofile/:userId"
              element={<ApplicantProfile />}
            />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:jobNumber" element={<JobDetails />} />
            <Route path="applynow/:jobNumber" element={<ApplyNow />} />
            <Route path="profile" element={<Profile />} />
            <Route path="myjobs" element={<MyJobs />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteManager;
