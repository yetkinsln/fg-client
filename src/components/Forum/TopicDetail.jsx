import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import axios from '../../services/axios';
import '../../styles/TopicDetail.css'
import Navbar from '../main/navbar';

function TopicDetail() {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const token = getToken()
  const location = useLocation();
  const topicTitle = location.state?.topicTitle || "Konu";
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


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
    async function fetchPosts() {
      const res = await axios.get(`api/posts/${topicId}`, { withCredentials: true });
      setPosts(res.data);
    }
    fetchPosts();
  }, [topicId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPostContent.trim() === '') return;
    await axios.post('api/posts', { topicId, content: newPostContent }, { withCredentials: true });
    setNewPostContent('');
    const res = await axios.get(`api/posts/${topicId}`,{ withCredentials: true });
    setPosts(res.data);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  

return (
  <>
  <Navbar></Navbar>
  
  <div className="topic-detail">
    <div className="content-wrapper">
    <h1 className="topic-title">{topicTitle}</h1>
    <hr />
    {!posts.length && <div className="no-posts">Bu konuda henüz gönderi yok.</div>}

    <form onSubmit={handleSubmit} className="post-form">
        <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Gönderinizi yazın..."
            className="post-textarea"
            rows="4"
        />
        <button type="submit" className="post-button">Gönder</button>
    </form>

    <div className="post-list">
        {posts.map((post) => (
            <div key={post._id} className="post-item">
                
                <p className="post-content"><span className="post-author">{post.createdBy?.username || "Anonim"}: </span>{post.content} </p>
                <small className='post-date'>{formatDate(post.createdAt)}</small>

                <div className="post-footer">
                {/* <button className="like-button" onClick={() => handleLike(post._id)}>❤️ {post.likes?.length || 0}</button> */}
                  
                </div>
            </div>
        ))}
        </div>
    </div>
</div>

  </>
);
}

export default TopicDetail;
