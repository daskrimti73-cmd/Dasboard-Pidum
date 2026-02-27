/* ============================================
   AUTH MODULE - Admin Authentication
   Kejaksaan RI CMS
   ============================================ */

// Admin credentials (in production, use server-side auth)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const AUTH_KEY = 'cms_auth_session';
const TAHUN_KEY = 'cms_tahun_list';
const SATKER1_KEY = 'cms_satker1_list';
const SATKER2_KEY = 'cms_satker2_list';

// ---- Year Management ----
function getTahunList() {
    try {
        const saved = localStorage.getItem(TAHUN_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list.sort((a, b) => b - a);
        }
    } catch (e) { }
    // Default: current year
    const defaultList = [new Date().getFullYear()];
    localStorage.setItem(TAHUN_KEY, JSON.stringify(defaultList));
    return defaultList;
}

function saveTahunList(list) {
    const sorted = [...new Set(list)].sort((a, b) => b - a);
    localStorage.setItem(TAHUN_KEY, JSON.stringify(sorted));
    return sorted;
}

function addTahun(year) {
    const y = parseInt(year);
    if (isNaN(y) || y < 2000 || y > 2100) return false;
    const list = getTahunList();
    if (list.includes(y)) return false;
    list.push(y);
    saveTahunList(list);
    return true;
}

function deleteTahun(year) {
    const y = parseInt(year);
    let list = getTahunList();
    if (list.length <= 1) return false; // Keep at least one year
    list = list.filter(item => item !== y);
    saveTahunList(list);
    return true;
}

function populateTahunDropdown() {
    const select = document.getElementById('filterTahun');
    if (!select) return;
    const currentVal = select.value;
    const years = getTahunList();
    select.innerHTML = '';
    years.forEach((y, i) => {
        const opt = document.createElement('option');
        opt.value = y.toString();
        opt.textContent = y.toString();
        if (i === 0) opt.selected = true;
        select.appendChild(opt);
    });
    // Restore previous selection if still available
    if (currentVal && years.includes(parseInt(currentVal))) {
        select.value = currentVal;
    }
}

// ---- Satuan Kerja Management ----
function getSatker1List() {
    try {
        const saved = localStorage.getItem(SATKER1_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch (e) { }
    // Default: Kejati Kepri only
    const defaultList = [
        { value: 'kejati-kepri', label: 'Kejaksaan Tinggi Kepulauan Riau' }
    ];
    localStorage.setItem(SATKER1_KEY, JSON.stringify(defaultList));
    return defaultList;
}

function getSatker2List() {
    try {
        const saved = localStorage.getItem(SATKER2_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch (e) { }
    // Default: Kejati Kepri only
    const defaultList = [
        { value: 'kejati-kepri', label: 'Kejaksaan Tinggi Kepulauan Riau' }
    ];
    localStorage.setItem(SATKER2_KEY, JSON.stringify(defaultList));
    return defaultList;
}

function saveSatker1List(list) {
    localStorage.setItem(SATKER1_KEY, JSON.stringify(list));
    return list;
}

function saveSatker2List(list) {
    localStorage.setItem(SATKER2_KEY, JSON.stringify(list));
    return list;
}

function addSatker1(label) {
    const trimmed = label.trim();
    if (!trimmed) return false;

    const list = getSatker1List();

    // Check if already exists
    if (list.some(s => s.label.toLowerCase() === trimmed.toLowerCase())) {
        return false;
    }

    // Generate value from label (lowercase, replace spaces with dash)
    const value = trimmed.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    list.push({ value, label: trimmed });
    saveSatker1List(list);
    return true;
}

function addSatker2(label) {
    const trimmed = label.trim();
    if (!trimmed) return false;

    const list = getSatker2List();

    // Check if already exists
    if (list.some(s => s.label.toLowerCase() === trimmed.toLowerCase())) {
        return false;
    }

    // Generate value from label (lowercase, replace spaces with dash)
    const value = trimmed.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    list.push({ value, label: trimmed });
    saveSatker2List(list);
    return true;
}

function deleteSatker1(value) {
    let list = getSatker1List();
    // Keep at least Kejati Kepri
    if (list.length <= 1) return false;
    if (value === 'kejati-kepri') return false; // Cannot delete Kejati Kepri

    list = list.filter(item => item.value !== value);
    saveSatker1List(list);
    return true;
}

function deleteSatker2(value) {
    let list = getSatker2List();
    // Keep at least Kejati Kepri
    if (list.length <= 1) return false;
    if (value === 'kejati-kepri') return false; // Cannot delete Kejati Kepri

    list = list.filter(item => item.value !== value);
    saveSatker2List(list);
    return true;
}

function populateSatkerDropdowns() {
    // Populate Satker 1
    const satkers1 = getSatker1List();
    const select1 = document.getElementById('filterSatker1');
    if (select1) {
        const currentVal1 = select1.value;
        select1.innerHTML = '<option value="">SATUAN KERJA (SATKER)</option>';
        satkers1.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.value;
            opt.textContent = s.label;
            select1.appendChild(opt);
        });
        if (currentVal1) select1.value = currentVal1;
    }

    // Populate Satker 2
    const satkers2 = getSatker2List();
    const select2 = document.getElementById('filterSatker2');
    if (select2) {
        const currentVal2 = select2.value;
        select2.innerHTML = '<option value="">SATUAN KERJA (SATKER) 2</option>';
        satkers2.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.value;
            opt.textContent = s.label;
            select2.appendChild(opt);
        });
        if (currentVal2) select2.value = currentVal2;
    }
}

