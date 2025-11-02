import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { ExcelTemplateButton } from './excel-template-generator';
import { useAuth } from './auth-context';
import { uploadExcelFile } from '../services/wearable-service';
import { saveMentalHealthProfile } from '../services/user-service';
import './mental-health-profile.css';

interface MentalHealthData {
  anxietyLevel: number;
  mentalHealthHistory: boolean;
  headache: number;
  financialCondition: boolean;
  safety: number;
}

export default function MentalHealthProfile() {
  const { updateUserProfile, user } = useAuth();
  const [formData, setFormData] = useState<MentalHealthData>(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('mentalHealthProfile');
    return saved ? JSON.parse(saved) : {
      anxietyLevel: 10,
      mentalHealthHistory: false,
      headache: 3,
      financialCondition: true,
      safety: 3,
    };
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSliderChange = (field: keyof MentalHealthData, value: number) => {
    console.log(`🔍 Slider changed: ${field} = ${value}`);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log(`🔍 Updated formData.${field}:`, updated[field]);
      return updated;
    });
  };

  const handleToggle = (field: 'mentalHealthHistory' | 'financialCondition', value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Upload to backend - saves all headers and data to database
      const result = await uploadExcelFile(file);
      toast.success(`✅ ${result.message} (${result.records} records saved)`);

      // Also parse locally to update form if first row matches expected fields
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length > 0) {
            const row: any = jsonData[0];
            const imported: Partial<MentalHealthData> = {};

            if (row.anxietyLevel !== undefined) {
              imported.anxietyLevel = Math.min(20, Math.max(1, Number(row.anxietyLevel)));
            }
            if (row.mentalHealthHistory !== undefined) {
              imported.mentalHealthHistory = row.mentalHealthHistory === 'Yes' || row.mentalHealthHistory === true;
            }
            if (row.headache !== undefined) {
              imported.headache = Math.min(5, Math.max(1, Number(row.headache)));
            }
            if (row.financialCondition !== undefined) {
              imported.financialCondition = row.financialCondition === 'Yes' || row.financialCondition === true;
            }
            if (row.safety !== undefined) {
              imported.safety = Math.min(5, Math.max(1, Number(row.safety)));
            }

            // Import CGPA if present
            if (row.cgpa !== undefined) {
              const cgpaValue = Number(row.cgpa);
              if (!isNaN(cgpaValue) && cgpaValue >= 0 && cgpaValue <= 10) {
                updateUserProfile({ cgpa: cgpaValue });
                toast.success('✅ CGPA imported successfully!');
              }
            }

            setFormData(prev => ({ ...prev, ...imported }));
            toast.success('✅ Form data updated from Excel!');
          }
        } catch (error) {
          console.error('Local Excel parsing error:', error);
          // Don't show error since upload was successful
        }
      };

      reader.onerror = () => {
        console.error('Error reading file for local parsing');
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error('Excel upload error:', error);
      toast.error(error.message || 'Failed to upload Excel file');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Get current user data to include in survey
      // Convert gender string to number: 'male' → 1, 'female'/'other' → 0 (backend mapping)
      let genderNum: number | undefined;
      if (user?.gender) {
        if (typeof user.gender === 'number') {
          genderNum = user.gender;
        } else {
          // Backend: 1 = male, 0 = female/other
          genderNum = user.gender === 'male' ? 1 : 0;
        }
      }

      const userData = {
        cgpa: user?.cgpa,
        extracurricularActivities: user?.extracurricularActivities,
        gender: genderNum,
      };

      // Save to backend database (includes all survey fields + user data)
      console.log('💾 Attempting to save mental health profile...');
      console.log('Form data:', formData);
      console.log('🔍 Safety in formData:', formData.safety, 'Type:', typeof formData.safety);
      console.log('User data:', userData);

      const result = await saveMentalHealthProfile(formData, userData);

      console.log('✅ Successfully saved! Response:', result);

      // Also save to localStorage for local access
      localStorage.setItem('mentalHealthProfile', JSON.stringify(formData));
      localStorage.setItem('mentalHealthProfileSaved', 'true');

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('profileSaved'));

      toast.success('✅ Mental health profile saved to database successfully!');
      console.log('📊 Saved survey data:', result.survey);
    } catch (error: any) {
      console.error('Error saving mental health profile:', error);
      toast.error(error.message || 'Failed to save mental health profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getAnxietyLabel = (value: number) => {
    if (value <= 5) return 'Minimal';
    if (value <= 10) return 'Mild';
    if (value <= 15) return 'Moderate';
    return 'Severe';
  };

  const getHeadacheLabel = (value: number) => {
    const labels = ['None', 'Mild', 'Moderate', 'Strong', 'Severe'];
    return labels[value - 1] || 'Moderate';
  };

  const getSafetyLabel = (value: number) => {
    const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return labels[value - 1] || 'Moderate';
  };

  return (
    <div className="mental-health-profile">
      <div className="container py-5">
        <div className="neubrutalism-card">
          {/* Header */}
          <div className="profile-header">
            <h1 className="profile-title">
              <span className="emoji">🧘‍♀️</span> Your Mental Health Profile
            </h1>
            <p className="profile-subtext">
              These details help Vishuddhi personalize your recommendations and monitor progress safely.
            </p>
          </div>

          {/* Anxiety Level */}
          <div className="form-section">
            <label className="section-label">
              Anxiety Level
              <span className="current-value">Current: {formData.anxietyLevel}</span>
            </label>
            <div className="slider-container lavender">
              <input
                type="range"
                min="1"
                max="20"
                value={formData.anxietyLevel}
                onChange={(e) => handleSliderChange('anxietyLevel', Number(e.target.value))}
                className="neubrutalism-slider"
                list="anxiety-markers"
              />
              <datalist id="anxiety-markers">
                <option value="1" label="1"></option>
                <option value="5" label="5"></option>
                <option value="10" label="10"></option>
                <option value="15" label="15"></option>
                <option value="20" label="20"></option>
              </datalist>
              <div className="slider-labels">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
              <div className="slider-tooltip">{getAnxietyLabel(formData.anxietyLevel)}</div>
            </div>
          </div>

          {/* Mental Health History */}
          <div className="form-section">
            <label className="section-label">Mental Health History</label>
            <div className="toggle-group">
              <button
                className={`toggle-button ${formData.mentalHealthHistory ? 'active' : ''}`}
                onClick={() => handleToggle('mentalHealthHistory', true)}
              >
                Yes
              </button>
              <button
                className={`toggle-button ${!formData.mentalHealthHistory ? 'active' : ''}`}
                onClick={() => handleToggle('mentalHealthHistory', false)}
              >
                No
              </button>
            </div>
          </div>

          {/* Headache Severity */}
          <div className="form-section">
            <label className="section-label">
              Headache Severity
              <span className="current-value">Current: {formData.headache}</span>
            </label>
            <div className="slider-container peach">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.headache}
                onChange={(e) => handleSliderChange('headache', Number(e.target.value))}
                className="neubrutalism-slider"
              />
              <div className="slider-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <div className="slider-tooltip">{getHeadacheLabel(formData.headache)}</div>
            </div>
          </div>

          {/* Financial Condition */}
          <div className="form-section">
            <label className="section-label">Financial Condition (Stable)</label>
            <div className="toggle-group mint">
              <button
                className={`toggle-button ${formData.financialCondition ? 'active' : ''}`}
                onClick={() => handleToggle('financialCondition', true)}
              >
                Yes
              </button>
              <button
                className={`toggle-button ${!formData.financialCondition ? 'active' : ''}`}
                onClick={() => handleToggle('financialCondition', false)}
              >
                No
              </button>
            </div>
          </div>

          {/* Safety Level */}
          <div className="form-section">
            <label className="section-label">
              Safety Level
              <span className="current-value">Current: {formData.safety}</span>
            </label>
            <div className="slider-container yellow">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.safety}
                onChange={(e) => handleSliderChange('safety', Number(e.target.value))}
                className="neubrutalism-slider"
              />
              <div className="slider-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <div className="slider-tooltip">{getSafetyLabel(formData.safety)}</div>
            </div>
          </div>

          {/* Import from Excel */}
          <div className="form-section">
            <label className="section-label">Import from Excel 📂</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="excel-upload"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="file-input"
                disabled={isUploading}
              />
              <label htmlFor="excel-upload" className={`file-upload-button ${isUploading ? 'disabled' : ''}`}>
                <span>{isUploading ? '⏳ Uploading...' : '📂 Import from Excel'}</span>
              </label>
              <p className="file-hint">
                Accepts .xlsx and .csv files | <ExcelTemplateButton />
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="form-section">
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '⏳ Saving...' : '💾 Save / Update Profile'}
            </button>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <strong>💡 Excel Upload:</strong> All columns from your Excel file will be saved to the database for future access.
            Common fields include: <code>anxietyLevel</code>, <code>mentalHealthHistory</code>, <code>headache</code>,
            <code>financialCondition</code>, <code>safety</code>, <code>cgpa</code>, and any other custom columns you include.
            <br />
            <strong>📂 Access your uploaded files:</strong> Use the API endpoints <code>GET /api/wearable/data</code> to retrieve all uploaded data,
            or <code>GET /api/wearable/data/:id</code> for a specific file.
          </div>
        </div>
      </div>
    </div>
  );
}
