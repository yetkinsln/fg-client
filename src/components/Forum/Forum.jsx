import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import '../../styles/Forum.css'
import Navbar from '../main/navbar';

function Forum() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBanStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const res = await axios.get('api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.data.isBanned) {
          alert('Hesabınız banlandığı için erişiminiz engellendi.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
  
      } catch (err) {
        console.error('Ban kontrolü hatası:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };
  
    checkBanStatus();
  }, []);
  

  useEffect(() => {
    async function fetchTopics() {
      const res = await axios.get('/api/topics', { withCredentials: true });
      setTopics(res.data);
    }
    fetchTopics();
  }, []);

  const handleTopicClick = (id, title) => {
    navigate(`/topics/${id}`, { state: { topicTitle: title } });
  };

  return (
   <>
   <Navbar></Navbar>
    <div className="forum">
  <h1 className="forum-title">Forum</h1>
  {topics.map((topic) => (
    <div key={topic._id} className="forum-topic" onClick={() => handleTopicClick(topic._id, topic.title)}>
      <h2 className="topic-title">{topic.title}</h2>
      <p className="topic-description">{topic.description}</p>
    </div>
  ))}
</div>
   </>
  );
}

export default Forum;
