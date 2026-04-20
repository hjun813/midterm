
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputPage from './pages/InputPage';
import StudyMode from './pages/StudyMode';
import ExamMode from './pages/ExamMode';
import ReviewNotes from './pages/ReviewNotes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="input" element={<InputPage />} />
        <Route path="study" element={<StudyMode />} />
        <Route path="exam" element={<ExamMode />} />
        <Route path="review" element={<ReviewNotes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
