const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for communities
const communities = [];

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Community routes
app.get('/api/communities', (req, res) => {
    res.json(communities);
});

app.post('/api/communities', (req, res) => {
    const { name, creator } = req.body;
    const code = Math.random().toString(36).substring(7);
    const newCommunity = { 
        id: communities.length + 1, 
        name, 
        code, 
        creator,
        members: [creator] // Add creator as first member
    };
    communities.push(newCommunity);
    res.json(newCommunity);
});

app.post('/api/communities/join', (req, res) => {
    const { code, memberName } = req.body;
    const community = communities.find(c => c.code === code);
    if (!community) {
        return res.status(404).json({ message: 'Community not found' });
    }
    community.members.push(memberName);
    res.json(community);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 