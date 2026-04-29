// ===== State Management =====
const state = {
  currentView: 'dashboard',
  currentCommand: null,
  cameraStream: null,
  cameraOn: false,
  isDarkMode: false,
  messages: [],
  commandLog: [],
  isRecording: false,
};

// ===== DOM Elements =====
const navButtons = document.querySelectorAll('.nav-btn[data-view]');
const views = document.querySelectorAll('.view');
const themeToggle = document.getElementById('themeToggle');
const a11yToggle = document.getElementById('accessibilityToggle');
const a11yPanel = document.getElementById('a11yPanel');
const closeA11yBtn = document.getElementById('closeA11yPanel');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const highContrastToggle = document.getElementById('highContrastToggle');
const reducedMotionToggle = document.getElementById('reducedMotionToggle');
const largeTargetsToggle = document.getElementById('largeTargetsToggle');

// Camera elements
const dashCameraPreview = document.getElementById('dashCameraPreview');
const dashCameraPlaceholder = document.getElementById('dashCameraPlaceholder');
const dashCameraToggle = document.getElementById('dashCameraToggle');
const mainCameraFeed = document.getElementById('mainCameraFeed');
const mainCameraPlaceholder = document.getElementById('mainCameraPlaceholder');
const cameraToggleBtn = document.getElementById('cameraToggleBtn');
const cameraOverlay = document.getElementById('cameraOverlay');
const cameraTimestamp = document.getElementById('cameraTimestamp');

// Controller elements
const commandDisplay = document.getElementById('commandDisplay');
const currentCommandText = document.getElementById('currentCommandText');
const commandLog = document.getElementById('commandLog');
const dashCurrentCommand = document.getElementById('dashCurrentCommand');

// Chat elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const voiceModeBtn = document.getElementById('voiceModeBtn');
const voiceRecordingBar = document.getElementById('voiceRecordingBar');
const stopRecordingBtn = document.getElementById('stopRecording');
const dashChatPreview = document.getElementById('dashChatPreview');

// ===== Navigation =====
function switchView(viewName) {
  state.currentView = viewName;

  views.forEach(v => v.classList.remove('active'));
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });

  const targetView = document.getElementById(viewName + 'View');
  if (targetView) {
    targetView.classList.add('active');
  }

  navButtons.forEach(btn => {
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'page');
    }
  });
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Handle "View All" button in chat preview
document.querySelectorAll('[data-view="chat"]').forEach(btn => {
  btn.addEventListener('click', () => switchView('chat'));
});

// ===== Theme Toggle =====
function setTheme(isDark) {
  state.isDarkMode = isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  if (isDark) {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => setTheme(!state.isDarkMode));

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  setTheme(true);
}

// ===== Accessibility Panel =====
a11yToggle.addEventListener('click', () => {
  const isOpen = a11yPanel.classList.contains('open');
  a11yPanel.classList.toggle('open');
  a11yPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
});

closeA11yBtn.addEventListener('click', () => {
  a11yPanel.classList.remove('open');
  a11yPanel.setAttribute('aria-hidden', 'true');
});

fontSizeSlider.addEventListener('input', (e) => {
  const size = e.target.value;
  document.documentElement.style.fontSize = size + 'px';
  fontSizeValue.textContent = size + 'px';
  e.target.setAttribute('aria-valuenow', size);
});

highContrastToggle.addEventListener('change', (e) => {
  document.body.classList.toggle('high-contrast', e.target.checked);
});

reducedMotionToggle.addEventListener('change', (e) => {
  document.body.classList.toggle('reduced-motion', e.target.checked);
});

largeTargetsToggle.addEventListener('change', (e) => {
  document.body.classList.toggle('large-targets', e.target.checked);
});

// ===== Camera =====
function turnOnCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(mediaStream) {
        state.cameraStream = mediaStream;
        state.cameraOn = true;

        dashCameraPreview.srcObject = mediaStream;
        mainCameraFeed.srcObject = mediaStream;

        dashCameraPlaceholder.classList.add('hidden');
        mainCameraPlaceholder.classList.add('hidden');
        cameraOverlay.classList.add('visible');

        dashCameraToggle.textContent = 'Turn Off';
        cameraToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg> Turn Off Camera';

        startTimestamp();
        simulateEmotionDetection();
      })
      .catch(function(error) {
        console.error('Error accessing the camera:', error);
        alert('Could not access camera. Please ensure camera permissions are granted.');
      });
  } else {
    alert('Camera access is not supported in this browser.');
  }
}

function turnOffCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
    state.cameraOn = false;

    dashCameraPreview.srcObject = null;
    mainCameraFeed.srcObject = null;

    dashCameraPlaceholder.classList.remove('hidden');
    mainCameraPlaceholder.classList.remove('hidden');
    cameraOverlay.classList.remove('visible');

    dashCameraToggle.textContent = 'Turn On';
    cameraToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg> Turn On Camera';

    stopTimestamp();
    resetEmotionDisplay();
  }
}

