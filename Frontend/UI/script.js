// Access the video element
const videoElement = document.getElementById("cameraView");
let stream; // To keep track of the video stream

// Function to turn on the camera
function turnOnCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Get user media (access the camera)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(mediaStream) {
        stream = mediaStream; // Store the stream
        // Attach the stream to the video element
        videoElement.srcObject = mediaStream;
      })
      .catch(function(error) {
        // Handle errors
        console.error("Error accessing the camera:", error);
      });
  } else {
    console.error("getUserMedia is not supported in this browser");
  }
}

// Function to turn off the camera
function turnOffCamera() {
  if (stream) {
    // Stop the video stream tracks
    stream.getTracks().forEach(track => track.stop());
    // Reset the video element srcObject
    videoElement.srcObject = null;
  }
}

// Access the message input element and send button
const messageInput = document.getElementById("messageInput");
const sendMessageButton = document.getElementById("sendMessage");

// Function to send message
function sendMessage() {
  // Get the message from the input field
  const message = messageInput.value.trim();
  
  // Check if the message is not empty
  if (message !== "") {
    // Create a new message element
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    
    // Append the message to the chat box
    const chatBox = document.getElementById("chatBox");
    chatBox.appendChild(messageElement);
    
    // Clear the message input field
    messageInput.value = "";
  }
}

// Event listener for the send message button
sendMessageButton.addEventListener("click", sendMessage);

// Attach click event listeners to the camera control buttons
document.getElementById("turnOnCamera").addEventListener("click", turnOnCamera);
document.getElementById("turnOffCamera").addEventListener("click", turnOffCamera);
