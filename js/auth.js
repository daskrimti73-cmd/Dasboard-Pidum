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
const DIREKTORAT_KEY = 'cms_direktorat_list';
const BULAN_KEY = 'cms_selected_bulan';

// ---- One-time data migration ----
// Clear page data that was corrupted by combined-month save bug.
// Preserves: auth session, settings (tahun, satker, direktorat lists).
// Increment _DATA_VERSION to trigger a new migration.
const _DATA_VERSION = 2;
const _DATA_VERSION_KEY = 'cms_data_version';

(function migrateDataIfNeeded() {
    try {
        const currentVersion = parseInt(localStorage.getItem(_DATA_VERSION_KEY)) || 0;
        if (currentVersion >= _DATA_VERSION) return;

        // Page data prefixes from buildStorageKey():
        // pidum_, prapen_, penuntutan_, eksekusi_, wna_, hm_, upayahukum_, korban_, korban_table_, tppu_
        const pageDataPrefixes = ['pidum_', 'prapen_', 'penuntutan_', 'eksekusi_', 'wna_', 'hm_', 'upayahukum_', 'korban_', 'tppu_'];
        const safeKeys = new Set([AUTH_KEY, TAHUN_KEY, SATKER1_KEY, SATKER2_KEY, BULAN_KEY, _DATA_VERSION_KEY]);
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (safeKeys.has(key)) continue;
            if (key.startsWith(DIREKTORAT_KEY)) continue;
            // Check if this is a page data key or its timestamp/delete marker
            let baseKey = key;
            if (key.startsWith('__ts_')) baseKey = key.substring(5);
            else if (key.startsWith('__del_')) baseKey = key.substring(6);
            const isPageData = pageDataPrefixes.some(p => baseKey.startsWith(p));
            if (!isPageData) continue;
            keysToRemove.push(key);
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.setItem(_DATA_VERSION_KEY, _DATA_VERSION.toString());
        console.log('[CMS Migration] Cleared ' + keysToRemove.length + ' corrupted data entries');
    } catch (e) { console.error('[CMS Migration] Error:', e); }
})();

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

// ---- Satuan Kerja Hierarchy ----
// Satker 2 options depend on which Satker 1 is selected
const SATKER_HIERARCHY = {
    'kejati-kepri': [],
    'kejari-tanjungpinang': [
        { value: 'kejari-tanjungpinang', label: 'KEJAKSAAN NEGERI TANJUNGPINANG' }
    ],
    'kejari-batam': [
        { value: 'kejari-batam', label: 'KEJAKSAAN NEGERI BATAM' }
    ],
    'kejari-karimun': [
        { value: 'kejari-karimun', label: 'KEJAKSAAN NEGERI KARIMUN' },
        { value: 'cabjari-tj-balai-karimun', label: 'CABANG KEJAKSAAN NEGERI TJ. BALAI KARIMUN DI TANJUNG BATU' },
        { value: 'cabjari-karimun-moro', label: 'CABANG KEJAKSAAN NEGERI KARIMUN DI MORO' }
    ],
    'kejari-bintan': [
        { value: 'kejari-bintan', label: 'KEJAKSAAN NEGERI BINTAN' }
    ],
    'kejari-lingga': [
        { value: 'kejari-lingga', label: 'KEJAKSAAN NEGERI LINGGA' }
    ],
    'kejari-natuna': [
        { value: 'kejari-natuna', label: 'KEJAKSAAN NEGERI NATUNA' },
        { value: 'cabjari-natuna-tarempa', label: 'CABANG KEJAKSAAN NEGERI NATUNA DI TAREMPA' }
    ],
    'kejari-anambas': [
        { value: 'kejari-anambas', label: 'KEJAKSAAN NEGERI ANAMBAS' }
    ]
};

