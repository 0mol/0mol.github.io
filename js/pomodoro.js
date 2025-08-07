// 专业级番茄钟时间管理工具
class ProfessionalPomodoro {
  constructor() {
    this.timer = null;
    this.remainingTime = 0;
    this.totalTime = 0;
    this.isRunning = false;
    this.currentMode = 'focus'; // focus, shortBreak, longBreak
    this.completedPomodoros = 0;
    this.completedTasks = 0;
    this.tasks = [];
    this.settings = this.loadSettings();
    this.stats = this.loadStats();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadTasks();
    this.updateDisplay();
    this.updateStats();
    this.requestNotificationPermission();
  }
  
  bindEvents() {
    // 计时器控制按钮
    document.getElementById('start-btn').addEventListener('click', () => this.startTimer());
    document.getElementById('pause-btn').addEventListener('click', () => this.pauseTimer());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetTimer());
    document.getElementById('skip-btn').addEventListener('click', () => this.skipTimer());
    
    // 设置变更
    document.getElementById('focus-time').addEventListener('change', (e) => {
      this.settings.focusTime = parseInt(e.target.value);
      this.saveSettings();
      if (!this.isRunning) this.updateDisplay();
    });
    
    document.getElementById('short-break').addEventListener('change', (e) => {
      this.settings.shortBreak = parseInt(e.target.value);
      this.saveSettings();
    });
    
    document.getElementById('long-break').addEventListener('change', (e) => {
      this.settings.longBreak = parseInt(e.target.value);
      this.saveSettings();
    });
    
    document.getElementById('long-break-interval').addEventListener('change', (e) => {
      this.settings.longBreakInterval = parseInt(e.target.value);
      this.saveSettings();
    });
    
    document.getElementById('auto-start').addEventListener('change', (e) => {
      this.settings.autoStart = e.target.value === 'true';
      this.saveSettings();
    });
    
    document.getElementById('sound-enabled').addEventListener('change', (e) => {
      this.settings.soundEnabled = e.target.value === 'true';
      this.saveSettings();
    });
    
