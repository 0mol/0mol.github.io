const txtInput = document.getElementById('txt-input');
const upperBtn = document.getElementById('txt-upper');
const lowerBtn = document.getElementById('txt-lower');
const statBtn = document.getElementById('txt-stat');
const statShow = document.getElementById('txt-stat-show');
const dedupBtn = document.getElementById('txt-dedup');
const formatBtn = document.getElementById('txt-format');
const regexBtn = document.getElementById('txt-regex');
const regexExp = document.getElementById('txt-regex-exp');
const regexRep = document.getElementById('txt-regex-rep');

upperBtn.onclick = () => { txtInput.value = txtInput.value.toUpperCase(); };
lowerBtn.onclick = () => { txtInput.value = txtInput.value.toLowerCase(); };
statBtn.onclick = () => {
  const t = txtInput.value;
  statShow.textContent = `字数：${t.length}，行数：${t.split('\n').length}`;
};
dedupBtn.onclick = () => {
  const lines = txtInput.value.split('\n');
  txtInput.value = Array.from(new Set(lines)).join('\n');
};
formatBtn.onclick = () => {
  try { txtInput.value = JSON.stringify(JSON.parse(txtInput.value),null,2); }
  catch { alert('不是合法JSON'); }
};
regexBtn.onclick = () => {
  try {
    const re = new RegExp(regexExp.value,'g');
    txtInput.value = txtInput.value.replace(re, regexRep.value);
  } catch { alert('正则有误'); }
}; 