import * as THREE from 'three'

// Three.js ASCII Framebuffer Background Animation
export class ThreeJSBackground {
    constructor() {
        this.container = document.getElementById('threejs-background');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.asciiChars = '@%#*+=-:. ';
        this.textMeshes = [];
        this.framebufferTexture = null;
        this.renderTarget = null;
        this.time = 0;
        
        this.init();
        this.createFramebuffer();
        this.createASCIIField();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 10;
        
        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x00ff88, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x0099ff, 0.6, 50);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);
    }
    
    createFramebuffer() {
        // Create render target for framebuffer effect
        this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
    }
    
    createASCIIField() {
        // Create a field of ASCII characters
        const gridSize = 15;
        const spacing = 1.5;
        
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < 5; z++) {
                    // Create geometry for each ASCII character
                    const char = this.asciiChars[Math.floor(Math.random() * this.asciiChars.length)];
                    const geometry = this.createASCIIGeometry(char);
                    
                    const material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color().setHSL(
                            0.4 + Math.sin(x * 0.1 + y * 0.1) * 0.2,
                            0.7,
                            0.6 + Math.cos(z * 0.2) * 0.3
                        ),
                        transparent: true,
                        opacity: 0.4 + Math.random() * 0.3,
                        wireframe: Math.random() > 0.7
                    });
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    
                    // Position in 3D grid
                    mesh.position.set(
                        (x - gridSize / 2) * spacing,
                        (y - gridSize / 2) * spacing,
                        (z - 2) * spacing * 2
                    );
                    
                    // Random rotation
                    mesh.rotation.set(
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    );
                    
                    // Store animation data
                    mesh.userData = {
                        originalPosition: mesh.position.clone(),
                        rotationSpeed: {
                            x: (Math.random() - 0.5) * 0.02,
                            y: (Math.random() - 0.5) * 0.02,
                            z: (Math.random() - 0.5) * 0.02
                        },
                        floatSpeed: Math.random() * 0.01 + 0.005,
                        floatAmplitude: Math.random() * 2 + 0.5,
                        phaseOffset: Math.random() * Math.PI * 2
                    };
                    
                    this.textMeshes.push(mesh);
                    this.scene.add(mesh);
                }
            }
        }
        
        // Create additional flowing particles
        this.createFlowingParticles();
    }
    
    createASCIIGeometry(char) {
        // Create different geometries based on ASCII character
        switch (char) {
            case '@':
                return new THREE.SphereGeometry(0.15, 8, 8);
            case '%':
                return new THREE.BoxGeometry(0.2, 0.2, 0.2);
            case '#':
                return new THREE.OctahedronGeometry(0.15);
            case '*':
                return new THREE.TetrahedronGeometry(0.15);
            case '+':
                return new THREE.ConeGeometry(0.1, 0.3, 4);
            case '=':
                return new THREE.CylinderGeometry(0.1, 0.1, 0.3, 6);
            case '-':
                return new THREE.BoxGeometry(0.3, 0.05, 0.05);
            case ':':
                return new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
            case '.':
                return new THREE.SphereGeometry(0.05, 6, 6);
            default:
                return new THREE.BoxGeometry(0.1, 0.1, 0.1);
        }
    }
    
    createFlowingParticles() {
        // Add flowing particle system
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            const hue = 0.3 + Math.random() * 0.4;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 0.5 + 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    updateFramebuffer() {
        // Render scene to framebuffer for feedback effect
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        
        // Apply framebuffer texture to some meshes for feedback effect
        if (this.textMeshes.length > 0 && this.renderTarget.texture) {
            const feedbackMeshes = this.textMeshes.filter((_, index) => index % 10 === 0);
            feedbackMeshes.forEach(mesh => {
                if (Math.random() > 0.95) { // Occasionally update texture
                    mesh.material.map = this.renderTarget.texture;
                    mesh.material.needsUpdate = true;
                }
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Animate ASCII meshes with complex movements
        this.textMeshes.forEach((mesh, index) => {
            const userData = mesh.userData;
            
            // Rotation animation
            mesh.rotation.x += userData.rotationSpeed.x;
            mesh.rotation.y += userData.rotationSpeed.y;
            mesh.rotation.z += userData.rotationSpeed.z;
            
            // Floating animation with wave patterns
            const waveY = Math.sin(this.time * userData.floatSpeed + userData.phaseOffset) * userData.floatAmplitude;
            const waveX = Math.cos(this.time * userData.floatSpeed * 0.7 + userData.phaseOffset) * userData.floatAmplitude * 0.5;
            const waveZ = Math.sin(this.time * userData.floatSpeed * 1.3 + userData.phaseOffset) * userData.floatAmplitude * 0.3;
            
            mesh.position.x = userData.originalPosition.x + waveX;
            mesh.position.y = userData.originalPosition.y + waveY;
            mesh.position.z = userData.originalPosition.z + waveZ;
            
            // Color animation
            const hue = (0.4 + Math.sin(this.time * 0.5 + index * 0.1) * 0.3) % 1;
            mesh.material.color.setHSL(hue, 0.7, 0.6);
            
            // Opacity pulsing
            mesh.material.opacity = 0.3 + Math.sin(this.time * 2 + index * 0.2) * 0.2;
        });
        
        // Animate particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(this.time + i) * 0.002; // X
                positions[i + 1] += Math.cos(this.time + i) * 0.002; // Y
                positions[i + 2] += Math.sin(this.time * 0.5 + i) * 0.001; // Z
                
                // Wrap around boundaries
                if (positions[i] > 15) positions[i] = -15;
                if (positions[i] < -15) positions[i] = 15;
                if (positions[i + 1] > 15) positions[i + 1] = -15;
                if (positions[i + 1] < -15) positions[i + 1] = 15;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
            
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }
        
        // Camera movement with more complex patterns
        const radius = 8;
        this.camera.position.x = Math.cos(this.time * 0.3) * radius * 0.3;
        this.camera.position.y = Math.sin(this.time * 0.2) * radius * 0.2;
        this.camera.position.z = 10 + Math.sin(this.time * 0.1) * 2;
        this.camera.lookAt(0, 0, 0);
        
        // Update framebuffer effect
        this.updateFramebuffer();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Update render target size
            this.renderTarget.setSize(
                Math.min(window.innerWidth, 512),
                Math.min(window.innerHeight, 512)
            );
        });
    }
}
