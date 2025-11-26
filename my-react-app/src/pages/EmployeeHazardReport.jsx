import React, { useState } from 'react';
import { hazardsAPI } from '../utils/api';
import '../styles/EmployeeHazardReport.css';

const EmployeeHazardReport = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    location: '',
    description: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we just store the filename
      setFormData(prev => ({
        ...prev,
        image: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newHazard = {
        reportedBy: user.id,
        reportedByName: user.name,
        type: formData.type,
        severity: formData.severity,
        location: formData.location,
        description: formData.description,
        status: 'Pending',
        assignedTo: null,
        images: formData.image ? [formData.image] : [],
        actionTaken: '',
        resolvedAt: null
      };

      await hazardsAPI.create(newHazard);
      
      // Show success message
      await hazardsAPI.create(newHazard);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reset form
      setFormData({
        type: '',
        severity: '',
        location: '',
        description: '',
        image: ''
      });

      // Clear file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error submitting hazard report:', error);
      alert('Failed to submit hazard report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hazardTypes = [
    'Gas Leak',
    'Roof Instability',
    'Equipment Malfunction',
    'Fire Hazard',
    'Safety Violation',
    'Water Accumulation',
    'Ventilation Issue',
    'Electrical Issue',
    'Structural Damage',
    'Other'
  ];

  return (
    <div className="hazard-report-page">
      <div className="page-header">
        <h1>Report Hazard</h1>
        <p>Report any safety concerns or hazards immediately</p>
      </div>

      {showSuccess && (
        <div className="success-alert">
          ✓ Hazard reported successfully! Your report has been submitted to the safety team.
        </div>
      )}

      <div className="report-container">
        <form onSubmit={handleSubmit} className="hazard-form">
          <div className="form-section">
            <h2>📋 Hazard Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Hazard Category *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category...</option>
                  {hazardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="severity">Severity Level *</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select severity...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Section 4B - Main Tunnel"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the hazard, what you observed, and any immediate actions taken..."
                rows="6"
                required
              />
              <span className="char-count">{formData.description.length} characters</span>
            </div>

            <div className="form-group">
              <label htmlFor="image-upload">Upload Image (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <label htmlFor="image-upload" className="file-label">
                  <span className="file-icon">📷</span>
                  {formData.image ? formData.image : 'Choose image file...'}
                </label>
              </div>
              <span className="help-text">Supported formats: JPG, PNG (Max 5MB)</span>
            </div>
          </div>

          <div className="form-section reporter-info">
            <h3>Reporter Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID:</span>
                <span className="info-value">{user.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time:</span>
                <span className="info-value">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <span className="btn-icon">📤</span>
              Submit Hazard Report
            </button>
          </div>
        </form>

        <div className="info-sidebar">
          <div className="info-box emergency">
            <h3>🚨 Emergency</h3>
            <p>In case of immediate danger:</p>
            <ul>
              <li>Evacuate the area immediately</li>
              <li>Alert nearby workers</li>
              <li>Contact emergency services</li>
              <li>Report to your supervisor</li>
            </ul>
          </div>

          <div className="info-box guidelines">
            <h3>📌 Reporting Guidelines</h3>
            <ul>
              <li>Report all hazards, no matter how small</li>
              <li>Be specific about location and conditions</li>
              <li>Include photos when possible</li>
              <li>Do not attempt to fix hazards yourself</li>
              <li>Follow up with your supervisor</li>
            </ul>
          </div>

          <div className="info-box severity-guide">
            <h3>⚠️ Severity Levels</h3>
            <div className="severity-item">
              <span className="severity-badge critical">Critical</span>
              <p>Immediate danger to life</p>
            </div>
            <div className="severity-item">
              <span className="severity-badge high">High</span>
              <p>Serious safety risk</p>
            </div>
            <div className="severity-item">
              <span className="severity-badge medium">Medium</span>
              <p>Moderate concern</p>
            </div>
            <div className="severity-item">
              <span className="severity-badge low">Low</span>
              <p>Minor issue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHazardReport;
