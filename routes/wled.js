const express = require('express');
const axios = require('axios');

const router = express.Router();
const ESP32_IP = process.env.ESP32_IP;

// Trigger a WLED Preset
router.post('/preset', async (req, res) => {
    const { presetId } = req.body;

    try {
        const response = await axios.post(`http://${ESP32_IP}/json/state`, {
            ps: presetId
        });
        res.status(200).json({ message: `Preset ${presetId} triggered`, data: response.data });
    } catch (err) {
        console.error('Error triggering preset:', err);
        res.status(500).json({ message: 'Failed to trigger preset', error: err.message });
    }
});

// Trigger a WLED Effect (for advanced custom use)
router.post('/effect', async (req, res) => {
    const { effectId, speed, intensity } = req.body;

    try {
        const response = await axios.post(`http://${ESP32_IP}/json/state`, {
            seg: [{ fx: effectId, sx: speed || 128, ix: intensity || 128 }]
        });
        res.status(200).json({ message: `Effect ${effectId} triggered`, data: response.data });
    } catch (err) {
        console.error('Error triggering effect:', err);
        res.status(500).json({ message: 'Failed to trigger effect', error: err.message });
    }
});

module.exports = router;

