Chat Buddy is a simple, real-time web-based chat application that allows users to communicate instantly with each other. The app uses WebSockets for live communication, and MongoDB to store chat histories and user information persistently.

This app is built with simple HTML, CSS for front-end styling, WebSockets for real-time interaction, and MongoDB as the database to store data.

Features
Real-Time Messaging: Instant messaging between users using WebSockets for low-latency communication.

User Profiles: Allows users to set up profiles and communicate with others in real-time.

Persistent Chat History: Chat logs are stored in a MongoDB database, ensuring messages persist across sessions.

Simple and Clean UI: Designed with simple HTML and CSS to offer a smooth user experience.

Technologies Used
Frontend:

HTML5

CSS3

JavaScript (for WebSocket interaction)

Backend:

WebSocket API (for real-time communication)

Node.js (for backend server)

Express.js (for server setup)

Database:

MongoDB (for persistent data storage)

Installation
To get the app running locally, follow these steps:

Prerequisites
Node.js and npm installed on your system

MongoDB instance running (locally or on MongoDB Atlas)

Steps
Clone this repository:

bash
Copy
Edit
git clone https://github.com/yourusername/chat-buddy.git
cd chat-buddy
Install the required dependencies:

bash
Copy
Edit
npm install
Set up MongoDB:

Create a MongoDB database or use MongoDB Atlas to get a cloud database URL.

Add your MongoDB URI into the config.js file (inside the backend folder).

Run the application:

bash
Copy
Edit
npm start
Open the app in your browser:

Navigate to http://localhost:3000 to start using the chat app.

File Structure
graphql
Copy
Edit
chat-buddy/
│
├── public/                   # Static files (HTML, CSS, JS)
│   ├── index.html            # Main HTML file
│   ├── styles.css            # CSS file for styling
│   └── script.js             # JavaScript for WebSocket interaction
│
├── server/                   # Backend files
│   ├── app.js                # Main server file (Express & WebSocket setup)
│   ├── config.js             # MongoDB connection configuration
│   └── models/               # Mongoose models for MongoDB
│       └── message.js        # Message schema for MongoDB
│
├── .env                      # Environment variables (e.g., MongoDB URI)
├── package.json              # Project dependencies
└── README.md                 # Project documentation
How It Works
1. WebSocket Communication
The front-end connects to the WebSocket server (ws://localhost:3000).

Whenever a user sends a message, the message is broadcast to all connected clients in real-time.

Each message is stored in the MongoDB database to ensure persistence.

2. MongoDB for Persistent Data
User Information: Store user details such as usernames, profile images, etc.

Chat History: All messages are saved in the MongoDB database under the messages collection.

3. Front-End Design
The user interface is created using simple HTML and styled with CSS.

JavaScript is used to handle the WebSocket connection, send and receive messages, and dynamically update the chat interface.

MongoDB Setup
Create a MongoDB Database:

Create a new database on MongoDB Atlas or run MongoDB locally.

Store the database URI in a .env file to keep it secure.

MongoDB URI Format:

For local MongoDB:

bash
Copy
Edit
mongodb://localhost:27017/chat_buddy
For MongoDB Atlas:

bash
Copy
Edit
mongodb+srv://<username>:<password>@cluster0.mongodb.net/chat_buddy?retryWrites=true&w=majority
Contributing
We welcome contributions to make Chat Buddy better! Here’s how you can help:

Fork this repository

Create a new branch for your feature (git checkout -b feature-name)

Commit your changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature-name)

Create a new Pull Request

