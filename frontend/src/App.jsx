import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login.jsx";
import Signup from "./pages/signup/signup.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import InitialAssessment from "./pages/assessment/initialAssessment.jsx";
import Recommendations from "./pages/recommendations/recommendations.jsx";
import CourseAssessment from "./pages/courseAssessment/courseAssessment.jsx";
import Profile from "./pages/profile/profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/assessment/initial"
          element={<InitialAssessment />}
        />

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />
        <Route
          path="/assessment/course"
          element={<CourseAssessment />}
        />
        <Route
         path="/profile"
         element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;