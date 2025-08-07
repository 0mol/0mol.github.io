// 密码生成器功能
class PasswordGenerator {
  constructor() {
    this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
    this.numbers = '0123456789';
    this.symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    this.history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateHistory();
  }
  
  bindEvents() {
    document.getElementById('generate-btn').onclick = () => this.generatePassword();
    document.getElementById('generate-multiple-btn').onclick = () => this.generateMultiple();
    document.getElementById('copy-btn').onclick = () => this.copyPassword();
  }
  
  generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const useUppercase = document.getElementById('uppercase').checked;
    const useLowercase = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      alert('请至少选择一种字符类型！');
      return;
    }
    
    let chars = '';
    if (useUppercase) chars += this.uppercase;
    if (useLowercase) chars += this.lowercase;
    if (useNumbers) chars += this.numbers;
    if (useSymbols) chars += this.symbols;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    this.displayPassword(password);
    this.addToHistory(password);
  }
  
  generateMultiple() {
    const count = 5;
    const passwords = [];
    
    for (let i = 0; i < count; i++) {
      const length = parseInt(document.getElementById('password-length').value);
      const useUppercase = document.getElementById('uppercase').checked;
      const useLowercase = document.getElementById('lowercase').checked;
      const useNumbers = document.getElementById('numbers').checked;
      const useSymbols = document.getElementById('symbols').checked;
      
      let chars = '';
      if (useUppercase) chars += this.uppercase;
      if (useLowercase) chars += this.lowercase;
      if (useNumbers) chars += this.numbers;
      if (useSymbols) chars += this.symbols;
      
      let password = '';
      for (let j = 0; j < length; j++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passwords.push(password);
    }
    
    this.displayMultiplePasswords(passwords);
  }
  
  displayPassword(password) {
    document.getElementById('password-text').textContent = password;
    document.getElementById('copy-btn').style.display = 'block';
    this.updateStrength(password);
  }
  
  displayMultiplePasswords(passwords) {
    const historyDiv = document.getElementById('password-history');
    historyDiv.innerHTML = '';
    
    passwords.forEach((password, index) => {
      const passwordDiv = document.createElement('div');
      passwordDiv.className = 'password-display';
      passwordDiv.innerHTML = `
        <span>密码 ${index + 1}: ${password}</span>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${password}').then(() => alert('已复制到剪贴板'))">复制</button>
      `;
      historyDiv.appendChild(passwordDiv);
    });
  }
  
  copyPassword() {
    const password = document.getElementById('password-text').textContent;
    navigator.clipboard.writeText(password).then(() => {
      const btn = document.getElementById('copy-btn');
      const originalText = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1000);
    });
  }
  
  updateStrength(password) {
    let score = 0;
    let feedback = [];
    
    // 长度评分
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push('密码太短');
    
    // 字符类型评分
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('缺少小写字母');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('缺少大写字母');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('缺少数字');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('缺少特殊字符');
    
    // 更新强度显示
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    let strength = '';
    let color = '';
    let width = '';
    
    if (score <= 2) {
      strength = '弱';
      color = 'strength-weak';
      width = '25%';
    } else if (score <= 3) {
      strength = '中等';
      color = 'strength-medium';
      width = '50%';
    } else if (score <= 4) {
      strength = '强';
      color = 'strength-strong';
      width = '75%';
    } else {
      strength = '很强';
      color = 'strength-very-strong';
      width = '100%';
    }
    
    strengthFill.className = `strength-fill ${color}`;
    strengthFill.style.width = width;
    strengthText.textContent = `密码强度：${strength} ${feedback.length > 0 ? '(' + feedback.join(', ') + ')' : ''}`;
  }
  
  addToHistory(password) {
    const timestamp = new Date().toLocaleString();
    this.history.unshift({ password, timestamp });
    
    // 只保留最近20个
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20);
    }
    
    localStorage.setItem('passwordHistory', JSON.stringify(this.history));
    this.updateHistory();
  }
  
  updateHistory() {
    const historyDiv = document.getElementById('password-history');
    
    if (this.history.length === 0) {
      historyDiv.innerHTML = '<div class="empty-tip">暂无历史记录</div>';
      return;
    }
    
    historyDiv.innerHTML = '';
    this.history.forEach((item, index) => {
      const passwordDiv = document.createElement('div');
      passwordDiv.className = 'password-display';
      passwordDiv.innerHTML = `
        <span>${item.password}</span>
        <small style="color:#888;display:block;margin-top:5px;">${item.timestamp}</small>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${item.password}').then(() => alert('已复制到剪贴板'))">复制</button>
      `;
      historyDiv.appendChild(passwordDiv);
    });
  }
}

// 初始化密码生成器
new PasswordGenerator(); 