// ---- Check if current page is in view mode (public) ----
function isViewMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'view') return true;
    // Auto-detect if loaded inside an iframe (e.g., WordPress embed)
    try {
        if (window.self !== window.top) return true;
    } catch (e) {
        // Cross-origin iframe — definitely embedded
        return true;
    }
    return false;
}

// ---- Check if user is logged in (Auto-grant — login removed from flow) ----
function isLoggedIn() {
    // View mode bypasses auth (public read-only)
    if (isViewMode()) return true;

    const session = localStorage.getItem(AUTH_KEY);
    if (!session) {
        // Auto-grant: create session automatically
        const autoSession = {
            username: 'admin',
            loginTime: new Date().getTime(),
            loggedIn: true
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(autoSession));
        return true;
    }

    try {
        const data = JSON.parse(session);
        // Check if session is still valid (24 hours) — auto-renew
        const now = new Date().getTime();
        if (now - data.loginTime > 24 * 60 * 60 * 1000) {
            // Auto-renew session
            const renewed = {
                username: data.username || 'admin',
                loginTime: now,
                loggedIn: true
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(renewed));
        }
        return true;
    } catch (e) {
        return true;
    }
}

// ---- Require auth — always grant (login removed from flow) ----
function requireAuth() {
    if (!isLoggedIn()) {
        // isLoggedIn() already auto-grants, so this is a fallback
        const autoSession = {
            username: 'admin',
            loginTime: new Date().getTime(),
            loggedIn: true
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(autoSession));
    }
    return true;
}

// ---- Apply view mode: hide edit controls, make everything read-only ----
function applyViewMode() {
    if (!isViewMode()) return;

    document.body.classList.add('view-mode');

    // Hide sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';

    // Adjust main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.style.marginLeft = '0';

    // Hide logout button
    document.querySelectorAll('.btn-logout').forEach(el => el.style.display = 'none');

    // Hide toggle sidebar button
    document.querySelectorAll('.toggle-btn').forEach(el => el.style.display = 'none');

    // Hide header badge (redundant in WordPress iframe)
    document.querySelectorAll('.header-badge').forEach(el => el.style.display = 'none');

    // Hide entire top-header in view mode (not needed in iframe)
    document.querySelectorAll('.top-header').forEach(el => el.style.display = 'none');

    // Hide save section
    document.querySelectorAll('.save-section').forEach(el => el.style.display = 'none');

    // Hide filter actions reset button (keep Terapkan)
    document.querySelectorAll('.filter-actions .btn-secondary').forEach(el => el.style.display = 'none');

    // Make all inputs read-only
    document.querySelectorAll('input[type="number"], input[type="text"], textarea').forEach(input => {
        input.readOnly = true;
        input.style.cursor = 'default';
        input.style.opacity = '0.9';
        input.tabIndex = -1;
    });

    // Hide monthly detail input sections (input per bulan/direktorat)
    document.querySelectorAll('.monthly-detail').forEach(el => el.style.display = 'none');

    // Hide add/delete row buttons in tables
    document.querySelectorAll('.btn-add-row, .btn-delete-row, .btn-delete, .btn-save, .btn-add, .btn-danger, [onclick*="addRow"], [onclick*="deleteRow"], [onclick*="saveAll"], [onclick*="resetAll"], [onclick*="openAddModal"], [onclick*="saveRecord"]').forEach(el => {
        el.style.display = 'none';
    });

    // Hide modals
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.style.display = 'none';
    });

    // Hide table action columns (edit/delete buttons in table rows) via CSS
    const viewStyle = document.createElement('style');
    viewStyle.textContent = `
        body.view-mode .btn-icon.btn-delete,
        body.view-mode .btn-icon.btn-edit,
        body.view-mode .btn-add,
        body.view-mode .btn-danger,
        body.view-mode .modal-overlay,
        body.view-mode .table-actions,
        body.view-mode th:last-child,
        body.view-mode td:last-child {
            /* Only hide action columns if they contain buttons */
        }
        body.view-mode .btn-icon { display: none !important; }
        body.view-mode .btn-add { display: none !important; }
        body.view-mode .modal-overlay { display: none !important; }
    `;
    document.head.appendChild(viewStyle);

    // Change breadcrumb "Kembali ke Dashboard Pidum" to go back to display.html
    document.querySelectorAll('.breadcrumb a').forEach(link => {
        if (link.href.includes('pidum.html') || link.href.includes('index.html')) {
            link.href = 'display.html';
            link.innerHTML = '<i class="fas fa-arrow-left"></i> Kembali';
        }
    });

    // Make card detail links also pass view mode + current filter params
    const filterParams = getCurrentFilterParams();
    document.querySelectorAll('a.card-detail-link, a[href*="detail"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('mode=view') && !href.startsWith('#') && !href.startsWith('javascript')) {
            const separator = href.includes('?') ? '&' : '?';
            link.href = href + separator + 'mode=view&' + filterParams;
        }
    });

    // Replace header greeting
    const greeting = document.getElementById('greeting');
    if (greeting) greeting.textContent = '';
}

