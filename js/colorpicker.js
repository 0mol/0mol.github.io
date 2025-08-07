// 颜色选择器功能
class ColorPicker {
  constructor() {
    this.currentColor = '#2d8cf0';
    this.history = JSON.parse(localStorage.getItem('colorHistory') || '[]');
    this.presetColors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#74b9ff',
      '#fd79a8', '#fdcb6e', '#e17055', '#6c5ce7', '#a29bfe'
    ];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateColorDisplay();
    this.generatePresetPalette();
    this.updateHistory();
    this.updateContrastCheck();
  }
  
  bindEvents() {
    document.getElementById('color-picker').oninput = (e) => {
      this.currentColor = e.target.value;
      this.updateColorDisplay();
    };
    
    document.getElementById('copy-hex-btn').onclick = () => this.copyToClipboard(this.currentColor);
    document.getElementById('copy-rgb-btn').onclick = () => this.copyToClipboard(this.hexToRgb(this.currentColor));
    document.getElementById('copy-hsl-btn').onclick = () => this.copyToClipboard(this.hexToHsl(this.currentColor));
    document.getElementById('add-to-history-btn').onclick = () => this.addToHistory();
    document.getElementById('random-color-btn').onclick = () => this.generateRandomColor();
    document.getElementById('random-palette-btn').onclick = () => this.generateRandomPalette();
    
    // 对比度检查
    document.getElementById('bg-color').oninput = () => this.updateContrastCheck();
    document.getElementById('text-color').oninput = () => this.updateContrastCheck();
  }
  
  updateColorDisplay() {
    const preview = document.getElementById('color-preview');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    
    preview.style.backgroundColor = this.currentColor;
    hexValue.textContent = this.currentColor;
    rgbValue.textContent = this.hexToRgb(this.currentColor);
    hslValue.textContent = this.hexToHsl(this.currentColor);
  }
  
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1000);
    });
  }
  
  addToHistory() {
    if (!this.history.includes(this.currentColor)) {
      this.history.unshift(this.currentColor);
      if (this.history.length > 20) {
        this.history = this.history.slice(0, 20);
      }
      localStorage.setItem('colorHistory', JSON.stringify(this.history));
      this.updateHistory();
    }
  }
  
  updateHistory() {
    const historyDiv = document.getElementById('color-history');
    
    if (this.history.length === 0) {
      historyDiv.innerHTML = '<div class="empty-tip">暂无历史记录</div>';
      return;
    }
    
    historyDiv.innerHTML = '';
    this.history.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'history-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.onclick = () => {
        this.currentColor = color;
        document.getElementById('color-picker').value = color;
        this.updateColorDisplay();
      };
      
      const codeDiv = document.createElement('div');
      codeDiv.className = 'color-code';
      codeDiv.textContent = color;
      
      colorDiv.appendChild(codeDiv);
      historyDiv.appendChild(colorDiv);
    });
  }
  
  generatePresetPalette() {
    const paletteDiv = document.getElementById('color-palette');
    paletteDiv.innerHTML = '';
    
    this.presetColors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'palette-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.onclick = () => {
        this.currentColor = color;
        document.getElementById('color-picker').value = color;
        this.updateColorDisplay();
      };
      paletteDiv.appendChild(colorDiv);
    });
  }
  
  generateRandomColor() {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    this.currentColor = hex;
    document.getElementById('color-picker').value = hex;
    this.updateColorDisplay();
  }
  
  generateRandomPalette() {
    const newPalette = [];
    for (let i = 0; i < 10; i++) {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      newPalette.push(hex);
    }
    
    const paletteDiv = document.getElementById('color-palette');
    paletteDiv.innerHTML = '';
    
    newPalette.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'palette-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.onclick = () => {
        this.currentColor = color;
        document.getElementById('color-picker').value = color;
        this.updateColorDisplay();
      };
      paletteDiv.appendChild(colorDiv);
    });
  }
  
  updateContrastCheck() {
    const bgColor = document.getElementById('bg-color').value;
    const textColor = document.getElementById('text-color').value;
    const resultDiv = document.getElementById('contrast-result');
    
    const contrast = this.calculateContrast(bgColor, textColor);
    let rating = '';
    let color = '';
    
    if (contrast >= 7) {
      rating = '优秀 (AAA)';
      color = '#27ae60';
    } else if (contrast >= 4.5) {
      rating = '良好 (AA)';
      color = '#f39c12';
    } else if (contrast >= 3) {
      rating = '一般 (A)';
      color = '#e74c3c';
    } else {
      rating = '较差';
      color = '#c0392b';
    }
    
    resultDiv.innerHTML = `
      <div style="background: ${bgColor}; color: ${textColor}; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        示例文字 - 这是对比度测试
      </div>
      <div>对比度比例: ${contrast.toFixed(2)}:1</div>
      <div style="color: ${color};">评级: ${rating}</div>
    `;
  }
  
  calculateContrast(hex1, hex2) {
    const getLuminance = (hex) => {
      const rgb = hex.match(/[0-9a-f]{2}/gi).map(x => parseInt(x, 16) / 255);
      const [r, g, b] = rgb.map(c => {
        if (c <= 0.03928) return c / 12.92;
        return Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
}

// 初始化颜色选择器
new ColorPicker(); 