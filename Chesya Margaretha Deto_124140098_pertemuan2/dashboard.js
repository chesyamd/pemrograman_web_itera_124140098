export const STORAGE_KEYS = {
  tasks: 'paw-personal-tasks-v1',
  schedule: 'paw-weekly-schedule-v1',
};

export const USER_NAME = 'Chesya Margaretha Deto';

const course = (name, time, room, lecturer, sks, instructorLabel) => ({
  name,
  time,
  room,
  ...(lecturer ? { lecturer } : {}),
  ...(sks ? { sks } : {}),
  ...(instructorLabel ? { instructorLabel } : {}),
});

export const WEEKLY_SCHEDULE = {
  Senin: [course('Asprak Basdat RC', '15.30–17.00', 'Labtek 1')],
  Selasa: [
    course('Kapita Selekta RA', '09.20–12.00', 'GK2 206', 'Ilham Firman Ashari, S.Kom., M.T.', 3),
    course('Inteligensi Buatan RB', '13.00–15.40', 'GK2 107', 'Rahman Indra Kesuma, S.Kom., M.Cs.', 3),
  ],
  Rabu: [
    course('Praktikum Jarkom RB', '07.30–09.30', 'Labtek 3 Lab IOT', 'Garis dan Vebri'),
    course('Pengolahan Citra Digital/RB', '13.00–15.40', 'GK2 123', 'Mohamad Idris, S.Si., M.Sc.', 3),
  ],
  Kamis: [
    course('Metodologi Penelitian RA', '09.20–12.00', 'GK2 221', 'Martin Clinton Tosima Manullang, S.T., M.T., Ph.D.', 3),
    course('Pengembangan Aplikasi Web RB', '13.00–15.40', 'GK2 409', 'M Habib Algifari, S.Kom., M.T.I.', 3),
    course('Praktikum PAW', '18.30–selesai', 'Online', 'Bang Daffa Hakim', undefined, 'Asprak'),
  ],
  Jumat: [
    course('Sistem Informasi RA', '07.30–09.15', 'GK2 221', 'Andre Febrianto, S.Kom., M.Eng.', 2),
    course('Manajemen Proyek Teknologi Informasi RA', '09.20–12.00', 'GK2 308', 'Amirul Iqbal, S.Kom., M.Eng.', 3),
    course('Jaringan Komputer RB', '13.00–15.40', 'GK2 302', 'Hartanto Tantriawan, S.Kom., M.Kom.', 3),
  ],
};

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const WEATHER_CODES = {
  0: 'Cerah', 1: 'Sebagian berawan', 2: 'Berawan', 3: 'Mendung', 45: 'Berkabut',
  51: 'Gerimis ringan', 53: 'Gerimis sedang', 55: 'Gerimis lebat', 56: 'Gerimis dingin',
  61: 'Hujan ringan', 63: 'Hujan sedang', 65: 'Hujan lebat', 66: 'Hujan dingin',
  95: 'Badai', 99: 'Badai parah',
};

