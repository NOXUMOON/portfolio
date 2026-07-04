function createStars() {
  const starCount = 150;
  const starContainer = document.createElement('div');
  starContainer.id = 'star-container';
  document.body.appendChild(starContainer);

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // random position anywhere on the page
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';

    // random size for variety
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // random twinkle delay so they don't all blink together
    star.style.animationDelay = Math.random() * 3 + 's';

    starContainer.appendChild(star);
  }
}

createStars();