    // 任务管理
    document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
    document.getElementById('task-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    // 通知设置
    document.getElementById('desktop-notification').addEventListener('click', () => this.toggleNotification('desktop'));
    document.getElementById('sound-notification').addEventListener('click', () => this.toggleNotification('sound'));
    document.getElementById('browser-notification').addEventListener('click', () => this.toggleNotification('browser'));
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.toggleTimer();
      }
    });
  }
  
  // 计时器核心功能
  startTimer() {
    if (this.isRunning) return;
    
    if (this.remainingTime === 0) {
      this.initializeTimer();
    }
    
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.remainingTime--;
      this.updateDisplay();
      
      if (this.remainingTime <= 0) {
        this.completeTimer();
      }
    }, 1000);
    
    this.updateButtonStates();
  }
  
  pauseTimer() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.timer);
    this.timer = null;
    this.updateButtonStates();
  }
  
  resetTimer() {
    this.pauseTimer();
    this.initializeTimer();
    this.updateDisplay();
  }
  
  skipTimer() {
    this.completeTimer();
  }
  
  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }
  
  initializeTimer() {
    switch (this.currentMode) {
      case 'focus':
        this.remainingTime = this.settings.focusTime * 60;
        break;
      case 'shortBreak':
        this.remainingTime = this.settings.shortBreak * 60;
        break;
      case 'longBreak':
        this.remainingTime = this.settings.longBreak * 60;
        break;
    }
    this.totalTime = this.remainingTime;
  }
  
  completeTimer() {
    this.pauseTimer();
    
    // 更新统计
    if (this.currentMode === 'focus') {
      this.completedPomodoros++;
      this.stats.completedPomodoros++;
      this.stats.totalFocusTime += this.settings.focusTime;
      this.saveStats();
    }
    
    // 播放声音
    if (this.settings.soundEnabled) {
      this.playNotificationSound();
    }
    
    // 发送通知
    this.sendNotification();
    
    // 自动切换到下一个模式
    this.switchToNextMode();
    
    // 自动开始下一个计时器
    if (this.settings.autoStart) {
      setTimeout(() => this.startTimer(), 1000);
    }
  }
  
  switchToNextMode() {
    if (this.currentMode === 'focus') {
      this.completedPomodoros++;
      if (this.completedPomodoros % this.settings.longBreakInterval === 0) {
        this.currentMode = 'longBreak';
      } else {
        this.currentMode = 'shortBreak';
      }
    } else {
      this.currentMode = 'focus';
    }
    
    this.initializeTimer();
    this.updateDisplay();
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer-display').textContent = display;
    
    // 更新圆形进度条
    const progress = this.totalTime > 0 ? ((this.totalTime - this.remainingTime) / this.totalTime) * 360 : 0;
    const timerCircle = document.getElementById('timer-circle');
    timerCircle.style.background = `conic-gradient(var(--primary) ${progress}deg, var(--bg) ${progress}deg)`;
    
    // 更新模式显示
    const modeText = {
      'focus': '专注',
      'shortBreak': '短休息',
      'longBreak': '长休息'
    };
    document.getElementById('timer-mode').textContent = modeText[this.currentMode];
    
    // 更新进度条
    this.updateProgressBar();
  }
  
  updateButtonStates() {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (this.isRunning) {
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'flex';
    } else {
      startBtn.style.display = 'flex';
      pauseBtn.style.display = 'none';
    }
  }
  
  updateProgressBar() {
    const targetPomodoros = 8; // 每日目标
    const progress = Math.min((this.completedPomodoros / targetPomodoros) * 100, 100);
    
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${this.completedPomodoros}/${targetPomodoros}`;
  }
  
  // 任务管理功能
  addTask() {
    const input = document.getElementById('task-input');
    const priority = document.getElementById('task-priority').value;
    const text = input.value.trim();
    
    if (!text) return;
    
    const task = {
      id: Date.now(),
      text: text,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    this.updateTaskStats();
    
    input.value = '';
  }
  
  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    
    if (task.completed) {
      this.completedTasks++;
      this.stats.completedTasks++;
      this.saveStats();
    } else {
      this.completedTasks--;
      this.stats.completedTasks--;
      this.saveStats();
    }
    
    this.saveTasks();
    this.renderTasks();
    this.updateTaskStats();
  }
  
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.renderTasks();
    this.updateTaskStats();
  }
  
  renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    this.tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority`;
      
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-content">
          <div class="task-title">${task.text}</div>
          <div class="task-meta">
            <span>${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} ${task.priority}</span>
            <span>${new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="task-btn delete" onclick="pomodoro.deleteTask(${task.id})">删除</button>
        </div>
      `;
      
      const checkbox = taskItem.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => this.toggleTask(task.id));
      
      taskList.appendChild(taskItem);
    });
  }
  
  updateTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('total-tasks').textContent = `总计: ${total}`;
    document.getElementById('completed-tasks-count').textContent = `已完成: ${completed}`;
    document.getElementById('pending-tasks').textContent = `待完成: ${pending}`;
  }
  
  // 统计功能
  updateStats() {
    document.getElementById('completed-pomodoros').textContent = this.stats.completedPomodoros;
    document.getElementById('total-focus-time').textContent = this.stats.totalFocusTime;
    document.getElementById('completed-tasks').textContent = this.stats.completedTasks;
    
    // 计算专注效率
    const efficiency = this.stats.completedPomodoros > 0 ? 
      Math.round((this.stats.completedTasks / this.stats.completedPomodoros) * 100) : 0;
    document.getElementById('focus-efficiency').textContent = `${efficiency}%`;
  }
  
  // 通知功能
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.settings.notifications = permission === 'granted';
      this.saveSettings();
    }
  }
  
  toggleNotification(type) {
    const toggle = document.getElementById(`${type}-notification`);
    toggle.classList.toggle('active');
    
    this.settings[`${type}Notification`] = toggle.classList.contains('active');
    this.saveSettings();
  }
  
  sendNotification() {
    const title = this.currentMode === 'focus' ? '专注时间结束！' : '休息时间结束！';
    const body = this.currentMode === 'focus' ? '该休息一下了，保持专注！' : '休息结束，继续专注工作！';
    
    if (this.settings.desktopNotification && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: body, icon: '/favicon.ico' });
    }
    
    if (this.settings.browserNotification) {
      // 浏览器内通知
      this.showBrowserNotification(title, body);
    }
  }
  
  showBrowserNotification(title, body) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 0.9em;">${body}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  playNotificationSound() {
    // 创建音频上下文播放提示音
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  // 数据持久化
  loadSettings() {
    const defaultSettings = {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStart: true,
      soundEnabled: true,
      desktopNotification: false,
      soundNotification: true,
      browserNotification: true
    };
    
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }
  
  saveSettings() {
    localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
  }
  
  loadStats() {
    const defaultStats = {
      completedPomodoros: 0,
      totalFocusTime: 0,
      completedTasks: 0,
      lastReset: new Date().toDateString()
    };
    
    const saved = localStorage.getItem('pomodoroStats');
    const stats = saved ? JSON.parse(saved) : defaultStats;
    
    // 检查是否需要重置每日统计
    if (stats.lastReset !== new Date().toDateString()) {
      stats.completedPomodoros = 0;
      stats.totalFocusTime = 0;
      stats.completedTasks = 0;
      stats.lastReset = new Date().toDateString();
    }
    
    return stats;
  }
  
  saveStats() {
    this.stats.lastReset = new Date().toDateString();
    localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
  }
  
  loadTasks() {
    const saved = localStorage.getItem('pomodoroTasks');
    this.tasks = saved ? JSON.parse(saved) : [];
    this.completedTasks = this.tasks.filter(t => t.completed).length;
  }
  
  saveTasks() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
  }
  
  // 导出数据
  exportData() {
    const data = {
      settings: this.settings,
      stats: this.stats,
      tasks: this.tasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // 导入数据
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) this.settings = { ...this.settings, ...data.settings };
        if (data.stats) this.stats = { ...this.stats, ...data.stats };
        if (data.tasks) this.tasks = data.tasks;
        
        this.saveSettings();
        this.saveStats();
        this.saveTasks();
        
        this.renderTasks();
        this.updateStats();
        this.updateTaskStats();
        
        alert('数据导入成功！');
      } catch (error) {
        alert('数据导入失败，请检查文件格式！');
      }
    };
    reader.readAsText(file);
  }
}

// 初始化番茄钟
let pomodoro;

document.addEventListener('DOMContentLoaded', () => {
  pomodoro = new ProfessionalPomodoro();
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