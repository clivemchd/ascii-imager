# ASCII Art Converter

A modern web-based image to ASCII art converter. Vibe coded with Vite for optimal development and build performance.

> **Note**: This project was vibe-coded, so expect some minor bugs and issues. Contributions and bug reports are welcome!

## Features

- 🎨 Convert images to ASCII art with multiple character sets
- 🎯 Customizable character count for precise output control
- 🎨 Custom character set support
- 🌈 Color customization for text and background
- 📱 Responsive design with drag-and-drop functionality
- 📄 Multiple export formats (PNG, SVG, TXT)
- ✨ Animated Three.js background with ASCII-themed 3D elements
- ⚡ Fast development with Vite and modern ES modules

## Getting Started

### Prerequisites

- Node.js v22.17.1 (specified in `.nvmrc`)
- npm (latest version)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/clivemchd/ascii-imager.git
cd ascii-imager
```

2. Use the correct Node.js version:
```bash
nvm use
```

3. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Deployment

Deploy to GitHub Pages:
```bash
npm run deploy
```

## Project Structure

```
├── public/
│   └── CNAME                   # Custom domain configuration
├── src/
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   ├── js/
│   │   ├── app.js              # ASCII converter logic
│   │   └── background.js       # Three.js background animation
│   └── main.js                 # Application entry point
├── index.html                  # Main HTML file
├── vite.config.js             # Vite configuration
├── package.json               # Project dependencies and scripts
├── .nvmrc                     # Node.js version specification
├── .npmrc                     # npm configuration
└── .gitignore                 # Git ignore rules
```

## Usage

1. **Upload Image**: Drag and drop an image file or click to select
2. **Configure Settings**:
   - Choose a character set (detailed, simple, blocks, or custom)
   - Optionally specify total character count for precise control
   - Adjust colors for text and background
   - Toggle color inversion if needed
3. **Convert**: Click "Convert to ASCII" to generate the art
4. **Download**: Choose your preferred format (PNG, SVG, or TXT) and download

## Technologies Used

- **Vite**: Fast build tool and development server
- **Three.js**: 3D graphics library for background animation
- **Vanilla JavaScript**: ES6+ modules for clean, modern code
- **CSS3**: Modern styling with backdrop filters and animations
- **HTML5 Canvas**: Image processing and ASCII generation

## Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Author

Clive - [GitHub](https://github.com/clivemchd)