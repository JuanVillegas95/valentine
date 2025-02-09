import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffb6c1); // Light pink background

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Optimize for high-DPI screens
document.body.appendChild(renderer.domElement);

// Handle window resizing for mobile
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera position
camera.position.set(0, 1, 6);

let mixer, action;

// Add Audio Listener to the camera (to hear sound from the camera position)
const listener = new THREE.AudioListener();
camera.add(listener);

// Load audio files
const audioLoader = new THREE.AudioLoader();
const music1 = new THREE.Audio(listener); // First music track
const music2 = new THREE.Audio(listener); // Second music track

// Load first track (music to play on page load)
audioLoader.load(
  "./mia.mp3", // Replace with your own file path
  function (buffer) {
    music1.setBuffer(buffer);
    music1.setLoop(true); // Optionally loop the sound
    music1.setVolume(0.5); // Set volume (0.0 to 1.0)
    music1.play(); // Automatically play when the page loads
  },
  undefined,
  function (error) {
    console.error("Error loading music1:", error);
  }
);

// Load second track (music to play when the button is clicked)
audioLoader.load(
  "./cat.mp3", // Replace with your own file path
  function (buffer) {
    music2.setBuffer(buffer);
    music2.setLoop(true);
    music2.setVolume(0.5);
  },
  undefined,
  function (error) {
    console.error("Error loading music2:", error);
  }
);

// Load GLTF model (cat)
const loader = new GLTFLoader();
loader.load(
  "./oiiaioooooiai_cat.glb",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(4, 4, 4); // Slightly bigger for mobile
    model.position.set(0, -1.5, 0); // Center it better for mobile view
    scene.add(model);

    // Play the first animation if available
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      action = mixer.clipAction(gltf.animations[0]); // First animation
    }
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Load GLTF model for the heart
const heartLoader = new GLTFLoader();
const hearts = []; // Array to store heart instances

// Function to create and animate a heart
function createHeart() {
  heartLoader.load(
    "./heart_in_love.glb", // Path to your heart model
    function (gltf) {
      const heart = gltf.scene;

      // Random scale for the heart
      // Random scale for the heart, capped at 0.01
      const randomScale = Math.random() * 0.01; // Random size between 0 and 0.01
      heart.scale.set(randomScale, randomScale, randomScale);

      // Random X, Y, and Z positions
      const randomX = (Math.random() - 0.5) * 10; // Random X position between -5 and 5
      const randomY = Math.random() * 10; // Random Y position between 0 and 10
      const randomZ = (Math.random() - 0.5) * 10; // Random Z position between -5 and 5

      heart.position.set(randomX, randomY, randomZ);

      scene.add(heart);
      hearts.push(heart); // Add to the array for animation
    },
    undefined,
    function (error) {
      console.error("Error loading heart model:", error);
    }
  );
}

// Create multiple hearts
for (let i = 0; i < 80; i++) {
  // Adjust the number of hearts as needed
  createHeart();
}

// Animation loop for hearts
function animateHearts() {
  hearts.forEach((heart) => {
    heart.position.y += 0.02; // Move upwards
    heart.rotation.y += 0.02; // Spin on X-axis

    // Reset position if heart goes above the screen
    if (heart.position.y > 5) {
      heart.position.y = -5;
      heart.position.x = (Math.random() - 0.5) * 10; // Random X position
      heart.position.z = (Math.random() - 0.5) * 10; // Random Z position
    }
  });
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.02); // Slightly faster update for smoothness
  animateHearts(); // Animate the hearts
  renderer.render(scene, camera);
}
animate();

// Create a text element "Will you be my Valentine?"
const textElement = document.createElement("div");
textElement.innerText = "Will you be my Valentine? 💖";
textElement.style.position = "absolute";
textElement.style.top = "20px"; // Positioned near the top
textElement.style.left = "50%";
textElement.style.transform = "translateX(-50%)";
textElement.style.fontSize = "24px";
textElement.style.fontWeight = "bold";
textElement.style.color = "#fff";
textElement.style.textAlign = "center";
textElement.style.zIndex = "10"; // Ensure it's on top
document.body.appendChild(textElement);

// Create a button to play the animation
const button = document.createElement("button");
button.innerText = "Yes"; // Changed button text to "Yes"
button.style.position = "absolute";
button.style.bottom = "10%"; // Higher for mobile
button.style.left = "50%";
button.style.transform = "translateX(-50%)";
button.style.padding = "15px 25px"; // Bigger button for easier tapping
button.style.fontSize = "18px";
button.style.cursor = "pointer";
button.style.backgroundColor = "#ff1493"; // A deeper pink for contrast
button.style.color = "#fff";
button.style.border = "none";
button.style.borderRadius = "12px";
button.style.boxShadow = "0px 5px 8px rgba(0, 0, 0, 0.3)";
button.style.fontWeight = "bold";
button.style.textAlign = "center";
button.style.zIndex = "10"; // Ensure it’s on top
document.body.appendChild(button);

// Play animation and change music on button click
button.addEventListener("click", () => {
  if (action) {
    action.reset().play();
  }

  // Switch music on button click
  if (music1.isPlaying) {
    music1.stop();
    music2.play(); // Play second music
  } else {
    music2.stop();
    music1.play(); // Play first music
  }
});