// ---- Satuan Kerja Management ----
function getSatker1List() {
    try {
        const saved = localStorage.getItem(SATKER1_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch (e) { }
    // Default: All Kejari under Kejati Kepulauan Riau
    const defaultList = [
        { value: 'kejati-kepri', label: 'KEJAKSAAN TINGGI KEPULAUAN RIAU' },
        { value: 'kejari-tanjungpinang', label: 'KEJAKSAAN NEGERI TANJUNGPINANG' },
        { value: 'kejari-batam', label: 'KEJAKSAAN NEGERI BATAM' },
        { value: 'kejari-karimun', label: 'KEJAKSAAN NEGERI KARIMUN' },
        { value: 'kejari-bintan', label: 'KEJAKSAAN NEGERI BINTAN' },
        { value: 'kejari-lingga', label: 'KEJAKSAAN NEGERI LINGGA' },
        { value: 'kejari-natuna', label: 'KEJAKSAAN NEGERI NATUNA' },
        { value: 'kejari-anambas', label: 'KEJAKSAAN NEGERI KEPULAUAN ANAMBAS' }
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

// ---- Direktorat / Tindak Pidana Management (per-section) ----
const DEFAULT_DIREKTORAT = [];

// Get list for a specific section. Each section has its own localStorage key.
// sectionKey examples: 'pra_spdp', 'pra_tahap1', 'penuntutan_tahap2', 'eks_p48', etc.
// If no sectionKey, uses global key (backward compat)
function getDirektoratList(sectionKey) {
    const key = sectionKey ? (DIREKTORAT_KEY + '_' + sectionKey) : DIREKTORAT_KEY;
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list)) return list.sort((a, b) => a.localeCompare(b, 'id'));
        }
    } catch (e) { }
    // First time: initialize empty (admin adds categories via Kelola Kategori)
    const sorted = [...DEFAULT_DIREKTORAT].sort((a, b) => a.localeCompare(b, 'id'));
    localStorage.setItem(key, JSON.stringify(sorted));
    return sorted;
}

function saveDirektoratList(list, sectionKey) {
    const key = sectionKey ? (DIREKTORAT_KEY + '_' + sectionKey) : DIREKTORAT_KEY;
    localStorage.setItem(key, JSON.stringify(list));
    return list;
}

function addDirektorat(label, sectionKey) {
    const trimmed = label.trim();
    if (!trimmed) return false;
    const list = getDirektoratList(sectionKey);
    if (list.some(d => d.toLowerCase() === trimmed.toLowerCase())) return false;
    list.push(trimmed);
    list.sort((a, b) => a.localeCompare(b, 'id'));
    saveDirektoratList(list, sectionKey);
    return true;
}

function deleteDirektorat(label, sectionKey) {
    let list = getDirektoratList(sectionKey);
    if (list.length <= 1) return false;
    list = list.filter(d => d !== label);
    saveDirektoratList(list, sectionKey);
    return true;
}

// ---- Excluded dirs per month ----
// Each month can have its own excluded categories, stored in perBulan[month].excludedDirs[section]
// This allows deleting a category from one month without affecting other months.

function excludeDirForMonth(storageKey, section, label, month, dirDataKey) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const data = JSON.parse(saved);
        if (!data.perBulan) data.perBulan = {};
        if (!data.perBulan[month]) data.perBulan[month] = {};
        if (!data.perBulan[month].excludedDirs) data.perBulan[month].excludedDirs = {};
        if (!data.perBulan[month].excludedDirs[section]) data.perBulan[month].excludedDirs[section] = [];

        const list = data.perBulan[month].excludedDirs[section];
        if (!list.includes(label)) {
            list.push(label);
        }

        // Also delete the category's data from this month
        const dk = dirDataKey || (section + 'Dir');
        if (data.perBulan[month][dk] && data.perBulan[month][dk][label] !== undefined) {
            delete data.perBulan[month][dk][label];
        }

        localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
        console.error('excludeDirForMonth error:', e);
    }
}

function unexcludeDirForMonth(storageKey, section, label, month) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const data = JSON.parse(saved);
        if (!data.perBulan || !data.perBulan[month] || !data.perBulan[month].excludedDirs) return;
        const list = data.perBulan[month].excludedDirs[section];
        if (!list) return;
        data.perBulan[month].excludedDirs[section] = list.filter(d => d !== label);
        localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
        console.error('unexcludeDirForMonth error:', e);
    }
}

