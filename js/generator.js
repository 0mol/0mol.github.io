// 随机颜色
const colorBtn = document.getElementById('gen-color-btn');
const colorShow = document.getElementById('gen-color-show');
colorBtn.onclick = () => {
  const c = '#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0');
  colorShow.style.background = c;
  colorShow.textContent = c;
  navigator.clipboard.writeText(c);
};

// 随机密码
const pwdBtn = document.getElementById('gen-pwd-btn');
const pwdLen = document.getElementById('gen-pwd-len');
const pwdShow = document.getElementById('gen-pwd-show');
pwdBtn.onclick = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  let pwd = '';
  for(let i=0;i<pwdLen.value;i++) pwd += chars[Math.floor(Math.random()*chars.length)];
  pwdShow.value = pwd;
};

// 灵感生成
const ideaBtn = document.getElementById('gen-idea-btn');
const ideaShow = document.getElementById('gen-idea-show');
const ideas = ['写一首诗','画一幅画','做一道新菜','给朋友发消息','尝试冥想5分钟','换个桌面壁纸','写下今天的感恩','拍一张有趣的照片','用左手写字','尝试新运动'];
ideaBtn.onclick = () => {
  ideaShow.textContent = ideas[Math.floor(Math.random()*ideas.length)];
};

// 昵称生成
const nickBtn = document.getElementById('gen-nick-btn');
const nickShow = document.getElementById('gen-nick-show');
const nicks = ['小太阳','夜行者','风之子','代码侠','猫头鹰','星辰猎人','橙子汽水','云端漫步','闪电侠','小宇宙'];
nickBtn.onclick = () => {
  nickShow.textContent = nicks[Math.floor(Math.random()*nicks.length)] + Math.floor(Math.random()*1000);
};

// emoji生成
const emojiBtn = document.getElementById('gen-emoji-btn');
const emojiShow = document.getElementById('gen-emoji-show');
const emojis = ['😀','😎','🥳','🤖','🐱','🍉','🌈','🚀','🎲','🦄','🍔','🎧','🧩','🦕','🍕','🎮'];
emojiBtn.onclick = () => {
  let s = '';
  for(let i=0;i<5;i++) s += emojis[Math.floor(Math.random()*emojis.length)];
  emojiShow.textContent = s;
};

// 随机数/抽签
const randBtn = document.getElementById('gen-rand-btn');
const randMin = document.getElementById('gen-rand-min');
const randMax = document.getElementById('gen-rand-max');
const randShow = document.getElementById('gen-rand-show');
randBtn.onclick = () => {
  const min = +randMin.value, max = +randMax.value;
  if (isNaN(min)||isNaN(max)||min>=max) { randShow.textContent = '区间有误'; return; }
  randShow.textContent = Math.floor(Math.random()*(max-min+1))+min;
}; 