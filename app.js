// Focus Flow - Pomodoro Timer (No Persistence Version)
// Everything resets after page reload

class FocusFlowApp {
    constructor() {
        // App state (all in memory, resets on reload)
        this.currentTask = null;
        this.isActive = false;
        this.isPaused = false;
        this.timeLeft = 0;
        this.selectedDuration = 25;
        this.currentSession = 'work';
        this.timer = null;
        this.sessions = [];
        this.currentTheme = 'sage';
        
        // Default tasks (reset every time)
        this.tasks = [
            {
                id: 1,
                name: "Physics Problem Set Ch. 12",
                subject: "Physics",
                difficulty: "Hard",
                duration: 60,
                status: "pending",
                tip: "Break complex problems into smaller steps. Physics flows when you understand the fundamentals!"
            },
            {
                id: 2,
                name: "Organic Chemistry Reactions",
                subject: "Chemistry",
                difficulty: "Medium",
                duration: 45,
                status: "pending",
                tip: "Visualize molecular movements. Chemistry is like a dance of atoms!"
            },
            {
                id: 3,
                name: "Calculus Integration Practice",
                subject: "Mathematics",
                difficulty: "Medium",
                duration: 25,
                status: "pending",
                tip: "Integration is about finding areas under curves. Each problem builds your intuition!"
            },
            {
                id: 4,
                name: "Cell Biology Review",
                subject: "Biology",
                difficulty: "Easy",
                duration: 30,
                status: "pending",
                tip: "Think of cells as tiny factories. Each organelle has a specific job to do!"
            },
            {
                id: 5,
                name: "IOQM Mock Test Analysis",
                subject: "IOQM",
                difficulty: "Hard",
                duration: 90,
                status: "pending",
                tip: "Analyze your mistakes thoroughly. Each error is a learning opportunity!"
            }
        ];
        
        // Psychology tips for motivation
        this.psychologyTips = [
            "🌱 Create your perfect study flow - edit tasks to match today's priorities!",
            "🧠 Your brain thrives on focused 25-minute sessions followed by brief breaks!",
            "⚡ The first 5 minutes are the hardest - push through and flow begins!",
            "🎯 Clear goals and deep focus create the optimal learning state!",
            "🌊 Let your mind flow like water - gentle, persistent, and powerful!",
            "✨ Each completed session builds momentum for the next challenge!",
            "🔥 Your focus muscle grows stronger with every mindful practice!"
        ];
        
        this.currentTipIndex = 0;
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.updateUI();
        this.startTipRotation();
        this.applyTheme(this.currentTheme);
        this.updateDate();
        this.initializeAnalytics();
    }
    
