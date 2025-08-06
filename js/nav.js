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
    // 主题切换按钮
    let themeBtn = document.createElement('button');
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️ 浅色' : '🌙 深色';
    themeBtn.style.marginLeft = '18px';
    themeBtn.style.background = 'none';
    themeBtn.style.border = 'none';
    themeBtn.style.cursor = 'pointer';
    themeBtn.style.fontSize = '1.1em';
    themeBtn.onclick = () => {
      document.body.classList.toggle('dark');
      themeBtn.textContent = document.body.classList.contains('dark') ? '☀️ 浅色' : '🌙 深色';
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : '');
    };
    document.querySelector('.navbar').appendChild(themeBtn);
    // 自动读取主题
    if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');
  }); 