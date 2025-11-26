import React, { useState, useEffect } from 'react';
import { hazardsAPI } from '../utils/api';
import '../styles/HazardsPage.css';

const HazardsPage = () => {
  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHazards();
  }, []);

  const fetchHazards = async () => {
    try {
      const data = await hazardsAPI.getAll();
      setHazards(data.hazards);
    } catch (error) {
      console.error('Error fetching hazards:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (hazard) => {
    setSelectedHazard(hazard);
  };

  const closeModal = () => {
    setSelectedHazard(null);
  };

  const updateHazardStatus = async (newStatus) => {
    try {
      const updatedHazard = await hazardsAPI.update(selectedHazard._id, { 
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' ? new Date().toISOString() : null
      });
      
      const updatedHazards = hazards.map(h => 
        h._id === selectedHazard._id ? updatedHazard : h
      );
      setHazards(updatedHazards);
      setSelectedHazard(updatedHazard);
    } catch (error) {
      console.error('Error updating hazard status:', error);
      alert('Failed to update hazard status');
    }
  };

  const filteredHazards = filterStatus === 'all' 
    ? hazards 
    : hazards.filter(h => h.status.toLowerCase() === filterStatus.toLowerCase());

  const getSeverityClass = (severity) => {
    return `severity-badge ${severity.toLowerCase()}`;
  };

  const getStatusClass = (status) => {
    return `status-badge ${status.toLowerCase().replace('-', '')}`;
  };

  return (
    <div className="hazards-page">
      <div className="page-header">
        <h1>Hazard Management</h1>
        <p>Monitor and manage reported hazards across all mine sections</p>
      </div>

      <div className="hazards-controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Hazards</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="hazards-stats">
          <span className="stat-item">Total: {hazards.length}</span>
          <span className="stat-item danger">Active: {hazards.filter(h => h.status !== 'Resolved').length}</span>
        </div>
      </div>

      <div className="hazards-table-container">
        <table className="hazards-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter Name</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHazards.map((hazard) => (
              <tr key={hazard._id}>
                <td className="hazard-id">{hazard.hazardId}</td>
                <td>{hazard.reporterName}</td>
                <td>{hazard.category}</td>
                <td>
                  <span className={getSeverityClass(hazard.severity)}>
                    {hazard.severity}
                  </span>
                </td>
                <td>{hazard.location}</td>
                <td>
                  <span className={getStatusClass(hazard.status)}>
                    {hazard.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => openModal(hazard)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedHazard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Hazard Details</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <label>ID:</label>
                <span>{selectedHazard.hazardId}</span>
              </div>
              
              <div className="detail-row">
                <label>Reported By:</label>
                <span>{selectedHazard.reportedByName} ({selectedHazard.reportedBy})</span>
              </div>
              
              <div className="detail-row">
                <label>Timestamp:</label>
                <span>{new Date(selectedHazard.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="detail-row">
                <label>Type:</label>
                <span>{selectedHazard.category}</span>
              </div>
              
              <div className="detail-row">
                <label>Severity:</label>
                <span className={getSeverityClass(selectedHazard.severity)}>
                  {selectedHazard.severity}
                </span>
              </div>
              
              <div className="detail-row">
                <label>Location:</label>
                <span>{selectedHazard.location}</span>
              </div>
              
              <div className="detail-row full-width">
                <label>Description:</label>
                <p>{selectedHazard.description}</p>
              </div>
              
              {selectedHazard.actionTaken && (
                <div className="detail-row full-width">
                  <label>Action Taken:</label>
                  <p>{selectedHazard.actionTaken}</p>
                </div>
              )}
              
              <div className="detail-row">
                <label>Assigned To:</label>
                <span>{selectedHazard.assignedTo || 'Unassigned'}</span>
              </div>
              
              <div className="detail-row">
                <label>Current Status:</label>
                <span className={getStatusClass(selectedHazard.status)}>
                  {selectedHazard.status}
                </span>
              </div>
              
              <div className="status-update-section">
                <label>Update Status:</label>
                <div className="status-buttons">
                  <button 
                    className={`status-update-btn pending ${selectedHazard.status === 'Pending' ? 'active' : ''}`}
                    onClick={() => updateHazardStatus('Pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`status-update-btn inprogress ${selectedHazard.status === 'In-progress' ? 'active' : ''}`}
                    onClick={() => updateHazardStatus('In-progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`status-update-btn resolved ${selectedHazard.status === 'Resolved' ? 'active' : ''}`}
                    onClick={() => updateHazardStatus('Resolved')}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HazardsPage;
