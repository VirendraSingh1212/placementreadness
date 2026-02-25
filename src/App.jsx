import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardLayout } from "./layouts/DashboardLayout.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { PracticePage } from "./pages/PracticePage.jsx";
import { AssessmentsPage } from "./pages/AssessmentsPage.jsx";
import { ResourcesPage } from "./pages/ResourcesPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { AnalyzerPage } from "./pages/AnalyzerPage.jsx";
import { ResultsPage } from "./pages/ResultsPage.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