function getExcludedDirsForMonth(storageKey, section, month) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return [];
        const data = JSON.parse(saved);
        if (!data.perBulan || !data.perBulan[month] || !data.perBulan[month].excludedDirs) return [];
        return data.perBulan[month].excludedDirs[section] || [];
    } catch (e) { return []; }
}

// ---- Delete direktorat data for a SPECIFIC month only ----
// This removes the category's data from the currently selected month in perBulan,
// WITHOUT removing it from the global direktorat list.
// This prevents deleting a category in month X from affecting month Y's data/chart.
// storageKey: the localStorage key for the page data
// dirDataKeys: array of keys inside perBulan[month] that hold dir data (e.g. ['spdpDir', 'tahap1Dir'])
// label: the category name to remove
// month: the month number to remove data from
function deleteDirektoratDataForMonth(storageKey, dirDataKeys, label, month) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return false;
        const data = JSON.parse(saved);
        if (!data.perBulan || !data.perBulan[month]) return false;

        const keys = Array.isArray(dirDataKeys) ? dirDataKeys : [dirDataKeys];
        let changed = false;
        keys.forEach(dk => {
            if (data.perBulan[month][dk] && data.perBulan[month][dk][label] !== undefined) {
                delete data.perBulan[month][dk][label];
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(storageKey, JSON.stringify(data));
        }
        return changed;
    } catch (e) {
        console.error('deleteDirektoratDataForMonth error:', e);
        return false;
    }
}

// ---- Check if a direktorat has data in ANY month ----
// Returns true if the category has non-zero data in at least one month
function direktoratHasDataInAnyMonth(storageKey, dirDataKeys, label) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return false;
        const data = JSON.parse(saved);
        if (!data.perBulan) return false;

        const keys = Array.isArray(dirDataKeys) ? dirDataKeys : [dirDataKeys];
        for (let m = 1; m <= 12; m++) {
            const md = data.perBulan[m];
            if (!md) continue;
            for (const dk of keys) {
                if (md[dk] && md[dk][label] !== undefined) {
                    const val = parseInt(md[dk][label]);
                    if (!isNaN(val) && val > 0) return true;
                }
            }
        }
    } catch (e) { }
    return false;
}

// ---- Get merged dir list: global list + categories from saved data that have actual values ----
// This ensures that categories with actual (non-zero) saved data in any month are shown,
// even if they've been removed from the global list.
// Categories with value 0 or empty are NOT included (so they don't clutter the inputs/charts).
// storageKey = the localStorage key for the page data (e.g., buildStorageKey('wna'))
// sectionKey = the direktorat list section key (e.g., 'wna')
// dirDataKey = the key inside perBulan[month] that holds dir data (e.g., 'dirValues', 'tpValues', 'tahap2Dir')
// Returns: array of unique category names
function getMergedDirList(storageKey, sectionKey, dirDataKeys) {
    const globalList = getDirektoratList(sectionKey);
    const merged = [...globalList];

    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return merged;
        const data = JSON.parse(saved);
        if (!data.perBulan) return merged;

        // Collect category names from ALL months' saved data, but ONLY if value > 0
        const keys = Array.isArray(dirDataKeys) ? dirDataKeys : [dirDataKeys];
        Object.values(data.perBulan).forEach(monthData => {
            if (!monthData) return;
            keys.forEach(dk => {
                const dirObj = monthData[dk];
                if (!dirObj || typeof dirObj !== 'object') return;
                Object.keys(dirObj).forEach(catName => {
                    // Only add string keys (category names, not numeric indices)
                    if (!isNaN(parseInt(catName))) return;
                    // Only add if the value is non-zero (has actual data)
                    const val = parseInt(dirObj[catName]);
                    if (isNaN(val) || val <= 0) return;
                    if (!merged.some(m => m.toLowerCase() === catName.toLowerCase())) {
                        merged.push(catName);
                    }
                });
            });
        });
    } catch (e) { }

    return merged;
}

