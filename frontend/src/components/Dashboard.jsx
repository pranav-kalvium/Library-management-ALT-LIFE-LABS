import React, { useState, useEffect, useCallback } from 'react';
import { fetchPendingIssuances } from '../api';

const styles = `
  /* ========== Dashboard Styles ========== */
  .dashboard {
    font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
    min-height: calc(100vh - 56px);
    background: #f0f2f5;
  }

  /* Header */
  .dashboard-header {
    background: linear-gradient(135deg, #1a2744 0%, #2a3f6a 100%);
    color: #ffffff;
    padding: 28px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 12px rgba(26, 39, 68, 0.25);
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .dashboard-header .header-subtitle {
    font-size: 0.875rem;
    font-weight: 300;
    opacity: 0.75;
    margin-top: 4px;
  }

  .header-date {
    font-size: 0.95rem;
    font-weight: 300;
    opacity: 0.85;
    text-align: right;
  }

  .header-date .date-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.6;
    display: block;
    margin-bottom: 2px;
  }

  /* Summary Cards */
  .summary-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    padding: 28px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .summary-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px 28px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .summary-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    border-radius: 4px 0 0 4px;
  }

  .summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  .summary-card.total::before { background: #1a2744; }
  .summary-card.overdue::before { background: #dc3545; }
  .summary-card.due-soon::before { background: #f59e0b; }

  .summary-card .card-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .summary-card .card-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a2744;
    line-height: 1;
  }

  .summary-card.overdue .card-value { color: #dc3545; }
  .summary-card.due-soon .card-value { color: #d97706; }

  /* Table Container */
  .table-container {
    padding: 0 40px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .table-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a2744;
  }

  .refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #1a2744;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
  }

  .refresh-btn:hover {
    background: #2a3f6a;
  }

  .refresh-btn:active {
    transform: scale(0.97);
  }

  .refresh-btn .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Table */
  .data-table-wrapper {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: #f8f9fb;
  }

  .data-table th {
    text-align: left;
    padding: 14px 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    border-bottom: 2px solid #e5e7eb;
  }

  .data-table td {
    padding: 16px 20px;
    font-size: 0.9rem;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }

  .data-table tbody tr {
    transition: background 0.15s ease;
  }

  .data-table tbody tr:hover {
    background: #f8f9fb;
  }

  .data-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Status Badges */
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .badge.overdue {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .badge.due-soon {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
  }

  .badge.on-time {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  /* Loading & Error */
  .state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: #1a2744;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  .state-text {
    color: #6b7280;
    font-size: 0.95rem;
  }

  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 24px 32px;
    max-width: 480px;
  }

  .error-box h3 {
    color: #dc2626;
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .error-box p {
    color: #7f1d1d;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .empty-state {
    padding: 60px 40px;
    text-align: center;
    color: #9ca3af;
  }

  .empty-state .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 20px 24px;
    }

    .header-date {
      text-align: left;
    }

    .summary-row {
      padding: 20px 24px;
      grid-template-columns: 1fr;
    }

    .table-container {
      padding: 0 24px 24px;
    }

    .data-table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      min-width: 700px;
    }

    .table-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
`;

function getStatusBadge(targetReturnDate) {
  const now = new Date();
  const target = new Date(targetReturnDate);
  const diffMs = target - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    return <span className="badge overdue">Overdue</span>;
  } else if (diffDays <= 3) {
    return <span className="badge due-soon">Due Soon</span>;
  } else {
    return <span className="badge on-time">On Time</span>;
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPendingIssuances();
      setIssuances(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Compute summary stats
  const now = new Date();
  const overdueCount = issuances.filter(
    (i) => new Date(i.target_return_date) < now
  ).length;

  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const dueSoonCount = issuances.filter((i) => {
    const target = new Date(i.target_return_date);
    return target >= now && target <= threeDaysFromNow;
  }).length;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Library Management — Pending Returns</h1>
            <div className="header-subtitle">
              Track and manage all outstanding book issuances
            </div>
          </div>
          <div className="header-date">
            <span className="date-label">Today</span>
            {getTodayFormatted()}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-row">
          <div className="summary-card total">
            <div className="card-label">Total Pending</div>
            <div className="card-value">{issuances.length}</div>
          </div>
          <div className="summary-card overdue">
            <div className="card-label">Overdue</div>
            <div className="card-value">{overdueCount}</div>
          </div>
          <div className="summary-card due-soon">
            <div className="card-label">Due This Week</div>
            <div className="card-value">{dueSoonCount}</div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">Pending Issuances</span>
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span className={refreshing ? 'spin' : ''}>↻</span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="state-container">
              <div className="spinner"></div>
              <div className="state-text">Loading pending issuances...</div>
            </div>
          ) : error ? (
            <div className="state-container">
              <div className="error-box">
                <h3>Unable to load data</h3>
                <p>
                  Could not connect to the API server. Make sure the backend is
                  running at the configured URL.
                </p>
                <p style={{ marginTop: 8, opacity: 0.7, fontSize: '0.8rem' }}>
                  Error: {error}
                </p>
              </div>
            </div>
          ) : issuances.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div>No pending issuances — all books have been returned!</div>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Book Name</th>
                    <th>Issued Date</th>
                    <th>Target Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issuances.map((item) => (
                    <tr key={item.issuance_id}>
                      <td style={{ fontWeight: 600 }}>{item.mem_name}</td>
                      <td>{item.book_name}</td>
                      <td>{formatDate(item.issuance_date)}</td>
                      <td>{formatDate(item.target_return_date)}</td>
                      <td>{getStatusBadge(item.target_return_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
