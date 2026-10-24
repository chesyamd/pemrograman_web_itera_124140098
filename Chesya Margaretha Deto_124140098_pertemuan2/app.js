import {
  createSampleTasks,
  DashboardView,
  fetchWeatherData,
  STORAGE_KEYS,
  TaskItem,
  USER_NAME,
  WEEKLY_SCHEDULE,
} from './dashboard.js';

class DashboardApp {
  constructor() {
    this.tasks = [];
    this.schedule = this.loadWeeklySchedule();
    this.dueDateFilter = 'all';
    this.editingTaskId = null;
    this.pendingDeleteTaskId = null;
    this.view = new DashboardView(this);
  }

  initialize() {
    this.bindEvents();
    this.seedDataIfNeeded();
    this.render();
    this.loadWeather();
  }

  bindEvents() {
    const taskForm = document.getElementById('taskForm');
    const dueDateFilter = document.getElementById('dueDateFilter');
    const refreshWeatherBtn = document.getElementById('refreshWeatherBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteModal = document.getElementById('deleteModal');

    taskForm.addEventListener('submit', (event) => this.handleFormSubmit(event));
    dueDateFilter.addEventListener('change', () => {
      this.dueDateFilter = dueDateFilter.value;
      this.view.renderTasks();
    });
    refreshWeatherBtn.addEventListener('click', () => this.loadWeather());
    cancelEditBtn.addEventListener('click', () => this.resetForm());
    cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    confirmDeleteBtn.addEventListener('click', () => this.confirmDeleteTask());

    deleteModal.addEventListener('click', (event) => {
      if (event.target.dataset.closeModal === 'true') {
        this.closeDeleteModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !deleteModal.classList.contains('hidden')) {
        this.closeDeleteModal();
      }
    });

    document.addEventListener('click', (event) => {
      const toggleTarget = event.target.closest('[data-toggle-complete]');
      if (toggleTarget) {
        const taskId = toggleTarget.dataset.toggleComplete;
        this.toggleTaskStatus(taskId);
      }

      const editTarget = event.target.closest('[data-edit-task]');
      if (editTarget) {
        const taskId = editTarget.dataset.editTask;
        this.startEditTask(taskId);
      }

      const deleteTarget = event.target.closest('[data-delete-task]');
      if (deleteTarget) {
        const taskId = deleteTarget.dataset.deleteTask;
        this.deleteTask(taskId);
      }
    });
  }

  seedDataIfNeeded() {
    const hasSavedTasks = localStorage.getItem(STORAGE_KEYS.tasks) !== null;
    const savedTasks = this.loadTasks();
    if (!hasSavedTasks) {
      const sampleTasks = createSampleTasks((date) => this.formatDateInputValue(date));
      this.tasks = sampleTasks;
      this.saveTasks();
    } else {
      this.tasks = savedTasks;
    }
  }

  loadTasks() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEYS.tasks);
      if (!rawData) {
        return [];
      }

      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((item) => TaskItem.fromObject(item))
        .filter(Boolean);
    } catch (error) {
      console.warn('Gagal membaca localStorage tasks:', error);
      return [];
    }
  }

  saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(this.tasks));
  }

  loadWeeklySchedule() {
    try {
      const savedSchedule = localStorage.getItem(STORAGE_KEYS.schedule);
      if (!savedSchedule) {
        localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(WEEKLY_SCHEDULE));
        return structuredClone(WEEKLY_SCHEDULE);
      }

      const parsed = JSON.parse(savedSchedule);
      if (parsed && typeof parsed === 'object') {
        let migrated = false;
        const mondayAsprak = parsed.Senin?.find((course) => course.name === 'Asprak Basdat RC');
        const thursdayPraktikum = parsed.Kamis?.find((course) => course.name === 'Praktikum PAW');

        if (mondayAsprak && 'lecturer' in mondayAsprak) {
          delete mondayAsprak.lecturer;
          migrated = true;
        }

        if (thursdayPraktikum && thursdayPraktikum.instructorLabel !== 'Asprak') {
          thursdayPraktikum.instructorLabel = 'Asprak';
          migrated = true;
        }

        if (migrated) {
          localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(parsed));
        }

        return parsed;
      }
      return structuredClone(WEEKLY_SCHEDULE);
    } catch (error) {
      console.warn('Gagal membaca jadwal rutin:', error);
      return structuredClone(WEEKLY_SCHEDULE);
    }
  }

  formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTodayDateString() {
    return this.formatDateInputValue(new Date());
  }

  getTodayLabel(date = new Date()) {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(date);
  }

  getTaskStatus(task) {
    if (task.status === 'completed') {
      return 'completed';
    }

    if (task.date && this.isLate(task.date)) {
      return 'late';
    }

    return 'active';
  }

  sortTasks(tasks) {
    return [...tasks].sort((first, second) => {
      const firstNoDate = !first.date;
      const secondNoDate = !second.date;

      if (firstNoDate && secondNoDate) {
        return (first.time || '').localeCompare(second.time || '') || first.title.localeCompare(second.title);
      }

      if (firstNoDate !== secondNoDate) {
        return firstNoDate ? 1 : -1;
      }

      const firstSort = this.dateTimeSortValue(first.date, first.time);
      const secondSort = this.dateTimeSortValue(second.date, second.time);

      return firstSort - secondSort;
    });
  }

  dateTimeSortValue(dateString, timeString) {
    if (!dateString) {
      return Number.MAX_SAFE_INTEGER;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const [hours = 0, minutes = 0] = (timeString || '00:00').split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes).getTime();
  }

  parseDateValue(dateString) {
    if (!dateString) {
      return null;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  diffInCalendarDays(dateString, referenceDate = new Date()) {
    if (!dateString) {
      return null;
    }

    const targetDate = this.parseDateValue(dateString);
    const currentDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

    return Math.round((targetDate - currentDate) / 86400000);
  }

  isLate(dateString) {
    if (!dateString) {
      return false;
    }

    const diffDays = this.diffInCalendarDays(dateString);
    return diffDays < 0;
  }

  getLateTasks() {
    return this.sortTasks(this.tasks.filter((task) => task.date && task.status !== 'completed' && this.isLate(task.date)));
  }

  getTodayTasks() {
    const todayKey = this.getTodayDateString();
    return this.sortTasks(
      this.tasks.filter((task) => task.date === todayKey && task.status !== 'completed')
    );
  }

  getActiveTasks() {
    return this.sortTasks(this.tasks.filter((task) => task.status !== 'completed'));
  }

  getCompletedTasks() {
    return this.sortTasks(this.tasks.filter((task) => task.status === 'completed'));
  }

  getAllTasks() {
    const sortedTasks = this.sortTasks(this.tasks);
    if (this.dueDateFilter !== 'due-window') {
      return sortedTasks;
    }

    return sortedTasks.filter((task) => {
      if (!task.date) return false;
      const daysUntilDue = this.diffInCalendarDays(task.date);
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    });
  }

  getDueDateLabel(task) {
    if (!task.date || task.status === 'completed') return '';
    const daysUntilDue = this.diffInCalendarDays(task.date);
    if (daysUntilDue < 0) return 'Terlambat';
    if (daysUntilDue === 0) return 'Hari H';
    if (daysUntilDue <= 3) return `H-${daysUntilDue}`;
    return 'Jadwal';
  }

  render() {
    document.getElementById('greetingText').textContent = USER_NAME;
    document.getElementById('todayDateText').textContent = this.getTodayLabel();
    this.view.render();
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const titleInput = document.getElementById('taskTitle');
    const title = String(formData.get('taskTitle') || '').trim();
    const category = String(formData.get('taskCategory') || 'Kuliah');
    const date = String(formData.get('taskDate') || '');
    const time = String(formData.get('taskTime') || '');
    const notes = String(formData.get('taskNotes') || '');
    const statusValue = String(formData.get('taskStatus') || 'active');

    if (!title) {
      titleInput.focus();
      titleInput.setCustomValidity('Nama agenda wajib diisi.');
      titleInput.reportValidity();
      titleInput.setCustomValidity('');
      return;
    }

    if (this.editingTaskId) {
      const taskIndex = this.tasks.findIndex((task) => task.id === this.editingTaskId);
      if (taskIndex >= 0) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          title,
          category,
          date,
          time,
          notes,
          status: statusValue === 'completed' ? 'completed' : 'active',
        };
      }
    } else {
      const newTask = new TaskItem({ title, category, date, time, notes, status: statusValue });
      this.tasks.push(newTask);
    }

    this.saveTasks();
    this.resetForm();
    this.render();
  }

  startEditTask(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    this.editingTaskId = taskId;
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskDate').value = task.date || '';
    document.getElementById('taskTime').value = task.time || '';
    document.getElementById('taskNotes').value = task.notes || '';
    document.getElementById('taskStatus').value = task.status === 'completed' ? 'completed' : 'active';
    document.getElementById('submitTaskBtn').textContent = 'Simpan Perubahan';
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    const form = document.getElementById('taskForm');
    form.reset();
    this.editingTaskId = null;
    document.getElementById('taskId').value = '';
    document.getElementById('submitTaskBtn').textContent = 'Simpan Agenda';
    document.getElementById('cancelEditBtn').classList.add('hidden');
  }

  deleteTask(taskId) {
    const targetTask = this.tasks.find((task) => task.id === taskId);
    if (!targetTask) {
      return;
    }

    this.pendingDeleteTaskId = taskId;
    const modal = document.getElementById('deleteModal');
    const deleteText = document.getElementById('deleteModalText');

    deleteText.textContent = `"${targetTask.title}" akan dihapus dari daftar agenda.`;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    this.pendingDeleteTaskId = null;
  }

  confirmDeleteTask() {
    if (!this.pendingDeleteTaskId) {
      return;
    }

    const taskId = this.pendingDeleteTaskId;
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();

    if (this.editingTaskId === taskId) {
      this.resetForm();
    }

    this.closeDeleteModal();
    this.render();
  }

  toggleTaskStatus(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    task.status = task.status === 'completed' ? 'active' : 'completed';
    this.saveTasks();
    this.render();
  }

  getCurrentDayName() {
    const dayName = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      timeZone: 'Asia/Jakarta',
    }).format(new Date());
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }

  timeToMinutes(value) {
    const startTime = (value || '00:00').split('–')[0];
    const [hour, minute] = startTime.replace('.', ':').split(':').map(Number);
    return hour * 60 + minute;
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async loadWeather() {
    const weatherState = document.getElementById('weatherState');
    weatherState.classList.add('loading');
    weatherState.innerHTML = '<p>Memuat data cuaca...</p>';

    try {
      this.view.renderWeather(await fetchWeatherData());
    } catch (error) {
      console.error('Gagal memuat cuaca:', error);
      this.view.renderWeatherError();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new DashboardApp();
  app.initialize();
  window.dashboardApp = app;
});
