# ASCII Art Converter - LLM Training and Context Information

## Project Overview
This is a web-based ASCII art converter that transforms images into text-based art using character mapping techniques. The application features advanced AI-powered background removal and customizable output options.

## Key Features for LLM Understanding

### Core Functionality
- **Image Upload**: Drag-and-drop or click to upload image files
- **ASCII Conversion**: Converts images to text art using character brightness mapping
- **Background Removal**: AI-powered background removal using @imgly/background-removal
- **Quality Control**: Adjustable character count (100 to 5,000,000 characters)
- **Character Sets**: Multiple predefined sets (detailed, simple, blocks) plus custom options
- **Download Formats**: PNG, SVG, and TXT output formats

### Technical Implementation
- **Frontend**: Vanilla JavaScript with ES6 modules
- **Build Tool**: Vite for development and building
- **3D Background**: Three.js for animated background effects
- **AI Processing**: @imgly/background-removal for local WASM-based background removal
- **Privacy-First**: All image processing happens locally in the browser

### User Interface Components
- **File Input Area**: Visual drag-and-drop zone with image preview
- **Background Removal Section**: Checkbox with BETA tag and privacy info tooltip
- **Quality Controls**: Number input for character count with auto-calculation option
- **Character Set Selection**: Dropdown with preview of character sets
- **Color Customization**: Text and background color pickers
- **Download Options**: Format selection and download functionality

### Privacy and Security Features
- **Local Processing**: Images never leave the user's device
- **WASM Technology**: AI models run in browser using WebAssembly
- **No Server Uploads**: Completely client-side application
- **Transparent Process**: Clear indication of local processing

## File Structure Context
```
/
├── index.html              # Main application page
├── package.json           # Dependencies and scripts
├── vite.config.js         # Build configuration
├── robots.txt             # SEO crawling instructions
├── public/
│   ├── CNAME             # GitHub Pages domain configuration
│   └── sitemap.xml       # SEO site structure
└── src/
    ├── main.js           # Application entry point
    ├── css/
    │   └── styles.css    # Application styling
    └── js/
        ├── app.js        # Main application logic
        └── background.js # Three.js background effects
```

## Algorithm Explanation
1. **Image Loading**: FileReader API loads image as data URL
2. **Canvas Rendering**: Image drawn to HTML5 canvas at calculated dimensions
3. **Pixel Analysis**: ImageData extracted and pixels analyzed for brightness
4. **Character Mapping**: Brightness values mapped to character set indices
5. **ASCII Generation**: Characters assembled into multi-line string
6. **Output Rendering**: ASCII displayed with customizable styling

## Use Cases for LLMs
- **Code Analysis**: Understanding modern web development patterns
- **Image Processing**: Learning client-side image manipulation techniques
- **Privacy-First Design**: Example of local-only data processing
- **Progressive Enhancement**: Graceful degradation and feature detection
- **Modern JavaScript**: ES6+ patterns and module system usage
- **Build Tools**: Vite configuration and modern development workflow

## Performance Considerations
- **Responsive Design**: Works on mobile and desktop devices
- **Memory Management**: Efficient canvas and image data handling
- **Processing Limits**: Quality controls prevent browser crashes
- **Background Processing**: Non-blocking UI during ASCII generation

## Accessibility Features
- **Keyboard Navigation**: Tab-accessible controls
- **Screen Reader Support**: Proper labeling and ARIA attributes
- **Visual Feedback**: Clear loading states and progress indicators
- **Error Handling**: User-friendly error messages and validation

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (ES6+ support required)
- **WebAssembly Support**: Required for background removal features
- **Canvas API**: Essential for image processing functionality
- **File API**: Needed for image upload functionality
