import React, { useState, useEffect } from 'react';
import { employeesAPI, attendanceAPI } from '../utils/api';
import '../styles/AttendancePage.css';

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    noData: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [employeesData, attendanceData] = await Promise.all([
        employeesAPI.getAll(),
        attendanceAPI.getAll({ date: today })
      ]);

      setEmployees(employeesData.employees || []);
      setAttendance(attendanceData.attendance || []);

      // Calculate stats
      const todayAttendance = attendanceData.attendance || [];
      const present = todayAttendance.filter(a => a.status === 'Present').length;
      const absent = todayAttendance.filter(a => a.status === 'Absent').length;
      const late = todayAttendance.filter(a => a.status === 'Late').length;
      const noData = (employeesData.employees?.length || 0) - todayAttendance.length;

      setStats({ present, absent, late, noData });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeAttendance = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.employeeId === employeeId && a.date === today);
    return record || { status: 'No Data', checkIn: null, checkOut: null };
  };

  const getStatusClass = (status) => {
    const classes = {
      'Present': 'status-present',
      'Late': 'status-late',
      'Absent': 'status-absent',
      'No Data': 'status-nodata'
    };
    return classes[status] || 'status-nodata';
  };

  const viewAttendanceLog = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const getEmployeeAttendanceLogs = (employeeId) => {
    return attendance
      .filter(a => a.employeeId === employeeId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Last 10 records
  };

  const filteredEmployees = employees.filter(emp => {
    if (filterStatus === 'all') return true;
    const empAttendance = getEmployeeAttendance(emp.id);
    return empAttendance.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1>Attendance Management</h1>
        <p>Monitor and manage employee attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="attendance-stats">
        <div className="stat-card present">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Present</h3>
            <p className="stat-value">{stats.present}</p>
          </div>
        </div>

        <div className="stat-card late">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Late</h3>
            <p className="stat-value">{stats.late}</p>
          </div>
        </div>

        <div className="stat-card absent">
          <div className="stat-icon">✗</div>
          <div className="stat-content">
            <h3>Absent</h3>
            <p className="stat-value">{stats.absent}</p>
          </div>
        </div>

        <div className="stat-card nodata">
          <div className="stat-icon">?</div>
          <div className="stat-content">
            <h3>No Data</h3>
            <p className="stat-value">{stats.noData}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="attendance-controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Employees</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="no data">No Data</option>
          </select>
        </div>
        <div className="date-display">
          Today: {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const empAttendance = getEmployeeAttendance(employee.id);
              return (
                <tr key={employee.id}>
                  <td className="employee-id">{employee.id}</td>
                  <td className="employee-name">{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.shift}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(empAttendance.status)}`}>
                      {empAttendance.status}
                    </span>
                  </td>
                  <td>{empAttendance.checkIn || '-'}</td>
                  <td>{empAttendance.checkOut || '-'}</td>
                  <td>{empAttendance.location || '-'}</td>
                  <td>
                    <button 
                      className="view-log-btn"
                      onClick={() => viewAttendanceLog(employee)}
                    >
                      View Log
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Attendance Log Modal */}
      {selectedEmployee && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Attendance Log - {selectedEmployee.name}</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="employee-details">
                <div className="detail-item">
                  <span className="detail-label">Employee ID:</span>
                  <span className="detail-value">{selectedEmployee.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedEmployee.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{selectedEmployee.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Shift:</span>
                  <span className="detail-value">{selectedEmployee.shift}</span>
                </div>
              </div>

              <h3>Recent Attendance Records</h3>
              <div className="log-table-container">
                <table className="log-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Location</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEmployeeAttendanceLogs(selectedEmployee.id).map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{record.checkIn || '-'}</td>
                        <td>{record.checkOut || '-'}</td>
                        <td>{record.location || '-'}</td>
                        <td>{record.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
