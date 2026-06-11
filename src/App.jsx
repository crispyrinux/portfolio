import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Archive from './pages/Archive'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <ProjectForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:id/edit"
          element={
            <ProtectedRoute>
              <ProjectForm mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
