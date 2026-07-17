const sampleCourses = [
  {
    id: 1,
    title: 'UI/UX Foundations',
    category: 'Design',
    instructor: 'Maya Chen',
    duration: '6 weeks',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    description: 'Learn interface design, wireframing, and accessibility principles.',
    level: 'Beginner'
  },
  {
    id: 2,
    title: 'JavaScript Mastery',
    category: 'Development',
    instructor: 'Jordan Blake',
    duration: '8 weeks',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    description: 'Build dynamic web experiences with modern JavaScript techniques.',
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'Data Science Essentials',
    category: 'Data',
    instructor: 'Lina Patel',
    duration: '5 weeks',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    description: 'Explore analytics, visualization, and smart interpretation of data.',
    level: 'Beginner'
  },
  {
    id: 4,
    title: 'Leadership for Teams',
    category: 'Business',
    instructor: 'Sam Ortiz',
    duration: '4 weeks',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    description: 'Develop management habits that improve collaboration and performance.',
    level: 'Intermediate'
  }
];

const enrolledCourses = [
  { title: 'UI/UX Foundations', progress: 82, next: 'Design critique session' },
  { title: 'JavaScript Mastery', progress: 64, next: 'Async JavaScript quiz' }
];

const assignments = [
  { title: 'Wireframe Challenge', due: 'Tomorrow · 6:00 PM' },
  { title: 'JavaScript Quiz', due: 'Friday · 12:00 PM' }
];

const announcements = [
  { title: 'Live Q&A this evening', detail: 'Join the instructor for project feedback.' },
  { title: 'New learning resources', detail: 'Check out updated course templates and guides.' }
];

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function initTheme() {
  const saved = localStorage.getItem('edusphere-theme');
  if (saved === 'dark') document.body.classList.add('dark');
  document.querySelectorAll('#themeToggle').forEach((button) => {
    button.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('edusphere-theme', isDark ? 'dark' : 'light');
      button.textContent = isDark ? '☀️' : '🌙';
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
  });
}

function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

function renderFeaturedCourses() {
  const container = document.getElementById('featuredCourses');
  if (!container) return;
  container.innerHTML = sampleCourses.slice(0, 3).map(course => `
    <article class="course-card">
      <img src="${course.image}" alt="${course.title}" />
      <div class="card-body">
        <span class="card-tag">${course.category}</span>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span>⏱ ${course.duration}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.8rem;">
          <span class="price-pill">${course.level}</span>
          <button class="btn" data-course-id="${course.id}">Enroll</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('button[data-course-id]').forEach((button) => {
    button.addEventListener('click', () => {
      showToast('Enrollment request received.');
    });
  });
}

function renderCoursesPage() {
  const grid = document.getElementById('courseGrid');
  const filters = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('searchInput');
  if (!grid || !filters) return;

  const categories = ['All', ...new Set(sampleCourses.map(course => course.category))];
  filters.innerHTML = categories.map((category) => `<button class="filter-pill ${category === 'All' ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');

  let activeCategory = 'All';
  let searchValue = '';

  function render() {
    const filtered = sampleCourses.filter((course) => {
      const categoryMatch = activeCategory === 'All' || course.category === activeCategory;
      const searchMatch = `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(searchValue.toLowerCase());
      return categoryMatch && searchMatch;
    });

    grid.innerHTML = filtered.map((course) => `
      <article class="course-card">
        <img src="${course.image}" alt="${course.title}" />
        <div class="card-body">
          <span class="card-tag">${course.category}</span>
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <div class="course-meta">
            <span>👨‍🏫 ${course.instructor}</span>
            <span>⏱ ${course.duration}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:0.8rem;">
            <span class="price-pill">${course.level}</span>
            <button class="btn" data-course-id="${course.id}">Enroll</button>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('button[data-course-id]').forEach((button) => {
      button.addEventListener('click', () => showToast('You are now enrolled.'));
    });
  }

  filters.querySelectorAll('.filter-pill').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      filters.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.category === activeCategory));
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchValue = event.target.value;
      render();
    });
  }

  render();
}

function renderDashboard() {
  const enrolledCount = document.getElementById('enrolledCount');
  const completedLessons = document.getElementById('completedLessons');
  const upcomingCount = document.getElementById('upcomingCount');
  const enrolledContainer = document.getElementById('enrolledCourses');
  const assignmentsContainer = document.getElementById('assignmentsList');
  const announcementsContainer = document.getElementById('announcementsList');

  if (!enrolledCount || !completedLessons || !upcomingCount) return;

  enrolledCount.textContent = enrolledCourses.length;
  completedLessons.textContent = '18';
  upcomingCount.textContent = assignments.length;

  if (enrolledContainer) {
    enrolledContainer.innerHTML = enrolledCourses.map((course) => `
      <div class="list-item">
        <div>
          <strong>${course.title}</strong>
          <div class="small">Next: ${course.next}</div>
        </div>
        <div style="min-width:120px;">
          <div class="progress-row">
            <div class="progress-bar"><span style="width:${course.progress}%"></span></div>
          </div>
          <div class="small">${course.progress}% complete</div>
        </div>
      </div>
    `).join('');
  }

  if (assignmentsContainer) {
    assignmentsContainer.innerHTML = assignments.map((item) => `
      <div class="list-item">
        <div>
          <strong>${item.title}</strong>
          <div class="small">${item.due}</div>
        </div>
      </div>
    `).join('');
  }

  if (announcementsContainer) {
    announcementsContainer.innerHTML = announcements.map((item) => `
      <div class="list-item">
        <div>
          <strong>${item.title}</strong>
          <div class="small">${item.detail}</div>
        </div>
      </div>
    `).join('');
  }
}

function initAuth() {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.toggle('active', item === tab));
      if (tab.dataset.tab === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
      } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
      }
    });
  });

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      showToast('Welcome back! Redirecting to your dashboard.');
      setTimeout(() => window.location.href = 'dashboard.html', 700);
    });
  }

  if (signupButton) {
    signupButton.addEventListener('click', () => {
      showToast('Account created. Welcome to EduSphere!');
      setTimeout(() => window.location.href = 'dashboard.html', 700);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  renderFeaturedCourses();
  renderCoursesPage();
  renderDashboard();
  initAuth();
});
