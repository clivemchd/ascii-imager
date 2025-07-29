import './css/styles.css'
import { ThreeJSBackground } from './js/background.js'
import { ImageToAscii } from './js/app.js'

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    new ThreeJSBackground();
    
    // Initialize ASCII converter
    new ImageToAscii();
});