function toggleCamera() {
  if (state.cameraOn) {
    turnOffCamera();
  } else {
    turnOnCamera();
  }
}

dashCameraToggle.addEventListener('click', toggleCamera);
cameraToggleBtn.addEventListener('click', toggleCamera);

// Timestamp
let timestampInterval = null;

function startTimestamp() {
  updateTimestamp();
  timestampInterval = setInterval(updateTimestamp, 1000);
}

function stopTimestamp() {
  if (timestampInterval) {
    clearInterval(timestampInterval);
    timestampInterval = null;
  }
}

function updateTimestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  cameraTimestamp.textContent = h + ':' + m + ':' + s;
}

// ===== Emotion Detection (Simulated) =====
const emotions = [
  { name: 'Happy', icon: 'happy' },
  { name: 'Neutral', icon: 'neutral' },
  { name: 'Sad', icon: 'sad' },
  { name: 'Surprised', icon: 'surprised' },
  { name: 'Angry', icon: 'angry' },
];

let emotionInterval = null;

function simulateEmotionDetection() {
  if (emotionInterval) clearInterval(emotionInterval);

  emotionInterval = setInterval(() => {
    if (!state.cameraOn) {
      clearInterval(emotionInterval);
      return;
    }

    const values = emotions.map(() => Math.random());
    const total = values.reduce((a, b) => a + b, 0);
    const normalized = values.map(v => Math.round((v / total) * 100));

    const maxIdx = normalized.indexOf(Math.max(...normalized));
    const topEmotion = emotions[maxIdx];
    const confidence = normalized[maxIdx];

    // Update dashboard emotion display
    const emotionLabel = document.getElementById('emotionLabel');
    const emotionBar = document.getElementById('emotionBar');
    const emotionConfidence = document.getElementById('emotionConfidence');

    emotionLabel.textContent = topEmotion.name;
    emotionBar.style.width = confidence + '%';
    emotionBar.setAttribute('aria-valuenow', confidence);
    emotionConfidence.textContent = 'Confidence: ' + confidence + '%';

    // Update camera overlay
    const overlayLabel = document.getElementById('overlayEmotionLabel');
    overlayLabel.textContent = topEmotion.name + ' (' + confidence + '%)';

    // Update camera sidebar detail
    const detailLabel = document.getElementById('emotionDetailLabel');
    detailLabel.textContent = topEmotion.name;

    // Update bars
    const barFills = document.querySelectorAll('.bar-fill');
    const barPcts = document.querySelectorAll('.bar-pct');
    emotions.forEach((em, i) => {
      barFills[i].style.width = normalized[i] + '%';
      barPcts[i].textContent = normalized[i] + '%';
    });
  }, 2000);
}

function resetEmotionDisplay() {
  if (emotionInterval) {
    clearInterval(emotionInterval);
    emotionInterval = null;
  }

  document.getElementById('emotionLabel').textContent = 'Waiting for input...';
  document.getElementById('emotionBar').style.width = '0%';
  document.getElementById('emotionConfidence').textContent = 'Confidence: --';
  document.getElementById('overlayEmotionLabel').textContent = '--';
  document.getElementById('emotionDetailLabel').textContent = 'No emotion detected';

  document.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = '0%'; });
  document.querySelectorAll('.bar-pct').forEach(pct => { pct.textContent = '0%'; });
}

// ===== Robot Controller =====
const allControlBtns = document.querySelectorAll('[data-command]');

function executeCommand(command) {
  state.currentCommand = command;

  // Update command display
  currentCommandText.textContent = command;
  dashCurrentCommand.textContent = command;

  commandDisplay.classList.remove('active-command', 'stop-command');
  if (command === 'Stop') {
    commandDisplay.classList.add('stop-command');
  } else {
    commandDisplay.classList.add('active-command');
  }

  // Update active button styling
  allControlBtns.forEach(btn => btn.classList.remove('active-btn'));
  allControlBtns.forEach(btn => {
    if (btn.dataset.command === command) {
      btn.classList.add('active-btn');
    }
  });

  // Add to command log
  addCommandLog(command);
}

function addCommandLog(command) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  state.commandLog.unshift({ command: command, time: timeStr });

  // Keep only last 50 entries
  if (state.commandLog.length > 50) {
    state.commandLog = state.commandLog.slice(0, 50);
  }

  renderCommandLog();
}

function renderCommandLog() {
  if (state.commandLog.length === 0) {
    commandLog.innerHTML = '<div class="empty-state"><p>No commands sent yet</p></div>';
    return;
  }

  commandLog.innerHTML = state.commandLog.map(entry =>
    '<div class="log-entry">' +
      '<span class="log-cmd">' + entry.command + '</span>' +
      '<span class="log-time">' + entry.time + '</span>' +
    '</div>'
  ).join('');
}

allControlBtns.forEach(btn => {
  btn.addEventListener('click', () => executeCommand(btn.dataset.command));
});

