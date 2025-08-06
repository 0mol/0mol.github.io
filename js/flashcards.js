let cards = JSON.parse(localStorage.getItem('flashcards')||'[]');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const addBtn = document.getElementById('add-card-btn');
const cardList = document.getElementById('card-list');
const drawBtn = document.getElementById('draw-card-btn');
const drawShow = document.getElementById('draw-card-show');
const statTotal = document.getElementById('stat-total');
const statReview = document.getElementById('stat-review');

function renderList() {
  cardList.innerHTML = '';
  cards.forEach((c,i) => {
    const li = document.createElement('li');
    li.textContent = c.front + ' / ' + c.back;
    const del = document.createElement('button');
    del.textContent = '删除';
    del.onclick = () => { cards.splice(i,1); save(); };
    li.appendChild(del);
    cardList.appendChild(li);
  });
  statTotal.textContent = cards.length;
}
function save() {
  localStorage.setItem('flashcards', JSON.stringify(cards));
  renderList();
}
addBtn.onclick = () => {
  if (!cardFront.value.trim() || !cardBack.value.trim()) return;
  cards.push({front:cardFront.value, back:cardBack.value, review:0});
  cardFront.value = cardBack.value = '';
  save();
};
drawBtn.onclick = () => {
  if (!cards.length) { drawShow.textContent = '无卡片'; return; }
  const idx = Math.floor(Math.random()*cards.length);
  const c = cards[idx];
  drawShow.textContent = c.front + ' / ' + c.back;
  c.review = (c.review||0)+1;
  save();
  statReview.textContent = c.review;
};
renderList(); 