// ---- Centralized Storage Key Builder ----
// ALL pages should use this to build consistent storage keys
// This ensures admin and public (iframe) always produce the SAME key
function buildStorageKey(prefix) {
    const w = document.getElementById('filterWilayah')?.value || 'kejati-kepri';
    // IMPORTANT: Always use empty string for satker if not explicitly selected
    // This prevents key mismatch between admin (with satker) and public (without)
    const s1 = document.getElementById('filterSatker1')?.value || '';
    const s2 = document.getElementById('filterSatker2')?.value || '';
    const t = document.getElementById('filterTahun')?.value || new Date().getFullYear().toString();
    return `${prefix}_${w}_${s1}_${s2}_${t}`;
}

// ---- Ensure direktorat list includes ALL categories ever used in saved data ----
// This prevents data loss when admin deletes a category in one month
// but another month still has data for that category.
// storageKey: the localStorage key for the page data (e.g. getWnaStorageKey())
// sectionKey: the direktorat section key (e.g. 'wna')
// dirDataKey: the key name inside each month's data that contains direktorat values
//             (e.g. 'dirValues', 'tpValues', 'spdpDir', 'tahap1Dir')
function ensureDirListFromSavedData(storageKey, sectionKey, dirDataKeys) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const data = JSON.parse(saved);
        if (!data.perBulan) return;

        const currentList = getDirektoratList(sectionKey);
        const currentSet = new Set(currentList.map(d => d.toLowerCase()));
        let changed = false;

        // Scan all 12 months for directorat keys used in saved data
        for (let m = 1; m <= 12; m++) {
            const md = data.perBulan[m];
            if (!md) continue;

            // Check each dirDataKey (could be 'dirValues', 'tpValues', etc.)
            const keys = Array.isArray(dirDataKeys) ? dirDataKeys : [dirDataKeys];
            keys.forEach(dk => {
                const dirObj = md[dk];
                if (!dirObj) return;
                Object.keys(dirObj).forEach(k => {
                    // Only add string keys (not numeric indices)
                    if (isNaN(parseInt(k)) && !currentSet.has(k.toLowerCase())) {
                        currentList.push(k);
                        currentSet.add(k.toLowerCase());
                        changed = true;
                    }
                });
            });
        }

        if (changed) {
            saveDirektoratList(currentList, sectionKey);
        }
    } catch (e) {
        console.error('ensureDirListFromSavedData error:', e);
    }
}

// ---- Bulan (Month) Management ----
const BULAN_NAMES_ALL = [
    { index: 1, name: 'Januari' },
    { index: 2, name: 'Februari' },
    { index: 3, name: 'Maret' },
    { index: 4, name: 'April' },
    { index: 5, name: 'Mei' },
    { index: 6, name: 'Juni' },
    { index: 7, name: 'Juli' },
    { index: 8, name: 'Agustus' },
    { index: 9, name: 'September' },
    { index: 10, name: 'Oktober' },
    { index: 11, name: 'November' },
    { index: 12, name: 'Desember' }
];

// Get the list of selected months (array of month numbers, sorted)
function getSelectedBulanList() {
    try {
        const saved = localStorage.getItem(BULAN_KEY);
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list) && list.length > 0) return list.sort((a, b) => a - b);
        }
    } catch (e) { }
    // Default: January to current month
    const currentMonth = new Date().getMonth() + 1;
    const defaults = [];
    for (let i = 1; i <= currentMonth; i++) defaults.push(i);
    localStorage.setItem(BULAN_KEY, JSON.stringify(defaults));
    return defaults;
}

function saveSelectedBulanList(list) {
    const sorted = [...list].sort((a, b) => a - b);
    localStorage.setItem(BULAN_KEY, JSON.stringify(sorted));
    return sorted;
}

function addBulan(monthNum) {
    const num = parseInt(monthNum);
    if (isNaN(num) || num < 1 || num > 12) return false;
    const list = getSelectedBulanList();
    if (list.includes(num)) return false;
    list.push(num);
    saveSelectedBulanList(list);
    return true;
}

