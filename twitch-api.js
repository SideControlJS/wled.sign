const WebSocket = require('ws');

let ws; // WLED WebSocket
let twitchWs; // Twitch PubSub WebSocket

// Connect to WLED WebSocket
function connectWLEDWebSocket() {
    const ESP32_IP = process.env.ESP32_IP;
    ws = new WebSocket(`ws://${ESP32_IP}/ws`);

    ws.on('open', () => {
        console.log('Connected to WLED WebSocket');
    });

    ws.on('error', (err) => {
        console.error('WLED WebSocket Error:', err);
    });

    ws.on('close', () => {
        console.log('WLED WebSocket Closed. Reconnecting...');
        setTimeout(connectWLEDWebSocket, 5000); // Reconnect if closed
    });
}

// Trigger WLED Effects
function triggerWLEDEffect(effect) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(effect));
    } else {
        console.error('WLED WebSocket is not open. Cannot trigger WLED effect.');
    }
}

// Connect to Twitch PubSub WebSocket
function connectTwitchPubSub() {
    const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;
    const BROADCASTER_USER_ID = process.env.BROADCASTER_USER_ID;

    twitchWs = new WebSocket('wss://pubsub-edge.twitch.tv');

    twitchWs.on('open', () => {
        console.log('Connected to Twitch PubSub');
        twitchWs.send(JSON.stringify({
            type: 'LISTEN',
            nonce: 'randomstring',
            data: {
                topics: [`channel-subscribe-events-v1.${BROADCASTER_USER_ID}`],
                auth_token: TWITCH_ACCESS_TOKEN
            }
        }));
    });

    twitchWs.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'MESSAGE') {
            const eventData = JSON.parse(parsedMessage.data.message);
            handleTwitchEvent(eventData);
        } else if (parsedMessage.type === 'RECONNECT') {
            console.log('Twitch PubSub requested reconnecting.');
            twitchWs.close();
        }
    });

    twitchWs.on('error', (err) => {
        console.error('Twitch PubSub Error:', err);
    });

    twitchWs.on('close', () => {
        console.log('Twitch PubSub connection closed. Reconnecting...');
        setTimeout(connectTwitchPubSub, 5000);
    });
}

// Handle Twitch Events
function handleTwitchEvent(event) {
    console.log('Twitch Event Received:', event);

    // Check the event type and trigger corresponding effects
    if (event.context === 'sub') {
        // Subscription event
        triggerWLEDEffect({ effect: 'rainbow', speed: 50 });
    } else if (event.context === 'cheer') {
        // Cheer (bits) event
        triggerWLEDEffect({ effect: 'strobe', color: [255, 0, 0] });
    } else if (event.context === 'follow') {
        // Follow event
        triggerWLEDEffect({ effect: 'glitter', color: [0, 255, 0] });
    } else {
        console.log('Unhandled event:', event);
    }
}

// Start Twitch Listener
function startTwitchListener() {
    connectWLEDWebSocket(); // Connect to WLED
    connectTwitchPubSub(); // Connect to Twitch PubSub
}

module.exports = { startTwitchListener };
