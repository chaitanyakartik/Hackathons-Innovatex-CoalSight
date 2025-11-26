import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AttendancePage from './pages/AttendancePage'
import HazardsPage from './pages/HazardsPage'
import EquipmentPage from './pages/EquipmentPage'
import ProductionPage from './pages/ProductionPage'
import NotificationsPage from './pages/NotificationsPage'
import EmployeeLayout from './components/EmployeeLayout'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeAttendance from './pages/EmployeeAttendance'
import EmployeeHazardReport from './pages/EmployeeHazardReport'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="hazards" element={<HazardsPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        
        {/* Employee Routes with Layout */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="report-hazard" element={<EmployeeHazardReport />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
