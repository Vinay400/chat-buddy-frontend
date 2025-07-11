# Chat Buddy

Chat Buddy is a real-time chat application that enables seamless communication between users. It supports multiple chat rooms, allowing users to join or create rooms for group conversations. The project is built using HTML, CSS, and JavaScript for the frontend, with WebSockets for real-time messaging and MongoDB as the database for storing user and message data.

## Features

- Real-time messaging using WebSockets
- Multiple chat rooms (room feature)
- User-friendly interface
- Persistent message storage with MongoDB
- Responsive design for desktop and mobile

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Real-time Communication:** WebSockets
- **Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-application-frontend
   ```
2. Install dependencies (if applicable):
   ```bash
   npm install
   ```
3. Set up your backend server (ensure it connects to MongoDB and handles WebSocket connections).
4. Update the frontend WebSocket URL in `main.js` if needed.
5. Start the backend server.
6. Open `public/index.html` in your browser to use the chat application.

## Usage
- Enter a username and select or create a chat room to join.
- Start chatting in real time with other users in the same room.
- Messages are stored in MongoDB for persistence.

## Project Structure
```
public/
  images/           # App icons and images
  index.html        # Main HTML file
  main.js           # Frontend JavaScript logic
  manifest.json     # PWA manifest
  style.css         # Stylesheet
```
