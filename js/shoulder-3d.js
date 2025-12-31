// Interactive 3D Shoulder Anatomy Viewer
// Using Three.js

// Shoulder anatomy parts data
const shoulderParts = [
    {
        id: 'scapula',
        name: 'עצם השכם (Scapula)',
        color: 0xE8F5E9,
        description: 'עצם משולשת שנמצאת בגב, מהווה חלק ממפרק הכתף ומספקת נקודת חיבור לשרירים רבים.',
        position: { x: 0, y: 0, z: -2 },
        size: { x: 3, y: 4, z: 0.3 }
    },
    {
        id: 'humerus',
        name: 'עצם הזרוע (Humerus)',
        color: 0xFFF3E0,
        description: 'עצם הזרוע העליונה, מתחברת למפרק הכתף בחלקה העליון.',
        position: { x: 0, y: -3, z: 0 },
        size: { x: 1.2, y: 5, z: 1.2 }
    },
    {
        id: 'clavicle',
        name: 'עצם הבריח (Clavicle)',
        color: 0xE1F5FE,
        description: 'עצם ארוכה המחברת את השכם לעצם החזה.',
        position: { x: 3, y: 2, z: 0 },
        size: { x: 4, y: 0.5, z: 0.5 }
    },
    {
        id: 'rotator_cuff',
        name: 'שרוול מסובב (Rotator Cuff)',
        color: 0xFFEBEE,
        description: 'קבוצת ארבעה שרירים וגידים המייצבת את מפרק הכתף ומאפשרת תנועה.',
        position: { x: 0, y: 0.5, z: 0.5 },
        size: { x: 2.5, y: 2.5, z: 1.5 }
    },
    {
        id: 'glenoid',
        name: 'חלל המפרק (Glenoid)',
        color: 0xF3E5F5,
        description: 'החלק המעוגל של השכם בו נשענת ראש עצם הזרוע.',
        position: { x: 0, y: 1, z: 0 },
        size: { x: 1.5, y: 1.5, z: 0.5 }
    },
    {
        id: 'labrum',
        name: 'לברום (Labrum)',
        color: 0xE0F2F1,
        description: 'טבעת סחוסית המקיפה את חלל המפרק ומעמיקה אותו.',
        position: { x: 0, y: 1, z: 0.3 },
        size: { x: 1.7, y: 1.7, z: 0.2 }
    },
    {
        id: 'acromion',
        name: 'האקרומיון (Acromion)',
        color: 0xFFF9C4,
        description: 'הזיז הגבוה ביותר של השכם, נקודת חיבור לעצם הבריח.',
        position: { x: 1.5, y: 2.5, z: 0 },
        size: { x: 1.5, y: 0.5, z: 1 }
    },
    {
        id: 'coracoid',
        name: 'הקורקואיד (Coracoid)',
        color: 0xF8BBD0,
        description: 'זיז קטן של השכם, משמש כנקודת חיבור לשרירים ורצועות.',
        position: { x: 1, y: 1.5, z: 1 },
        size: { x: 0.7, y: 1, z: 0.7 }
    }
];

// Three.js setup
let scene, camera, renderer, controls;
let meshes = [];
let selectedPart = null;
let autoRotate = false;
let showLabels = false;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x667eea);

    // Add gradient background
    const canvas = document.getElementById('canvas-container');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 5, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create shoulder parts
    createShoulderParts();

    // Mouse controls
    setupControls();

    // Event listeners
    setupEventListeners();

    // Populate sidebar
    populateSidebar();

    // Render loop
    animate();
}

function createShoulderParts() {
    shoulderParts.forEach((part, index) => {
        const geometry = new THREE.BoxGeometry(
            part.size.x,
            part.size.y,
            part.size.z
        );

        const material = new THREE.MeshPhongMaterial({
            color: part.color,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(part.position.x, part.position.y, part.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { partId: part.id, index: index };

        // Add edge wireframe
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(wireframe);

        scene.add(mesh);
        meshes.push(mesh);
    });
}

function setupControls() {
    const canvas = renderer.domElement;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            meshes.forEach(mesh => {
                mesh.rotation.y += deltaX * 0.01;
                mesh.rotation.x += deltaY * 0.01;
            });
        }

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };

        // Highlight on hover
        handleHover(e);
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('click', (e) => {
        handleClick(e);
    });

    // Mouse wheel for zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(5, Math.min(20, camera.position.z));
    });
}

function handleHover(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(meshes);

    // Reset all
    meshes.forEach(mesh => {
        if (mesh !== selectedPart) {
            mesh.material.emissive = new THREE.Color(0x000000);
        }
    });

    const label = document.getElementById('canvasLabel');

    if (intersects.length > 0 && showLabels) {
        const intersected = intersects[0].object;
        if (intersected !== selectedPart) {
            intersected.material.emissive = new THREE.Color(0x333333);
        }

        // Show label
        const partData = shoulderParts[intersected.userData.index];
        label.textContent = partData.name;
        label.style.left = event.clientX - rect.left + 'px';
        label.style.top = event.clientY - rect.top - 40 + 'px';
        label.classList.add('show');
    } else {
        label.classList.remove('show');
    }
}

function handleClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        selectPart(intersects[0].object);
    }
}

function selectPart(mesh) {
    // Deselect previous
    if (selectedPart) {
        selectedPart.material.emissive = new THREE.Color(0x000000);
        selectedPart.material.opacity = 0.85;
    }

    selectedPart = mesh;
    selectedPart.material.emissive = new THREE.Color(0x444444);
    selectedPart.material.opacity = 1;

    // Update info panel
    const partData = shoulderParts[mesh.userData.index];
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.innerHTML = `
        <h4>${partData.name}</h4>
        <p>${partData.description}</p>
    `;

    // Update sidebar selection
    document.querySelectorAll('.part-item').forEach((item, index) => {
        item.classList.toggle('active', index === mesh.userData.index);
    });
}

function setupEventListeners() {
    document.getElementById('resetView').addEventListener('click', () => {
        camera.position.set(8, 5, 12);
        camera.lookAt(0, 0, 0);
        meshes.forEach(mesh => {
            mesh.rotation.set(0, 0, 0);
        });
    });

    document.getElementById('toggleRotation').addEventListener('click', (e) => {
        autoRotate = !autoRotate;
        e.target.classList.toggle('active', autoRotate);
        const icon = e.target.querySelector('i');
        icon.setAttribute('data-lucide', autoRotate ? 'pause' : 'play');
        lucide.createIcons();
    });

    document.getElementById('toggleLabels').addEventListener('click', (e) => {
        showLabels = !showLabels;
        e.target.classList.toggle('active', showLabels);
    });

    window.addEventListener('resize', () => {
        const canvas = document.getElementById('canvas-container');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function populateSidebar() {
    const partList = document.getElementById('partList');
    shoulderParts.forEach((part, index) => {
        const item = document.createElement('div');
        item.className = 'part-item';
        item.innerHTML = `
            <div class="part-color" style="background-color: #${part.color.toString(16).padStart(6, '0')};"></div>
            <span>${part.name}</span>
        `;
        item.addEventListener('click', () => {
            selectPart(meshes[index]);
        });
        partList.appendChild(item);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
        meshes.forEach(mesh => {
            mesh.rotation.y += 0.005;
        });
    }

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
