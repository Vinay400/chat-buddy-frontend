const socket = io("https://chat-buddy-g53x.onrender.com/", {
  autoConnect: false, // Prevent auto-connection; connect only after authentication
});
const BACKEND_URL = "https://chat-buddy-g53x.onrender.com";
console.log("Socket initialized, autoConnect: false");
const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const feedbackElement = document.getElementById("feedback");

const authSection = document.getElementById("auth-section");
const chatSection = document.getElementById("chat-section");
const authUsernameInput = document.getElementById("auth-username");
const authPasswordInput = document.getElementById("auth-password");
const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const authMessage = document.getElementById("auth-message");

// New Room Elements
const roomInput = document.getElementById("room-input");
const joinRoomButton = document.getElementById("join-room-button");
const currentRoomSpan = document.getElementById("current-room");
const roomList = document.getElementById("room-list");

// New Modal Elements
const roomsModal = document.getElementById("rooms-modal");
const openRoomsModalButton = document.getElementById("open-rooms-modal-button");
const closeButton = roomsModal.querySelector(".close-button");

messageContainer.innerHTML = "";

// Hide room modal and button by default on page load
openRoomsModalButton.style.display = "none";
roomsModal.style.display = "none";

// --- Authentication Logic ---
async function authenticate(endpoint) {
  const username = authUsernameInput.value.trim();
  const password = authPasswordInput.value.trim();

  if (!username || !password) {
    authMessage.innerText = "Please enter both username and password.";
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      authMessage.innerText = data.message;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username); // Store username for display
        initChat(username);
      }
    } else {
      authMessage.innerText = data.message || "Authentication failed.";
    }
  } catch (error) {
    console.error("Authentication error:", error);
    authMessage.innerText = "Network error or server unavailable.";
  }
}

registerButton.addEventListener("click", () => authenticate("register"));
loginButton.addEventListener("click", () => authenticate("login"));
logoutButton.addEventListener("click", () => logout());

function initChat(username) {
  nameInput.value = username; // Set the name input to the authenticated username
  authSection.style.display = "none";
  chatSection.style.display = "flex";
  openRoomsModalButton.style.display = "inline-block";
  roomsModal.style.display = "none"; // Ensure modal is hidden on chat init

  // Pass token in the query for Socket.IO authentication
  socket.auth = { token: localStorage.getItem("token") };
  console.log(
    "Attempting to connect socket with token:",
    socket.auth.token ? "present" : "missing"
  );
  socket.connect(); // Connect only after setting auth token

  socket.on("connect", () => {
    console.log("Socket connected successfully!", socket.id);
    socket.emit("get-rooms");
    socket.emit("join-room", "general");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    authMessage.innerText = `Socket connection error: ${err.message}. Please try logging in again.`;
    logout(); // Force logout on connection error
  });

  scrollToBottom(); // Initial scroll to bottom after chat is displayed
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  socket.disconnect(); // Disconnect socket on logout
  authSection.style.display = "block";
  chatSection.style.display = "none";
  openRoomsModalButton.style.display = "none";
  roomsModal.style.display = "none"; // Hide modal if logging out
  authMessage.innerText = ""; // Clear any auth messages
  authUsernameInput.value = "";
  authPasswordInput.value = "";
  messageContainer.innerHTML = ""; // Clear chat messages
  clientsTotal.innerText = "Total clients: 0"; // Reset client count
}

// Check for existing token on page load
const token = localStorage.getItem("token");
const storedUsername = localStorage.getItem("username");
if (token && storedUsername) {
  // Attempt to connect socket with existing token
  socket.auth = { token: token };
  socket.connect();
  initChat(storedUsername); // Show chat if token exists
} else {
  // Ensure auth section is displayed if no token
  authSection.style.display = "block";
  chatSection.style.display = "none";
  openRoomsModalButton.style.display = "none";
  roomsModal.style.display = "none";
}

// --- Room Management Logic ---
joinRoomButton.addEventListener("click", () => {
  const roomName = roomInput.value.trim();
  if (roomName) {
    socket.emit("join-room", roomName);
    roomInput.value = ""; // Clear input after joining/creating
  }
});

