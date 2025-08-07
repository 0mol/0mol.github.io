// 专业级计算器功能
class ProfessionalCalculator {
  constructor() {
    this.currentDisplay = '0';
    this.previousDisplay = '';
    this.operation = null;
    this.waitingForOperand = false;
    this.history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateDisplay();
    this.loadHistory();
  }
  
  bindEvents() {
    // Tab切换
    const tabs = document.querySelectorAll('.calc-tab');
    const panels = document.querySelectorAll('.calc-panel');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
      };
    });
    
    // 基础计算器键盘事件
    this.bindBasicCalculator();
    
    // 科学计算器事件
    this.bindScientificCalculator();
    
    // 金融计算器事件
    this.bindFinancialCalculator();
    
    // 健康计算器事件
    this.bindHealthCalculator();
    
    // 单位换算器事件
    this.bindUnitConverter();
  }
  
  bindBasicCalculator() {
    const keypad = document.getElementById('basic-keypad');
    const display = document.getElementById('basic-display');
    
    keypad.addEventListener('click', (e) => {
      const btn = e.target;
      const action = btn.dataset.action;
      const value = btn.textContent;
      
      if (action === 'number') {
        this.inputNumber(value);
      } else if (action === 'operator') {
        this.inputOperator(value);
      } else if (action === 'equals') {
        this.calculate();
      } else if (action === 'clear') {
        this.clear();
      } else if (action === 'backspace') {
        this.backspace();
      } else if (action === 'bracket') {
        this.inputBracket(value);
      }
      
      this.updateDisplay();
    });
    
    // 键盘支持
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        this.inputNumber(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        this.inputOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        this.calculate();
      } else if (e.key === 'Escape') {
        this.clear();
      } else if (e.key === 'Backspace') {
        this.backspace();
      }
      this.updateDisplay();
    });
  }
  
  bindScientificCalculator() {
    const functionBtns = document.querySelectorAll('.function-btn');
    const display = document.getElementById('scientific-display');
    
    functionBtns.forEach(btn => {
      btn.onclick = () => {
        const func = btn.dataset.function;
        this.inputScientificFunction(func);
        this.updateScientificDisplay();
      };
    });
  }
  
  bindFinancialCalculator() {
    const financialType = document.getElementById('financial-type');
    financialType.onchange = () => {
      this.showFinancialSection(financialType.value);
    };
    
    // 房贷计算
    document.getElementById('calculate-mortgage').onclick = () => {
      this.calculateMortgage();
    };
    
    // 投资计算
    document.getElementById('calculate-investment').onclick = () => {
      this.calculateInvestment();
    };
    
    // 个税计算
    document.getElementById('calculate-tax').onclick = () => {
      this.calculateTax();
    };
  }
  
  bindHealthCalculator() {
    const healthType = document.getElementById('health-type');
    healthType.onchange = () => {
      this.showHealthSection(healthType.value);
    };
    
    // BMI计算
    document.getElementById('calculate-bmi').onclick = () => {
      this.calculateBMI();
    };
    
    // BMR计算
    document.getElementById('calculate-bmr').onclick = () => {
      this.calculateBMR();
    };
  }
  
  bindUnitConverter() {
    const converterType = document.getElementById('converter-type');
    const fromValue = document.getElementById('converter-from-value');
    const toValue = document.getElementById('converter-to-value');
    const fromUnit = document.getElementById('converter-from-unit');
    const toUnit = document.getElementById('converter-to-unit');
    
    converterType.onchange = () => {
      this.updateUnitOptions(converterType.value);
    };
    
    fromValue.oninput = () => {
      this.convertUnit();
    };
    
    fromUnit.onchange = () => {
      this.convertUnit();
    };
    
    toUnit.onchange = () => {
      this.convertUnit();
    };
    
    // 初始化
    this.updateUnitOptions('length');
  }
  
  // 基础计算器功能
  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentDisplay = num;
      this.waitingForOperand = false;
    } else {
      this.currentDisplay = this.currentDisplay === '0' ? num : this.currentDisplay + num;
    }
  }
  
  inputOperator(operator) {
    const inputValue = parseFloat(this.currentDisplay);
    
    if (this.previousDisplay === '') {
      this.previousDisplay = inputValue;
    } else if (this.operation) {
      const result = this.performCalculation(this.previousDisplay, inputValue, this.operation);
      this.currentDisplay = String(result);
      this.previousDisplay = result;
    }
    
    this.waitingForOperand = true;
    this.operation = operator;
  }
  
  calculate() {
    const inputValue = parseFloat(this.currentDisplay);
    
    if (this.previousDisplay === '') {
      return;
    }
    
    const result = this.performCalculation(this.previousDisplay, inputValue, this.operation);
    this.addToHistory(`${this.previousDisplay} ${this.operation} ${inputValue} = ${result}`);
    this.currentDisplay = String(result);
    this.previousDisplay = '';
    this.operation = null;
    this.waitingForOperand = true;
  }
  
  performCalculation(firstValue, secondValue, operation) {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  }
  
  clear() {
    this.currentDisplay = '0';
    this.previousDisplay = '';
    this.operation = null;
    this.waitingForOperand = false;
  }
  
  backspace() {
    if (this.currentDisplay.length > 1) {
      this.currentDisplay = this.currentDisplay.slice(0, -1);
    } else {
      this.currentDisplay = '0';
    }
  }
  
  inputBracket(bracket) {
    this.currentDisplay += bracket;
  }
  
  updateDisplay() {
    document.getElementById('basic-display').textContent = this.currentDisplay;
  }
  
  // 科学计算器功能
  inputScientificFunction(func) {
    const display = document.getElementById('scientific-display');
    let currentValue = display.textContent;
    
    switch (func) {
      case 'sin':
        currentValue = Math.sin(parseFloat(currentValue) * Math.PI / 180);
        break;
      case 'cos':
        currentValue = Math.cos(parseFloat(currentValue) * Math.PI / 180);
        break;
      case 'tan':
        currentValue = Math.tan(parseFloat(currentValue) * Math.PI / 180);
        break;
      case 'log':
        currentValue = Math.log10(parseFloat(currentValue));
        break;
      case 'ln':
        currentValue = Math.log(parseFloat(currentValue));
        break;
      case 'exp':
        currentValue = Math.exp(parseFloat(currentValue));
        break;
      case 'sqrt':
        currentValue = Math.sqrt(parseFloat(currentValue));
        break;
      case 'pi':
        currentValue = Math.PI;
        break;
      case 'e':
        currentValue = Math.E;
        break;
    }
    
    display.textContent = currentValue;
  }
  
  updateScientificDisplay() {
    // 科学计算器显示更新
  }
  
  // 金融计算器功能
  showFinancialSection(type) {
    const sections = ['mortgage-calc', 'investment-calc', 'tax-calc'];
    sections.forEach(section => {
      document.getElementById(section).style.display = 'none';
    });
    
    if (type === 'mortgage') {
      document.getElementById('mortgage-calc').style.display = 'block';
    } else if (type === 'investment') {
      document.getElementById('investment-calc').style.display = 'block';
    } else if (type === 'tax') {
      document.getElementById('tax-calc').style.display = 'block';
    }
  }
  
  calculateMortgage() {
    const total = parseFloat(document.getElementById('mortgage-total').value) * 10000;
    const rate = parseFloat(document.getElementById('mortgage-rate').value) / 100 / 12;
    const months = parseFloat(document.getElementById('mortgage-years').value) * 12;
    const type = document.getElementById('mortgage-type').value;
    
    let monthlyPayment, totalInterest, totalPayment;
    
    if (type === 'equal') {
      // 等额本息
      monthlyPayment = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - total;
    } else {
      // 等额本金
      const monthlyPrincipal = total / months;
      const firstMonthPayment = monthlyPrincipal + total * rate;
      const lastMonthPayment = monthlyPrincipal + (total - monthlyPrincipal * (months - 1)) * rate;
      totalInterest = (months + 1) * total * rate / 2;
      totalPayment = total + totalInterest;
      monthlyPayment = firstMonthPayment; // 首月还款
    }
    
    const resultDiv = document.getElementById('mortgage-result');
    const contentDiv = document.getElementById('mortgage-content');
    
    contentDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">月还款额</span>
        <span class="result-value">¥${monthlyPayment.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">总利息</span>
        <span class="result-value">¥${totalInterest.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">总还款额</span>
        <span class="result-value">¥${totalPayment.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">还款月数</span>
        <span class="result-value">${months}个月</span>
      </div>
    `;
    
    resultDiv.style.display = 'block';
    this.createMortgageChart(total, totalInterest);
  }
  
  createMortgageChart(principal, interest) {
    const chartContainer = document.getElementById('mortgage-chart');
    const principalBar = document.createElement('div');
    const interestBar = document.createElement('div');
    
    principalBar.className = 'chart-bar';
    interestBar.className = 'chart-bar';
    
    const total = principal + interest;
    principalBar.style.height = `${(principal / total) * 100}%`;
    interestBar.style.height = `${(interest / total) * 100}%`;
    
    chartContainer.innerHTML = '';
    chartContainer.appendChild(principalBar);
    chartContainer.appendChild(interestBar);
  }
  
  calculateInvestment() {
    const principal = parseFloat(document.getElementById('investment-principal').value);
    const rate = parseFloat(document.getElementById('investment-rate').value) / 100;
    const years = parseFloat(document.getElementById('investment-years').value);
    const frequency = parseInt(document.getElementById('investment-frequency').value);
    
    const effectiveRate = rate / frequency;
    const periods = years * frequency;
    const futureValue = principal * Math.pow(1 + effectiveRate, periods);
    const interest = futureValue - principal;
    
    const resultDiv = document.getElementById('investment-result');
    const contentDiv = document.getElementById('investment-content');
    
    contentDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">投资本金</span>
        <span class="result-value">¥${principal.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">投资收益</span>
        <span class="result-value">¥${interest.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">未来价值</span>
        <span class="result-value">¥${futureValue.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">年化收益率</span>
        <span class="result-value">${(rate * 100).toFixed(2)}%</span>
      </div>
    `;
    
    resultDiv.style.display = 'block';
  }
  
  calculateTax() {
    const salary = parseFloat(document.getElementById('tax-salary').value);
    const insurance = parseFloat(document.getElementById('tax-insurance').value);
    const deduct = parseFloat(document.getElementById('tax-deduct').value);
    const bonus = parseFloat(document.getElementById('tax-bonus').value);
    
    // 月薪个税计算
    const monthlyTaxable = salary - insurance - 5000 - deduct;
    const monthlyTax = this.calculateTaxAmount(monthlyTaxable);
    
    // 年终奖个税计算
    const bonusTax = this.calculateBonusTax(bonus);
    
    const resultDiv = document.getElementById('tax-result');
    const contentDiv = document.getElementById('tax-content');
    
    contentDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">月应纳税所得额</span>
        <span class="result-value">¥${monthlyTaxable.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">月个人所得税</span>
        <span class="result-value">¥${monthlyTax.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">税后月收入</span>
        <span class="result-value">¥${(salary - insurance - monthlyTax).toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">年终奖个税</span>
        <span class="result-value">¥${bonusTax.toFixed(2)}</span>
      </div>
    `;
    
    resultDiv.style.display = 'block';
    this.showTaxBrackets();
  }
  
  calculateTaxAmount(taxableIncome) {
    if (taxableIncome <= 0) return 0;
    if (taxableIncome <= 3000) return taxableIncome * 0.03;
    if (taxableIncome <= 12000) return taxableIncome * 0.1 - 210;
    if (taxableIncome <= 25000) return taxableIncome * 0.2 - 1410;
    if (taxableIncome <= 35000) return taxableIncome * 0.25 - 2660;
    if (taxableIncome <= 55000) return taxableIncome * 0.3 - 4410;
    if (taxableIncome <= 80000) return taxableIncome * 0.35 - 7160;
    return taxableIncome * 0.45 - 15160;
  }
  
  calculateBonusTax(bonus) {
    if (bonus <= 0) return 0;
    const monthlyBonus = bonus / 12;
    let rate = 0;
    let deduction = 0;
    
    if (monthlyBonus <= 3000) {
      rate = 0.03;
      deduction = 0;
    } else if (monthlyBonus <= 12000) {
      rate = 0.1;
      deduction = 210;
    } else if (monthlyBonus <= 25000) {
      rate = 0.2;
      deduction = 1410;
    } else if (monthlyBonus <= 35000) {
      rate = 0.25;
      deduction = 2660;
    } else if (monthlyBonus <= 55000) {
      rate = 0.3;
      deduction = 4410;
    } else if (monthlyBonus <= 80000) {
      rate = 0.35;
      deduction = 7160;
    } else {
      rate = 0.45;
      deduction = 15160;
    }
    
    return bonus * rate - deduction;
  }
  
  showTaxBrackets() {
    const brackets = [
      { range: '0 - 3,000', rate: '3%' },
      { range: '3,000 - 12,000', rate: '10%' },
      { range: '12,000 - 25,000', rate: '20%' },
      { range: '25,000 - 35,000', rate: '25%' },
      { range: '35,000 - 55,000', rate: '30%' },
      { range: '55,000 - 80,000', rate: '35%' },
      { range: '80,000+', rate: '45%' }
    ];
    
    const bracketsDiv = document.getElementById('tax-brackets');
    bracketsDiv.innerHTML = brackets.map(bracket => `
      <div class="tax-bracket">
        <span class="bracket-range">${bracket.range}</span>
        <span class="bracket-rate">${bracket.rate}</span>
      </div>
    `).join('');
  }
  
  // 健康计算器功能
  showHealthSection(type) {
    const sections = ['bmi-calc', 'bmr-calc'];
    sections.forEach(section => {
      document.getElementById(section).style.display = 'none';
    });
    
    if (type === 'bmi') {
      document.getElementById('bmi-calc').style.display = 'block';
    } else if (type === 'bmr') {
      document.getElementById('bmr-calc').style.display = 'block';
    }
  }
  
  calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value) / 100;
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const bmi = weight / (height * height);
    
    let category, color;
    if (bmi < 18.5) {
      category = '偏瘦';
      color = 'bmi-underweight';
    } else if (bmi < 24) {
      category = '正常';
      color = 'bmi-normal';
    } else if (bmi < 28) {
      category = '超重';
      color = 'bmi-overweight';
    } else {
      category = '肥胖';
      color = 'bmi-obese';
    }
    
    const resultDiv = document.getElementById('bmi-result');
    const contentDiv = document.getElementById('bmi-content');
    
    contentDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">BMI指数</span>
        <span class="result-value">${bmi.toFixed(2)}</span>
      </div>
      <div class="result-item">
        <span class="result-label">体重状态</span>
        <span class="result-value">${category}</span>
      </div>
      <div class="result-item">
        <span class="result-label">健康建议</span>
        <span class="result-value">${this.getBMIAdvice(category)}</span>
      </div>
    `;
    
    resultDiv.style.display = 'block';
    this.showBMIChart();
  }
  
  getBMIAdvice(category) {
    switch (category) {
      case '偏瘦': return '建议适当增加营养摄入，进行力量训练';
      case '正常': return '保持健康的生活方式，定期运动';
      case '超重': return '建议控制饮食，增加有氧运动';
      case '肥胖': return '建议咨询医生，制定减重计划';
      default: return '请咨询专业医生';
    }
  }
  
  showBMIChart() {
    const chartDiv = document.getElementById('bmi-chart');
    chartDiv.innerHTML = `
      <div class="bmi-category bmi-underweight">偏瘦<br><18.5</div>
      <div class="bmi-category bmi-normal">正常<br>18.5-24</div>
      <div class="bmi-category bmi-overweight">超重<br>24-28</div>
      <div class="bmi-category bmi-obese">肥胖<br>>28</div>
    `;
  }
  
  calculateBMR() {
    const gender = document.getElementById('bmr-gender').value;
    const age = parseFloat(document.getElementById('bmr-age').value);
    const height = parseFloat(document.getElementById('bmr-height').value);
    const weight = parseFloat(document.getElementById('bmr-weight').value);
    
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    const resultDiv = document.getElementById('bmr-result');
    const contentDiv = document.getElementById('bmr-content');
    
    contentDiv.innerHTML = `
      <div class="result-item">
        <span class="result-label">基础代谢率</span>
        <span class="result-value">${bmr.toFixed(0)} 千卡/天</span>
      </div>
      <div class="result-item">
        <span class="result-label">轻度活动</span>
        <span class="result-value">${(bmr * 1.375).toFixed(0)} 千卡/天</span>
      </div>
      <div class="result-item">
        <span class="result-label">中度活动</span>
        <span class="result-value">${(bmr * 1.55).toFixed(0)} 千卡/天</span>
      </div>
      <div class="result-item">
        <span class="result-label">重度活动</span>
        <span class="result-value">${(bmr * 1.725).toFixed(0)} 千卡/天</span>
      </div>
    `;
    
    resultDiv.style.display = 'block';
  }
  
  // 单位换算器功能
  updateUnitOptions(type) {
    const units = {
      length: ['米', '厘米', '毫米', '千米', '英寸', '英尺', '码', '英里'],
      weight: ['千克', '克', '毫克', '磅', '盎司', '吨'],
      area: ['平方米', '平方厘米', '平方千米', '公顷', '亩', '平方英尺', '平方英寸'],
      volume: ['立方米', '升', '毫升', '加仑', '立方英尺'],
      temperature: ['摄氏度', '华氏度', '开尔文'],
      speed: ['米/秒', '千米/时', '英里/时', '节'],
      time: ['秒', '分钟', '小时', '天', '周', '月', '年'],
      data: ['字节', '千字节', '兆字节', '吉字节', '太字节']
    };
    
    const fromUnit = document.getElementById('converter-from-unit');
    const toUnit = document.getElementById('converter-to-unit');
    
    fromUnit.innerHTML = units[type].map(unit => `<option value="${unit}">${unit}</option>`).join('');
    toUnit.innerHTML = units[type].map(unit => `<option value="${unit}">${unit}</option>`).join('');
    
    // 设置默认选择
    if (type === 'temperature') {
      fromUnit.value = '摄氏度';
      toUnit.value = '华氏度';
    } else {
      fromUnit.value = units[type][0];
      toUnit.value = units[type][1];
    }
    
    this.convertUnit();
  }
  
  convertUnit() {
    const fromValue = parseFloat(document.getElementById('converter-from-value').value) || 0;
    const fromUnit = document.getElementById('converter-from-unit').value;
    const toUnit = document.getElementById('converter-to-unit').value;
    const type = document.getElementById('converter-type').value;
    
    const result = this.performUnitConversion(fromValue, fromUnit, toUnit, type);
    
    document.getElementById('converter-to-value').value = result;
    
    if (fromValue > 0) {
      const resultDiv = document.getElementById('converter-result');
      const contentDiv = document.getElementById('converter-content');
      
      contentDiv.innerHTML = `
        <div class="result-item">
          <span class="result-label">换算结果</span>
          <span class="result-value">${fromValue} ${fromUnit} = ${result} ${toUnit}</span>
        </div>
      `;
      
      resultDiv.style.display = 'block';
    }
  }
  
  performUnitConversion(value, fromUnit, toUnit, type) {
    // 这里实现具体的单位换算逻辑
    // 为了简化，这里只实现温度换算
    if (type === 'temperature') {
      if (fromUnit === '摄氏度' && toUnit === '华氏度') {
        return (value * 9/5 + 32).toFixed(2);
      } else if (fromUnit === '华氏度' && toUnit === '摄氏度') {
        return ((value - 32) * 5/9).toFixed(2);
      }
    }
    
    // 其他单位换算可以在这里添加
    return value;
  }
  
  // 历史记录功能
  addToHistory(calculation) {
    this.history.unshift(calculation);
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20);
    }
    localStorage.setItem('calcHistory', JSON.stringify(this.history));
    this.loadHistory();
  }
  
  loadHistory() {
    const historyDiv = document.getElementById('basic-history');
    if (this.history.length === 0) {
      historyDiv.innerHTML = '<div class="empty-tip">暂无计算历史</div>';
      return;
    }
    
    historyDiv.innerHTML = this.history.map(item => 
      `<div class="history-item" onclick="calculator.loadFromHistory('${item}')">${item}</div>`
    ).join('');
  }
  
  loadFromHistory(calculation) {
    const parts = calculation.split(' = ');
    if (parts.length === 2) {
      this.currentDisplay = parts[1];
      this.updateDisplay();
    }
  }
}

// 初始化计算器
const calculator = new ProfessionalCalculator(); 