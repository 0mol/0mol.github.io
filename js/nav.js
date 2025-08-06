fetch('components/nav.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('nav-placeholder').innerHTML = html;
    // 高亮当前导航
    const links = document.querySelectorAll('.nav-links a');
    const path = location.pathname.split('/').pop();
    links.forEach(link => {
      if(link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  }); 