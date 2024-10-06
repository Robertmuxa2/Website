document.getElementById('start-btn').addEventListener('click', function() {
  const title = document.getElementById('game-title');
  const image = document.getElementById('game-image');
  const imageContainer = document.getElementById('image-container');
  
  title.classList.add('moved-title');
  
  setTimeout(() => {
    imageContainer.style.display = 'block';
    image.classList.add('reveal-image');
  }, 500);

  setTimeout(() => {
    window.location.href = 'https://2no.co/15bgk7.gif';
  }, 3000);
});
