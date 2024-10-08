let mouse = { x: 0, y: 0 };
let particles = [];
let currentTextIndex = 0;
let nextTextTimeout;

// Параметры конфигурации
const config = {
    particleCount: 500, // Количество частиц
    explosionRadius: 150, // Радиус взрыва
    gravity: 0.03, // Гравитация
    fadeSpeed: 0.02, // Скорость затухания
    textChangeInterval: 5000, // Интервал смены текста
    colorChangeSpeed: 1.5, // Скорость изменения цвета частиц
    autoplayInterval: 2000 // Интервал автопроигрывания
};

// Функция для создания частиц
function createParticles() {
    particles.length = 0; // Очистить старые частицы
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            baseX: Math.random() * canvas.width,
            baseY: Math.random() * canvas.height,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 1,
            originalSize: Math.random() * 5 + 1,
            color: Math.random() * 360, // начальный цвет по HSL
            speedX: (Math.random() - 0.5) * 5,
            speedY: (Math.random() - 0.5) * 5,
            brightness: 1,
            isExploding: false,
            angle: Math.random() * 360, // угол для разлетания
        });
    }
}

// Функция анимации
function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    particles.forEach((particle) => {
        if (particle.isExploding) {
            // Анимация взрыва
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedX *= 0.98; // Замедление взрыва
            particle.speedY += config.gravity; // Гравитация
            particle.brightness -= config.fadeSpeed;

            particle.color += config.colorChangeSpeed; // Изменение цвета

            if (particle.brightness <= 0) {
                particle.brightness = 0;
                particle.isExploding = false;
                particle.x = particle.baseX;
                particle.y = particle.baseY;
            }
        } else {
            // Плавное движение к базовой позиции
            particle.x += (particle.baseX - particle.x) * 0.05;
            particle.y += (particle.baseY - particle.y) * 0.05;

            particle.color += 0.5;
            particle.brightness = 0.5 + Math.random() * 0.5;
        }

        // Рисуем частицы
        gl.fillStyle = `hsla(${particle.color}, 100%, 50%, ${particle.brightness})`;
        gl.beginPath();
        gl.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        gl.fill();
    });
    requestAnimationFrame(animate);
}

// Обработчики событий
canvas.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / canvas.width) * 2 - 1;
    mouse.y = (event.clientY / canvas.height) * -2 + 1;
});

canvas.addEventListener("mouseleave", () => {
    mouse.x = -500;
    mouse.y = -500;
});

// Функция для выполнения клика
function triggerExplosion(event) {
    particles.forEach((particle) => {
        let distX = event.clientX - particle.x;
        let distY = event.clientY - particle.y;
        let distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < config.explosionRadius) {
            particle.isExploding = true;
            const angle = Math.random() * Math.PI * 2; // угол разлетания
            particle.speedX = Math.cos(angle) * 10;
            particle.speedY = Math.sin(angle) * 10;
            particle.brightness = 1;
        }
    });
}

// Автоматическое срабатывание клика
function autoplay() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    triggerExplosion({ clientX: x, clientY: y });
}

// Интервал автопроигрывания
setInterval(autoplay, config.autoplayInterval);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    createParticles();
});

// Функция для изменения текста
function changeText() {
    currentTextIndex = (currentTextIndex + 1) % config.textArray.length;
    const newCoordinates = getTextCoordinates(config.textArray[currentTextIndex]);

    particles.forEach((particle, i) => {
        const randomIndex = Math.floor(Math.random() * newCoordinates.length);
        const { x, y } = newCoordinates[randomIndex];
        particle.baseX = x;
        particle.baseY = y;
        particle.isExploding = false;
        particle.brightness = 1;
    });

    nextTextTimeout = setTimeout(changeText, config.textChangeInterval);
}

// Добавляем UI настройки
const controls = document.createElement('div');
controls.innerHTML = `
    <label>Particle Count: <input type="range" min="100" max="1000" value="${config.particleCount}" id="particleCount"></label>
    <label>Explosion Radius: <input type="range" min="50" max="300" value="${config.explosionRadius}" id="explosionRadius"></label>
    <label>Gravity: <input type="range" min="0.01" max="0.1" step="0.01" value="${config.gravity}" id="gravity"></label>
    <label>Fade Speed: <input type="range" min="0.01" max="0.1" step="0.01" value="${config.fadeSpeed}" id="fadeSpeed"></label>
    <label>Autoplay Interval: <input type="range" min="500" max="5000" step="500" value="${config.autoplayInterval}" id="autoplayInterval"></label>
`;
document.body.appendChild(controls);

// Обновляем параметры на лету
document.getElementById('particleCount').addEventListener('input', (e) => {
    config.particleCount = e.target.value;
    createParticles(); // Пересоздаем частицы при изменении
});
document.getElementById('explosionRadius').addEventListener('input', (e) => {
    config.explosionRadius = e.target.value;
});
document.getElementById('gravity').addEventListener('input', (e) => {
    config.gravity = e.target.value;
});
document.getElementById('fadeSpeed').addEventListener('input', (e) => {
    config.fadeSpeed = e.target.value;
});
document.getElementById('autoplayInterval').addEventListener('input', (e) => {
    config.autoplayInterval = e.target.value;
});

// Начальные настройки
gl.clearColor(0, 0, 0, 1);
createParticles();
animate();
nextTextTimeout = setTimeout(changeText, config.textChangeInterval);
