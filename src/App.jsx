import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Archive from './pages/Archive'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects/new" element={<ProjectForm mode="create" />} />
        <Route path="/admin/projects/:id/edit" element={<ProjectForm mode="edit" />} />
        <Route path="/admin/archive" element={<Archive />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
