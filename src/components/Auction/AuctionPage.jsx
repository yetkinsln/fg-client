import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../services/axios';
import Navbar from '../main/navbar';
import '../../styles/auctionPage.css';
import { useParams } from 'react-router-dom';

const AuctionPage = () => {
  const { id } = useParams();
  const [query, setQuery] = useState(id || '');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
  
  
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace('.', ',') + 'm€';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k€';
    } else {
      return value + '€';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = useCallback(async (searchQuery = null) => {
    // Use the provided searchQuery or fall back to the state value
    const queryToSearch = searchQuery !== null ? searchQuery : query;
    
    if (!queryToSearch.trim()) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/auction/search?query=${queryToSearch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(response.data);
    } catch (err) {
      console.error('Arama hatası:', err);
      setError(err.response?.data?.error || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleBid = async (playerId, operation) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/auction/bid/${playerId}`, { operation }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlayers(players.map(player =>
        player._id === playerId ? { ...response.data.player, userLimits: response.data.limits } : player
      ));

      setMessage(`${response.data.message} Kalan Artırma Limiti: ${formatCurrency(response.data.limits.increaseLimit)}`);

    } catch (err) {
      console.error('İşlem hatası:', err);
      setError(err.response?.data?.error || 'Bir hata oluştu.');
    }
  };

  // Run search on initial load if id is provided
  useEffect(() => {
    if (id) {
      handleSearch(id);
    }
  }, [id, handleSearch]);

  return (
    <>
      <Navbar />
      <div className="wwm-auction-page">
        <h1 className="wwm-auction-title">Müzayede Alanı</h1>

        <div className="wwm-auction-search">
          <input
            type="text"
            className="wwm-auction-input"
            placeholder="Oyuncu ismi ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={() => handleSearch()}
            className="wwm-auction-button"
            disabled={loading}
          >
            {loading ? <div className="wwm-spinner"></div> : 'Ara'}
          </button>
        </div>

        {error && <p className="wwm-auction-error">{error}</p>}
        {message && <p className="wwm-auction-success">{message}</p>}

        {players.length > 0 ? (
          <div className="wwm-auction-grid">
            {players.map(player => (
              <div key={player._id} className="wwm-auction-card">
                <div className="wwm-player-image-container">
                  <img
                    src={player.image || 'https://via.placeholder.com/150'}
                    alt={player.fullName || player.Name}
                    className="wwm-player-image"
                  />
                </div>

                <div className="wwm-player-info">
                  <h2 className="wwm-player-name">{player.Name}</h2>
                  <div className="neon-div">
                    <div className="neon-border"></div>
                    <div className="neon-glow"></div>
                    
                    <p className="wwm-added-by">
                      <small className="wwm-addedby-small">Ekleyen:</small> {player.addedBy}
                      <small className="wwm-level">{player.addedByLevel}</small>
                    </p>
                  </div>

                  <ul className="wwm-player-details">
                    <li><strong>Yaş:</strong> {player.age}</li>
                    <li><strong>Takım:</strong> {player.team}</li>
                    <li><strong>TM Piyasa Değeri:</strong> {player.marketValue}</li>
                    <li className="wwm-fangang-value animate-glow">
                      <strong>FanGang Değeri:</strong> {formatCurrency(player.fangangValue)}
                    </li>
                  </ul>

                  <div className="wwm-player-actions">
                    <button
                      className="wwm-increase-btn animate-bounce"
                      onClick={() => handleBid(player._id, 'increase')}
                    >
                      Artır
                    </button>
                    <button
                      className="wwm-decrease-btn animate-bounce"
                      onClick={() => handleBid(player._id, 'decrease')}
                    >
                      Azalt
                    </button>
                  </div>

                  <div className="wwm-player-comment">
                    <h3>Oyuncu Yorumu</h3>
                    {player.comment ? (
                      <div
                        className="wwm-comment-content"
                        dangerouslySetInnerHTML={{ __html: player.comment }}
                      />
                    ) : (
                      <p>Yorum bulunmuyor.</p>
                    )}
                  </div>

                  {player.userLimits && (
                    <div className="wwm-player-limits">
                      <p><strong>Kalan Artırma Limiti:</strong> {formatCurrency(player.userLimits.increaseLimit)}</p>
                      <p><strong>Kalan Azaltma Limiti:</strong> {formatCurrency(player.userLimits.decreaseLimit)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="wwm-no-player">Oyuncu bulunamadı.</p>
        )}
      </div>
    </>
  );
};

export default AuctionPage;