export class TaskItem {
  constructor({ id, title, category = 'Kuliah', date = '', time = '', notes = '', status = 'active', createdAt }) {
    this.id = id || `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    this.title = String(title || '').trim() || 'Agenda baru';
    this.category = category || 'Kuliah';
    this.date = date || '';
    this.time = time || '';
    this.notes = String(notes || '').trim();
    this.status = status === 'completed' ? 'completed' : 'active';
    this.createdAt = createdAt || new Date().toISOString();
  }

  static fromObject(data) {
    if (!data || typeof data !== 'object') return null;
    return new TaskItem({ ...data });
  }
}

export function createSampleTasks(formatDate) {
  const dateAfter = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };

  return [
    new TaskItem({ title: 'Laporan praktikum', category: 'Kuliah', date: dateAfter(3), time: '16:00', notes: 'Susun hasil eksperimen dan revisi data.' }),
    new TaskItem({ title: 'Rapat organisasi', category: 'Organisasi', date: dateAfter(1), time: '18:30', notes: 'Diskusikan progres acara kampus.' }),
    new TaskItem({ title: 'Belanja kebutuhan rumah', category: 'Pribadi', notes: 'Beli sabun cuci dan perlengkapan mandi.' }),
    new TaskItem({ title: 'Kelas pengganti Jarkom', category: 'Kuliah', date: dateAfter(-1), time: '08:00', notes: 'Kelas pengganti di Labtek 3.' }),
    new TaskItem({ title: 'Review proposal volunteer', category: 'Lainnya', date: dateAfter(-2), time: '14:00', notes: 'Hubungi mitra volunteer dan cek checklist.', status: 'completed' }),
  ];
}

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-5.4292&longitude=105.2610&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FJakarta';

export async function fetchWeatherData() {
  const response = await fetch(WEATHER_URL);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return response.json();
}

export class DashboardView {
  constructor(app) {
    this.app = app;
  }

  render() {
    this.renderSummary();
    this.renderTodayAgenda();
    this.renderWeeklySchedule();
    this.renderTasks();
  }

  renderWeather(data) {
    const weatherState = document.getElementById('weatherState');
    const current = data.current || {};
    const weatherText = WEATHER_CODES[current.weather_code] || 'Cuaca tidak diketahui';
    const support = [
      ['Kelembapan', `${current.relative_humidity_2m ?? '--'}%`],
      ['Kecepatan angin', `${current.wind_speed_10m ?? '--'} km/jam`],
      ['Terasa', `${current.apparent_temperature ?? '--'}°C`],
    ];

    weatherState.classList.remove('loading');
    weatherState.innerHTML = `
      <div class="weather-main">
        <div class="weather-temp">${current.temperature_2m ?? '--'}°C</div>
        <div><h3>${weatherText}</h3><p>${this.app.getTodayLabel(current.time ? new Date(current.time) : new Date())}</p></div>
      </div>
      <div class="weather-meta">${support.map(([label, value]) => `
        <div class="meta-pill"><span>${label}</span><strong>${value}</strong></div>
      `).join('')}</div>
    `;
  }

  renderWeatherError() {
    const state = document.getElementById('weatherState');
    state.classList.remove('loading');
    state.innerHTML = '<div class="weather-main"><div class="weather-temp">--</div><div><h3>Cuaca tidak tersedia</h3><p>Data gagal dimuat. Coba beberapa saat lagi.</p></div></div>';
  }

  renderSummary() {
    const app = this.app;
    document.getElementById('activeSummary').textContent = String(app.getActiveTasks().length);
    document.getElementById('completedSummary').textContent = String(app.getCompletedTasks().length);
    document.getElementById('lateSummary').textContent = String(app.getLateTasks().length);
  }

  renderTodayAgenda() {
    const app = this.app;
    const entries = [
      ...(app.schedule[app.getCurrentDayName()] || []).map((data) => ({ isClass: true, data })),
      ...app.getTodayTasks().map((data) => ({ isClass: false, data })),
    ].sort((a, b) => app.timeToMinutes(a.data.time) - app.timeToMinutes(b.data.time));
    const list = document.getElementById('todayAgendaList');

    list.innerHTML = entries.length ? entries.map(({ isClass, data }) => {
      const title = isClass ? data.name : data.title;
      const detail = isClass
        ? `Jadwal rutin • ${data.time} • ${data.room}`
        : `${data.category} • ${data.time || 'Waktu tidak ditentukan'}`;
      const extra = isClass
        ? this.renderInstructorDetails(data, 'task-meta schedule-row')
        : `<div class="task-meta"><span>${app.escapeHtml(data.notes || 'Tidak ada catatan')}</span></div>`;
      return `<article class="task-card"><div class="task-main"><div class="task-text">
        <div class="task-title">${app.escapeHtml(title)}</div>
        <div class="task-subtitle">${app.escapeHtml(detail)}</div>
      </div><span class="badge neutral">${isClass ? 'Kelas' : 'Agenda'}</span></div>${extra}</article>`;
    }).join('') : '<div class="empty-state">Hari ini tidak ada kelas atau agenda yang dijadwalkan.</div>';
  }

  renderWeeklySchedule() {
    const app = this.app;
    document.getElementById('weeklySchedule').innerHTML = DAY_ORDER.map((day) => {
      const courses = app.schedule[day] || [];
      const isToday = day === app.getCurrentDayName();
      const markup = courses.length ? courses.map((course) => `
        <div class="schedule-item"><div class="schedule-item-header"><strong>${app.escapeHtml(course.name)}</strong></div>
          ${this.scheduleRow('Waktu', course.time)}
          ${this.scheduleRow('Ruangan', course.room || 'Ruangan tidak dicantumkan')}
          ${this.renderInstructorDetails(course, 'schedule-row')}
        </div>
      `).join('') : '<div class="schedule-item empty-item"><span>Libur</span></div>';
      return `<article class="class-card ${isToday ? 'is-today' : ''}">
        <div class="schedule-day-header"><h3>${day}</h3>${isToday ? '<span class="today-pill">Hari ini</span>' : ''}</div>
        <div class="class-meta">${markup}</div></article>`;
    }).join('');
  }

  renderTasks() {
    const tasks = this.app.getAllTasks();
    const list = document.getElementById('taskList');
    const emptyText = this.app.dueDateFilter === 'due-window'
      ? 'Tidak ada agenda dari H-3 sampai Hari H.'
      : 'Belum ada agenda.';
    list.innerHTML = tasks.map((task) => this.renderTaskCard(task)).join('')
      || `<div class="empty-state">${emptyText}</div>`;
  }

  renderInstructorDetails(course, className) {
    if (!course.lecturer) return '';
    return `<div class="${className}"><span class="schedule-label">${this.app.escapeHtml(course.instructorLabel || 'Dosen')}</span><span>${this.app.escapeHtml(course.lecturer)}</span></div>`;
  }

  scheduleRow(label, value) {
    return `<div class="schedule-row"><span class="schedule-label">${label}</span><span>${this.app.escapeHtml(value)}</span></div>`;
  }

  renderTaskCard(task) {
    const app = this.app;
    const status = app.getTaskStatus(task);
    const date = task.date ? this.formatDate(task.date) : 'Tidak ada tanggal';
    const dueLabel = app.getDueDateLabel(task);
    const badge = dueLabel
      ? `<span class="badge ${status === 'late' ? 'warning' : 'neutral'}">${dueLabel}</span>`
      : '';
    const notes = app.escapeHtml(task.notes || 'Catatan kosong');
    return `<article class="task-card"><div class="task-top"><div class="task-main">
      <input class="task-check" type="checkbox" data-toggle-complete="${task.id}" ${task.status === 'completed' ? 'checked' : ''} aria-label="${task.status === 'completed' ? 'Aktifkan kembali' : 'Tandai selesai'} ${app.escapeHtml(task.title)}" />
      <div class="task-text"><div class="task-title">${app.escapeHtml(task.title)}</div>
        <div class="task-subtitle">${app.escapeHtml(task.category)} • ${app.escapeHtml(task.time || 'Waktu tidak diisi')} • ${app.escapeHtml(date)}</div>
      </div></div>${badge}</div><div class="task-meta"><span>${notes}</span></div>
      <div class="card-actions">${task.status === 'completed' ? '<span class="badge success">Selesai</span>' : '<span class="badge neutral">Aktif</span>'}
        <button class="icon-btn" type="button" data-edit-task="${task.id}">Edit</button>
        <button class="icon-btn" type="button" data-delete-task="${task.id}">Hapus</button>
      </div></article>`;
  }

  formatDate(value) {
    const date = this.app.parseDateValue(value);
    return date ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(date) : 'Tidak ada tanggal';
  }
}
