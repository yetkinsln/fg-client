import React, { useState, useEffect } from "react";
import axios from "../../services/axios"; // axios instance
import "../../styles/MyPlayers.css";
import Navbar from "../main/navbar";
import Editor from "../player/simpleEditor";

const AddPlayer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]); // Liste olacak!
  const [selected, setSelected] = useState(null); // Seçilen oyuncu
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  

  useEffect(() => {
    const checkBanStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.isBanned) {
          alert('Hesabınız banlandığı için erişiminiz engellendi.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
  
      } catch (err) {
        console.error('Ban kontrolü hatası:', err.message);

      }
    };
  
    checkBanStatus();
  }, []);
  

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setResults([]);
    setError("");
    setSelected(null);

    try {
      const response = await fetch("https://fangang.pythonanywhere.com/api/dj/search/", { //http://127.0.0.1:8000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error("Veri alınamadı");

      const data = await response.json();
      // Her zaman dizi olsun
      const resultList = Array.isArray(data) ? data : [data];
      setResults(resultList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAddPlayer = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Giriş yapmalısınız.");
      return;
    }
    try {
      const response = await fetch("/api/player/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: selected.name,
          age: selected.age,
          team: selected.team,
          marketValue: selected.marketValue,
          transfermarktProfile: selected.transfermarktProfile,
          image: selected.image,
          comment: comment.slice(0, 1000),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Oyuncu başarıyla eklendi.");
        setComment(""); 
      } else {
        alert(data.error || "Hata oluştu.");
      }
    } catch (error) {
      alert("Sunucuya erişilemedi.", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="wwm-container">
        <h1>Oyuncu Ara</h1>
        <div className="wwm-search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Oyuncu ismi girin"
          />
          <button onClick={handleSearch}>Ara</button>
        </div>

        {loading && <p className="wwm-loading">Yükleniyor...</p>}
        {error && <p className="wwm-error">{error}</p>}

        {/* Sonuçlar: */}
        {!selected && results.length > 0 && (
          <div>
            <p>Oyuncular:</p>
            <div className="wwm-result-list">
              {results.map((player, idx) => (
                <div className="wwm-card" key={idx} onClick={() => setSelected(player)} style={{ cursor: "pointer" }}>
                  <img
                    src={player.image || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficrier.org%2Fwp-content%2Fuploads%2F2022%2F12%2Fmedia-Event-Image-Not-Found.jpg&f=1&nofb=1&ipt=7e75f15af6d54f6909bbb39e59f66e217d425eeedc9f11e8ef50e43ad150daf5"}
                    alt={player.name}
                    className="player-image"
                  />
                  <h2>{player.name}</h2>
                  <ul>
                    <li><strong>Yaş:</strong> {player.age}</li>
                    <li><strong>Takım:</strong> {player.team}</li>
                    <li><strong>Piyasa Değeri:</strong> {player.marketValue}</li>
                  </ul>
                  {player.transfermarktProfile && (
                    <div className="wwm-links">
                      <a
                        href={player.transfermarktProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wwm-link"
                        onClick={e => e.stopPropagation()} // link tıklanınca seçilmesin
                      >
                        Transfermarkt Profiline Git →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oyuncu seçilince detaylar ve ekleme */}
        {selected && (
          <div className="wwm-card">
            <img
              src={selected.image || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficrier.org%2Fwp-content%2Fuploads%2F2022%2F12%2Fmedia-Event-Image-Not-Found.jpg&f=1&nofb=1&ipt=7e75f15af6d54f6909bbb39e59f66e217d425eeedc9f11e8ef50e43ad150daf5"}
              alt={selected.name}
              className="player-image"
            />
            <h2>{selected.name}</h2>
            <ul>
              <li><strong>Yaş:</strong> {selected.age}</li>
              <li><strong>Takım:</strong> {selected.team}</li>
              <li><strong>Piyasa Değeri:</strong> {selected.marketValue}</li>
            </ul>
            {selected.transfermarktProfile && (
              <div className="wwm-links">
                <a
                  href={selected.transfermarktProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wwm-link"
                >
                  Transfermarkt Profiline Git →
                </a>
                <button className="wwm-link" onClick={handleAddPlayer}>
                  Oyuncuyu Ekle
                </button>
              </div>
            )}

            <Editor
              value={comment}
              onChange={setComment}
              placeholder="Yorumunuzu buraya yazın..."
            />

            <button style={{marginTop: 10}} onClick={() => setSelected(null)}>
              Oyuncu Seçimini İptal Et
            </button>
          </div>
        )}

        {!selected && results.length === 0 && !loading && (
          <p className="wwm-info">Lütfen bir oyuncu arayın.</p>
        )}
      </div>
    </>
  );
};

export default AddPlayer;