// 专业级颜色选择器
class ProfessionalColorPicker {
  constructor() {
    this.currentColor = '#2d8cf0';
    this.history = JSON.parse(localStorage.getItem('colorHistory') || '[]');
    this.favorites = JSON.parse(localStorage.getItem('colorFavorites') || '[]');
    this.palettes = JSON.parse(localStorage.getItem('colorPalettes') || []);
    this.settings = this.loadSettings();
    
    // 预设调色板
    this.presetPalettes = {
      material: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
      flat: ['#e74c3c', '#c0392b', '#e67e22', '#d35400', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50'],
      pastel: ['#ffb3ba', '#baffc9', '#bae1ff', '#ffffba', '#ffb3f7', '#f7b3ff', '#b3f7ff', '#f7ffb3', '#ffd4b3', '#d4ffb3', '#b3ffd4', '#b3d4ff', '#ffb3d4', '#d4b3ff', '#b3d4ff', '#f7d4b3'],
      monochrome: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#f0f0f0', '#ffffff']
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateColorDisplay();
    this.generatePresetPalettes();
    this.updateHistory();
    this.updateFavorites();
    this.updateContrastCheck();
    this.initializeColorPicker();
  }
  
  bindEvents() {
    // 颜色选择器事件
    document.getElementById('color-picker').addEventListener('input', (e) => {
      this.currentColor = e.target.value;
      this.updateColorDisplay();
      this.updateContrastCheck();
    });
    
    // 复制按钮事件
    document.getElementById('copy-hex-btn').addEventListener('click', () => this.copyToClipboard(this.currentColor));
    document.getElementById('copy-rgb-btn').addEventListener('click', () => this.copyToClipboard(this.hexToRgb(this.currentColor)));
    document.getElementById('copy-hsl-btn').addEventListener('click', () => this.copyToClipboard(this.hexToHsl(this.currentColor)));
    document.getElementById('copy-cmyk-btn').addEventListener('click', () => this.copyToClipboard(this.hexToCmyk(this.currentColor)));
    
    // 历史记录和收藏
    document.getElementById('add-to-history-btn').addEventListener('click', () => this.addToHistory());
    document.getElementById('add-to-favorites-btn').addEventListener('click', () => this.addToFavorites());
    
    // 随机生成
    document.getElementById('random-color-btn').addEventListener('click', () => this.generateRandomColor());
    document.getElementById('random-palette-btn').addEventListener('click', () => this.generateRandomPalette());
    document.getElementById('generate-harmony-btn').addEventListener('click', () => this.generateColorHarmony());
    
    // 对比度检查
    document.getElementById('bg-color').addEventListener('input', () => this.updateContrastCheck());
    document.getElementById('text-color').addEventListener('click', () => {
      document.getElementById('text-color').value = this.currentColor;
      this.updateContrastCheck();
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        this.copyToClipboard(this.currentColor);
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        this.generateRandomColor();
      }
    });
  }
  
  // 颜色转换功能
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  hexToRgbArray(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  hexToHsl(hex) {
    const [r, g, b] = this.hexToRgbArray(hex).map(x => x / 255);
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
  
  hexToCmyk(hex) {
    const [r, g, b] = this.hexToRgbArray(hex).map(x => x / 255);
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  }
  
  // 颜色分析功能
  analyzeColor(hex) {
    const [r, g, b] = this.hexToRgbArray(hex);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const saturation = this.calculateSaturation(r, g, b);
    const temperature = this.calculateColorTemperature(r, g, b);
    
    return {
      brightness: Math.round(brightness),
      saturation: Math.round(saturation),
      temperature: temperature,
      isLight: brightness > 128,
      isWarm: temperature > 0.5
    };
  }
  
  calculateSaturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : ((max - min) / max) * 100;
  }
  
  calculateColorTemperature(r, g, b) {
    const total = r + g + b;
    if (total === 0) return 0.5;
    return (r + g) / (2 * total);
  }
  
  // 颜色和谐生成
  generateColorHarmony() {
    const [r, g, b] = this.hexToRgbArray(this.currentColor);
    const harmonies = {
      complementary: this.generateComplementary(r, g, b),
      analogous: this.generateAnalogous(r, g, b),
      triadic: this.generateTriadic(r, g, b),
      tetradic: this.generateTetradic(r, g, b),
      monochromatic: this.generateMonochromatic(r, g, b)
    };
    
    this.displayHarmonies(harmonies);
  }
  
  generateComplementary(r, g, b) {
    return this.rgbToHex(255 - r, 255 - g, 255 - b);
  }
  
  generateAnalogous(r, g, b) {
    const hsl = this.rgbToHsl(r, g, b);
    const h1 = (hsl.h + 30) % 360;
    const h2 = (hsl.h - 30 + 360) % 360;
    return [
      this.hslToHex(h1, hsl.s, hsl.l),
      this.hslToHex(h2, hsl.s, hsl.l)
    ];
  }
  
  generateTriadic(r, g, b) {
    const hsl = this.rgbToHsl(r, g, b);
    const h1 = (hsl.h + 120) % 360;
    const h2 = (hsl.h + 240) % 360;
    return [
      this.hslToHex(h1, hsl.s, hsl.l),
      this.hslToHex(h2, hsl.s, hsl.l)
    ];
  }
  
  generateTetradic(r, g, b) {
    const hsl = this.rgbToHsl(r, g, b);
    const h1 = (hsl.h + 90) % 360;
    const h2 = (hsl.h + 180) % 360;
    const h3 = (hsl.h + 270) % 360;
    return [
      this.hslToHex(h1, hsl.s, hsl.l),
      this.hslToHex(h2, hsl.s, hsl.l),
      this.hslToHex(h3, hsl.s, hsl.l)
    ];
  }
  
  generateMonochromatic(r, g, b) {
    const hsl = this.rgbToHsl(r, g, b);
    return [
      this.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 0.3)),
      this.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 0.15)),
      this.hslToHex(hsl.h, hsl.s, Math.min(1, hsl.l + 0.15)),
      this.hslToHex(hsl.h, hsl.s, Math.min(1, hsl.l + 0.3))
    ];
  }
  
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
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
    
    return { h: h * 360, s: s, l: l };
  }
  
  hslToHex(h, s, l) {
    h /= 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    
    if (h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    return this.rgbToHex(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    );
  }
  
  // 显示颜色和谐
  displayHarmonies(harmonies) {
    const container = document.getElementById('harmony-results');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(harmonies).forEach(([type, colors]) => {
      const section = document.createElement('div');
      section.className = 'harmony-section';
      section.innerHTML = `
        <h4>${this.getHarmonyName(type)}</h4>
        <div class="harmony-colors">
          ${Array.isArray(colors) ? 
            colors.map(color => this.createColorSwatch(color)).join('') :
            this.createColorSwatch(colors)
          }
        </div>
      `;
      container.appendChild(section);
    });
  }
  
  getHarmonyName(type) {
    const names = {
      complementary: '互补色',
      analogous: '类似色',
      triadic: '三角色',
      tetradic: '四角色',
      monochromatic: '单色调'
    };
    return names[type] || type;
  }
  
  createColorSwatch(color) {
    return `
      <div class="color-swatch" style="background-color: ${color};" onclick="colorPicker.selectColor('${color}')">
        <span class="color-code">${color}</span>
      </div>
    `;
  }
  
  // 颜色选择
  selectColor(color) {
    this.currentColor = color;
    document.getElementById('color-picker').value = color;
    this.updateColorDisplay();
    this.updateContrastCheck();
  }
  
  // 更新显示
  updateColorDisplay() {
    const preview = document.getElementById('color-preview');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const cmykValue = document.getElementById('cmyk-value');
    
    if (preview) preview.style.backgroundColor = this.currentColor;
    if (hexValue) hexValue.textContent = this.currentColor;
    if (rgbValue) rgbValue.textContent = this.hexToRgb(this.currentColor);
    if (hslValue) hslValue.textContent = this.hexToHsl(this.currentColor);
    if (cmykValue) cmykValue.textContent = this.hexToCmyk(this.currentColor);
    
    // 更新颜色分析
    this.updateColorAnalysis();
  }
  
  updateColorAnalysis() {
    const analysis = this.analyzeColor(this.currentColor);
    const container = document.getElementById('color-analysis');
    if (!container) return;
    
    container.innerHTML = `
      <div class="analysis-item">
        <span>亮度: ${analysis.brightness}</span>
        <div class="brightness-bar">
          <div class="brightness-fill" style="width: ${analysis.brightness}%"></div>
        </div>
      </div>
      <div class="analysis-item">
        <span>饱和度: ${analysis.saturation}%</span>
        <div class="saturation-bar">
          <div class="saturation-fill" style="width: ${analysis.saturation}%"></div>
        </div>
      </div>
      <div class="analysis-item">
        <span>色温: ${analysis.isWarm ? '暖色' : '冷色'}</span>
      </div>
    `;
  }
  
  // 随机颜色生成
  generateRandomColor() {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    this.currentColor = hex;
    document.getElementById('color-picker').value = hex;
    this.updateColorDisplay();
  }
  
  generateRandomPalette() {
    const baseHue = Math.random() * 360;
    const palette = [];
    
    for (let i = 0; i < 8; i++) {
      const hue = (baseHue + i * 45) % 360;
      const saturation = 0.3 + Math.random() * 0.7;
      const lightness = 0.2 + Math.random() * 0.6;
      palette.push(this.hslToHex(hue, saturation, lightness));
    }
    
    this.displayPalette(palette, '随机调色板');
  }
  
  // 历史记录管理
  addToHistory() {
    if (!this.history.includes(this.currentColor)) {
      this.history.unshift(this.currentColor);
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50);
      }
      localStorage.setItem('colorHistory', JSON.stringify(this.history));
      this.updateHistory();
      this.showNotification('已添加到历史记录', 'success');
    }
  }
  
  updateHistory() {
    const container = document.getElementById('color-history');
    if (!container) return;
    
    if (this.history.length === 0) {
      container.innerHTML = '<div class="empty-tip">暂无历史记录</div>';
      return;
    }
    
    container.innerHTML = '';
    this.history.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'history-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.onclick = () => this.selectColor(color);
      
      const codeDiv = document.createElement('div');
      codeDiv.className = 'color-code';
      codeDiv.textContent = color;
      
      colorDiv.appendChild(codeDiv);
      container.appendChild(colorDiv);
    });
  }
  
  // 收藏夹管理
  addToFavorites() {
    if (!this.favorites.includes(this.currentColor)) {
      this.favorites.unshift(this.currentColor);
      if (this.favorites.length > 20) {
        this.favorites = this.favorites.slice(0, 20);
      }
      localStorage.setItem('colorFavorites', JSON.stringify(this.favorites));
      this.updateFavorites();
      this.showNotification('已添加到收藏夹', 'success');
    }
  }
  
  updateFavorites() {
    const container = document.getElementById('color-favorites');
    if (!container) return;
    
    if (this.favorites.length === 0) {
      container.innerHTML = '<div class="empty-tip">暂无收藏</div>';
      return;
    }
    
    container.innerHTML = '';
    this.favorites.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'favorite-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.onclick = () => this.selectColor(color);
      
      const codeDiv = document.createElement('div');
      codeDiv.className = 'color-code';
      codeDiv.textContent = color;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-favorite';
      removeBtn.innerHTML = '×';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        this.removeFromFavorites(color);
      };
      
      colorDiv.appendChild(codeDiv);
      colorDiv.appendChild(removeBtn);
      container.appendChild(colorDiv);
    });
  }
  
  removeFromFavorites(color) {
    this.favorites = this.favorites.filter(c => c !== color);
    localStorage.setItem('colorFavorites', JSON.stringify(this.favorites));
    this.updateFavorites();
  }
  
  // 预设调色板
  generatePresetPalettes() {
    const container = document.getElementById('preset-palettes');
    if (!container) return;
    
    Object.entries(this.presetPalettes).forEach(([name, colors]) => {
      const section = document.createElement('div');
      section.className = 'palette-section';
      section.innerHTML = `
        <h4>${this.getPaletteName(name)}</h4>
        <div class="palette-colors">
          ${colors.map(color => this.createColorSwatch(color)).join('')}
        </div>
      `;
      container.appendChild(section);
    });
  }
  
  getPaletteName(name) {
    const names = {
      material: 'Material Design',
      flat: 'Flat UI',
      pastel: 'Pastel',
      monochrome: '单色'
    };
    return names[name] || name;
  }
  
  // 对比度检查
  updateContrastCheck() {
    const bgColor = document.getElementById('bg-color').value;
    const textColor = document.getElementById('text-color').value;
    const resultDiv = document.getElementById('contrast-result');
    
    if (!resultDiv) return;
    
    const contrast = this.calculateContrast(bgColor, textColor);
    let rating = '';
    let color = '';
    let accessibility = [];
    
    if (contrast >= 7) {
      rating = '优秀 (AAA)';
      color = '#27ae60';
      accessibility = ['大文字', '小文字', '图形元素'];
    } else if (contrast >= 4.5) {
      rating = '良好 (AA)';
      color = '#f39c12';
      accessibility = ['大文字', '图形元素'];
    } else if (contrast >= 3) {
      rating = '一般 (A)';
      color = '#e74c3c';
      accessibility = ['大文字'];
    } else {
      rating = '较差';
      color = '#c0392b';
      accessibility = [];
    }
    
    resultDiv.innerHTML = `
      <div style="background: ${bgColor}; color: ${textColor}; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 16px;">
        示例文字 - 这是对比度测试文本
      </div>
      <div style="margin-bottom: 10px;">
        <strong>对比度比例:</strong> ${contrast.toFixed(2)}:1
      </div>
      <div style="color: ${color}; margin-bottom: 10px;">
        <strong>评级:</strong> ${rating}
      </div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">
        <strong>无障碍等级:</strong> ${accessibility.length > 0 ? accessibility.join(', ') : '不符合标准'}
      </div>
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
  
  // 复制功能
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('已复制到剪贴板', 'success');
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('已复制到剪贴板', 'success');
    });
  }
  
  // 通知功能
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // 设置管理
  loadSettings() {
    const defaultSettings = {
      defaultFormat: 'hex',
      autoAddToHistory: false,
      showColorAnalysis: true,
      showHarmonies: true
    };
    
    const saved = localStorage.getItem('colorPickerSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }
  
  saveSettings() {
    localStorage.setItem('colorPickerSettings', JSON.stringify(this.settings));
  }
  
  // 导出功能
  exportPalette() {
    const data = {
      colors: [this.currentColor],
      harmonies: this.generateAllHarmonies(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  generateAllHarmonies() {
    const [r, g, b] = this.hexToRgbArray(this.currentColor);
    return {
      complementary: this.generateComplementary(r, g, b),
      analogous: this.generateAnalogous(r, g, b),
      triadic: this.generateTriadic(r, g, b),
      tetradic: this.generateTetradic(r, g, b),
      monochromatic: this.generateMonochromatic(r, g, b)
    };
  }
  
  // 初始化颜色选择器
  initializeColorPicker() {
    // 设置初始颜色
    document.getElementById('color-picker').value = this.currentColor;
    this.updateColorDisplay();
  }
}

// 初始化颜色选择器
let colorPicker;

document.addEventListener('DOMContentLoaded', () => {
  colorPicker = new ProfessionalColorPicker();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style); 