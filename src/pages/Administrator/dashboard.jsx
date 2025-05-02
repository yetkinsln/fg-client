import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import '../../styles/AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    async function fetchData() {
      try {
        const [userRes, topicRes, postRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/topics'),
          axios.get('/api/admin/posts'),
        ]);

        setUsers(userRes.data);
        setTopics(topicRes.data);
        setPosts(postRes.data);
      } catch (err) {
        console.error('Veriler alınamadı', err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>

      <a href="/admin/users" className="admin-link">

      <section>
        <h2>Kullanıcılar ({users.length})</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.username} - {user.email}</li>
          ))}
        </ul>
      </section>
      </a>

      <a href="/admin/topics">
      <section>
        <h2>Konular ({topics.length})</h2>
        <ul>
          {topics.map(topic => (
            <li key={topic._id}>{topic.title}</li>
          ))}
        </ul>
      </section>


      </a>
     <a href="/admin/posts">
     <section>
        <h2>Gönderiler ({posts.length})</h2>
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              {post.content.slice(0, 50)}... - {post?.createdBy?.username || "Anonim"}
            </li>
          ))}
        </ul>
      </section>

     </a>
    </div>
  );
}

export default AdminDashboard;
