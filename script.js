let mouse = { x: 0, y: 0 };
let particles = [];
let currentTextIndex = 0;
let nextTextTimeout;
const explosionRadius = 200; // радиус взрыва частиц при клике

// Функция для создания частиц
function createParticles() {
	for (let i = 0; i < config.particleCount; i++) {
		particles[i] = {
			baseX: Math.random() * canvas.width,
			baseY: Math.random() * canvas.height,
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 5 + 1,
			originalSize: Math.random() * 5 + 1, // исходный размер
			color: `hsl(${Math.random() * 360}, 100%, 50%)`,
			speedX: (Math.random() - 0.5) * 5,
			speedY: (Math.random() - 0.5) * 5,
			isExploding: false, // флаг взрыва
		};
	}
}

// Функция для получения координат текста
function getTextCoordinates(text) {
	// Логика для получения координат текста
}

// Функция анимации
function animate() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	particles.forEach((particle) => {
		if (particle.isExploding) {
			// Анимация взрыва частиц
			particle.x += particle.speedX;
			particle.y += particle.speedY;
			particle.size -= 0.05; // Уменьшение размера после взрыва
			if (particle.size <= 0) particle.size = particle.originalSize;
		} else {
			// Плавное движение к позиции текста или мыши
			particle.x += (particle.baseX - particle.x) * 0.05;
			particle.y += (particle.baseY - particle.y) * 0.05;

			// Легкое растяжение частиц при наведении мыши
			let distX = particle.x - mouse.x;
			let distY = particle.y - mouse.y;
			let distance = Math.sqrt(distX * distX + distY * distY);
			if (distance < 100) {
				particle.size = Math.min(particle.originalSize * 2, 10); // Увеличение размера
			} else {
				particle.size = particle.originalSize;
			}
		}

		// Рисуем частицы
		gl.fillStyle = particle.color;
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
			particle.speedX = (Math.random() - 0.5) * 10;
			particle.speedY = (Math.random() - 0.5) * 10;
		}
	});
});

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	createParticles();
});

// Функция для плавного изменения текста
function changeText() {
	currentTextIndex = (currentTextIndex + 1) % config.textArray.length;
	const newCoordinates = getTextCoordinates(config.textArray[currentTextIndex]);
	particles.forEach((particle, i) => {
		const randomIndex = Math.floor(Math.random() * newCoordinates.length);
		const { x, y } = newCoordinates[randomIndex];
		particle.baseX = x;
		particle.baseY = y;
		particle.isExploding = false; // сброс взрыва
	});
	nextTextTimeout = setTimeout(changeText, config.textChangeInterval);
}

// Начальные настройки
gl.clearColor(0, 0, 0, 1);
createParticles();
animate();
nextTextTimeout = setTimeout(changeText, config.textChangeInterval);
