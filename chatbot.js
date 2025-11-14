class WeatherChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        // DOM elements
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.chatWindow = document.getElementById('chat-window');
        this.closeBtn = document.getElementById('chat-close');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.messagesContainer = document.getElementById('chat-messages');
        this.typingIndicator = document.getElementById('typing-indicator');

        // Event listeners
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.style.display = 'block';
            this.chatInput.focus();
        } else {
            this.closeChat();
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.style.display = 'none';
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to UI
        this.addMessage(message, 'user');

        // Clear input
        this.chatInput.value = '';

        // Show typing indicator
        this.showTyping();

        // Generate AI response
        this.generateAIResponse(message);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Add to conversation history
        this.conversationHistory.push({ role: sender, content: content });

        // Keep only last 10 messages for context
        if (this.conversationHistory.length > 10) {
            this.conversationHistory.shift();
        }
    }

    showTyping() {
        this.typingIndicator.style.display = 'block';
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    async generateAIResponse(userMessage) {
        try {
            // Call your local server proxy (replace with your server URL)
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: this.conversationHistory.slice(-5) // Send last 5 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response || "I'm sorry, I couldn't generate a response right now.";

            // Hide typing indicator
            this.hideTyping();

            // Add AI response to chat
            this.addMessage(aiResponse, 'bot');

        } catch (error) {
            console.error('API Error:', error);
            this.hideTyping();

            // Show error message
            const errorMessage = "Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.";
            this.addMessage(errorMessage, 'bot');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherChatbot();
});
