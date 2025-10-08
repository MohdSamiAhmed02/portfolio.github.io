// Chatbot Elements
const chatbot = document.getElementById("chatbot");
const toggle = document.getElementById("chatbot-toggle");
const messagesContainer = document.getElementById("chatbot-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// NEW: Global variable to track and remove the typing indicator element
let typingIndicatorDiv = null; 

// Toggle chatbot visibility
toggle.addEventListener("click", () => {
    chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
});

const addMessage = (text, sender) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    
    // FINAL FIX: Using innerHTML to correctly render bold tags and lists
    messageDiv.innerHTML = text; 
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
};

// NEW: Function to display the 'Typing...' message
const addTypingIndicator = () => {
    if (typingIndicatorDiv) return; // Prevent multiple indicators
    
    typingIndicatorDiv = document.createElement("div");
    // Use the new class for styling
    typingIndicatorDiv.classList.add("message", "typing-indicator"); 
    typingIndicatorDiv.textContent = "Typing...";
    
    messagesContainer.appendChild(typingIndicatorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
};

// NEW: Function to remove the 'Typing...' message
const removeTypingIndicator = () => {
    if (typingIndicatorDiv) {
        typingIndicatorDiv.remove();
        typingIndicatorDiv = null; // Reset the variable
    }
};

const sendMessage = async () => {
    const userText = userInput.value.trim();
    if (!userText) return;

    // 1. Display user message
    addMessage(userText, "user");
    userInput.value = "";
    
    // 2. Show the typing indicator immediately
    addTypingIndicator(); // NEW STEP

    // Send to backend and get AI response
    try {
        const response = await fetch("http://localhost:3001/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        
        // 3. Hide indicator and display response
        removeTypingIndicator(); // NEW STEP

        // The data.reply content must contain HTML like <b>Skill</b> or <ul><li>...</li></ul>
        addMessage(data.reply, "bot");
    } catch (error) {
        console.error("Error:", error);
        
        // 4. Hide indicator even on error
        removeTypingIndicator(); // NEW STEP

        addMessage("Sorry, I couldn’t connect to the AI server. Please make sure the backend is running.", "bot");
    }
};

// Event listeners for sending message
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Initial bot message
addMessage("Hi! I'm Sami's AI assistant. Ask me anything about his skills, experience, or projects!", "bot");

// =========================================================
// 3. Scroll Spy for Active Navigation Links (Unchanged)
// =========================================================

const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section, .connect-section'); 

const scrollActive = () => {
    const scrollY = window.pageYOffset;
    
    let currentActiveLink = document.querySelector('.nav-links a[href*="#home"]');

    navLinks.forEach(link => link.classList.remove('active-link'));
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        const link = document.querySelector('.nav-links a[href*="#' + sectionId + '"]');

        if (scrollY >= sectionTop && scrollY < (sectionTop + sectionHeight)) {
            currentActiveLink = link;
        }
    });


    const isAtBottom = (window.innerHeight + scrollY) >= (document.body.offsetHeight - 5);
    
    if (isAtBottom) {
        currentActiveLink = navLinks[navLinks.length - 1]; 
    }
    
    if (currentActiveLink) {
        currentActiveLink.classList.add('active-link');
    }
}

window.addEventListener('scroll', scrollActive);
window.addEventListener('load', scrollActive);