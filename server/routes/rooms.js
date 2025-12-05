const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// InMemory store for rooms (for simplicity, could use Redis/DB)
const rooms = {};

// Create a new room
router.post('/', (req, res) => {
    const roomId = uuidv4();
    rooms[roomId] = {
        id: roomId,
        createdAt: new Date(),
        language: 'javascript', // Default language
        code: '// Start coding here'
    };
    res.json({ roomId });
});

// Get room details
router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (rooms[id]) {
        res.json(rooms[id]);
    } else {
        // For this demo, we can also auto-create if it doesn't exist or return 404
        // Returning 404 is cleaner
        res.status(404).json({ error: 'Room not found' });
    }
});

module.exports = router;