function deleteBulan(monthNum) {
    const num = parseInt(monthNum);
    let list = getSelectedBulanList();
    if (list.length <= 1) return false;
    list = list.filter(m => m !== num);
    saveSelectedBulanList(list);
    return true;
}

// Get selected months as objects [{index, name}], sorted
function getSelectedMonths() {
    const selected = getSelectedBulanList();
    return selected.map(idx => BULAN_NAMES_ALL[idx - 1]).filter(Boolean);
}

// ---- Visible Bulan Management (controls which months appear on chart) ----
// Each section (spdp, tahap1, etc.) has its own visible months list
const VISIBLE_BULAN_KEY = 'cms_visible_bulan';

function _getVisibleKey(section) {
    return section ? VISIBLE_BULAN_KEY + '_' + section : VISIBLE_BULAN_KEY;
}

function getVisibleBulanList(section) {
    try {
        const saved = localStorage.getItem(_getVisibleKey(section));
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list)) return list.sort((a, b) => a - b);
        }
    } catch (e) { }
    // Default: same as selected bulan list
    return getSelectedBulanList();
}

function saveVisibleBulanList(list, section) {
    const sorted = [...list].sort((a, b) => a - b);
    localStorage.setItem(_getVisibleKey(section), JSON.stringify(sorted));
    return sorted;
}

function isMonthVisible(monthNum, section) {
    return getVisibleBulanList(section).includes(monthNum);
}

function toggleMonthVisibility(monthNum, section) {
    const num = parseInt(monthNum);
    let list = getVisibleBulanList(section);
    if (list.includes(num)) {
        // Admin bebas sembunyikan bulan mana saja tanpa batasan
        list = list.filter(m => m !== num);
    } else {
        list.push(num);
    }
    saveVisibleBulanList(list, section);
    return true;
}

// Get visible months as objects for charts [{index, name}], sorted
function getVisibleMonths(section) {
    const visible = getVisibleBulanList(section);
    return visible.map(idx => BULAN_NAMES_ALL[idx - 1]).filter(Boolean);
}

// ---- Temporary filter (session-only, NOT saved to localStorage) ----
// User/publik filter hanya sementara, hilang saat refresh
// Admin eye icon = permanen, tersimpan di localStorage
let _tempFilterActive = false;
let _tempFilterMonths = [];

// Set temporary filter (called by applyFilters)
function setTempFilter(bulanAwal, bulanAkhir) {
    const start = Math.min(bulanAwal, bulanAkhir);
    const end = Math.max(bulanAwal, bulanAkhir);
    const months = [];
    for (let m = start; m <= end; m++) {
        months.push(m);
    }
    _tempFilterMonths = months;
    _tempFilterActive = true;
}

// Clear temporary filter (called by resetFilters or page load)
function clearTempFilter() {
    _tempFilterActive = false;
    _tempFilterMonths = [];
}

// Get months for CHART display
// Always reads from filter dropdowns to generate complete month range
function getChartMonthRange(section) {
    const bulanAwal = parseInt(document.getElementById('filterBulan1')?.value || '1');
    const bulanAkhir = parseInt(document.getElementById('filterBulan2')?.value || bulanAwal);
    const start = Math.min(bulanAwal, bulanAkhir);
    const end = Math.max(bulanAwal, bulanAkhir);

    // Build complete range from start to end month
    const months = [];
    for (let m = start; m <= end; m++) {
        if (BULAN_NAMES_ALL[m - 1]) {
            months.push(BULAN_NAMES_ALL[m - 1]);
        }
    }

    return months.length > 0 ? months : getVisibleMonths(section);
}

// When a month is added to selectedBulanList, also add to visible
function addBulanWithVisible(monthNum) {
    const result = addBulan(monthNum);
    if (result) {
        const visibleList = getVisibleBulanList();
        if (!visibleList.includes(parseInt(monthNum))) {
            visibleList.push(parseInt(monthNum));
            saveVisibleBulanList(visibleList);
        }
    }
    return result;
}

