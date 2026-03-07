/* ============================================
   TPPU - JAVASCRIPT
   2 Cards (TPPU, TPA) - clickable to detail
   No table on this page - table is on detail page
   ============================================ */

// hasUnsaved is already declared in app.js — do NOT redeclare with let

// ---- Storage key ----
function getStorageKey() {
    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
    return `tppu_${w}_${s1}_${s2}_${t}`;
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
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    if (bulanAwal !== bulanAkhir) { showToast('Untuk menyimpan data, Bulan Awal dan Bulan Akhir harus sama.', 'error'); return; }
    const bulan = bulanAwal;
    const monthData = { cards: {} };
    ['tppu-count', 'tpa-count'].forEach(id => { const el = document.getElementById(id); if (el) monthData.cards[id] = el.value; });
    const storageKey = getStorageKey();
    let existing = {}; try { const s = localStorage.getItem(storageKey); if (s) existing = JSON.parse(s); } catch (e) { }
    if (!existing.perBulan) existing.perBulan = {};
    existing.perBulan[bulan] = monthData;
    existing.savedAt = new Date().toISOString();
    try {
        localStorage.setItem(storageKey, JSON.stringify(existing));
        const nb = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
        showToast('Data bulan ' + nb + ' berhasil disimpan!', 'success');
        hasUnsaved = false;
        const btn = document.getElementById('btnSave');
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Tersimpan'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-save"></i> Simpan Semua Data'; }, 2000); }
    } catch (e) { showToast('Gagal menyimpan data!', 'error'); }
}

function loadAllData() {
    const saved = localStorage.getItem(getStorageKey());
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        const bA = parseInt(document.getElementById('filterBulan1')?.value || '1');
        const bB = parseInt(document.getElementById('filterBulan2')?.value || bA);
        const start = Math.min(bA, bB), end = Math.max(bA, bB);
        if (data.perBulan) {
            const sumC = {};
            for (let m = start; m <= end; m++) { const md = data.perBulan[m]; if (!md) continue; _sumTppu(sumC, md.cards); }
            ['tppu-count', 'tpa-count'].forEach(id => { const el = document.getElementById(id); if (el && sumC[id] !== undefined) el.value = sumC[id]; });
            return;
        }
        if (data.cards) { Object.keys(data.cards).forEach(id => { const el = document.getElementById(id); if (el) el.value = data.cards[id]; }); }
    } catch (e) { console.error('Load error:', e); }
}
function _sumTppu(t, s) { if (!s) return; Object.keys(s).forEach(k => { t[k] = ((parseInt(t[k]) || 0) + (parseInt(s[k]) || 0)).toString(); }); }

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
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    // Set temporary filter (session-only, resets on page reload)
    setTempFilter(bulanAwal, bulanAkhir);

    loadAllData();
    setUpdateDate();
    saveActiveFilters();
    showToast('Filter diterapkan', 'success');
}

function resetFilters() {
    document.getElementById('filterWilayah').value = 'kejati-kepri';
    document.getElementById('filterSatker1').value = '';
    document.getElementById('filterSatker2').value = '';
    document.getElementById('filterTahun').value = getTahunList()[0]?.toString() || '2026';
    document.getElementById('filterBulan1').value = '01';
    document.getElementById('filterBulan2').value = getDefaultBulanAkhir();

    saveVisibleBulanList(getSelectedBulanList());

    ['tppu-count', 'tpa-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    clearTempFilter();
    showToast('Filter telah direset', 'success');
}

// ---- Navigate to detail page ----
function goToDetailTppu(jenis, event) {
    // Cegah navigasi jika user mengklik input field
    if (event && event.target.tagName === 'INPUT') {
        return;
    }

    const w = document.getElementById('filterWilayah')?.value || '';
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || '';
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
