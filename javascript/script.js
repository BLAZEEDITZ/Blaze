function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
}

function toggleSendButton() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const sendIcon = document.getElementById('sendIcon');
    if (messageInput.value.trim() !== "") {
        sendButton.disabled = false;
        sendIcon.src = "https://img.icons8.com/?size=100&id=124436&format=png&color=ffffff";
    } else {
        sendButton.disabled = true;
        sendIcon.src = "https://img.icons8.com/?size=100&id=124436&format=png&color=000000";
    }
}

document.getElementById('messageInput').addEventListener('input', toggleSendButton);
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    const sendButton = document.getElementById('sendButton');
    if (event.key === 'Enter' && !sendButton.disabled) {
        event.preventDefault();
        sendButton.click();
    }
});

function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

const API_KEY = "sk-5976526e3f56409ba780633cc51f46a2"; // ✨ NEW: Added your API key here

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const userMessage = messageInput.value.trim();

    if (userMessage === "") return;

    // Hide logo and quick actions after first message
    document.getElementById('logo-container').style.display = 'none';
    document.getElementById('quick-actions').style.display = 'none';

    // Display user message
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user-message';
    userMessageElement.innerHTML = `${userMessage}<span class="timestamp">${getCurrentTimestamp()}</span>`;
    messagesContainer.appendChild(userMessageElement);

    // Clear the input
    messageInput.value = '';
    toggleSendButton();

    // Display loading animation
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message loading';
    loadingElement.textContent = 'Loading...';
    messagesContainer.appendChild(loadingElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}` // ✨ NEW: Add Authorization header
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" model
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Remove loading animation
        messagesContainer.removeChild(loadingElement);

        // Display AI response
        const aiMessageElement = document.createElement('div');
        aiMessageElement.className = 'message ai-message';
        aiMessageElement.innerHTML = `<img src="images/blaze-top.png" alt="Yankara Logo" style="width: 35px; height: 35px; vertical-align: middle;"> ${aiMessage}<span class="timestamp">${getCurrentTimestamp()}</span>`;
        messagesContainer.appendChild(aiMessageElement);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Error:', error);

        // Remove loading animation
        messagesContainer.removeChild(loadingElement);

        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'message error-message';
        errorMessageElement.innerHTML = `Error: Unable to get response from OpenAI.<span class="timestamp">${getCurrentTimestamp()}</span>`;
        messagesContainer.appendChild(errorMessageElement);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function sendQuickAction(message) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = message;
    toggleSendButton();
    sendMessage();
}