    setupEventListeners() {
        // Theme selector
        document.getElementById('themeSelector').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
        
        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.openTaskModal();
        });
        
        document.getElementById('resetTasksBtn').addEventListener('click', () => {
            this.resetTasks();
        });
        
        // Timer controls
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('skipBtn').addEventListener('click', () => {
            this.skipSession();
        });
        
        document.getElementById('completeBtn').addEventListener('click', () => {
            this.completeSession();
        });
        
        // Duration modal
        document.getElementById('cancelDurationBtn').addEventListener('click', () => {
            this.closeDurationModal();
        });
        
        document.getElementById('confirmDurationBtn').addEventListener('click', () => {
            this.startSession();
        });
        
        // Task edit modal
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.saveTask();
        });
        
        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.closeEditModal();
        });
        
        document.getElementById('deleteTaskBtn').addEventListener('click', () => {
            this.deleteTask();
        });
        
        // Session completion modal
        document.getElementById('saveSessionBtn').addEventListener('click', () => {
            this.saveSessionRating();
        });
        
        document.getElementById('skipRatingBtn').addEventListener('click', () => {
            this.closeSessionModal();
        });
        
        // Focus slider
        document.getElementById('focusSlider').addEventListener('input', (e) => {
            document.getElementById('sliderValue').textContent = e.target.value;
        });
        
        // Duration option selection
        document.querySelectorAll('.duration-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedDuration = parseInt(option.dataset.duration);
                document.getElementById('confirmDurationBtn').disabled = false;
            });
        });
        
        // Modal overlays
        document.getElementById('durationModalOverlay').addEventListener('click', () => {
            this.closeDurationModal();
        });
        
        document.getElementById('taskEditModalOverlay').addEventListener('click', () => {
            this.closeEditModal();
        });
        
        document.getElementById('modalOverlay').addEventListener('click', () => {
            this.closeSessionModal();
        });
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('hidden');
        });
        
        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });
        
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });
        
        // Analytics toggle
        document.getElementById('analyticsToggle').addEventListener('click', () => {
            this.toggleAnalytics();
        });
    }
    
    applyTheme(themeName) {
        this.currentTheme = themeName;
        document.body.setAttribute('data-theme', themeName);
        document.getElementById('themeSelector').value = themeName;
    }
    
    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.querySelector('.date').textContent = now.toLocaleDateString('en-US', options);
    }
    
    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }
    
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.status}`;
        taskDiv.dataset.taskId = task.id;
        
        if (this.currentTask && this.currentTask.id === task.id) {
            taskDiv.classList.add('active');
        }
        
        taskDiv.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.name}</h4>
                <div class="task-actions">
                    <button class="btn btn--sm edit-task-btn" onclick="app.editTask(${task.id})">✏️</button>
                    <button class="btn btn--sm btn--primary" onclick="app.selectTask(${task.id})">${task.status === 'completed' ? '✅' : '▶️'}</button>
                </div>
            </div>
            <div class="task-meta">
                <div class="task-details">
                    <span class="task-subject">${task.subject}</span>
                    <span class="task-duration">${task.duration}min</span>
                    <span class="difficulty-badge ${task.difficulty.toLowerCase()}">${task.difficulty}</span>
                </div>
                <div class="task-status">
                    <div class="status-dot ${task.status}"></div>
                    <span>${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                </div>
            </div>
        `;
        
        return taskDiv;
    }
    
    selectTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.status === 'completed') return;
        
        this.currentTask = task;
        document.getElementById('selectedTaskName').textContent = task.name;
        document.getElementById('durationModal').classList.remove('hidden');
        
        // Update current task display
        document.getElementById('currentTaskName').textContent = task.name;
        document.getElementById('currentTaskSubject').textContent = `${task.subject} • ${task.difficulty} • ${task.duration}min recommended`;
        document.getElementById('psychologyTip').textContent = task.tip || "Stay focused and maintain your flow!";
        
        this.renderTasks();
    }
    
    startSession() {
        if (!this.currentTask) return;
        
        this.timeLeft = this.selectedDuration * 60; // Convert to seconds
        this.isActive = true;
        this.isPaused = false;
        this.currentTask.status = 'active';
        
        this.closeDurationModal();
        this.updateUI();
        this.startTimer();
        this.renderTasks();
        this.updateStatusIndicator('🎯 Deep in Flow');
    }
    
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (!this.isPaused && this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
                this.updateProgressRing();
                
                if (this.timeLeft === 0) {
                    this.sessionComplete();
                }
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
    }
    
    updateProgressRing() {
        const totalTime = this.selectedDuration * 60;
        const progress = (totalTime - this.timeLeft) / totalTime;
        const circumference = 2 * Math.PI * 86;
        const strokeDashoffset = circumference - (progress * circumference);
        
        const circle = document.getElementById('progressCircle');
        circle.style.strokeDashoffset = strokeDashoffset;
        circle.classList.add('active');
    }
    
    togglePause() {
        if (!this.isActive) return;
        
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        this.updateStatusIndicator(this.isPaused ? '⏸️ Paused' : '🎯 Deep in Flow');
    }
    
    skipSession() {
        if (!this.isActive) return;
        
        this.stopTimer();
        this.currentTask.status = 'pending';
        this.resetSession();
    }
    
    completeSession() {
        if (!this.isActive) return;
        
        this.sessionComplete();
    }
    
    sessionComplete() {
        this.stopTimer();
        this.currentTask.status = 'completed';
        
        // Show completion modal
        document.getElementById('completedTaskName').textContent = `Great work on "${this.currentTask.name}"!`;
        document.getElementById('sessionModal').classList.remove('hidden');
        
        // Add to sessions for analytics
        this.sessions.push({
            task: this.currentTask,
            duration: this.selectedDuration,
            completedAt: new Date(),
            focusRating: null
        });
        
        this.updateStatusIndicator('🌟 Session Complete');
        this.renderTasks();
    }
    
    saveSessionRating() {
        const rating = document.getElementById('focusSlider').value;
        const notes = document.getElementById('sessionNotes').value;
        
        // Update the last session
        if (this.sessions.length > 0) {
            this.sessions[this.sessions.length - 1].focusRating = parseInt(rating);
            this.sessions[this.sessions.length - 1].notes = notes;
        }
        
        this.updateAnalytics();
        this.closeSessionModal();
        this.resetSession();
    }
    
    closeSessionModal() {
        document.getElementById('sessionModal').classList.add('hidden');
        document.getElementById('sessionNotes').value = '';
        document.getElementById('focusSlider').value = 8;
        document.getElementById('sliderValue').textContent = '8';
        this.resetSession();
    }
    
    resetSession() {
        this.isActive = false;
        this.isPaused = false;
        this.currentTask = null;
        this.timeLeft = 0;
        this.selectedDuration = 25;
        
        this.updateUI();
        this.updateTimerDisplay();
        this.resetProgressRing();
        this.updateStatusIndicator('🌱 Ready to Flow');
        
        // Reset display
        document.getElementById('currentTaskName').textContent = 'Select a task to begin your focused study session';
        document.getElementById('currentTaskSubject').textContent = 'Choose from your personalized task list below';
        document.getElementById('psychologyTip').textContent = this.psychologyTips[this.currentTipIndex];
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    resetProgressRing() {
        const circle = document.getElementById('progressCircle');
        circle.style.strokeDashoffset = 540;
        circle.classList.remove('active');
    }
    
    updateUI() {
        const pauseBtn = document.getElementById('pauseBtn');
        const skipBtn = document.getElementById('skipBtn');
        const completeBtn = document.getElementById('completeBtn');
        
        pauseBtn.disabled = !this.isActive;
        skipBtn.disabled = !this.isActive;
        completeBtn.disabled = !this.isActive;
        
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        // Update timer display
        if (!this.isActive) {
            document.getElementById('timerDisplay').textContent = '25:00';
        }
        
        // Update session counter
        const completedCount = this.tasks.filter(t => t.status === 'completed').length;
        document.getElementById('sessionCounter').textContent = `${completedCount}/${this.tasks.length} Sessions`;
    }
    
    updateStatusIndicator(status) {
        document.getElementById('statusIndicator').textContent = status;
    }
    
    startTipRotation() {
        setInterval(() => {
            if (!this.isActive) {
                this.currentTipIndex = (this.currentTipIndex + 1) % this.psychologyTips.length;
                document.getElementById('psychologyTip').textContent = this.psychologyTips[this.currentTipIndex];
            }
        }, 10000); // Change tip every 10 seconds
    }
    
    // Task Management
    openTaskModal(taskId = null) {
        const modal = document.getElementById('taskEditModal');
        const isEditing = taskId !== null;
        
        document.getElementById('editModalTitle').textContent = isEditing ? 'Edit Task' : 'Add New Task';
        
        if (isEditing) {
            const task = this.tasks.find(t => t.id === taskId);
            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editTaskSubject').value = task.subject;
            document.getElementById('editTaskDifficulty').value = task.difficulty;
            document.getElementById('editTaskDuration').value = task.duration;
            document.getElementById('editTaskTip').value = task.tip || '';
            document.getElementById('deleteTaskBtn').style.display = 'inline-flex';
        } else {
            document.getElementById('editTaskName').value = '';
            document.getElementById('editTaskSubject').value = 'Physics';
            document.getElementById('editTaskDifficulty').value = 'Medium';
            document.getElementById('editTaskDuration').value = '25';
            document.getElementById('editTaskTip').value = '';
            document.getElementById('deleteTaskBtn').style.display = 'none';
        }
        
        modal.classList.remove('hidden');
        modal.dataset.taskId = taskId || '';
    }
    
    editTask(taskId) {
        this.openTaskModal(taskId);
    }
    
    saveTask() {
        const modal = document.getElementById('taskEditModal');
        const taskId = modal.dataset.taskId;
        const isEditing = taskId !== '';
        
        const taskData = {
            name: document.getElementById('editTaskName').value.trim(),
            subject: document.getElementById('editTaskSubject').value,
            difficulty: document.getElementById('editTaskDifficulty').value,
            duration: parseInt(document.getElementById('editTaskDuration').value),
            tip: document.getElementById('editTaskTip').value.trim(),
            status: 'pending'
        };
        
        if (!taskData.name) {
            alert('Please enter a task name');
            return;
        }
        
        if (isEditing) {
            const task = this.tasks.find(t => t.id === parseInt(taskId));
            Object.assign(task, taskData);
        } else {
            const newTask = {
                id: Math.max(...this.tasks.map(t => t.id), 0) + 1,
                ...taskData
            };
            this.tasks.push(newTask);
        }
        
        this.renderTasks();
        this.closeEditModal();
    }
    
    deleteTask() {
        const modal = document.getElementById('taskEditModal');
        const taskId = parseInt(modal.dataset.taskId);
        
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            this.closeEditModal();
        }
    }
    
    closeEditModal() {
        document.getElementById('taskEditModal').classList.add('hidden');
    }
    
    resetTasks() {
        if (confirm('Reset all tasks to pending status?')) {
            this.tasks.forEach(task => {
                task.status = 'pending';
            });
            this.sessions = [];
            this.renderTasks();
            this.updateAnalytics();
        }
    }
    
    closeDurationModal() {
        document.getElementById('durationModal').classList.add('hidden');
        document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('selected'));
        document.getElementById('confirmDurationBtn').disabled = true;
        this.selectedDuration = 25;
    }
    
    // Analytics
    initializeAnalytics() {
        this.updateAnalytics();
        this.setupCharts();
    }
    
    updateAnalytics() {
        // Calculate metrics from current session
        const completed = this.sessions.length;
        const total = this.tasks.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const avgFocus = this.sessions.length > 0 
            ? Math.round(this.sessions.reduce((sum, s) => sum + (s.focusRating || 8), 0) / this.sessions.length)
            : '-';
            
        // Update UI
        document.getElementById('completionRate').textContent = `${completionRate}%`;
        document.getElementById('avgFocusScore').textContent = avgFocus;
        
        // Update progress bar
        const progressBar = document.getElementById('completionProgressBar');
        progressBar.style.width = `${completionRate}%`;
        
        // Update other metrics with dynamic values
        document.getElementById('studyStreak').textContent = Math.max(1, this.sessions.length);
        document.getElementById('peakWindow').textContent = this.getPeakWindow();
    }
    
    getPeakWindow() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    }
    
    toggleAnalytics() {
        const detailedSection = document.getElementById('analyticsDetailed');
        const toggleBtn = document.getElementById('analyticsToggle');
        
        if (detailedSection.classList.contains('hidden')) {
            detailedSection.classList.remove('hidden');
            toggleBtn.textContent = 'Hide Details';
        } else {
            detailedSection.classList.add('hidden');
            toggleBtn.textContent = 'Show Details';
        }
    }
    
    setupCharts() {
        // Subject performance chart
        const subjectCtx = document.getElementById('subjectChart').getContext('2d');
        const subjectData = {
            labels: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'IOQM'],
            datasets: [{
                data: [85, 78, 92, 88, 75],
                backgroundColor: [
                    'rgba(168, 185, 156, 0.8)',
                    'rgba(122, 138, 110, 0.8)',
                    'rgba(240, 244, 237, 0.8)',
                    'rgba(168, 185, 156, 0.6)',
                    'rgba(122, 138, 110, 0.6)'
                ],
                borderColor: 'rgba(122, 138, 110, 1)',
                borderWidth: 2
            }]
        };
        
        new Chart(subjectCtx, {
            type: 'doughnut',
            data: subjectData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'var(--theme-text)',
                            font: {
                                family: 'Quicksand'
                            }
                        }
                    }
                }
            }
        });
        
        // Focus trend chart
        const focusCtx = document.getElementById('focusChart').getContext('2d');
        const focusData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Focus Score',
                data: [7, 8, 6, 9, 8, 7, 8],
                borderColor: 'rgba(122, 138, 110, 1)',
                backgroundColor: 'rgba(122, 138, 110, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
        
        new Chart(focusCtx, {
            type: 'line',
            data: focusData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: 'var(--theme-text)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--theme-text)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--theme-text)',
                            font: {
                                family: 'Quicksand'
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FocusFlowApp();
});

// Background timer functionality - continues even when tab is not active
document.addEventListener('visibilitychange', () => {
    if (window.app && window.app.isActive && !document.hidden) {
        // Update display when returning to tab
        window.app.updateTimerDisplay();
        window.app.updateProgressRing();
    }
});