// Keyboard controls for robot
document.addEventListener('keydown', (e) => {
  if (state.currentView !== 'controller' && state.currentView !== 'dashboard') return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case 'ArrowUp': e.preventDefault(); executeCommand('Forward'); break;
    case 'ArrowDown': e.preventDefault(); executeCommand('Backward'); break;
    case 'ArrowLeft': e.preventDefault(); executeCommand('Left'); break;
    case 'ArrowRight': e.preventDefault(); executeCommand('Right'); break;
    case 'q': case 'Q': executeCommand('Rotate Left'); break;
    case 'e': case 'E': executeCommand('Rotate Right'); break;
    case ' ': e.preventDefault(); executeCommand('Stop'); break;
  }
});

// ===== Chat =====
function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msg = {
    text: text,
    sender: 'You',
    time: timeStr,
    type: 'sent',
  };

  state.messages.push(msg);
  chatInput.value = '';

  renderMessages();
  updateDashChatPreview();

  // Simulate a response
  setTimeout(() => {
    const responses = [
      'Thank you for your message. How can I help you further?',
      'I received your message. The robot is ready for commands.',
      'Message acknowledged. Is there anything specific you need?',
      'Got it! Let me know if you need any assistance.',
      'Thank you! The system is processing your request.',
    ];
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    state.messages.push({
      text: responseText,
      sender: 'Customer',
      time: responseTime,
      type: 'received',
    });

    renderMessages();
    updateDashChatPreview();
  }, 1000 + Math.random() * 2000);
}

function renderMessages() {
  // Remove welcome message
  const welcome = chatMessages.querySelector('.chat-welcome');
  if (welcome && state.messages.length > 0) {
    welcome.remove();
  }

  // Only render new messages
  const existingMsgCount = chatMessages.querySelectorAll('.chat-msg').length;
  const newMessages = state.messages.slice(existingMsgCount);

  newMessages.forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg ' + msg.type;
    msgEl.innerHTML =
      '<div class="msg-avatar">' + msg.sender.charAt(0) + '</div>' +
      '<div>' +
        '<div class="msg-bubble">' + escapeHtml(msg.text) + '</div>' +
        '<div class="msg-meta">' + msg.time + '</div>' +
      '</div>';
    chatMessages.appendChild(msgEl);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateDashChatPreview() {
  const recentMessages = state.messages.slice(-3);

  if (recentMessages.length === 0) {
    dashChatPreview.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><p>No messages yet</p></div>';
    return;
  }

  dashChatPreview.innerHTML = recentMessages.map(msg =>
    '<div class="chat-preview-msg">' +
      '<div class="msg-avatar">' + msg.sender.charAt(0) + '</div>' +
      '<div class="msg-content">' + escapeHtml(msg.text) + '</div>' +
      '<div class="msg-time">' + msg.time + '</div>' +
    '</div>'
  ).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

sendChatBtn.addEventListener('click', sendChatMessage);

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

clearChatBtn.addEventListener('click', () => {
  state.messages = [];
  chatMessages.innerHTML =
    '<div class="chat-welcome">' +
      '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
      '<h3>Welcome to the chat</h3>' +
      '<p>Start a conversation with the customer through text or voice.</p>' +
    '</div>';
  updateDashChatPreview();
});

// ===== Voice Mode =====
let mediaRecorder = null;

voiceModeBtn.addEventListener('click', () => {
  if (state.isRecording) return;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        state.isRecording = true;
        voiceRecordingBar.style.display = 'flex';
        chatInput.disabled = true;
        sendChatBtn.disabled = true;

        mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          state.isRecording = false;
          voiceRecordingBar.style.display = 'none';
          chatInput.disabled = false;
          sendChatBtn.disabled = false;
          stream.getTracks().forEach(track => track.stop());

          // Simulate speech-to-text
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          state.messages.push({
            text: '[Voice message recorded]',
            sender: 'You',
            time: timeStr,
            type: 'sent',
          });
          renderMessages();
          updateDashChatPreview();
        };

        mediaRecorder.start();
      })
      .catch(err => {
        console.error('Microphone access denied:', err);
        alert('Could not access microphone. Please ensure microphone permissions are granted.');
      });
  }
});

stopRecordingBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
});

// ===== Mobile Navigation =====
function setupMobileNav() {
  if (window.innerWidth <= 700) {
    if (!document.querySelector('.mobile-nav')) {
      const mobileNav = document.createElement('nav');
      mobileNav.className = 'mobile-nav';
      mobileNav.setAttribute('aria-label', 'Mobile navigation');
      mobileNav.innerHTML =
        '<button class="nav-btn active" data-view="dashboard">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' +
          'Home' +
        '</button>' +
        '<button class="nav-btn" data-view="controller">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>' +
          'Control' +
        '</button>' +
        '<button class="nav-btn" data-view="camera">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>' +
          'Camera' +
        '</button>' +
        '<button class="nav-btn" data-view="chat">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
          'Chat' +
        '</button>';
      document.body.appendChild(mobileNav);

      mobileNav.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          switchView(btn.dataset.view);
          mobileNav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }
  } else {
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) mobileNav.remove();
  }
}

window.addEventListener('resize', setupMobileNav);
setupMobileNav();
