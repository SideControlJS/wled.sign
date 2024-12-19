const axios = require('axios');
const WebSocket = require('ws');

let ws;

// Connect to WLED WebSocket
function connectWLEDWebSocket() {
    const ESP32_IP = process.env.ESP32_IP;
    ws = new WebSocket(`ws://${ESP32_IP}/wled/ws`);

    ws.on('open', () => {
        console.log('Connected to WLED WebSocket');
    });

    ws.on('error', (err) => {
        console.error('WLED WebSocket Error:', err);
    });

    ws.on('close', () => {
        console.log('WLED WebSocket Closed');
    });
}

// Trigger WLED Effects
function triggerWLEDEffect(effect) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ command: 'effect', effect }));
    } else {
        console.error('WLED WebSocket is not open. Cannot trigger WLED effect.');
    }
}

// Start Twitch Listener
async function startTwitchListener() {
    const TWITCH_USERNAME = process.env.TWITCH_USERNAME;
  
    // Simulated Twitch Events (replace with actual API listener)
    setInterval(() => {
      console.log('Listening for Twitch events...');
  
      const simulatedEvent = {
        type: 'subscription',
        user: 'example_user'
      };
  
      handleTwitchEvent(simulatedEvent);
    }, 15000);
  }
  
  // Handle Twitch Events
  function handleTwitchEvent(event) {
    console.log('Twitch Event Received:', event);
  
    switch (event.type) {
      case 'subscription':
        triggerWLEDEffect({ effect: 'rainbow', speed: 50 });
        break;
  
      case 'donation':
        triggerWLEDEffect({ effect: 'strobe', color: [255, 0, 0] });
        break;
  
      default:
        console.log('Unhandled event:', event);
    }
  }
  
  module.exports = { startTwitchListener };