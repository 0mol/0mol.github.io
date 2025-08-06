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

// 基础计算器
const formBasic = document.getElementById('form-basic');
formBasic.onsubmit = e => {
  e.preventDefault();
  try {
    const exp = document.getElementById('basic-exp').value;
    // 只允许数字和+-*/().
    if (!/^[-+*/().\d\s]+$/.test(exp)) throw '仅支持数字和+-*/().';
    const result = Function('return ' + exp)();
    document.getElementById('result-basic').textContent = '结果：' + result;
  } catch (err) {
    document.getElementById('result-basic').textContent = '错误：' + err;
  }
};

// 科学计算器
const formScience = document.getElementById('form-science');
formScience.onsubmit = e => {
  e.preventDefault();
  try {
    let exp = document.getElementById('science-exp').value;
    // 支持sin,cos,log,exp,pow
    exp = exp.replace(/sin\(([^)]+)\)/g, 'Math.sin($1*Math.PI/180)')
             .replace(/cos\(([^)]+)\)/g, 'Math.cos($1*Math.PI/180)')
             .replace(/tan\(([^)]+)\)/g, 'Math.tan($1*Math.PI/180)')
             .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
             .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
             .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
             .replace(/([\d.]+)\^([\d.]+)/g, 'Math.pow($1,$2)');
    const result = Function('return ' + exp)();
    document.getElementById('result-science').textContent = '结果：' + result;
  } catch (err) {
    document.getElementById('result-science').textContent = '错误：' + err;
  }
};

// 房贷计算器
const formMortgage = document.getElementById('form-mortgage');
formMortgage.onsubmit = e => {
  e.preventDefault();
  const total = +document.getElementById('mortgage-total').value * 10000;
  const rate = +document.getElementById('mortgage-rate').value / 100 / 12;
  const months = +document.getElementById('mortgage-years').value * 12;
  const type = document.getElementById('mortgage-type').value;
  let result = '';
  if (type === 'equal') {
    // 等额本息
    const m = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    result = `每月还款：${m.toFixed(2)}元，总利息：${(m*months-total).toFixed(2)}元，总还款：${(m*months).toFixed(2)}元`;
  } else {
    // 等额本金
    const m1 = total / months + (total - 0) * rate;
    const m2 = total / months + (total - total * (months - 1) / months) * rate;
    const totalInterest = (months + 1) * total * rate / 2;
    result = `首月还款：${m1.toFixed(2)}元，末月还款：${m2.toFixed(2)}元，总利息：${totalInterest.toFixed(2)}元，总还款：${(total+totalInterest).toFixed(2)}元`;
  }
  document.getElementById('result-mortgage').textContent = result;
};

// 五险一金
const formInsurance = document.getElementById('form-insurance');
formInsurance.onsubmit = e => {
  e.preventDefault();
  const base = +document.getElementById('insurance-base').value;
  const sb = +document.getElementById('insurance-sb').value / 100;
  const gjj = +document.getElementById('insurance-gjj').value / 100;
  const sbAmount = base * sb;
  const gjjAmount = base * gjj;
  document.getElementById('result-insurance').textContent = `社保：${sbAmount.toFixed(2)}元，公积金：${gjjAmount.toFixed(2)}元，合计：${(sbAmount+gjjAmount).toFixed(2)}元/月`;
};

// 个人所得税
const formTax = document.getElementById('form-tax');
formTax.onsubmit = e => {
  e.preventDefault();
  const salary = +document.getElementById('tax-salary').value;
  const insurance = +document.getElementById('tax-insurance').value;
  const deduct = +document.getElementById('tax-deduct').value;
  const base = salary - insurance - 5000 - deduct;
  let tax = 0;
  if (base <= 0) tax = 0;
  else if (base <= 3000) tax = base * 0.03;
  else if (base <= 12000) tax = base * 0.1 - 210;
  else if (base <= 25000) tax = base * 0.2 - 1410;
  else if (base <= 35000) tax = base * 0.25 - 2660;
  else if (base <= 55000) tax = base * 0.3 - 4410;
  else if (base <= 80000) tax = base * 0.35 - 7160;
  else tax = base * 0.45 - 15160;
  document.getElementById('result-tax').textContent = `月应纳税：${tax.toFixed(2)}元，税后收入：${(salary-insurance-tax).toFixed(2)}元`;
};

// 单位换算
const unitMap = {
  length: { m: 1, cm: 0.01, mm: 0.001, km: 1000, in: 0.0254, ft: 0.3048 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592 },
  area: { '㎡': 1, 'm2': 1, 'cm2': 0.0001, '平方英尺': 0.092903, 'acre': 4046.86 },
  volume: { 'm3': 1, 'L': 0.001, 'ml': 0.000001, 'gal': 0.00378541 },
};
const formUnit = document.getElementById('form-unit');
formUnit.onsubmit = e => {
  e.preventDefault();
  const value = +document.getElementById('unit-value').value;
  const type = document.getElementById('unit-type').value;
  const from = document.getElementById('unit-from').value.trim();
  const to = document.getElementById('unit-to').value.trim();
  let result = '';
  if (type === 'temp') {
    // 温度特殊
    if (from === '℃' && to === '℉') result = value * 9/5 + 32;
    else if (from === '℉' && to === '℃') result = (value - 32) * 5/9;
    else result = '仅支持 ℃↔℉';
  } else {
    if (!unitMap[type][from] || !unitMap[type][to]) result = '单位不支持';
    else result = value * unitMap[type][from] / unitMap[type][to];
  }
  document.getElementById('result-unit').textContent = '结果：' + result;
};

// BMI
const formBmi = document.getElementById('form-bmi');
formBmi.onsubmit = e => {
  e.preventDefault();
  const h = +document.getElementById('bmi-height').value / 100;
  const w = +document.getElementById('bmi-weight').value;
  const bmi = w / (h * h);
  let level = '';
  if (bmi < 18.5) level = '偏瘦';
  else if (bmi < 24) level = '正常';
  else if (bmi < 28) level = '超重';
  else level = '肥胖';
  document.getElementById('result-bmi').textContent = `BMI：${bmi.toFixed(2)}，${level}`;
};

// 利息计算
const formInterest = document.getElementById('form-interest');
formInterest.onsubmit = e => {
  e.preventDefault();
  const p = +document.getElementById('interest-principal').value;
  const r = +document.getElementById('interest-rate').value / 100;
  const y = +document.getElementById('interest-years').value;
  const interest = p * r * y;
  document.getElementById('result-interest').textContent = `利息：${interest.toFixed(2)}元，本息合计：${(p+interest).toFixed(2)}元`;
}; 