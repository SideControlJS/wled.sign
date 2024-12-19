# **LED Twitch Interactive Sign**

This project is a fully interactive LED sign designed to react to Twitch events such as subscriptions, follows, and donations. Built using WLED, Node.js, and a Raspberry Pi, the sign provides customizable lighting effects triggered by real-time Twitch events. This README provides detailed setup instructions for developers or users.

---

## **Features**
- Customizable LED effects for Twitch events:
  - **Subscriptions**: Rainbow animation.
  - **Donations**: Strobe effect with red color.
  - **Follows**: Glitter effect.
- Predefined presets for quick activation.
- WebSocket-based communication with the ESP32 running WLED.
- Node.js server to manage Twitch API integration and control the LED panels.
- Easily extendable for future features or additional effects.

---

## **Table of Contents**
1. [Requirements](#requirements)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)
8. [License](#license)

---

## **Requirements**
To set up and run this project, you’ll need the following:
- **Hardware**:
  - ESP32 microcontroller (running WLED).
  - Raspberry Pi 4 (2GB or 4GB recommended).
  - LED panels (e.g., WS2812B, 8x32 or 16x16 matrices).
  - 5V power supply (25A or higher, depending on LED configuration).
  - Level shifter (e.g., 74AHCT125) for 3.3V to 5V signal conversion.
- **Software**:
  - Node.js (v14 or higher).
  - NPM (Node Package Manager).
  - WLED firmware pre-installed on ESP32.
  - Twitch Developer credentials.

---

## **Project Structure**
led-sign-project/ 
├── server.js # Main entry point for the Node.js server 
├── twitch-api.js # Handles Twitch event integration 
├── routes/ 
│ └── wled.js # REST API routes for WLED 
├── package.json # Node.js project configuration 
├── .env # Environment variables (not included in the repository) 
├── .gitignore # Git ignore file for sensitive data 
└── README.md # Project documentation

---

## **Installation**
Follow these steps to set up and run the project:

### **Step 1: Clone the Repository**
```bash
git clone <your-repo-url>
cd led-sign-project

```
### **Step 2: Install Dependencies**
```bash
npm install

```
### **Step 3: Set Up the .env File**
Create a new .env file in the root directory and populate it with the following variables:

PORT=3000
ESP32_IP=192.168.1.100   # Replace with the IP of your ESP32
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_ACCESS_TOKEN=your_access_token
BROADCASTER_USER_ID=your_user_id
TWITCH_USERNAME=your_username

### **Step 4: Start the Server:**
```bash
node server.js
```

---

### **Configuration**
## **Twitch Setup**
1. Go to the Twitch Developer Console and register a new application
2. Set the following:
- Redirect URI: http://localhost:3000/auth/twitch/callback
- Scopes: channel:read:subscriptions, channel:read:redemptions, chat:read, chat:edit.
3. Generate a Twitch access token and add it to your .env file.

---

## **WLED Setup**
1. Flash the WLED firmware to your ESP32.
2. Connect the ESP32 to your WiFi network and note the IP address.
3. Configure the LED settings (number of LEDs, data pin, etc.) in the WLED web interface.

---

### **Usage**
## **Testing the Server**
1. Access the server locally.
- Open your browser and go to: http://localhost:3000.
- You should see: "LED Sign Node.js Server Running".
2. Test manual WLED controls:
- Send a POST request to /wled/effect:
```bash
curl -X POST http://localhost:3000/wled/effect \
-H "Content-Type: application/json" \
-d '{"effectId":1, "speed":128, "intensity":128}'
```
- This triggers the rainbow effect on your LEDs.

### **Customization**
## **Add New Twitch Event Triggers**
To handle new Twitch events:

1. Edit twitch-api.js and modify the handleTwitchEvent function:
```bash
function handleTwitchEvent(event) {
    if (event.type === 'channel.raid') {
        triggerWLEDEffect({ effect: 'fireworks', speed: 200 });
    }
}
```
## **Add New WLED Effects**
To trigger custom WLED effects:

1. Save a new preset in the WLED web interface.
2. Trigger the preset via the Node.js server:
```bash
axios.post(`http://${ESP32_IP}/json/state`, { ps: presetId });
```
### **Troubleshooting**
## **Common Issues**
1. ESP32 Not Responding:

- Check that the ESP32 is on the same network as the Raspberry Pi. Verify the IP address in the .env file.
2. Twitch Events Not Triggering:

- Ensure the Twitch access token has the correct scopes. Verify that the BROADCASTER_USER_ID matches the Twitch account you’re monitoring.

3. LEDs Flickering or Not Lighting:

- Ensure you’re using a level shifter for the data signal. Check that the power supply provides enough current for your LED panels.
### **License**
This project is licensed under the MIT License. 