const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const inputForm = document.getElementById("input-form");
const suggestions = document.querySelectorAll('.suggestion');

// Auto-resize textarea
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
});

// Send on form submit
inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;
  displayMessage('user', message);
  userInput.value = '';
  userInput.style.height = 'auto';
  getChatbotResponse(message);
});

// Quick suggestion buttons
suggestions.forEach((btn) => {
  btn.addEventListener('click', () => {
    const text = btn.textContent.trim();
    userInput.value = text;
    userInput.focus();
  });
});

function displayMessage(sender, message) {
  const el = document.createElement('div');
  el.className = `message ${sender}`;
  el.textContent = message;
  chatLog.appendChild(el);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

async function getChatbotResponse(userMessage) {
  setStatus('Thinking...');
  try {
    const resp = await fetch('/getChatbotResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage }),
    });
    const data = await resp.json();
    displayMessage('chatbot', data.chatbotResponse || 'Sorry, no response.');
  } catch (err) {
    console.error(err);
    displayMessage('chatbot', 'Error: could not reach server.');
  } finally {
    setStatus('Online');
  }
}

function setStatus(text){
  const s = document.getElementById('chat-status');
  if(s) s.textContent = text;
}