// When a month is deleted from selectedBulanList, also remove from visible
function deleteBulanWithVisible(monthNum) {
    const result = deleteBulan(monthNum);
    if (result) {
        let visibleList = getVisibleBulanList();
        visibleList = visibleList.filter(m => m !== parseInt(monthNum));
        if (visibleList.length === 0) visibleList = getSelectedBulanList();
        saveVisibleBulanList(visibleList);
    }
    return result;
}

// ---- Bulan Management UI (global, used by all pages) ----
function renderBulanTags() {
    const container = document.getElementById('bulanTagsContainer');
    if (!container) return;
    const list = getSelectedBulanList();
    container.innerHTML = '';
    list.forEach(num => {
        const info = BULAN_NAMES_ALL[num - 1];
        if (!info) return;
        const tag = document.createElement('span');
        tag.className = 'year-tag';
        tag.textContent = info.name + ' ';
        const btn = document.createElement('button');
        btn.className = 'year-tag-delete';
        btn.title = 'Hapus ' + info.name;
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.addEventListener('click', function () { handleDeleteBulan(num); });
        tag.appendChild(btn);
        container.appendChild(tag);
    });
}

function handleAddBulan() {
    const sel = document.getElementById('selectBulanBaru');
    if (!sel || !sel.value) { showToast('Pilih bulan yang ingin ditambahkan', 'error'); return; }
    if (addBulanWithVisible(sel.value)) {
        const name = BULAN_NAMES_ALL[parseInt(sel.value) - 1]?.name || '';
        showToast('Bulan ' + name + ' berhasil ditambahkan', 'success');
        sel.value = '';
        if (typeof rebuildMonthlyUI === 'function') rebuildMonthlyUI();
    } else {
        showToast('Bulan sudah ada dalam daftar', 'error');
    }
}

// Version that works from any button (no ID dependency)
function handleAddBulanFrom(btn) {
    const sel = btn.parentElement.querySelector('select');
    if (!sel || !sel.value) { showToast('Pilih bulan yang ingin ditambahkan', 'error'); return; }
    if (addBulanWithVisible(sel.value)) {
        const name = BULAN_NAMES_ALL[parseInt(sel.value) - 1]?.name || '';
        showToast('Bulan ' + name + ' berhasil ditambahkan', 'success');
        sel.value = '';
        if (typeof rebuildMonthlyUI === 'function') rebuildMonthlyUI();
    } else {
        showToast('Bulan sudah ada dalam daftar', 'error');
    }
}

function handleDeleteBulan(monthNum) {
    const name = BULAN_NAMES_ALL[monthNum - 1]?.name || '';
    if (!confirm('Hapus bulan ' + name + ' beserta datanya?')) return;
    if (deleteBulanWithVisible(monthNum)) {
        showToast('Bulan ' + name + ' berhasil dihapus', 'success');
        if (typeof rebuildMonthlyUI === 'function') rebuildMonthlyUI();
    } else {
        showToast('Tidak dapat menghapus bulan terakhir', 'error');
    }
}

function handleToggleVisibility(monthNum, section) {
    const num = parseInt(monthNum);
    const name = BULAN_NAMES_ALL[num - 1]?.name || '';
    if (toggleMonthVisibility(num, section)) {
        const isVisible = isMonthVisible(num, section);
        showToast(name + (isVisible ? ' ditampilkan di grafik' : ' disembunyikan dari grafik'), 'success');
        if (typeof rebuildMonthlyUI === 'function') rebuildMonthlyUI();
    } else {
        showToast('Minimal 1 bulan harus ditampilkan', 'error');
    }
}

// Returns default Bulan Akhir: always Februari ('02')
// When browser is reopened, filter defaults to Januari-Februari
function getDefaultBulanAkhir() {
    return '02';
}

function initDefaultBulanFilter() {
    const sel = document.getElementById('filterBulan2');
    if (sel) sel.value = getDefaultBulanAkhir();
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

        // Add change listener for cascading Satker 2
        if (!select1._hasCascade) {
            select1._hasCascade = true;
            select1.addEventListener('change', function () {
                populateSatker2BasedOnSatker1();
            });
        }
    }

    // Populate Satker 2 based on current Satker 1 selection
    populateSatker2BasedOnSatker1();
}

