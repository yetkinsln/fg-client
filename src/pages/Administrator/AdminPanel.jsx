import { useEffect, useState } from "react";
import axios from "../../services/axios";
import "../../styles/AdminPanel.css";

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('admin_token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Silinemedi:", err);
    }
  };
  const toggleBan = async (userId, isBanned) => {
    try {

      const url = isBanned ? `/api/admin/unban/${userId}` : `/api/admin/ban/${userId}`;
      await axios.put(url, {});
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, isBanned: !isBanned } : user
      ));
    } catch (err) {
      console.error('Ban işlemi başarısız:', err);
    }
  };
  

  return (
    <div className="admin-panel">
      <h1>Kullanıcılar</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>Yetki</th>
            <th>İşlem</th>
            <th>Ban Durumu</th>
            <th>Banla/Kaldır</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Admin" : "Kullanıcı"}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                  Sil
                </button>
              </td>
              <td className="px-4 py-2 border">
  {user.isBanned ? 'Banlı' : 'Aktif'}
</td>
<td className="px-4 py-2 border">
  <button
    className={`px-3 py-1 rounded ${user.isBanned ? 'bg-green-500' : 'bg-red-500'} text-white`}
    onClick={() => toggleBan(user._id, user.isBanned)}
  >
    {user.isBanned ? 'Banı Kaldır' : 'Banla'}
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPanel;
