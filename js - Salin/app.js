/* ============================================
   DASHBOARD KEJAKSAAN RI - JAVASCRIPT
   Core logic: sidebar, filters, data persistence
   ============================================ */

// ---- Sidebar Toggle ----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');

    // Mobile handling
    if (window.innerWidth <= 480) {
        sidebar.classList.toggle('mobile-open');
    }
}

// ---- Navigate to page (only if not clicking input) ----
function navigateToPage(url, event) {
    // Jangan navigasi jika yang diklik adalah input field
    if (event.target.tagName === 'INPUT') {
        return;
    }
    window.location.href = url;
}

// ---- Greeting based on time ----
function setGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;

    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 11) greeting = 'Selamat Pagi';
    else if (hour >= 11 && hour < 15) greeting = 'Selamat Siang';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
    else greeting = 'Selamat Malam';

    el.textContent = `${greeting}, Kejaksaan Tinggi Kepulauan Riau`;
}

// ---- Update date display ----
function setUpdateDate() {
    const el = document.getElementById('updateDate');
    if (!el) return;

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    el.textContent = `${dayName}, ${date} ${month} ${year} ${time}`;
}

// ---- Storage Key Builder ----
function getStorageKey() {
    const wilayah = document.getElementById('filterWilayah')?.value || '';
    const satker1 = document.getElementById('filterSatker1')?.value || '';
    const satker2 = document.getElementById('filterSatker2')?.value || '';
    const tahun = document.getElementById('filterTahun')?.value || '';
    const bulan1 = document.getElementById('filterBulan1')?.value || '';
    const bulan2 = document.getElementById('filterBulan2')?.value || '';

    return `pidum_${wilayah}_${satker1}_${satker2}_${tahun}_${bulan1}_${bulan2}`;
}

// ---- Data Fields ----
const dataFields = [
    'val-pra-penuntutan',
    'val-penuntutan',
    'val-upaya-hukum',
    'val-eksekusi',
    'val-wna',
    'val-hukuman-mati',
    'val-korban',
    'val-tppu'
];

// ---- Save Data to localStorage ----
function saveData() {
    const key = getStorageKey();
    const data = {};

    dataFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            data[field] = input.value;
        }
    });

    // Save filter state too
    data._filters = {
        wilayah: document.getElementById('filterWilayah')?.value || '',
        satker1: document.getElementById('filterSatker1')?.value || '',
        satker2: document.getElementById('filterSatker2')?.value || '',
        tahun: document.getElementById('filterTahun')?.value || '',
        bulan1: document.getElementById('filterBulan1')?.value || '',
        bulan2: document.getElementById('filterBulan2')?.value || ''
    };

    data._savedAt = new Date().toISOString();

    try {
        localStorage.setItem(key, JSON.stringify(data));

        // Also save last used key for quick reload
        localStorage.setItem('pidum_last_key', key);
        localStorage.setItem('pidum_last_filters', JSON.stringify(data._filters));

        showToast('Data berhasil disimpan!', 'success');
        document.getElementById('btnSave').innerHTML = '<i class="fas fa-check"></i> Tersimpan';
        setTimeout(() => {
            const btn = document.getElementById('btnSave');
            if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Simpan Data';
        }, 2000);
    } catch (e) {
        showToast('Gagal menyimpan data!', 'error');
        console.error('Save error:', e);
    }
}

// ---- Load Saved Data ----
// restoreFilters = true only on initial page load, false when user clicks Terapkan
function loadSavedData(restoreFilters) {
    // Only restore filters on initial load, not when user manually changes them
    if (restoreFilters !== false) {
        const lastFilters = localStorage.getItem('pidum_last_filters');
        if (lastFilters) {
            try {
                const filters = JSON.parse(lastFilters);
                setSelectValue('filterWilayah', filters.wilayah);
                setSelectValue('filterSatker1', filters.satker1);
                setSelectValue('filterSatker2', filters.satker2);
                setSelectValue('filterTahun', filters.tahun);
                setSelectValue('filterBulan1', filters.bulan1);
                setSelectValue('filterBulan2', filters.bulan2);
            } catch (e) {
                console.error('Filter restore error:', e);
            }
        }
    }

    // Then load data for current filter combination
    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    if (saved) {
        try {
            const data = JSON.parse(saved);
            dataFields.forEach(field => {
                const input = document.getElementById(field);
                if (input && data[field] !== undefined) {
                    input.value = data[field];
                }
            });
        } catch (e) {
            console.error('Load error:', e);
        }
    } else {
        // Clear fields if no data for this filter combo
        clearDataFields();
    }

    // Reset unsaved flag after loading
    hasUnsaved = false;
    const btn = document.getElementById('btnSave');
    if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Simpan Data';
}

// ---- Helper: Set select value ----
function setSelectValue(id, value) {
    const select = document.getElementById(id);
    if (select && value !== undefined) {
        select.value = value;
    }
}

// ---- Clear data input fields ----
function clearDataFields() {
    dataFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) input.value = '';
    });
}

// ---- Reset data (clear inputs and remove from localStorage) ----
function resetData() {
    if (confirm('Apakah Anda yakin ingin mengosongkan semua data?')) {
        clearDataFields();

        // Remove data from localStorage so display page also reflects deletion
        const key = getStorageKey();
        localStorage.removeItem(key);
        hasUnsaved = false;

        showToast('Data telah dikosongkan', 'success');
    }
}

// ---- Apply Filters ----
function applyFilters() {
    // Load data for current filter values without overriding filter selection
    loadSavedData(false);
    showToast('Filter diterapkan', 'success');

    // Update the date display
    setUpdateDate();
}

// ---- Reset Filters ----
function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    // Reset tahun to first available year
    const years = getTahunList();
    document.getElementById('filterTahun').value = years[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = '02';

    clearDataFields();
    showToast('Filter telah direset', 'success');
}

// ---- Mark Unsaved Changes ----
let hasUnsaved = false;
function markUnsaved() {
    hasUnsaved = true;
    const btn = document.getElementById('btnSave');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-save"></i> Simpan Data *';
        btn.style.animation = 'none';
        btn.offsetHeight; // trigger reflow
        btn.style.animation = '';
    }
}

// ---- Toast Notification ----
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    toast.innerHTML = `<i class="${icon}"></i> ${message}`;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ---- Warn before leaving with unsaved changes ----
window.addEventListener('beforeunload', function (e) {
    if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = 'Ada data yang belum disimpan. Yakin ingin meninggalkan halaman?';
    }
});

// ---- Update date every second ----
setInterval(() => {
    setUpdateDate();
}, 1000);

// ---- Keyboard shortcut: Ctrl+S to save ----
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (typeof saveData === 'function') {
            saveData();
        }
    }
});
