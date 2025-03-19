import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecyclingRounded, GroupAdd, JoinFull, People, EmojiPeople, Close, LocalShipping } from '@mui/icons-material';
import './App.css';

function App() {
  const [communities, setCommunities] = useState([]);
  const [communityName, setCommunityName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [memberStatuses, setMemberStatuses] = useState({});

  useEffect(() => {
    document.title = 'Reflow - Sustainable Communities';
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = () => {
    fetch('http://localhost:5000/api/communities')
      .then(res => res.json())
      .then(data => setCommunities(data))
      .catch(err => console.error('Error:', err));
  };

  const createCommunity = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: communityName,
        creator: creatorName 
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCommunities([...communities, data]);
        setCommunityName('');
        setCreatorName('');
        showSuccessNotification('🌱 Community created successfully!');
      })
      .catch(err => console.error('Error:', err));
  };

  const joinCommunity = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/communities/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: joinCode, 
        memberName
      }),
    })
      .then(res => res.json())
      .then(data => {
        const updatedCommunities = communities.map(c => 
          c.code === data.code ? data : c
        );
        setCommunities(updatedCommunities);
        setJoinCode('');
        setMemberName('');
        showSuccessNotification('🤝 Successfully joined the community!');
      })
      .catch(err => console.error('Error:', err));
  };

  const showSuccessNotification = (message) => {
    setNotifications(prev => [...prev, { message, id: Date.now() }]);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
    setShowModal(true);
  };

  const handleStatusChange = (memberName) => {
    setMemberStatuses(prev => ({
      ...prev,
      [memberName]: !prev[memberName]
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCommunity(null);
  };

  const getCommunitiesNeedingPickup = () => {
    return communities.filter(community => 
      community.members.some(member => memberStatuses[member])
    );
  };

  return (
    <div className="App">
      <AnimatePresence>
        {showNotification && notifications.length > 0 && (
          <motion.div 
            className="notification"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {notifications[notifications.length - 1].message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RecyclingRounded className="logo" />
        <h1>Reflow <span className="world-emoji">🌍</span></h1>
        <p className="subtitle">Building sustainable communities together <span className="plant-emoji">🌱</span></p>
      </motion.div>

      <div className="tabs">
        <motion.button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GroupAdd /> Create Community
        </motion.button>
        <motion.button 
          className={`tab ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <JoinFull /> Join Community
        </motion.button>
      </div>

      <motion.div 
        className="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div 
              key="create"
              className="form-section"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h2><GroupAdd /> Create Eco-Community <span className="leaf-emoji">🌿</span></h2>
              <p className="form-description">Start a new community to manage waste and promote sustainability</p>
              <form onSubmit={createCommunity}>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  placeholder="Community Name 🏡"
                  required
                />
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Your Name (Creator) 👤"
                  required
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Community 🚀
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="join"
              className="form-section"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <h2><JoinFull /> Join Eco-Community <span className="handshake-emoji">🤝</span></h2>
              <p className="form-description">Join an existing community to contribute to waste management</p>
              <form onSubmit={joinCommunity}>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Community Code 🔑"
                  required
                />
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Your Name 👤"
                  required
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Community 🚀
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="pickup-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2><LocalShipping /> Communities Needing Pickup <span className="truck-emoji">🚛</span></h2>
          <div className="pickup-grid">
            {getCommunitiesNeedingPickup().map(community => (
              <motion.div 
                key={community.id} 
                className="pickup-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleCommunityClick(community)}
              >
                <h3>{community.name} <span className="plant-emoji">🌱</span></h3>
                <div className="pickup-info">
                  <p className="code">Code: {community.code} <span className="key-emoji">🔑</span></p>
                  <p className="creator">Created by: {community.creator || 'Unknown'} <span className="crown-emoji">👑</span></p>
                  <div className="needs-pickup-section">
                    <h4>Members Needing Pickup <span className="truck-emoji">🚛</span></h4>
                    <ul>
                      {community.members
                        .filter(member => memberStatuses[member])
                        .map((member, index) => (
                          <motion.li 
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="pickup-member-item"
                          >
                            <span className="member-info">
                              <EmojiPeople /> {member}
                            </span>
                          </motion.li>
                        ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
            {getCommunitiesNeedingPickup().length === 0 && (
              <motion.div 
                className="no-pickup-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p>No communities currently need pickup <span className="check-emoji">✅</span></p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="communities-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2><People /> Active Communities <span className="star-emoji">🌟</span></h2>
          <div className="communities-grid">
            {communities.map(community => (
              <motion.div 
                key={community.id} 
                className="community-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleCommunityClick(community)}
              >
                <h3>{community.name} <span className="plant-emoji">🌱</span></h3>
                <div className="community-info">
                  <p className="code">Code: {community.code} <span className="key-emoji">🔑</span></p>
                  <p className="creator">Created by: {community.creator || 'Unknown'} <span className="crown-emoji">👑</span></p>
                  <div className="members-section">
                    <h4>Community Members <span className="people-emoji">👥</span></h4>
                    <ul>
                      {community.members.map((member, index) => (
                        <motion.li 
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="member-item"
                        >
                          <span className="member-info">
                            <EmojiPeople /> {member}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && selectedCommunity && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="modal-header">
                <h2>{selectedCommunity.name} - Member Status</h2>
                <button className="close-button" onClick={closeModal}>
                  <Close />
                </button>
              </div>
              <div className="modal-content">
                <div className="status-list">
                  {selectedCommunity.members.map((member, index) => (
                    <motion.div 
                      key={index}
                      className="status-item"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="member-name">
                        <EmojiPeople /> {member}
                      </span>
                      <div className="status-toggle">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={memberStatuses[member] || false}
                            onChange={() => handleStatusChange(member)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className="status-label">
                          {memberStatuses[member] ? '🚛 Pickup Needed' : '✅ No Pickup'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