// ---- Get current filter params as URL string ----
function getCurrentFilterParams() {
    const wilayah = document.getElementById('filterWilayah')?.value || '';
    const satker1 = document.getElementById('filterSatker1')?.value || '';
    const satker2 = document.getElementById('filterSatker2')?.value || '';
    const tahun = document.getElementById('filterTahun')?.value || '';
    const bulan1 = document.getElementById('filterBulan1')?.value || '';
    const bulan2 = document.getElementById('filterBulan2')?.value || '';
    return new URLSearchParams({ wilayah, satker1, satker2, tahun, bulan1, bulan2 }).toString();
}

// ---- Get filter params from URL (for view mode) ----
function getViewFilterParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        wilayah: params.get('wilayah') || '',
        satker1: params.get('satker1') || '',
        satker2: params.get('satker2') || '',
        tahun: params.get('tahun') || '',
        bulan1: params.get('bulan1') || '',
        bulan2: params.get('bulan2') || ''
    };
}

// ---- Restore filters from URL params (view mode) ----
function restoreViewFilters() {
    // Populate Tahun dropdown first (dynamic from localStorage)
    populateTahunDropdown();

    if (!isViewMode()) return;
    const filters = getViewFilterParams();
    if (filters.wilayah) setSelectValueSafe('filterWilayah', filters.wilayah);
    if (filters.satker1) setSelectValueSafe('filterSatker1', filters.satker1);
    if (filters.satker2) setSelectValueSafe('filterSatker2', filters.satker2);
    if (filters.tahun) setSelectValueSafe('filterTahun', filters.tahun);
    if (filters.bulan1) setSelectValueSafe('filterBulan1', filters.bulan1);
    if (filters.bulan2) setSelectValueSafe('filterBulan2', filters.bulan2);
}

function setSelectValueSafe(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
}

// ---- Handle login form submission ----
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const btnLogin = document.getElementById('btnLogin');

    // Clear previous error
    errorMsg.textContent = '';

    // Validate
    if (!username || !password) {
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username dan password harus diisi';
        return false;
    }

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Save session
        const session = {
            username: username,
            loginTime: new Date().getTime(),
            loggedIn: true
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));

        // Show loading
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        btnLogin.disabled = true;

        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    } else {
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username atau password salah!';

        // Shake animation
        const card = document.querySelector('.login-card');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'shake 0.5s ease';

        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }

    return false;
}

// ---- Toggle password visibility ----
function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ---- Kembali ke Portal ----
function logout() {
    window.location.href = 'https://daskrimti73-cmd.github.io/admin-portal/';
}

// ---- Get logged in username ----
function getLoggedInUser() {
    try {
        const session = JSON.parse(localStorage.getItem(AUTH_KEY));
        return session?.username || 'Admin';
    } catch (e) {
        return 'Admin';
    }
}

// ---- If on login page and already logged in, redirect to dashboard ----
function checkLoginPage() {
    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Add shake animation style
(function () {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 50%, 90% { transform: translateX(-6px); }
            30%, 70% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(style);
})();
