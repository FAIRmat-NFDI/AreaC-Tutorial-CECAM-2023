document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.click-zoom img');

  images.forEach((img) => {
    const initialWidth = img.getAttribute('width') || '30%';
    img.style.width = initialWidth;

    img.addEventListener('click', function() {
      if (this.classList.contains('expanded')) {
        this.style.width = initialWidth;
        this.classList.remove('expanded');
      } else {
        this.style.width = '100%';
        this.classList.add('expanded');
      }
    });
  });
});