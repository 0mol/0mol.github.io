// 专业密码生成器 - 产品级别实现
class ProfessionalPasswordGenerator {
  constructor() {
    this.currentPassword = '';
    this.history = [];
    this.batchPasswords = [];
    this.charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      similar: '0O1Il',
      ambiguous: '{[|]}'
    };
    
    this.initializeEventListeners();
    this.loadHistory();
    this.updateCharOptions();
  }

  initializeEventListeners() {
    // 长度滑块
    document.getElementById('length-slider').addEventListener('input', (e) => {
      this.updateLength(e.target.value);
    });

    // 字符选项变化
    document.querySelectorAll('.char-option input').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateStrength();
      });
    });

    // 密码类型变化
    document.getElementById('password-type').addEventListener('change', (e) => {
      this.updateCharOptions();
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'g':
            e.preventDefault();
            this.generatePassword();
            break;
          case 'c':
            e.preventDefault();
            this.copyPassword();
            break;
          case 'r':
            e.preventDefault();
            this.regeneratePassword();
            break;
        }
      }
    });
  }

  updateLength(value) {
    document.getElementById('length-value').textContent = value;
    this.updateStrength();
  }

  updateCharOptions() {
    const type = document.getElementById('password-type').value;
    const checkboxes = {
      uppercase: document.getElementById('uppercase'),
      lowercase: document.getElementById('lowercase'),
      numbers: document.getElementById('numbers'),
      symbols: document.getElementById('symbols'),
      similar: document.getElementById('similar'),
      ambiguous: document.getElementById('ambiguous')
    };

    // 重置所有选项
    Object.values(checkboxes).forEach(checkbox => {
      checkbox.checked = false;
    });

    // 根据类型设置选项
    switch (type) {
      case 'alphanumeric':
        checkboxes.uppercase.checked = true;
        checkboxes.lowercase.checked = true;
        checkboxes.numbers.checked = true;
        break;
      case 'letters':
        checkboxes.uppercase.checked = true;
        checkboxes.lowercase.checked = true;
        break;
      case 'numbers':
        checkboxes.numbers.checked = true;
        break;
      case 'symbols':
        checkboxes.symbols.checked = true;
        break;
      case 'pronounceable':
        checkboxes.uppercase.checked = true;
        checkboxes.lowercase.checked = true;
        checkboxes.numbers.checked = true;
        break;
      case 'memorable':
        checkboxes.uppercase.checked = true;
        checkboxes.lowercase.checked = true;
        checkboxes.numbers.checked = true;
        break;
      case 'custom':
      default:
        checkboxes.uppercase.checked = true;
        checkboxes.lowercase.checked = true;
        checkboxes.numbers.checked = true;
        break;
    }

    this.updateStrength();
  }

  generatePassword() {
    try {
      const length = parseInt(document.getElementById('length-slider').value);
      const type = document.getElementById('password-type').value;
      
      let password = '';
      
      switch (type) {
        case 'pronounceable':
          password = this.generatePronounceablePassword(length);
          break;
        case 'memorable':
          password = this.generateMemorablePassword(length);
          break;
        default:
          password = this.generateRandomPassword(length);
          break;
      }
      
      this.currentPassword = password;
      this.displayPassword(password);
      this.updateStrength();
      this.addToHistory(password);
      this.showSuccess('密码生成成功');
      
    } catch (error) {
      this.showError('生成失败: ' + error.message);
    }
  }

  generateRandomPassword(length) {
    const charPool = this.getCharacterPool();
    
    if (charPool.length === 0) {
      throw new Error('请至少选择一种字符类型');
    }
    
    let password = '';
    const excludeSimilar = document.getElementById('similar').checked;
    const excludeAmbiguous = document.getElementById('ambiguous').checked;
    
    // 确保至少包含每种选中的字符类型
    const selectedTypes = this.getSelectedCharTypes();
    for (const type of selectedTypes) {
      const chars = this.charSets[type];
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // 填充剩余长度
    while (password.length < length) {
      const randomChar = charPool[Math.floor(Math.random() * charPool.length)];
      
      // 排除相似和歧义字符
      if (excludeSimilar && this.charSets.similar.includes(randomChar)) continue;
      if (excludeAmbiguous && this.charSets.ambiguous.includes(randomChar)) continue;
      
      password += randomChar;
    }
    
    // 打乱密码字符顺序
    return this.shuffleString(password);
  }

  generatePronounceablePassword(length) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const numbers = '0123456789';
    
    let password = '';
    let isVowel = Math.random() < 0.5;
    
    for (let i = 0; i < length; i++) {
      if (i % 3 === 2 && i < length - 1) {
        // 每3个字符后插入一个数字
        password += numbers[Math.floor(Math.random() * numbers.length)];
      } else {
        if (isVowel) {
          password += vowels[Math.floor(Math.random() * vowels.length)];
        } else {
          password += consonants[Math.floor(Math.random() * consonants.length)];
        }
        isVowel = !isVowel;
      }
    }
    
    return password;
  }

  generateMemorablePassword(length) {
    const words = [
      'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'house',
      'island', 'jungle', 'knight', 'lemon', 'mountain', 'night', 'ocean', 'planet',
      'queen', 'river', 'sunset', 'tiger', 'umbrella', 'village', 'window', 'xylophone',
      'yellow', 'zebra'
    ];
    
    const symbols = ['!', '@', '#', '$', '%', '^', '&', '*'];
    const numbers = '0123456789';
    
    let password = '';
    const wordCount = Math.floor(length / 8);
    
    for (let i = 0; i < wordCount && password.length < length; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      password += word.charAt(0).toUpperCase() + word.slice(1);
      
      if (password.length < length) {
        password += numbers[Math.floor(Math.random() * numbers.length)];
      }
      if (password.length < length) {
        password += symbols[Math.floor(Math.random() * symbols.length)];
      }
    }
    
    return password.substring(0, length);
  }

  getCharacterPool() {
    let pool = '';
    const selectedTypes = this.getSelectedCharTypes();
    
    for (const type of selectedTypes) {
      pool += this.charSets[type];
    }
    
    return pool;
  }

  getSelectedCharTypes() {
    const types = [];
    if (document.getElementById('uppercase').checked) types.push('uppercase');
    if (document.getElementById('lowercase').checked) types.push('lowercase');
    if (document.getElementById('numbers').checked) types.push('numbers');
    if (document.getElementById('symbols').checked) types.push('symbols');
    return types;
  }

  shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  displayPassword(password) {
    const display = document.getElementById('password-display');
    display.textContent = password;
  }

  copyPassword() {
    if (!this.currentPassword) {
      this.showError('请先生成密码');
      return;
    }
    
    navigator.clipboard.writeText(this.currentPassword).then(() => {
      this.showSuccess('密码已复制到剪贴板');
    }).catch(() => {
      this.showError('复制失败');
    });
  }

  regeneratePassword() {
    this.generatePassword();
  }

  clearPassword() {
    this.currentPassword = '';
    document.getElementById('password-display').textContent = '点击生成按钮创建密码';
    this.updateStrength();
    this.showSuccess('密码已清空');
  }

  updateStrength() {
    const password = this.currentPassword;
    if (!password) {
      this.updateStrengthDisplay('未生成', 'weak', 0);
      return;
    }
    
    const score = this.calculatePasswordStrength(password);
    const { level, text, width } = this.getStrengthLevel(score);
    
    this.updateStrengthDisplay(text, level, width);
  }

  calculatePasswordStrength(password) {
    let score = 0;
    
    // 基础分数
    score += password.length * 4;
    
    // 字符类型多样性
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    const charTypes = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
    score += (charTypes - 1) * 10;
    
    // 重复字符惩罚
    const uniqueChars = new Set(password).size;
    const repetitionPenalty = (password.length - uniqueChars) * 2;
    score -= repetitionPenalty;
    
    // 连续字符惩罚
    let consecutivePenalty = 0;
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);
      
      if (char2 === char1 + 1 && char3 === char2 + 1) {
        consecutivePenalty += 3;
      }
    }
    score -= consecutivePenalty;
    
    // 常见模式惩罚
    const commonPatterns = ['123', 'abc', 'qwe', 'asd', 'password', 'admin'];
    for (const pattern of commonPatterns) {
      if (password.toLowerCase().includes(pattern)) {
        score -= 10;
      }
    }
    
    return Math.max(0, score);
  }

  getStrengthLevel(score) {
    if (score < 20) {
      return { level: 'weak', text: '弱', width: 25 };
    } else if (score < 40) {
      return { level: 'fair', text: '一般', width: 50 };
    } else if (score < 60) {
      return { level: 'good', text: '良好', width: 75 };
    } else {
      return { level: 'strong', text: '强', width: 100 };
    }
  }

  updateStrengthDisplay(text, level, width) {
    const strengthText = document.getElementById('strength-text');
    const strengthFill = document.getElementById('strength-fill');
    
    strengthText.textContent = text;
    strengthFill.className = `strength-fill ${level}`;
    strengthFill.style.width = `${width}%`;
  }

  generateBatch() {
    const count = parseInt(document.getElementById('batch-count').value);
    if (count < 1 || count > 50) {
      this.showError('生成数量应在1-50之间');
      return;
    }
    
    this.batchPasswords = [];
    const container = document.getElementById('batch-results');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const password = this.generateRandomPassword(
        parseInt(document.getElementById('length-slider').value)
      );
      this.batchPasswords.push(password);
      
      const item = document.createElement('div');
      item.className = 'batch-item';
      item.textContent = password;
      item.addEventListener('click', () => this.copyToClipboard(password));
      container.appendChild(item);
    }
    
    this.showSuccess(`已生成 ${count} 个密码`);
  }

  copyBatch() {
    if (this.batchPasswords.length === 0) {
      this.showError('请先生成批量密码');
      return;
    }
    
    const text = this.batchPasswords.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('所有密码已复制到剪贴板');
    }).catch(() => {
      this.showError('复制失败');
    });
  }

  clearBatch() {
    this.batchPasswords = [];
    document.getElementById('batch-results').innerHTML = '';
    this.showSuccess('批量密码已清空');
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('密码已复制');
    }).catch(() => {
      this.showError('复制失败');
    });
  }

  addToHistory(password) {
    const historyItem = {
      password: password,
      timestamp: new Date().toLocaleString(),
      strength: this.calculatePasswordStrength(password)
    };
    
    this.history.unshift(historyItem);
    if (this.history.length > 100) {
      this.history.pop();
    }
    
    this.saveHistory();
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    this.history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-password">${item.password}</div>
        <div class="history-time">${item.timestamp}</div>
      `;
      historyItem.addEventListener('click', () => this.loadFromHistory(item));
      historyList.appendChild(historyItem);
    });
  }

  loadFromHistory(item) {
    this.currentPassword = item.password;
    this.displayPassword(item.password);
    this.updateStrength();
    this.showSuccess('已加载历史密码');
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.updateHistoryDisplay();
    this.showSuccess('历史记录已清空');
  }

  saveHistory() {
    localStorage.setItem('passwordHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const saved = localStorage.getItem('passwordHistory');
    if (saved) {
      this.history = JSON.parse(saved);
      this.updateHistoryDisplay();
    }
  }

  showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    setTimeout(() => {
      errorEl.style.display = 'none';
    }, 3000);
  }

  showSuccess(message) {
    const successEl = document.getElementById('success-message');
    successEl.textContent = message;
    successEl.style.display = 'block';
    
    setTimeout(() => {
      successEl.style.display = 'none';
    }, 2000);
  }
}

// 全局函数，用于HTML中的onclick事件
let passwordGenerator;

function generatePassword() {
  passwordGenerator.generatePassword();
}

function copyPassword() {
  passwordGenerator.copyPassword();
}

function regeneratePassword() {
  passwordGenerator.regeneratePassword();
}

function clearPassword() {
  passwordGenerator.clearPassword();
}

function generateBatch() {
  passwordGenerator.generateBatch();
}

function copyBatch() {
  passwordGenerator.copyBatch();
}

function clearBatch() {
  passwordGenerator.clearBatch();
}

function updateLength() {
  const slider = document.getElementById('length-slider');
  passwordGenerator.updateLength(slider.value);
}

function updateCharOptions() {
  passwordGenerator.updateCharOptions();
}

function updateStrength() {
  passwordGenerator.updateStrength();
}

function clearHistory() {
  passwordGenerator.clearHistory();
}

// 初始化密码生成器
document.addEventListener('DOMContentLoaded', () => {
  passwordGenerator = new ProfessionalPasswordGenerator();
}); 