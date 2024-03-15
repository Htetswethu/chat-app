const socket = io();
const chatForm = document.getElementById("sendMessageForm");
const chatMessages = document.getElementById("chatMessages");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(room);

//user joining chatroom
socket.emit("room", { username, room });

//message part
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//chat message submit part
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.messageInput.value;

  socket.emit("chatMessage", msg);
});

//output function to append chat html
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<div class="messageHeader">
        <span class="senderName">${message.username}:</span>
        <span class="messageTime">${message.time}</span>
    </div>
    <div class="messageBody">
        <p>${message.text}</p>
    </div>`;
  chatMessages.appendChild(div);
}
