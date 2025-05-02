import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const LogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('/api/admin/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        setError('Loglar alınamadı');
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="wwm-panel">
      <h1>İşlem Kayıtları</h1>
      {error && <p className="error">{error}</p>}
      <table className="wwm-table">
        <thead>
          <tr>
            <th>Yönetici</th>
            <th>IP</th>
            <th>Route</th>
            <th>Yöntem</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.adminId?.email || 'N/A'}</td>
              <td>{log.ip}</td>
              <td>{log.path}</td>
              <td>{log.method}</td>
              <td>{new Date(log.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogPanel;
