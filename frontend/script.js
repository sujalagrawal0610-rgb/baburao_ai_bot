const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusText = document.getElementById('status'); // Tera naya status bar

// --- 1. CONNECTION TEST LOGIC ---
async function testConnection() {
    try {
        statusText.innerText = "Connection check kar rela hai...";
        statusText.style.color = "#f39c12"; // Star Garage Yellow

        // Hum backend ke '/status' raste ko call kar rahe hain
        const response = await fetch('http://localhost:10000/status');
        const data = await response.json();
        
        // Agar response mil gaya toh ekdum green signal
        statusText.innerText = "Babu Bhaiya is online! 🟢";
        statusText.style.color = "#4CAF50"; // Green
        
    } catch (error) {
        // Agar server band hai ya kuch gadbad hai
        statusText.innerText = "Server Fat Gaya! 🔴";
        statusText.style.color = "#ff4444"; // Red
        
        // Bot ki taraf se error message dikhao
        addMessage("Arey baba, backend server chalu nahi hai! Pehle terminal mein 'node server.js' chala re!", 'bot');
        
        // User ko type karne se rok do
        userInput.disabled = true;
        sendBtn.disabled = true;
        userInput.placeholder = "Pehle server chalu kar baba...";
    }
}

// --- 2. MESSAGE UI MEIN ADD KARNE KA FUNCTION ---
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    
    // Naya message aane par auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 3. BACKEND SE CHAT API CALL KARNE KA FUNCTION ---
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // User ka message UI mein dikhao
    addMessage(text, 'user');
    userInput.value = ''; // Input box khali karo
    
    // Button disable karo jab tak Babu Rao soch raha hai
    sendBtn.disabled = true;
    sendBtn.innerText = 'Ruk ja...';

    try {
        const response = await fetch('http://localhost:10000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();

        // ✨ ASLI JAADU YAHAN HUA HAI ✨
        if (response.ok) {
            addMessage(data.answer, 'bot');
        } else {
            // Google error hata diya, apna Babu Rao wala style daal diya!
            addMessage("Arey deva! BSNL ka dabba kharab hai lagta hai! 15 sec me wapas bolna, abhi line busy hai! 📞", 'bot');
        }

    } catch (error) {
        // Agar local connection tut gaya
        addMessage("Arey Sham! Cable kisne nikala re? Mera server down ho gaya!", 'bot');
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerText = 'Send'; // Button ka naam clean UI ke hisab se "Send" kar diya
        userInput.focus();
    }
}

// --- 4. EVENT LISTENERS ---
// Button click karne par
sendBtn.addEventListener('click', sendMessage);

// Keyboard par 'Enter' dabane par
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// --- 5. PAGE LOAD HOTE HI ACTION START ---
testConnection();