socket.on("available-rooms", (rooms) => {
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    const roomNameSpan = document.createElement("span");
    roomNameSpan.className = "room-name";
    roomNameSpan.innerText = room;
    roomNameSpan.addEventListener("click", () => {
      socket.emit("join-room", room);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-room";
    deleteButton.innerText = "Delete";
    // Disable delete button for 'general' room
    deleteButton.disabled = room === "general";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent room joining when clicking delete
      if (confirm(`Are you sure you want to delete the room "${room}"?`)) {
        socket.emit("delete-room", room);
      }
    });

    li.appendChild(roomNameSpan);
    li.appendChild(deleteButton);
    roomList.appendChild(li);
  });
});

socket.on("joined-room", (roomName) => {
  currentRoomSpan.innerText = roomName;
  messageContainer.innerHTML = ""; // Clear chat history when joining a new room
  // You might want to fetch past messages here if you implement message history
});

socket.on("room-history", (messages) => {
  messages.forEach((msg) => {
    const data = {
      name: msg.sender,
      message: msg.content,
      dateTime: msg.timestamp,
      id: socket.id, // Use socket.id to mark as own message if sender matches
    };
    addMessageToUI(data.name === nameInput.value.trim(), data);
  });
});

socket.on("clear-messages", () => {
  messageContainer.innerHTML = ""; // Explicitly clear messages
});
socket.on('user-left', (username) => {
    const element = document.createElement('li');
    element.className = 'message-center';
    element.innerHTML = `<p class="message">${username} has left the room</p>`;
    messageContainer.appendChild(element);
    scrollToBottom();
}); 
// Add handler for room deletion response
socket.on("room-deleted", (roomName) => {
  if (currentRoomSpan.innerText === roomName) {
    // If user was in the deleted room, move them to general
    socket.emit("join-room", "general");
  }
});

// --- Modal Logic ---
openRoomsModalButton.addEventListener("click", () => {
  roomsModal.style.display = "block";
  socket.emit("get-rooms"); // Request updated room list when modal opens
});

closeButton.addEventListener("click", () => {
  roomsModal.style.display = "none";
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener("click", (event) => {
  if (event.target == roomsModal) {
    roomsModal.style.display = "none";
  }
});

// --- Existing Chat Logic (moved below authentication) ---
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("client-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
  if (!messageInput.value.trim()) return;

  const data = {
    name: nameInput.value.trim() || "anonymous",
    message: messageInput.value.trim(),
    dateTime: new Date(),
    id: socket.id,
  };

  socket.emit("message", data);
  messageInput.value = "";
  messageInput.focus();
  socket.emit("feedback", { feedback: "", id: socket.id });
}

socket.on("chat-message", (data) => {
  console.log("Received chat message:", data);
  addMessageToUI(data.id === socket.id, data);
});

function addMessageToUI(isOwnMessage, data) {
  const element = document.createElement("li");
  element.className = isOwnMessage ? "message-right" : "message-left";

  // Apply basic text formatting
  let formattedMessage = data.message;
  formattedMessage = formattedMessage.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  ); // Bold
  formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italics
  formattedMessage = formattedMessage.replace(
    /&lt;a href="(.*?)"&gt;(.*?)&lt;\/a&gt;/g,
    '<a href="$1" target="_blank">$2</a>'
  ); // Links (if sent as HTML-safe input)
  // Note: More robust link parsing and XSS prevention would be needed for production

  const messageHTML = `
        <p class="message">
            ${formattedMessage}
            <span>${data.name} ● ${moment(data.dateTime).format(
    "MMMM Do YYYY, h:mm:ss a"
  )}</span>
        </p>
    `;

  element.innerHTML = messageHTML;
  messageContainer.appendChild(element);
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing....`,
    id: socket.id,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing....`,
    id: socket.id,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", { feedback: "", id: socket.id });
});

socket.on("feedback", (data) => {
  if (data.id !== socket.id) {
    feedbackElement.innerText = data.feedback;
  }
});
