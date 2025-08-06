// 切西瓜（极简版）
const fruitArea = document.getElementById('fruit-area');
const startFruitBtn = document.getElementById('start-fruit-btn');
let fruits = [], score = 0, fruitTimer = null;
function spawnFruit() {
  const f = document.createElement('div');
  f.className = 'fruit';
  f.style.left = Math.random()*80+10+'%';
  f.style.top = '90%';
  fruitArea.appendChild(f);
  fruits.push(f);
  let y = 90;
  const fall = setInterval(()=>{
    y -= 2;
    f.style.top = y+'%';
    if (y<0) { clearInterval(fall); f.remove(); }
  }, 30);
  f.onclick = () => { score++; f.remove(); };
}
startFruitBtn.onclick = () => {
  score = 0;
  fruitArea.innerHTML = '';
  clearInterval(fruitTimer);
  fruitTimer = setInterval(spawnFruit, 500);
  setTimeout(()=>{clearInterval(fruitTimer); alert('得分：'+score);}, 15000);
};
// 2048/贪吃蛇/反应力测试可后续补充，结构预留 