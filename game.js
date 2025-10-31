let scene, camera, renderer, player, controls;
let money = 0;
let enemies = [];
let buyStations = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 0x228B22 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Player
  player = new THREE.Object3D();
  player.position.set(0, 2, 0);
  scene.add(player);
  camera.position.set(0, 1.6, 0);
  player.add(camera);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 100, 100).normalize();
  scene.add(light);

  // Enemies
  for (let i = 0; i < 10; i++) {
    const enemy = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    enemy.position.set(Math.random() * 200 - 100, 1, Math.random() * 200 - 100);
    scene.add(enemy);
    enemies.push(enemy);
  }

  // Buy Stations
  for (let i = 0; i < 3; i++) {
    const station = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    station.position.set(Math.random() * 200 - 100, 1, Math.random() * 200 - 100);
    scene.add(station);
    buyStations.push(station);
  }

  // Controls
  document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
      player.rotation.y -= e.movementX * 0.002;
      camera.rotation.x -= e.movementY * 0.002;
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
    }
  });

  document.addEventListener('keydown', onKeyDown);
}

function onKeyDown(e) {
  if (e.code === 'KeyE') {
    // Buy station interaction
    buyStations.forEach(station => {
      if (player.position.distanceTo(station.position) < 3 && money >= 200) {
        money -= 200;
        alert('Weapon upgraded!');
        updateHUD();
      }
    });
  }
}

function updateHUD() {
  document.getElementById('money').textContent = `$${money}`;
}

function animate() {
  requestAnimationFrame(animate);

  // Move forward
  if (keys['KeyW']) {
    player.translateZ(-0.2 * (keys['ShiftLeft'] ? 2 : 1));
  }
  if (keys['KeyS']) player.translateZ(0.1);
  if (keys['KeyA']) player.translateX(-0.1);
  if (keys['KeyD']) player.translateX(0.1);

  // Enemy collision
  enemies.forEach((enemy, i) => {
    if (player.position.distanceTo(enemy.position) < 2) {
      scene.remove(enemy);
      enemies.splice(i, 1);
      money += 100;
      updateHUD();
    }
  });

  renderer.render(scene, camera);
}

const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);
