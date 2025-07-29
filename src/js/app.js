import { removeBackground } from '@imgly/background-removal';

export class ImageToAscii {
    constructor() {
        this.canvas = document.getElementById('ascii-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageInput = document.getElementById('imageInput');
        this.originalImage = document.getElementById('originalImage');
        this.asciiOutput = document.getElementById('asciiOutput');
        this.convertBtn = document.getElementById('convertBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.loading = document.getElementById('loading');
        this.downloadLoading = document.getElementById('downloadLoading');
        
        this.totalChars = document.getElementById('totalChars');
        this.charsetSelect = document.getElementById('charsetSelect');
        this.customCharset = document.getElementById('customCharset');
        this.customInputGroup = document.getElementById('customInputGroup');
        this.downloadFormat = document.getElementById('downloadFormat');
        this.invertColors = document.getElementById('invertColors');
        this.textColor = document.getElementById('textColor');
        this.backgroundColor = document.getElementById('backgroundColor');
        this.textColorHex = document.getElementById('textColorHex');
        this.backgroundColorHex = document.getElementById('backgroundColorHex');
        
        // Background removal elements
        this.removeBackgroundCheckbox = document.getElementById('removeBackground');
        this.backgroundRemovalLoader = document.getElementById('backgroundRemovalLoader');
        this.processedImagePreview = document.getElementById('processedImagePreview');
        this.processedImage = document.getElementById('processedImage');
        this.backgroundRemovalIndicator = document.getElementById('backgroundRemovalIndicator');
        
        this.currentImage = null;
        this.processedImageData = null; // Store processed image data
        this.asciiResult = '';
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.convertBtn.addEventListener('click', () => this.convertToAscii());
        this.downloadBtn.addEventListener('click', () => this.downloadAscii());
        
        // Handle character set selection
        this.charsetSelect.addEventListener('change', () => {
            this.toggleCustomInput();
        });
        
        // Handle color changes
        this.textColor.addEventListener('change', () => {
            this.textColorHex.value = this.textColor.value;
            this.updateOutputColors();
        });
        
        this.backgroundColor.addEventListener('change', () => {
            this.backgroundColorHex.value = this.backgroundColor.value;
            this.updateOutputColors();
        });
        
        // Handle hex input changes
        this.textColorHex.addEventListener('input', () => {
            this.handleHexInput(this.textColorHex, this.textColor);
        });
        
        this.backgroundColorHex.addEventListener('input', () => {
            this.handleHexInput(this.backgroundColorHex, this.backgroundColor);
        });
        
        // Handle hex input validation on blur
        this.textColorHex.addEventListener('blur', () => {
            this.validateAndUpdateHexInput(this.textColorHex, this.textColor);
        });
        
        this.backgroundColorHex.addEventListener('blur', () => {
            this.validateAndUpdateHexInput(this.backgroundColorHex, this.backgroundColor);
        });
        
        // Handle background removal checkbox
        this.removeBackgroundCheckbox.addEventListener('change', () => {
            this.handleBackgroundRemovalToggle();
        });
        
        // Drag and drop functionality
        const fileInput = document.querySelector('.file-input');
        fileInput.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileInput.style.borderColor = '#007bff';
        });
        
        fileInput.addEventListener('dragleave', () => {
            fileInput.style.borderColor = '#ddd';
        });
        
        fileInput.addEventListener('drop', (e) => {
            e.preventDefault();
            fileInput.style.borderColor = '#ddd';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageFile(files[0]);
            }
        });
    }
    
    toggleCustomInput() {
        if (this.charsetSelect.value === 'custom') {
            this.customInputGroup.classList.remove('hidden');
        } else {
            this.customInputGroup.classList.add('hidden');
        }
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleImageFile(file);
        }
    }
    
    handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                // Update the drag area to show the image
                const fileInputArea = document.getElementById('fileInputArea');
                fileInputArea.style.backgroundImage = `url(${e.target.result})`;
                fileInputArea.classList.add('has-image');
                
                // Update the upload text and show image info
                const uploadText = document.getElementById('uploadText');
                const imageInfo = document.getElementById('imageInfo');
                const imageName = document.getElementById('imageName');
                const imageDimensions = document.getElementById('imageDimensions');
                
                uploadText.textContent = 'Image loaded - Click to change';
                imageName.textContent = `📁 ${file.name}`;
                imageDimensions.textContent = `📐 ${this.currentImage.width} × ${this.currentImage.height}px`;
                
                imageInfo.classList.remove('hidden');
                
                // Enable the background removal checkbox and convert button
                this.removeBackgroundCheckbox.disabled = false;
                this.convertBtn.disabled = false;
                
                // Reset processed image data and UI when new image is loaded
                this.processedImageData = null;
                this.processedImagePreview.classList.add('hidden');
                this.backgroundRemovalLoader.classList.add('hidden');
                this.backgroundRemovalIndicator.classList.add('hidden');
                this.removeBackgroundCheckbox.checked = false;
            };
            this.currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    getCharacterSet() {
        const charsets = {
            detailed: '@%#*+=-:. ',
            simple: '█▉▊▋▌▍▎▏ ',
            blocks: '██▓▒░  '
        };
        
        if (this.charsetSelect.value === 'custom') {
            const customChars = this.customCharset.value.trim();
            if (customChars.length === 0) {
                alert('Please enter custom characters!');
                return charsets.detailed;
            }
            return customChars;
        }
        
        return charsets[this.charsetSelect.value] || charsets.detailed;
    }
    
    updateOutputColors() {
        if (this.asciiOutput) {
            this.asciiOutput.style.backgroundColor = this.backgroundColor.value;
            this.asciiOutput.style.color = this.textColor.value;
        }
    }
    
    handleHexInput(hexInput, colorPicker) {
        const value = hexInput.value.trim();
        
        // Auto-add # if not present
        if (value && !value.startsWith('#')) {
            hexInput.value = '#' + value;
        }
        
        // Validate hex color format (real-time)
        if (this.isValidHexColor(hexInput.value)) {
            colorPicker.value = hexInput.value;
            this.updateOutputColors();
            hexInput.setCustomValidity('');
        } else if (hexInput.value.length > 0) {
            hexInput.setCustomValidity('Invalid hex color format. Use #RRGGBB format.');
        }
    }
    
    validateAndUpdateHexInput(hexInput, colorPicker) {
        const value = hexInput.value.trim();
        
        if (value === '') {
            // If empty, keep current color picker value
            hexInput.value = colorPicker.value;
            hexInput.setCustomValidity('');
            return;
        }
        
        // Auto-add # if not present
        if (!value.startsWith('#')) {
            hexInput.value = '#' + value;
        }
        
        // Validate and update
        if (this.isValidHexColor(hexInput.value)) {
            colorPicker.value = hexInput.value;
            this.updateOutputColors();
            hexInput.setCustomValidity('');
        } else {
            // Invalid format - revert to color picker value
            hexInput.value = colorPicker.value;
            hexInput.setCustomValidity('');
            alert('Invalid hex color format. Please use #RRGGBB format (e.g., #00ff88)');
        }
    }
    
    isValidHexColor(hex) {
        return /^#[0-9A-Fa-f]{6}$/.test(hex);
    }
    
    async handleBackgroundRemovalToggle() {
        if (!this.currentImage) {
            // This shouldn't happen since checkbox should be disabled, but just in case
            this.removeBackgroundCheckbox.checked = false;
            return;
        }
        
        if (this.removeBackgroundCheckbox.checked) {
            // If we already have processed image data, just show it
            if (this.processedImageData) {
                this.processedImagePreview.classList.remove('hidden');
                this.backgroundRemovalIndicator.classList.remove('hidden');
                return;
            }
            
            // Show loader
            this.backgroundRemovalLoader.classList.remove('hidden');
            this.processedImagePreview.classList.add('hidden');
            
            // Add progress cursor to body
            document.body.classList.add('bg-removal-in-progress');
            
            try {
                console.log('Starting background removal...');
                
                // Remove background using @imgly/background-removal
                const blob = await removeBackground(this.currentImage.src);
                
                console.log('Background removal completed, processing result...');
                
                // Create URL for the processed image
                const processedImageUrl = URL.createObjectURL(blob);
                
                // Create new image object for the processed image
                const processedImg = new Image();
                processedImg.onload = () => {
                    console.log('Processed image loaded successfully');
                    
                    // Store the processed image data
                    this.processedImageData = processedImg;
                    
                    // Display the processed image
                    this.processedImage.src = processedImageUrl;
                    this.processedImagePreview.classList.remove('hidden');
                    this.backgroundRemovalIndicator.classList.remove('hidden');
                    
                    // Hide loader
                    this.backgroundRemovalLoader.classList.add('hidden');
                    
                    // Remove progress cursor from body
                    document.body.classList.remove('bg-removal-in-progress');
                };
                
                processedImg.onerror = () => {
                    console.error('Failed to load processed image');
                    alert('Failed to load processed image. Please try again.');
                    this.removeBackgroundCheckbox.checked = false;
                    this.backgroundRemovalLoader.classList.add('hidden');
                    
                    // Remove progress cursor from body
                    document.body.classList.remove('bg-removal-in-progress');
                };
                
                processedImg.src = processedImageUrl;
                
            } catch (error) {
                console.error('Error removing background:', error);
                alert('Failed to remove background. Please try again.\n\nNote: This feature may not work with all image types.');
                this.removeBackgroundCheckbox.checked = false;
                this.backgroundRemovalLoader.classList.add('hidden');
                
                // Remove progress cursor from body
                document.body.classList.remove('bg-removal-in-progress');
            }
        } else {
            // User unchecked - hide processed image and indicator (but keep the data for potential re-use)
            this.processedImagePreview.classList.add('hidden');
            this.backgroundRemovalIndicator.classList.add('hidden');
        }
    }
    
    convertToAscii() {
        if (!this.currentImage) return;
        
        // Validate custom character set if selected
        if (this.charsetSelect.value === 'custom') {
            const customChars = this.customCharset.value.trim();
            if (customChars.length === 0) {
                alert('Please enter custom characters before converting!');
                return;
            }
        }
        
        // Validate total characters input if provided
        const totalCharsInput = this.totalChars.value.trim();
        if (totalCharsInput && !isNaN(totalCharsInput)) {
            const totalChars = parseInt(totalCharsInput);
            if (totalChars < 100) {
                alert('Total characters must be at least 100!');
                return;
            }
            if (totalChars > 400000) {
                alert('Total characters cannot exceed 400,000 for performance reasons!');
                return;
            }
        }
        
        this.loading.classList.remove('hidden');
        this.asciiOutput.classList.add('hidden');
        
        // Use setTimeout to allow loading message to display
        setTimeout(() => {
            // Determine which image to use for conversion
            const imageToConvert = this.removeBackgroundCheckbox.checked && this.processedImageData 
                ? this.processedImageData 
                : this.currentImage;
            
            // Use default values
            const contrast = 1.0; // Default contrast
            const defaultWidth = 100; // Default width
            const charset = this.getCharacterSet();
            const shouldInvert = this.invertColors.checked;
            
            let width, height;
            
            // Check if user specified total characters
            const totalCharsInput = this.totalChars.value.trim();
            if (totalCharsInput && !isNaN(totalCharsInput) && parseInt(totalCharsInput) > 0) {
                // User specified total characters - calculate dimensions for that character count
                const totalChars = parseInt(totalCharsInput);
                const aspectRatio = imageToConvert.height / imageToConvert.width;
                
                // Calculate width and height to achieve target total characters
                width = Math.round(Math.sqrt(totalChars / (aspectRatio * 0.5)));
                height = Math.round(totalChars / width);
                
                // Ensure minimum dimensions
                width = Math.max(width, 10);
                height = Math.max(height, 5);
                
                console.log(`Using total characters: ${totalChars}, calculated dimensions: ${width}×${height} = ${width * height} chars`);
            } else {
                // Use default total characters (10,000) when input is empty
                const defaultTotalChars = 10000;
                const aspectRatio = imageToConvert.height / imageToConvert.width;
                
                // Calculate width and height to achieve default total characters
                width = Math.round(Math.sqrt(defaultTotalChars / (aspectRatio * 0.5)));
                height = Math.round(defaultTotalChars / width);
                
                // Ensure minimum dimensions
                width = Math.max(width, 10);
                height = Math.max(height, 5);
                
                console.log(`Using default total characters: ${defaultTotalChars}, calculated dimensions: ${width}×${height} = ${width * height} chars`);
            }
            
            // Set canvas size
            this.canvas.width = width;
            this.canvas.height = height;
            
            // Draw image on canvas
            this.ctx.drawImage(imageToConvert, 0, 0, width, height);
            
            // Get image data
            const imageData = this.ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            let ascii = '';
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const pixelIndex = (i * width + j) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    
                    // Calculate brightness
                    const brightness = (r + g + b) / 3;
                    
                    // Apply contrast (using default value)
                    const adjustedBrightness = Math.max(0, Math.min(255, brightness * contrast));
                    
                    // Map brightness to character
                    const charIndex = Math.floor((adjustedBrightness / 255) * (charset.length - 1));
                    
                    // Apply inversion if checked
                    const finalCharIndex = shouldInvert ? (charset.length - 1 - charIndex) : charIndex;
                    ascii += charset[finalCharIndex];
                }
                ascii += '\n';
            }
            
            this.asciiResult = ascii;
            this.asciiOutput.textContent = ascii;
            
            // Adjust font size to maintain consistent visual output size
            this.adjustFontSizeForCharacterCount(width, height);
            
            this.asciiOutput.classList.remove('hidden');
            this.downloadBtn.classList.remove('hidden');
            this.loading.classList.add('hidden');
            
            // Apply custom colors
            this.updateOutputColors();
        }, 100);
    }
    
    adjustFontSizeForCharacterCount(width, height) {
        // Calculate font size to maintain consistent visual output size
        // Base calculation on a target display area
        const targetDisplayWidth = 800; // pixels
        const targetDisplayHeight = 600; // pixels
        
        // Calculate what font size would fit this character grid in the target area
        const fontSizeByWidth = Math.max(1, Math.floor(targetDisplayWidth / width));
        const fontSizeByHeight = Math.max(1, Math.floor(targetDisplayHeight / height));
        
        // Use the smaller of the two to ensure it fits
        const fontSize = Math.min(fontSizeByWidth, fontSizeByHeight);
        const lineHeight = fontSize;
        
        // Apply the calculated font size
        this.asciiOutput.style.fontSize = `${fontSize}px`;
        this.asciiOutput.style.lineHeight = `${lineHeight}px`;
        
        console.log(`Adjusted font size to ${fontSize}px for ${width}×${height} character grid`);
    }
    
    downloadAscii() {
        if (!this.asciiResult) return;
        
        // Show download loader
        this.downloadLoading.classList.remove('hidden');
        this.downloadBtn.disabled = true;
        this.downloadBtn.textContent = 'Preparing Download...';
        
        const format = this.downloadFormat.value;
        
        // Use setTimeout to allow UI to update before starting download
        setTimeout(() => {
            switch (format) {
                case 'png':
                    this.downloadAsPNG();
                    break;
                case 'svg':
                    this.downloadAsSVG();
                    break;
                case 'txt':
                    this.downloadAsText();
                    break;
                default:
                    this.downloadAsPNG();
            }
        }, 100);
    }
    
    hideDownloadLoader() {
        this.downloadLoading.classList.add('hidden');
        this.downloadBtn.disabled = false;
        this.downloadBtn.textContent = 'Download ASCII';
    }
    
    downloadAsPNG() {
        // Create a temporary canvas for rendering ASCII as image
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        
        // High-quality settings
        const fontSize = 16; // Increased from 8
        const lineHeight = 16; // Increased from 8
        const scaleFactor = 2; // For high DPI/retina displays
        
        // Set up font and measure text
        downloadCtx.font = `${fontSize}px 'Courier New', monospace`;
        
        // Split ASCII into lines and calculate canvas dimensions
        const lines = this.asciiResult.split('\n').filter(line => line.length > 0);
        const maxLineLength = Math.max(...lines.map(line => line.length));
        
        // Calculate canvas size with higher resolution
        const charWidth = downloadCtx.measureText('M').width;
        const baseWidth = Math.ceil(maxLineLength * charWidth) + 40; // Increased padding
        const baseHeight = Math.ceil(lines.length * lineHeight) + 40; // Increased padding
        
        // Scale for high quality
        const canvasWidth = baseWidth * scaleFactor;
        const canvasHeight = baseHeight * scaleFactor;
        
        // Set canvas dimensions
        downloadCanvas.width = canvasWidth;
        downloadCanvas.height = canvasHeight;
        
        // Scale context for high DPI
        downloadCtx.scale(scaleFactor, scaleFactor);
        
        // Enable font smoothing and high-quality rendering
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        downloadCtx.textRenderingOptimization = 'optimizeQuality';
        
        // Fill background with selected color
        downloadCtx.fillStyle = this.backgroundColor.value;
        downloadCtx.fillRect(0, 0, baseWidth, baseHeight);
        
        // Set text properties with selected color and high quality
        downloadCtx.font = `${fontSize}px 'Courier New', monospace`;
        downloadCtx.fillStyle = this.textColor.value;
        downloadCtx.textBaseline = 'top';
        downloadCtx.textAlign = 'left';
        
        // Draw each line of ASCII art with better positioning
        lines.forEach((line, index) => {
            const x = 20; // Increased padding
            const y = 20 + (index * lineHeight); // Increased padding
            downloadCtx.fillText(line, x, y);
        });
        
        // Convert canvas to blob with high quality settings
        downloadCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ascii-art-hq.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Hide download loader
            this.hideDownloadLoader();
        }, 'image/png', 1.0); // Maximum quality
    }
    
    downloadAsSVG() {
        const lines = this.asciiResult.split('\n').filter(line => line.length > 0);
        const maxLineLength = Math.max(...lines.map(line => line.length));
        
        // Higher quality settings for SVG
        const fontSize = 16; // Increased from 8
        const lineHeight = 18; // Slightly increased spacing
        const charWidth = 9.6; // Adjusted for larger font
        
        const width = Math.ceil(maxLineLength * charWidth) + 40; // Increased padding
        const height = Math.ceil(lines.length * lineHeight) + 40; // Increased padding
        
        let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${this.backgroundColor.value}"/>
    <style>
        .ascii-text {
            font-family: 'Courier New', monospace;
            font-size: ${fontSize}px;
            fill: ${this.textColor.value};
            white-space: pre;
            font-weight: normal;
            text-rendering: optimizeLegibility;
            shape-rendering: crispEdges;
        }
    </style>`;
        
        lines.forEach((line, index) => {
            const y = 20 + (index * lineHeight) + fontSize - 2; // Adjusted positioning
            svgContent += `\n    <text x="20" y="${y}" class="ascii-text">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
        });
        
        svgContent += '\n</svg>';
        
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art-hq.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Hide download loader
        this.hideDownloadLoader();
    }
    
    downloadAsText() {
        const blob = new Blob([this.asciiResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Hide download loader
        this.hideDownloadLoader();
    }
}
