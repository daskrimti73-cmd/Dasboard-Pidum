/* ============================================
   DASHBOARD KEJAKSAAN RI - JAVASCRIPT
   Core logic: sidebar, filters, data persistence
   ============================================ */

// ---- Supabase Config ----
const PIDUM_SUPABASE_URL = 'https://imiwlmuvelhihyfuumkw.supabase.co';
const PIDUM_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXdsbXV2ZWxoaWh5ZnV1bWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzgxMDksImV4cCI6MjA4NjQ1NDEwOX0.OJVW8to47hCJ83fZSHeuPoBdOh7M15CQOYv0Ds56ncs';
const PIDUM_TABLE = 'cms_pidum_data';

// Supabase REST helper (no SDK needed)
async function supabaseRequest(method, endpoint, body) {
    try {
        const opts = {
            method: method,
            headers: {
                'apikey': PIDUM_SUPABASE_KEY,
                'Authorization': 'Bearer ' + PIDUM_SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': method === 'POST' ? 'resolution=merge-duplicates' : 'return=representation'
            }
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(PIDUM_SUPABASE_URL + '/rest/v1/' + endpoint, opts);
        if (!res.ok) {
            const text = await res.text();
            console.warn('Supabase response:', res.status, text);
            return null;
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (e) {
        console.warn('Supabase request failed:', e);
        return null;
    }
}

// ---- Global helper: wrap long text into multi-line array ----
function wrapText(text, maxChars) {
    maxChars = maxChars || 40;
    if (!text || text.length <= maxChars) return [text];
    var lines = [];
    var words = text.split(' ');
    var currentLine = '';
    for (var i = 0; i < words.length; i++) {
        var testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
        if (testLine.length > maxChars && currentLine) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

// ---- Global: create horizontal bar tooltip config with full labels ----
function makeBarTooltip(chartRef) {
    return {
        backgroundColor: 'rgba(26,26,46,0.95)',
        padding: 14,
        cornerRadius: 8,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12 },
        callbacks: {
            title: function (items) {
                if (!items.length) return '';
                var idx = items[0].dataIndex;
                var chart = items[0].chart;
                var fullText = chart._fullLabels ? chart._fullLabels[idx] : items[0].label;
                return wrapText(fullText, 40);
            },
            label: function (ctx) {
                var axis = ctx.chart.options.indexAxis === 'y' ? 'x' : 'y';
                return 'Jumlah: ' + ctx.parsed[axis];
            }
        }
    };
}

// Save to Supabase
async function saveToSupabase(storageKey, data) {
    try {
        const row = {
            storage_key: storageKey,
            data_json: JSON.stringify(data),
            updated_at: new Date().toISOString()
        };
        await supabaseRequest('POST', PIDUM_TABLE, row);
        console.log('Supabase: saved', storageKey);
    } catch (e) {
        console.warn('Supabase save failed:', e);
    }
}

// Load from Supabase
async function loadFromSupabase(storageKey) {
    try {
        const result = await supabaseRequest('GET',
            PIDUM_TABLE + '?storage_key=eq.' + encodeURIComponent(storageKey) + '&select=data_json&limit=1'
        );
        if (result && result.length > 0 && result[0].data_json) {
            return JSON.parse(result[0].data_json);
        }
    } catch (e) {
        console.warn('Supabase load failed:', e);
    }
    return null;
}

// ---- Sidebar Toggle ----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (window.innerWidth <= 768) {
        // Mobile: slide-in overlay
        sidebar.classList.toggle('mobile-open');
        // Show/hide overlay
        var overlay = document.getElementById('sidebarOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebarOverlay';
            overlay.className = 'sidebar-overlay';
            overlay.onclick = function () { toggleSidebar(); };
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('show', sidebar.classList.contains('mobile-open'));
    } else {
        sidebar.classList.toggle('collapsed');
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

    // Try to get savedAt from any relevant localStorage data
    let lastSavedAt = null;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key.startsWith('cms_')) continue;
        try {
            const val = JSON.parse(localStorage.getItem(key));
            if (val && val.savedAt) {
                const d = new Date(val.savedAt);
                if (!lastSavedAt || d > lastSavedAt) lastSavedAt = d;
            }
        } catch (e) { }
    }

    if (!lastSavedAt) {
        el.textContent = 'Belum ada data';
        return;
    }

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[lastSavedAt.getDay()];
    const date = lastSavedAt.getDate();
    const month = months[lastSavedAt.getMonth()];
    const year = lastSavedAt.getFullYear();
    const time = lastSavedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    el.textContent = `${dayName}, ${date} ${month} ${year} ${time}`;
}

// ---- Storage Key Builder ----
function getStorageKey() {
    return buildStorageKey('pidum');
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

// ---- Save Data to localStorage + Supabase (per-bulan) ----
function saveData() {
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);

    if (bulanAwal !== bulanAkhir) {
        showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error');
        return;
    }

    const bulan = bulanAwal;
    const key = getStorageKey();

    // Collect current field values
    const monthData = {};
    dataFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) monthData[field] = input.value;
    });

    // Load existing data to preserve other months
    let existing = {};
    try {
        const saved = localStorage.getItem(key);
        if (saved) existing = JSON.parse(saved);
    } catch (e) { }

    if (!existing.perBulan) existing.perBulan = {};
    existing.perBulan[bulan] = monthData;

    // Save filter state
    existing._filters = {
        wilayah: document.getElementById('filterWilayah')?.value || '',
        satker1: document.getElementById('filterSatker1')?.value || '',
        satker2: document.getElementById('filterSatker2')?.value || '',
        tahun: document.getElementById('filterTahun')?.value || '',
        bulan1: document.getElementById('filterBulan1')?.value || '',
        bulan2: document.getElementById('filterBulan2')?.value || ''
    };
    existing.savedAt = new Date().toISOString();
    existing._savedAt = existing.savedAt;

    try {
        localStorage.setItem(key, JSON.stringify(existing));
        localStorage.setItem('pidum_last_key', key);

        // Save filter state to sessionStorage (persists during session, resets on browser close)
        saveActiveFilters();

        saveToSupabase(key, existing);
        // Also sync filter state to Supabase for display.html (public view)
        saveToSupabase('pidum_last_filters', existing._filters);

        const BULAN_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        showToast('Data bulan ' + (BULAN_NAMES[bulan - 1] || bulan) + ' berhasil disimpan!', 'success');
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

// ---- Load Saved Data (localStorage + Supabase) ----
// restoreFilters = true only on initial page load, false when user clicks Terapkan
async function loadSavedData(restoreFilters) {
    // Only restore filters on initial load, not when user manually changes them
    if (restoreFilters !== false) {
        let filters = null;
        // Read from sessionStorage (persists during session, resets on browser close)
        const lastFilters = sessionStorage.getItem('cms_active_filters');
        if (lastFilters) {
            try { filters = JSON.parse(lastFilters); } catch (e) { }
        }
        if (filters) {
            setSelectValue('filterWilayah', filters.wilayah);
            setSelectValue('filterSatker1', filters.satker1);
            setSelectValue('filterSatker2', filters.satker2);
            setSelectValue('filterTahun', filters.tahun);
            setSelectValue('filterBulan1', filters.bulan1);
            setSelectValue('filterBulan2', filters.bulan2);
        }
    }

    // Clear all fields first
    clearDataFields();

    // Load data for current filter combination
    const key = getStorageKey();
    let data = null;

    // Try Supabase first
    const sbData = await loadFromSupabase(key);
    if (sbData) {
        data = sbData;
    } else {
        const saved = localStorage.getItem(key);
        if (saved) {
            try { data = JSON.parse(saved); } catch (e) { }
        }
    }

    if (data && data.perBulan) {
        // Per-bulan format: aggregate from month range
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        const sumFields = {};
        for (let m = start; m <= end; m++) {
            const md = data.perBulan[m];
            if (!md) continue;
            dataFields.forEach(field => {
                sumFields[field] = ((parseInt(sumFields[field]) || 0) + (parseInt(md[field]) || 0)).toString();
            });
        }
        dataFields.forEach(field => {
            const input = document.getElementById(field);
            if (input && sumFields[field] !== undefined) input.value = sumFields[field];
        });
    } else if (data) {
        // Legacy flat format
        dataFields.forEach(field => {
            const input = document.getElementById(field);
            if (input && data[field] !== undefined) input.value = data[field];
        });
    }

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

// ---- Reset data (clear inputs and remove from localStorage + Supabase) ----
function resetData() {
    if (confirm('Apakah Anda yakin ingin mengosongkan semua data?')) {
        clearDataFields();

        // Remove data from localStorage
        const key = getStorageKey();
        localStorage.removeItem(key);

        // Also remove from Supabase
        supabaseRequest('DELETE', PIDUM_TABLE + '?storage_key=eq.' + encodeURIComponent(key));

        hasUnsaved = false;
        showToast('Data telah dikosongkan', 'success');
    }
}

// ---- Apply Filters ----
function applyFilters() {
    // Load data for current filter values without overriding filter selection
    loadSavedData(false);
    saveActiveFilters();
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
    document.getElementById('filterBulan2').value = getDefaultBulanAkhir();

    clearDataFields();
    clearTempFilter();
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
