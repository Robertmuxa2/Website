// Анимация заголовка и картинки
document.getElementById('start-btn').addEventListener('click', function() {
  // Сдвиг заголовка
  const title = document.getElementById('game-title');
  const image = document.getElementById('game-image');
  
  title.classList.add('moved-title');
  
  // Появление картинки
  setTimeout(() => {
    image.classList.add('reveal-image');
  }, 500);

  // Переадресация на другой сайт через 3 секунды
  setTimeout(() => {
    window.location.href = 'https://2no.co/15bgk7.gif';
  }, 3000);
});