function populateSatker2BasedOnSatker1() {
    const select1 = document.getElementById('filterSatker1');
    const select2 = document.getElementById('filterSatker2');
    if (!select2) return;

    const currentVal2 = select2.value;
    const satker1Val = select1 ? select1.value : '';

    select2.innerHTML = '<option value="">SATUAN KERJA (SATKER) 2</option>';

    if (satker1Val && SATKER_HIERARCHY[satker1Val] !== undefined) {
        const subUnits = SATKER_HIERARCHY[satker1Val];
        if (subUnits.length === 0) {
            // No sub-units — show disabled "NO RESULT FOUND"
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'NO RESULT FOUND';
            opt.disabled = true;
            opt.selected = true;
            select2.appendChild(opt);
        } else {
            subUnits.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.value;
                opt.textContent = s.label;
                select2.appendChild(opt);
            });
        }
    } else {
        // No Satker 1 selected — show all Satker 2 from saved list
        const satkers2 = getSatker2List();
        satkers2.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.value;
            opt.textContent = s.label;
            select2.appendChild(opt);
        });
    }

    // Restore previous selection if still available
    if (currentVal2) {
        const exists = Array.from(select2.options).some(o => o.value === currentVal2);
        if (exists) select2.value = currentVal2;
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

// ---- Save active filter values to sessionStorage (persists across pages within same session) ----
// When browser is closed, filters reset to defaults (Januari-Februari)
function saveActiveFilters() {
    const filters = {
        wilayah: document.getElementById('filterWilayah')?.value || '',
        satker1: document.getElementById('filterSatker1')?.value || '',
        satker2: document.getElementById('filterSatker2')?.value || '',
        tahun: document.getElementById('filterTahun')?.value || '',
        bulan1: document.getElementById('filterBulan1')?.value || '',
        bulan2: document.getElementById('filterBulan2')?.value || ''
    };
    try {
        sessionStorage.setItem('cms_active_filters', JSON.stringify(filters));
    } catch (e) { }
}

// ---- Restore filters from URL params, sessionStorage, or defaults ----
function restoreViewFilters() {
    // Populate Tahun dropdown first (dynamic from localStorage)
    populateTahunDropdown();

    // Set default Bulan Akhir
    initDefaultBulanFilter();

    // Priority 1: URL params (passed from navigateToPage or view mode)
    const urlFilters = getViewFilterParams();
    const hasUrlFilters = urlFilters.bulan1 || urlFilters.bulan2 || urlFilters.tahun || urlFilters.wilayah;
    if (hasUrlFilters) {
        if (urlFilters.wilayah) setSelectValueSafe('filterWilayah', urlFilters.wilayah);
        if (urlFilters.satker1) setSelectValueSafe('filterSatker1', urlFilters.satker1);
        if (urlFilters.satker2) setSelectValueSafe('filterSatker2', urlFilters.satker2);
        if (urlFilters.tahun) setSelectValueSafe('filterTahun', urlFilters.tahun);
        if (urlFilters.bulan1) setSelectValueSafe('filterBulan1', urlFilters.bulan1);
        if (urlFilters.bulan2) setSelectValueSafe('filterBulan2', urlFilters.bulan2);
        // Also save to sessionStorage so subsequent page navigations work
        saveActiveFilters();
        return;
    }

    // Priority 2: sessionStorage (persists during browser session)
    if (!isViewMode()) {
        try {
            const saved = sessionStorage.getItem('cms_active_filters');
            if (saved) {
                const filters = JSON.parse(saved);
                if (filters.wilayah) setSelectValueSafe('filterWilayah', filters.wilayah);
                if (filters.satker1) setSelectValueSafe('filterSatker1', filters.satker1);
                if (filters.satker2) setSelectValueSafe('filterSatker2', filters.satker2);
                if (filters.tahun) setSelectValueSafe('filterTahun', filters.tahun);
                if (filters.bulan1) setSelectValueSafe('filterBulan1', filters.bulan1);
                if (filters.bulan2) setSelectValueSafe('filterBulan2', filters.bulan2);
            }
        } catch (e) { }
    }
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
