import React, { useEffect, useState } from 'react';
import Navbar from '../main/navbar';
import Editor from './simpleEditor'; // Burayı doğru pathe göre ayarla
import "../../styles/mp.css"; // CSS dosyasını doğru pathe göre ayarla
import axios from '../../services/axios'; // axios'u doğru pathe göre ayarla

const MyPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    
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
        const fetchPlayers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Giriş yapmalısınız.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://fg-express.onrender.com/api/player/my-players', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setPlayers(data);
                } else {
                    setError(data.error || 'Hata oluştu.');
                }
            } catch (error) {
                setError('Sunucuya erişilemedi. ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    const handleDelete = async (playerId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Giriş yapmalısınız.');
            return;
        }

        const confirmDelete = window.confirm("Bu oyuncuyu silmek istediğinize emin misiniz?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://fg-express.onrender.com/api/player/delete/${playerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setPlayers(players.filter(player => player._id !== playerId));
            } else {
                alert(data.error || 'Silme işlemi başarısız.');
            }
        } catch (error) {
            alert('Sunucuya erişilemedi. ' + error.message);
        }
    };

    const handleSaveComment = async (playerId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Giriş yapmalısınız.');
            return;
        }

        try { //'/players/update-comment/:id'
            const response = await fetch(`https://fg-express.onrender.com/api/player/update-comment/${playerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: editedComment }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Yorum güncellendi.');
                setPlayers(players.map(player => 
                    player._id === playerId ? { ...player, comment: editedComment } : player
                ));
                setEditingPlayerId(null);
                setEditedComment('');
            } else {
                alert(data.error || 'Yorum güncelleme başarısız.');
            }
        } catch (error) {
            alert('Sunucuya erişilemedi. ' + error.message);
        }
    };

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <>
            <Navbar />
            <div className="wwm-container">
                <h1>Eklediğiniz Oyuncular</h1>

                {error && <p className="wwm-error">{error}</p>}

                {players.length > 0 ? (
                    <div className="wwm-grid">
                        {players.map((player) => (
                            <div key={player._id} className="wwm-card">
                                <div className="player-image-container">
                                    <img
                                        src={player.image || 'https://via.placeholder.com/150'}
                                        alt={player.fullName}
                                        className="player-image"
                                    />
                                </div>
                                <div className="player-info">
                                    <h2>{player.Name}</h2>
                                    <ul>
                                        <li><strong>Yaş:</strong> {player.age}</li>
                                        <li><strong>Takım:</strong> {player.team}</li>
                                        <li><strong>Piyasa Değeri:</strong> {player.marketValue}</li>
                                        <li><strong>fanGang Piyasa Değeri:</strong> {player.fangangValue}</li>
                                    </ul>

                                    <div className="player-comment-container">
                                        <h3>Oyuncu Yorumu</h3>
                                        {editingPlayerId === player._id ? (
                                            <>
                                                <Editor
                                                    value={editedComment}
                                                    onChange={(html) => setEditedComment(html)}
                                                    placeholder="Yorumunuzu buraya yazın..."
                                                />
                                                <div style={{ marginTop: "10px" }}>
                                                    <button
                                                        className="save-btn"
                                                        onClick={() => handleSaveComment(player._id)}
                                                    >
                                                        Kaydet
                                                    </button>
                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() => {
                                                            setEditingPlayerId(null);
                                                            setEditedComment('');
                                                        }}
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            player.comment ? (
                                                <div
                                                    className="comment-preview"
                                                    dangerouslySetInnerHTML={{ __html: player.comment }}
                                                />
                                            ) : (
                                                <p>Yorum bulunmuyor.</p>
                                            )
                                        )}
                                    </div>

                                    <div className="player-actions">
                                        {editingPlayerId === player._id ? null : (
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setEditingPlayerId(player._id);
                                                    setEditedComment(player.comment || '');
                                                }}
                                            >
                                                Düzenle
                                            </button>
                                        )}
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(player._id)}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Henüz oyuncu eklenmemiş.</p>
                )}
            </div>
        </>
    );
};

export default MyPlayers;
