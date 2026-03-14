// script.js

// 1. Password/Activation Logic
const magicString = "lumos";
const inputField = document.getElementById('magic-words');
const activateBtn = document.getElementById('activate-btn');
const activationOverlay = document.getElementById('activation-overlay');
const mapWrapper = document.getElementById('map-wrapper');
const ambienceAudio = document.getElementById('castle-ambience');

function revealMap() {
    ambienceAudio.play(); // Audio must start on user interaction
    activationOverlay.style.opacity = '0';
    setTimeout(() => {
        activationOverlay.classList.add('hidden');
        mapWrapper.classList.remove('hidden');
        // Now that the container is visible, initialize Panzoom
        initializePanzoom();
    }, 2000); // 2-second fade-out before showing map
}

activateBtn.addEventListener('click', () => {
    if (inputField.value.trim().toLowerCase() === magicString.toLowerCase()) {
        revealMap();
    } else {
        alert("The parchment remains blank. (Check your wording!)");
        inputField.value = ''; // Reset input
    }
});

// Optionally: Allow hitting 'Enter' to submit
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') { activateBtn.click(); }
});

// 2. Initialize Panzoom
function initializePanzoom() {
    const mapElement = document.getElementById('map-container');
    
    const panzoomInstance = Panzoom(mapElement, {
        maxScale: 6,       // How far they can zoom in (blow their minds)
        minScale: 0.5,     // How far they can zoom out
        contain: 'outside',// Prevent dragging the map entirely off-screen
        step: 0.2,         // Speed of mouse-wheel zoom
        handleStartEvent: (event) => {
            // This ensures they can still click on tooltips and labels!
            if (event.target.closest('.map-label')) {
              return false; // Don't drag if clicking a label
            }
        },
    });

    // Handle Mouse Wheel Zooming
    mapElement.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);
}

// 3. Dynamic Footprints (SVG CSS Animation)
/* This is a visual "wow" shortcut.
   Instead of dynamically calculating paths (hard), we use a pre-defined SVG path. */

const footprintSVG = `
<svg width="20" height="20" viewBox="0 0 100 100">
  <path id="walk-path-1" d="M10,10 C10,10 50,20 60,60 C70,100 10,90 10,90" fill="none" stroke="none" />
  <circle class="footprint" r="5">
    <animateMotion dur="6s" repeatCount="indefinite">
      <mpath href="#walk-path-1"/>
    </animateMotion>
  </circle>
</svg>
`;

// In a full implementation, you'd define multiple SVGs in HTML and apply CSS:
// .walking-path-1 .footprint { offset-path: path('M10,10...'); animation: followPath 6s infinite linear; }F
