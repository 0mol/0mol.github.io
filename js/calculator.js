// 专业计算器 - 产品级别实现
class ProfessionalCalculator {
  constructor() {
    this.currentExpression = '0';
    this.currentResult = '0';
    this.history = [];
    this.currentPanel = 'basic';
    this.isNewCalculation = true;
    
    this.initializeEventListeners();
    this.loadHistory();
    this.setupKeyboardSupport();
  }

  initializeEventListeners() {
    // 标签页切换
    document.querySelectorAll('.calc-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // 基础计算器按钮
    document.querySelectorAll('#basic-panel .calc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleButtonClick(e.target));
    });

    // 科学计算器按钮
    document.querySelectorAll('#scientific-panel .calc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleScientificButtonClick(e.target));
    });

    // 单位转换
    document.getElementById('conversion-type').addEventListener('change', () => this.updateConversionUnits());
    document.getElementById('input-value').addEventListener('input', () => this.handleConversionInput());

    // 金融计算
    document.getElementById('finance-type').addEventListener('change', () => this.updateFinanceFields());
  }

  switchTab(tabName) {
    // 更新标签页状态
    document.querySelectorAll('.calc-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 更新面板显示
    document.querySelectorAll('.calc-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`).classList.add('active');

    this.currentPanel = tabName;
    this.resetCalculator();
  }

  handleButtonClick(button) {
    const action = button.dataset.action;
    const number = button.dataset.number;

    if (number) {
      this.appendNumber(number);
    } else if (action) {
      this.handleAction(action);
    }
  }

  handleScientificButtonClick(button) {
    const action = button.dataset.action;
    const number = button.dataset.number;

    if (number) {
      this.appendNumber(number, 'scientific');
    } else if (action) {
      this.handleScientificAction(action);
    }
  }

  appendNumber(num, panel = 'basic') {
    const expressionEl = document.getElementById(panel === 'scientific' ? 'sci-expression' : 'expression');
    const resultEl = document.getElementById(panel === 'scientific' ? 'sci-result' : 'result');

    if (this.isNewCalculation) {
      this.currentExpression = num;
      this.isNewCalculation = false;
    } else {
      if (this.currentExpression === '0' && num !== '.') {
        this.currentExpression = num;
      } else {
        this.currentExpression += num;
      }
    }

    expressionEl.textContent = this.currentExpression;
    this.calculateResult(panel);
  }

  handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'equals':
        this.calculate();
        break;
      case 'add':
        this.appendOperator('+');
        break;
      case 'subtract':
        this.appendOperator('-');
        break;
      case 'multiply':
        this.appendOperator('*');
        break;
      case 'divide':
        this.appendOperator('/');
        break;
      case 'percent':
        this.calculatePercent();
        break;
      case 'negate':
        this.negate();
        break;
    }
  }

  handleScientificAction(action) {
    switch (action) {
      case 'sin':
        this.scientificFunction('sin');
        break;
      case 'cos':
        this.scientificFunction('cos');
        break;
      case 'tan':
        this.scientificFunction('tan');
        break;
      case 'log':
        this.scientificFunction('log');
        break;
      case 'ln':
        this.scientificFunction('ln');
        break;
      case 'sqrt':
        this.scientificFunction('sqrt');
        break;
      case 'power':
        this.appendOperator('^');
        break;
      case 'pi':
        this.appendConstant(Math.PI);
        break;
      case 'e':
        this.appendConstant(Math.E);
        break;
      case 'factorial':
        this.scientificFunction('factorial');
        break;
      case 'abs':
        this.scientificFunction('abs');
        break;
      case 'exp':
        this.scientificFunction('exp');
        break;
      default:
        this.handleAction(action);
    }
  }

  appendOperator(operator) {
    if (this.currentExpression !== '0' && !this.isOperator(this.currentExpression.slice(-1))) {
      this.currentExpression += operator;
      this.updateDisplay();
      this.isNewCalculation = false;
    }
  }

  appendConstant(constant) {
    if (this.isNewCalculation) {
      this.currentExpression = constant.toString();
      this.isNewCalculation = false;
    } else {
      this.currentExpression += constant.toString();
    }
    this.updateDisplay();
    this.calculateResult();
  }

  scientificFunction(func) {
    try {
      let value = parseFloat(this.currentResult);
      let result;

      switch (func) {
        case 'sin':
          result = Math.sin(value * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(value * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(value * Math.PI / 180);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'factorial':
          result = this.factorial(value);
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        case 'exp':
          result = Math.exp(value);
          break;
      }

      this.currentExpression = result.toString();
      this.currentResult = result.toString();
      this.updateDisplay();
      this.addToHistory(`${func}(${value})`, result);
    } catch (error) {
      this.showError('计算错误');
    }
  }

  factorial(n) {
    if (n < 0) throw new Error('负数没有阶乘');
    if (n === 0 || n === 1) return 1;
    if (n > 170) throw new Error('数值过大');
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  calculate() {
    try {
      const result = this.evaluateExpression(this.currentExpression);
      this.addToHistory(this.currentExpression, result);
      this.currentExpression = result.toString();
      this.currentResult = result.toString();
      this.updateDisplay();
      this.isNewCalculation = true;
      this.showSuccess('计算完成');
    } catch (error) {
      this.showError('计算错误: ' + error.message);
    }
  }

  calculateResult(panel = 'basic') {
    try {
      const result = this.evaluateExpression(this.currentExpression);
      const resultEl = document.getElementById(panel === 'scientific' ? 'sci-result' : 'result');
      resultEl.textContent = this.formatNumber(result);
      this.currentResult = result.toString();
    } catch (error) {
      const resultEl = document.getElementById(panel === 'scientific' ? 'sci-result' : 'result');
      resultEl.textContent = 'Error';
    }
  }

  evaluateExpression(expression) {
    // 替换显示符号为计算符号
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    
    // 安全评估表达式
    const sanitized = this.sanitizeExpression(expression);
    return this.safeEval(sanitized);
  }

  sanitizeExpression(expression) {
    // 只允许数字、运算符、括号和小数点
    return expression.replace(/[^0-9+\-*/().]/g, '');
  }

  safeEval(expression) {
    try {
      // 使用 Function 构造函数进行安全评估
      const result = new Function('return ' + expression)();
      if (!isFinite(result)) {
        throw new Error('结果超出范围');
      }
      return result;
    } catch (error) {
      throw new Error('表达式错误');
    }
  }

  clear() {
    this.currentExpression = '0';
    this.currentResult = '0';
    this.isNewCalculation = true;
    this.updateDisplay();
  }

  backspace() {
    if (this.currentExpression.length > 1) {
      this.currentExpression = this.currentExpression.slice(0, -1);
    } else {
      this.currentExpression = '0';
      this.isNewCalculation = true;
    }
    this.updateDisplay();
    this.calculateResult();
  }

  calculatePercent() {
    try {
      const value = parseFloat(this.currentResult);
      const result = value / 100;
      this.currentExpression = result.toString();
      this.currentResult = result.toString();
      this.updateDisplay();
      this.addToHistory(`${value}%`, result);
    } catch (error) {
      this.showError('百分比计算错误');
    }
  }

  negate() {
    try {
      const value = parseFloat(this.currentResult);
      const result = -value;
      this.currentExpression = result.toString();
      this.currentResult = result.toString();
      this.updateDisplay();
    } catch (error) {
      this.showError('取反错误');
    }
  }

  updateDisplay() {
    const expressionEl = document.getElementById(this.currentPanel === 'scientific' ? 'sci-expression' : 'expression');
    const resultEl = document.getElementById(this.currentPanel === 'scientific' ? 'sci-result' : 'result');
    
    expressionEl.textContent = this.currentExpression;
    resultEl.textContent = this.formatNumber(parseFloat(this.currentResult) || 0);
  }

  formatNumber(num) {
    if (isNaN(num)) return '0';
    
    // 处理大数字和小数
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-9 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // 处理小数位数
    const str = num.toString();
    if (str.includes('.')) {
      const parts = str.split('.');
      if (parts[1].length > 8) {
        return num.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    
    return str;
  }

  isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
  }

  addToHistory(expression, result) {
    const historyItem = {
      expression: expression,
      result: this.formatNumber(result),
      timestamp: new Date().toLocaleString()
    };
    
    this.history.unshift(historyItem);
    if (this.history.length > 50) {
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
        <div class="history-expression">${item.expression}</div>
        <div class="history-result">${item.result}</div>
      `;
      historyItem.addEventListener('click', () => this.loadFromHistory(item));
      historyList.appendChild(historyItem);
    });
  }

  loadFromHistory(item) {
    this.currentExpression = item.result;
    this.currentResult = item.result;
    this.isNewCalculation = true;
    this.updateDisplay();
    this.showSuccess('已加载历史记录');
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.updateHistoryDisplay();
    this.showSuccess('历史记录已清空');
  }

  saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
      this.history = JSON.parse(saved);
      this.updateHistoryDisplay();
    }
  }

  setupKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      if (this.currentPanel !== 'basic' && this.currentPanel !== 'scientific') return;
      
      const key = e.key;
      const panel = this.currentPanel === 'scientific' ? 'scientific' : 'basic';
      
      // 数字键
      if (/^[0-9]$/.test(key)) {
        this.appendNumber(key, panel);
        e.preventDefault();
      }
      
      // 运算符
      if (['+', '-', '*', '/'].includes(key)) {
        this.appendOperator(key);
        e.preventDefault();
      }
      
      // 特殊键
      switch (key) {
        case 'Enter':
        case '=':
          this.calculate();
          e.preventDefault();
          break;
        case 'Escape':
          this.clear();
          e.preventDefault();
          break;
        case 'Backspace':
          this.backspace();
          e.preventDefault();
          break;
        case '.':
          this.appendNumber('.', panel);
          e.preventDefault();
          break;
        case '%':
          this.calculatePercent();
          e.preventDefault();
          break;
      }
    });
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

  resetCalculator() {
    this.currentExpression = '0';
    this.currentResult = '0';
    this.isNewCalculation = true;
    this.updateDisplay();
  }

  // 单位转换功能
  updateConversionUnits() {
    const type = document.getElementById('conversion-type').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    
    const units = this.getConversionUnits(type);
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units.forEach(unit => {
      const option1 = document.createElement('option');
      option1.value = unit.value;
      option1.textContent = unit.label;
      fromUnit.appendChild(option1);
      
      const option2 = document.createElement('option');
      option2.value = unit.value;
      option2.textContent = unit.label;
      toUnit.appendChild(option2);
    });
    
    // 设置默认选择
    if (units.length > 1) {
      toUnit.selectedIndex = 1;
    }
  }

  getConversionUnits(type) {
    const units = {
      length: [
        { value: 'm', label: '米 (m)' },
        { value: 'km', label: '千米 (km)' },
        { value: 'cm', label: '厘米 (cm)' },
        { value: 'mm', label: '毫米 (mm)' },
        { value: 'in', label: '英寸 (in)' },
        { value: 'ft', label: '英尺 (ft)' },
        { value: 'yd', label: '码 (yd)' },
        { value: 'mi', label: '英里 (mi)' }
      ],
      weight: [
        { value: 'kg', label: '千克 (kg)' },
        { value: 'g', label: '克 (g)' },
        { value: 'mg', label: '毫克 (mg)' },
        { value: 'lb', label: '磅 (lb)' },
        { value: 'oz', label: '盎司 (oz)' }
      ],
      temperature: [
        { value: 'c', label: '摄氏度 (°C)' },
        { value: 'f', label: '华氏度 (°F)' },
        { value: 'k', label: '开尔文 (K)' }
      ]
    };
    
    return units[type] || units.length;
  }

  handleConversionInput() {
    const inputValue = document.getElementById('input-value').value;
    if (inputValue && !isNaN(inputValue)) {
      this.convert();
    }
  }

  convert() {
    const type = document.getElementById('conversion-type').value;
    const inputValue = parseFloat(document.getElementById('input-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    
    if (isNaN(inputValue)) {
      this.showError('请输入有效数值');
      return;
    }
    
    try {
      const result = this.performConversion(type, inputValue, fromUnit, toUnit);
      const resultEl = document.getElementById('conversion-result');
      const valueEl = document.getElementById('conversion-value');
      const unitEl = document.getElementById('conversion-unit');
      
      valueEl.textContent = this.formatNumber(result);
      unitEl.textContent = this.getUnitLabel(type, toUnit);
      resultEl.style.display = 'block';
      
      this.addToHistory(`${inputValue} ${fromUnit} → ${result} ${toUnit}`, result);
    } catch (error) {
      this.showError('转换失败: ' + error.message);
    }
  }

  performConversion(type, value, fromUnit, toUnit) {
    // 简化的转换逻辑
    const conversions = {
      length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
      },
      weight: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495
      },
      temperature: {
        c: { base: 'c', offset: 0 },
        f: { base: 'f', offset: 0 },
        k: { base: 'k', offset: 0 }
      }
    };
    
    if (type === 'temperature') {
      return this.convertTemperature(value, fromUnit, toUnit);
    }
    
    const units = conversions[type];
    if (!units) throw new Error('不支持的转换类型');
    
    const baseValue = value * units[fromUnit];
    return baseValue / units[toUnit];
  }

  convertTemperature(value, fromUnit, toUnit) {
    // 先转换为摄氏度
    let celsius;
    switch (fromUnit) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5/9;
        break;
      case 'k':
        celsius = value - 273.15;
        break;
      default:
        throw new Error('不支持的温度单位');
    }
    
    // 从摄氏度转换为目标单位
    switch (toUnit) {
      case 'c':
        return celsius;
      case 'f':
        return celsius * 9/5 + 32;
      case 'k':
        return celsius + 273.15;
      default:
        throw new Error('不支持的温度单位');
    }
  }

  getUnitLabel(type, unit) {
    const labels = {
      length: { m: '米', km: '千米', cm: '厘米', mm: '毫米', in: '英寸', ft: '英尺', yd: '码', mi: '英里' },
      weight: { kg: '千克', g: '克', mg: '毫克', lb: '磅', oz: '盎司' },
      temperature: { c: '摄氏度', f: '华氏度', k: '开尔文' }
    };
    
    return labels[type]?.[unit] || unit;
  }

  // 金融计算功能
  updateFinanceFields() {
    const type = document.getElementById('finance-type').value;
    const fieldsContainer = document.getElementById('finance-fields');
    
    fieldsContainer.innerHTML = '';
    
    switch (type) {
      case 'compound':
        this.createCompoundFields(fieldsContainer);
        break;
      case 'loan':
        this.createLoanFields(fieldsContainer);
        break;
      case 'investment':
        this.createInvestmentFields(fieldsContainer);
        break;
      case 'mortgage':
        this.createMortgageFields(fieldsContainer);
        break;
    }
  }

  createCompoundFields(container) {
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>本金 (元)</label>
          <input type="number" id="principal" placeholder="10000" step="100">
        </div>
        <div class="form-group">
          <label>年利率 (%)</label>
          <input type="number" id="rate" placeholder="5" step="0.1">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>投资年限</label>
          <input type="number" id="years" placeholder="10">
        </div>
        <div class="form-group">
          <label>复利频率</label>
          <select id="frequency">
            <option value="1">年复利</option>
            <option value="2">半年复利</option>
            <option value="4">季度复利</option>
            <option value="12">月复利</option>
            <option value="365">日复利</option>
          </select>
        </div>
      </div>
    `;
  }

  createLoanFields(container) {
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>贷款金额 (元)</label>
          <input type="number" id="loan-amount" placeholder="100000" step="1000">
        </div>
        <div class="form-group">
          <label>年利率 (%)</label>
          <input type="number" id="loan-rate" placeholder="4.9" step="0.1">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>贷款年限</label>
          <input type="number" id="loan-years" placeholder="30">
        </div>
        <div class="form-group">
          <label>还款方式</label>
          <select id="loan-type">
            <option value="equal">等额本息</option>
            <option value="principal">等额本金</option>
          </select>
        </div>
      </div>
    `;
  }

  createInvestmentFields(container) {
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>初始投资 (元)</label>
          <input type="number" id="invest-amount" placeholder="10000" step="100">
        </div>
        <div class="form-group">
          <label>年收益率 (%)</label>
          <input type="number" id="invest-rate" placeholder="8" step="0.1">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>投资年限</label>
          <input type="number" id="invest-years" placeholder="10">
        </div>
        <div class="form-group">
          <label>每月追加 (元)</label>
          <input type="number" id="invest-monthly" placeholder="1000" step="100">
        </div>
      </div>
    `;
  }

  createMortgageFields(container) {
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>房价 (元)</label>
          <input type="number" id="house-price" placeholder="1000000" step="10000">
        </div>
        <div class="form-group">
          <label>首付比例 (%)</label>
          <input type="number" id="down-payment" placeholder="30" step="5">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>年利率 (%)</label>
          <input type="number" id="mortgage-rate" placeholder="4.9" step="0.1">
        </div>
        <div class="form-group">
          <label>贷款年限</label>
          <input type="number" id="mortgage-years" placeholder="30">
        </div>
      </div>
    `;
  }

  calculateFinance() {
    const type = document.getElementById('finance-type').value;
    let results;
    
    try {
      switch (type) {
        case 'compound':
          results = this.calculateCompound();
          break;
        case 'loan':
          results = this.calculateLoan();
          break;
        case 'investment':
          results = this.calculateInvestment();
          break;
        case 'mortgage':
          results = this.calculateMortgage();
          break;
      }
      
      this.displayFinanceResults(results);
      this.showSuccess('计算完成');
    } catch (error) {
      this.showError('计算失败: ' + error.message);
    }
  }

  calculateCompound() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const years = parseFloat(document.getElementById('years').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    
    if (!principal || !rate || !years || !frequency) {
      throw new Error('请填写所有字段');
    }
    
    const finalAmount = principal * Math.pow(1 + rate / frequency, frequency * years);
    const interest = finalAmount - principal;
    
    return {
      title: '复利计算结果',
      items: [
        { label: '本金', value: this.formatCurrency(principal) },
        { label: '最终金额', value: this.formatCurrency(finalAmount) },
        { label: '利息收入', value: this.formatCurrency(interest) },
        { label: '年化收益率', value: (rate * 100).toFixed(2) + '%' }
      ]
    };
  }

  calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('loan-years').value);
    const type = document.getElementById('loan-type').value;
    
    if (!amount || !rate || !years) {
      throw new Error('请填写所有字段');
    }
    
    const months = years * 12;
    let monthlyPayment, totalPayment, totalInterest;
    
    if (type === 'equal') {
      monthlyPayment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - amount;
    } else {
      const monthlyPrincipal = amount / months;
      monthlyPayment = monthlyPrincipal + amount * rate;
      totalInterest = (amount * rate * (months + 1)) / 2;
      totalPayment = amount + totalInterest;
    }
    
    return {
      title: '贷款计算结果',
      items: [
        { label: '贷款金额', value: this.formatCurrency(amount) },
        { label: '月供', value: this.formatCurrency(monthlyPayment) },
        { label: '总还款', value: this.formatCurrency(totalPayment) },
        { label: '总利息', value: this.formatCurrency(totalInterest) }
      ]
    };
  }

  calculateInvestment() {
    const initial = parseFloat(document.getElementById('invest-amount').value);
    const rate = parseFloat(document.getElementById('invest-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('invest-years').value);
    const monthly = parseFloat(document.getElementById('invest-monthly').value) || 0;
    
    if (!initial || !rate || !years) {
      throw new Error('请填写所有字段');
    }
    
    const months = years * 12;
    const monthlyRate = rate;
    
    let futureValue = initial;
    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + monthly;
    }
    
    const totalContributed = initial + (monthly * months);
    const totalInterest = futureValue - totalContributed;
    
    return {
      title: '投资计算结果',
      items: [
        { label: '初始投资', value: this.formatCurrency(initial) },
        { label: '总投入', value: this.formatCurrency(totalContributed) },
        { label: '最终金额', value: this.formatCurrency(futureValue) },
        { label: '投资收益', value: this.formatCurrency(totalInterest) }
      ]
    };
  }

  calculateMortgage() {
    const price = parseFloat(document.getElementById('house-price').value);
    const downPaymentPercent = parseFloat(document.getElementById('down-payment').value) / 100;
    const rate = parseFloat(document.getElementById('mortgage-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('mortgage-years').value);
    
    if (!price || !downPaymentPercent || !rate || !years) {
      throw new Error('请填写所有字段');
    }
    
    const downPayment = price * downPaymentPercent;
    const loanAmount = price - downPayment;
    const months = years * 12;
    
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    
    return {
      title: '房贷计算结果',
      items: [
        { label: '房价', value: this.formatCurrency(price) },
        { label: '首付', value: this.formatCurrency(downPayment) },
        { label: '贷款金额', value: this.formatCurrency(loanAmount) },
        { label: '月供', value: this.formatCurrency(monthlyPayment) },
        { label: '总还款', value: this.formatCurrency(totalPayment) },
        { label: '总利息', value: this.formatCurrency(totalInterest) }
      ]
    };
  }

  displayFinanceResults(results) {
    const resultContainer = document.getElementById('finance-result');
    const resultsDiv = document.getElementById('finance-results');
    const titleEl = resultContainer.querySelector('.result-title');
    
    titleEl.textContent = results.title;
    resultsDiv.innerHTML = '';
    
    results.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);';
      itemDiv.innerHTML = `
        <span style="font-weight: 500; color: var(--text);">${item.label}:</span>
        <span style="font-weight: 600; color: var(--primary);">${item.value}</span>
      `;
      resultsDiv.appendChild(itemDiv);
    });
    
    resultContainer.style.display = 'block';
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  }

  // 复制功能
  copyResult() {
    const value = document.getElementById('conversion-value').textContent;
    const unit = document.getElementById('conversion-unit').textContent;
    const text = `${value} ${unit}`;
    
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('已复制到剪贴板');
    }).catch(() => {
      this.showError('复制失败');
    });
  }

  copyFinanceResult() {
    const resultsDiv = document.getElementById('finance-results');
    const items = resultsDiv.querySelectorAll('div');
    let text = '';
    
    items.forEach(item => {
      const spans = item.querySelectorAll('span');
      if (spans.length === 2) {
        text += `${spans[0].textContent} ${spans[1].textContent}\n`;
      }
    });
    
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('已复制到剪贴板');
    }).catch(() => {
      this.showError('复制失败');
    });
  }
}

// 全局函数，用于HTML中的onclick事件
let calculator;

function convert() {
  calculator.convert();
}

function calculateFinance() {
  calculator.calculateFinance();
}

function copyResult() {
  calculator.copyResult();
}

function copyFinanceResult() {
  calculator.copyFinanceResult();
}

function clearHistory() {
  calculator.clearHistory();
}

// 初始化计算器
document.addEventListener('DOMContentLoaded', () => {
  calculator = new ProfessionalCalculator();
}); 