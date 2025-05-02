import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';

const PostsPanel = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const token = localStorage.getItem('admin_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const fetchPosts = async () => {
    try {
   
      const res = await axios.get('api/admin/posts');
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Postlar alınamadı');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Bu post silinsin mi?')) return;

    try {
 
      await axios.delete(`api/admin/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const banUser = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı banlamak istiyor musun?')) return;
  
    try {

      await axios.post(`api/admin/ban/${userId}`, {});
      alert('Kullanıcı banlandı.');
      // İstersen buradan sonra post listesini yeniden alabilirsin:
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.error || 'Ban işlemi başarısız.');
    }
  };
  const searchPosts = async () => {
    try {
   
      const res = await axios.get(`api/admin/posts?search=${encodeURIComponent(searchText)}`);
      setPosts(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Arama başarısız.');
    }
  };
  
  

  return (
    <div className="wwm-panel">
  <h1>Gönderiler</h1>
  {error && <p className="error">{error}</p>}

  <div className="wwm-search-bar">
    <input
      type="text"
      placeholder="İçerikte ara..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
    <button className="wwm-btn" onClick={searchPosts}>Ara</button>
  </div>

  <table className="wwm-table">
    <thead>
      <tr>
        <th>Post id</th>
        <th>Yazan</th>
        <th>Konu</th>
        <th>Tarih</th>
        <th>İşlem</th>
      </tr>
    </thead>
    <tbody>
      {posts.map(post => (
        <tr key={post._id}>
          <td>{post?.content}</td>
          <td>{post?.createdBy?.username || 'N/A'}</td>
          <td>{post?.topic?.title || 'N/A'}</td>
          <td>{new Date(post.createdAt).toLocaleString()}</td>
          <td>
            <button className="wwm-btn wwm-btn-secondary" onClick={() => setSelectedPost(post)}>İncele</button>
            <button className="wwm-btn wwm-btn-danger" onClick={() => deletePost(post._id)}>Sil</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {selectedPost && (
    <div className="wwm-modal">
      <div className="wwm-modal-content">
        <h2>Post Detayı</h2>
        <p dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button className="wwm-btn" onClick={() => setSelectedPost(null)}>Kapat</button>
          <button className="wwm-btn wwm-btn-danger" onClick={() => banUser(selectedPost.createdBy?._id)}>Banla</button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default PostsPanel;
