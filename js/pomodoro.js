// 番茄钟核心
const timerDisplay = document.getElementById('pomodoro-timer');
const startBtn = document.getElementById('pomodoro-start');
const stopBtn = document.getElementById('pomodoro-stop');
const modeSel = document.getElementById('pomodoro-mode');
const minInput = document.getElementById('pomodoro-minutes');
let timer = null, remain = 0, mode = 'work', stats = {work:0, break:0};

function updateDisplay() {
  const m = String(Math.floor(remain/60)).padStart(2,'0');
  const s = String(remain%60).padStart(2,'0');
  timerDisplay.textContent = `${m}:${s}`;
}
function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    remain--;
    updateDisplay();
    if (remain <= 0) {
      clearInterval(timer); timer = null;
      stats[mode]++;
      localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
      alert(mode==='work'?'专注结束，休息一下！':'休息结束，继续专注！');
    }
  }, 1000);
}
function stopTimer() { clearInterval(timer); timer = null; }
startBtn.onclick = () => {
  mode = modeSel.value;
  remain = +minInput.value * 60;
  updateDisplay();
  startTimer();
};
stopBtn.onclick = stopTimer;
modeSel.onchange = () => {
  minInput.value = modeSel.value==='work'?25:5;
};
// 初始化
if (localStorage.getItem('pomodoro-stats')) stats = JSON.parse(localStorage.getItem('pomodoro-stats'));
updateDisplay();

// 任务清单
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem('pomodoro-tasks')||'[]');
  taskList.innerHTML = '';
  tasks.forEach((t,i) => {
    const li = document.createElement('li');
    li.textContent = t.text;
    if (t.done) li.style.textDecoration = 'line-through';
    li.onclick = () => {
      t.done = !t.done;
      tasks[i] = t;
      localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
      renderTasks();
    };
    const del = document.createElement('button');
    del.textContent = '删除';
    del.onclick = e => { e.stopPropagation(); tasks.splice(i,1); localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks)); renderTasks(); };
    li.appendChild(del);
    taskList.appendChild(li);
  });
}
addTaskBtn.onclick = () => {
  const val = taskInput.value.trim();
  if (!val) return;
  const tasks = JSON.parse(localStorage.getItem('pomodoro-tasks')||'[]');
  tasks.push({text:val,done:false});
  localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  taskInput.value = '';
  renderTasks();
};
renderTasks();

// 历史统计
const statWork = document.getElementById('stat-work');
const statBreak = document.getElementById('stat-break');
function updateStats() {
  statWork.textContent = stats.work;
  statBreak.textContent = stats.break;
}
updateStats(); 