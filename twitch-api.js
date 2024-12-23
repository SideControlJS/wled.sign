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

// Trigger WLED Preset
function triggerWLEDPreset(presetId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ ps: presetId })); // Send preset ID to WLED
    } else {
        console.error('WLED WebSocket is not open. Cannot trigger WLED preset.');
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
                topics: [
                    `channel-subscribe-events-v1.${BROADCASTER_USER_ID}`,
                    `channel-bits-events-v2.${BROADCASTER_USER_ID}`,
                    `channel-points-channel-v1.${BROADCASTER_USER_ID}`,
                    `hype-train-events-v1.${BROADCASTER_USER_ID}`
                ],
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

    // Map Twitch events to WLED preset IDs
    if (event.type === 'channel-subscribe-events-v1') {
        console.log('Subscription Event:', event);
        triggerWLEDPreset(1); // Example: Preset ID 1 for subscriptions
    } else if (event.type === 'channel-bits-events-v2') {
        console.log('Cheer (Bits) Event:', event);
        triggerWLEDPreset(2); // Example: Preset ID 2 for bits
    } else if (event.type === 'channel-points-channel-v1') {
        console.log('Channel Points Redemption Event:', event);
        triggerWLEDPreset(3); // Example: Preset ID 3 for channel points
    } else if (event.type === 'hype-train-events-v1') {
        console.log('Hype Train Event:', event);
        triggerWLEDPreset(4); // Example: Preset ID 4 for hype train
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

