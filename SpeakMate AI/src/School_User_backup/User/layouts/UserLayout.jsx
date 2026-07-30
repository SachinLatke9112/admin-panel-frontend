import React, { useState } from 'react';
import SchoolUserList from '../SchoolUser/pages/SchoolUserList';
import '../SchoolUser/styles/schoolUser.css';

const MOCK_SCHOOLS = [
  'Green Valley High School',
  'Sunrise Public School',
  "St. Mary's School",
  'Oxford International School',
];

const UserLayout = () => {
  const [selectedSchool, setSelectedSchool] = useState('Green Valley High School');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Module Navigation Bar */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            S
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
            SpeakMate AI Admin
          </span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>/ User Management</span>
        </div>

        {/* Navigation & Selector */}
        <div className="nav-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: '#ffffff',
              color: '#2563eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            🏫 School Users
          </button>

          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="school-selector-dropdown"
              aria-label="Select School"
            >
              {MOCK_SCHOOLS.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            <div
              style={{
                position: 'absolute',
                right: '12px',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Submodule View Content */}
      <SchoolUserList selectedSchool={selectedSchool} onSelectSchool={setSelectedSchool} />
    </div>
  );
};

export default UserLayout;
