let mouse = { x: 0, y: 0 };
let particles = [];
let currentTextIndex = 0;
let nextTextTimeout;
const explosionRadius = 200; // радиус взрыва
const gravity = 0.05; // гравитация для частиц
const fadeSpeed = 0.02; // скорость затухания частиц

// Функция для создания частиц
function createParticles() {
    for (let i = 0; i < config.particleCount; i++) {
        particles[i] = {
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
        };
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
            particle.speedX *= 0.98;
            particle.speedY += gravity;
            particle.brightness -= fadeSpeed;

            // Изменение цвета частиц при взрыве
            particle.color += 2; 

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

            // Постепенное изменение цвета частиц
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

canvas.addEventListener("click", (event) => {
    // Взрыв частиц при клике
    particles.forEach((particle) => {
        let distX = event.clientX - particle.x;
        let distY = event.clientY - particle.y;
        let distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < explosionRadius) {
            particle.isExploding = true;
            const angle = Math.random() * Math.PI * 2; // угол разлетания
            particle.speedX = Math.cos(angle) * 10;
            particle.speedY = Math.sin(angle) * 10;
            particle.brightness = 1;
        }
    });
});

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

// Начальные настройки
gl.clearColor(0, 0, 0, 1);
createParticles();
animate();
nextTextTimeout = setTimeout(changeText, config.textChangeInterval);
