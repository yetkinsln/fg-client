import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const TopicsPanel = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const token = localStorage.getItem('admin_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const fetchTopics = async () => {
    try {
      const res = await axios.get('/api/admin/topics');
      console.log(res.data);
      setTopics(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Başlıklar alınamadı');
    }
  };

  const deleteTopic = async (id) => {
    if (!window.confirm('Bu başlık silinsin mi?')) return;

    try {
      await axios.delete(`/api/admin/topics/${id}`);
      setTopics(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız');
    }
  };

  const createTopic = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await axios.post('/api/admin/topics', { title: newTitle });
      setTopics(prev => [...prev, res.data]);
      setNewTitle('');
    } catch (err) {
      alert(err.response?.data?.error || 'Başlık oluşturulamadı');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="wwm-panel">
      <h1>Başlıklar</h1>
      {error && <p className="error">{error}</p>}

      {/* Yeni başlık oluşturma alanı */}
      <div className="wwm-form-row">
        <input
          type="text"
          placeholder="Yeni başlık"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createTopic}>Ekle</button>
      </div>

      <table className="wwm-table">
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Oluşturan</th>
            <th>Tarih</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(topic => (
            <tr key={topic._id}>
              <td>{topic.title}</td>
              <td>{topic?.createdBy?.email || 'N/A'}</td>
              <td>{new Date(topic.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => deleteTopic(topic._id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicsPanel;
