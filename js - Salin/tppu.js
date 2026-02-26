/* ============================================
   TPPU - JAVASCRIPT
   2 Cards (TPPU, TPA) - clickable to detail
   No table on this page - table is on detail page
   ============================================ */

// hasUnsaved is already declared in app.js — do NOT redeclare with let

// ---- Storage key ----
function getStorageKey() {
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    return `tppu_${w}_${s1}_${s2}_${t}_${b1}_${b2}`;
}

// ============================================
// INITIALIZE
// ============================================
function initTppu() {
    loadAllData();
}

// ============================================
// DATA INPUT
// ============================================
function onDataInput() { markUnsaved(); }

function markUnsaved() {
    hasUnsaved = true;
    const btn = document.getElementById('btnSave');
    if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data *';
}

// ============================================
// SAVE & LOAD (Cards only)
// ============================================
function saveAllData() {
    const allData = { savedAt: new Date().toISOString() };
    allData.cards = {};
    ['tppu-count', 'tpa-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) allData.cards[id] = el.value;
    });
    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(allData));
        showToast('Semua data berhasil disimpan!', 'success');
        hasUnsaved = false;
        const btn = document.getElementById('btnSave');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000);
        }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllData() {
    const saved = localStorage.getItem(getStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        if (data.cards) {
            Object.keys(data.cards).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = data.cards[id];
            });
        }
    } catch (e) { console.error('Load error:', e); }
}

function resetAllData() {
    if (!confirm('Apakah Anda yakin ingin mengosongkan semua data di halaman ini?')) return;
    ['tppu-count', 'tpa-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    showToast('Semua data telah dikosongkan', 'success');
}

// ---- Filters ----
function applyFilters() {
    loadAllData();
    setUpdateDate();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = '02';
    ['tppu-count', 'tpa-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    showToast('Filter telah direset', 'success');
}

// ---- Navigate to detail page ----
function goToDetailTppu(jenis, event) {
    // Cegah navigasi jika user mengklik input field
    if (event && event.target.tagName === 'INPUT') {
        return;
    }
    
    const w  = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t  = document.getElementById('filterTahun')?.value || '';
    const b1 = document.getElementById('filterBulan1')?.value || '';
    const b2 = document.getElementById('filterBulan2')?.value || '';
    const params = new URLSearchParams({ jenis, w, s1, s2, t, b1, b2 });
    window.location.href = `detail-tppu.html?${params.toString()}`;
}

// ---- Utility ----
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
