/* ============================================
   SUPABASE SYNC - Auto-sync localStorage to Supabase
   Include this script BEFORE all other scripts.
   It transparently syncs data so all existing code
   continues to work with localStorage but data also 
   goes to/from Supabase for cross-origin access.
   ============================================ */

// IMMEDIATE iframe detection — runs before body renders
// Hides sidebar/admin elements via CSS on <html> element
(function () {
    var inIframe = false;
    try { inIframe = (window.self !== window.top); } catch (e) { inIframe = true; }
    if (inIframe) {
        document.documentElement.classList.add('view-mode');
        // Inject CSS immediately to prevent any flash of admin UI
        var s = document.createElement('style');
        s.textContent = 'html.view-mode .sidebar, html.view-mode #sidebar, html.view-mode .top-header, html.view-mode .save-section, html.view-mode .btn-logout, html.view-mode .toggle-btn, html.view-mode .header-badge, html.view-mode .monthly-detail, html.view-mode .btn-save, html.view-mode .btn-icon, html.view-mode .modal-overlay, html.view-mode .sidebar-brand, html.view-mode .sidebar-status, html.view-mode .sidebar-nav, html.view-mode .sidebar-footer { display: none !important; } html.view-mode .main-content, html.view-mode .main-area { margin-left: 0 !important; }';
        document.head.appendChild(s);
    }
})();

const _SB_URL = 'https://imiwlmuvelhihyfuumkw.supabase.co';
const _SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXdsbXV2ZWxoaWh5ZnV1bWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzgxMDksImV4cCI6MjA4NjQ1NDEwOX0.OJVW8to47hCJ83fZSHeuPoBdOh7M15CQOYv0Ds56ncs';
const _SB_TABLE = 'cms_pidum_data';
const _TS_PREFIX = '__ts_'; // timestamp tracking prefix
const _DEL_PREFIX = '__del_'; // deleted key tracking prefix

// Keys to EXCLUDE from sync (browser/framework keys)
function _shouldSkip(key) {
    if (!key) return true;
    // Skip auth session key and very short keys
    if (key === 'cms_auth_session') return true;
    if (key.length < 3) return true;
    // Skip internal timestamp tracking keys
    if (key.startsWith(_TS_PREFIX)) return true;
    if (key.startsWith(_DEL_PREFIX)) return true;
    return false;
}

// Override localStorage.setItem to also save to Supabase
const _originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function (key, value) {
    _originalSetItem(key, value);
    if (_shouldSkip(key)) return;
    // Track local save timestamp for this key (used by hydrate to avoid overwriting newer local data)
    if (!key.startsWith(_TS_PREFIX) && !key.startsWith(_DEL_PREFIX)) {
        _originalSetItem(_TS_PREFIX + key, new Date().toISOString());
        // Clear any deleted marker since key is being set again
        _originalRemoveItem(_DEL_PREFIX + key);
    }
    // Fire and forget - save to Supabase in background
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE, {
            method: 'POST',
            headers: {
                'apikey': _SB_KEY,
                'Authorization': 'Bearer ' + _SB_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                storage_key: key,
                data_json: value,
                updated_at: new Date().toISOString()
            })
        }).catch(function () { });
    } catch (e) { }
};

// Override localStorage.removeItem to also delete from Supabase
const _originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function (key) {
    _originalRemoveItem(key);
    // Also remove the timestamp tracking key and mark as deleted
    if (!key.startsWith(_TS_PREFIX) && !key.startsWith(_DEL_PREFIX)) {
        _originalRemoveItem(_TS_PREFIX + key);
        // Mark this key as locally deleted so hydrate won't re-insert it from Supabase
        _originalSetItem(_DEL_PREFIX + key, new Date().toISOString());
    }
    if (_shouldSkip(key)) return;
    try {
        fetch(_SB_URL + '/rest/v1/' + _SB_TABLE + '?storage_key=eq.' + encodeURIComponent(key), {
            method: 'DELETE',
            headers: { 'apikey': _SB_KEY, 'Authorization': 'Bearer ' + _SB_KEY }
        }).catch(function () { });
    } catch (e) { }
};

// Hydrate localStorage from Supabase SYNCHRONOUSLY
// This ensures data is available before page scripts run
// IMPORTANT: We compare timestamps to avoid overwriting newer local data
// (this happens when admin saves → async POST not yet complete → refresh → old Supabase data loads)
var _sbRecordCount = 0;
var _localNewerKeys = []; // track keys where local is newer, need re-push
(function _hydrateSync() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _SB_URL + '/rest/v1/' + _SB_TABLE + '?select=storage_key,data_json,updated_at&limit=1000', false);
        xhr.setRequestHeader('apikey', _SB_KEY);
        xhr.setRequestHeader('Authorization', 'Bearer ' + _SB_KEY);
        xhr.send(null);
        if (xhr.status === 200) {
            var rows = JSON.parse(xhr.responseText);
            _sbRecordCount = rows.length;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].storage_key && rows[i].data_json !== null && rows[i].data_json !== undefined) {
                    // Check if this key was locally deleted — don't re-insert it
                    var delMarker = localStorage.getItem(_DEL_PREFIX + rows[i].storage_key);
                    if (delMarker) {
                        // Key was deleted locally; check if deletion is newer than Supabase data
                        var delTime = new Date(delMarker).getTime();
                        var sbDelTime = new Date(rows[i].updated_at).getTime();
                        if (delTime >= sbDelTime) {
                            continue; // skip this row, local deletion is newer
                        } else {
                            // Supabase data is newer than delete — remove the delete marker
                            _originalRemoveItem(_DEL_PREFIX + rows[i].storage_key);
                        }
                    }

                    var existingLocal = localStorage.getItem(rows[i].storage_key);
                    var useSupabase = true;

                    if (existingLocal) {
                        // Method 1: Check __ts_ timestamp (works for ALL data types)
                        var localTs = localStorage.getItem(_TS_PREFIX + rows[i].storage_key);
                        if (localTs && rows[i].updated_at) {
                            var localTsTime = new Date(localTs).getTime();
                            var sbTime = new Date(rows[i].updated_at).getTime();
                            if (localTsTime >= sbTime) {
                                useSupabase = false;
                                _localNewerKeys.push(rows[i].storage_key);
                            }
                        }

                        // Method 2: Fallback - check savedAt inside JSON (legacy support)
                        if (useSupabase && !localTs) {
                            try {
                                var localObj = JSON.parse(existingLocal);
                                if (localObj.savedAt && rows[i].updated_at) {
                                    var localTime = new Date(localObj.savedAt).getTime();
                                    var sbTime2 = new Date(rows[i].updated_at).getTime();
                                    if (localTime >= sbTime2) {
                                        useSupabase = false;
                                        _localNewerKeys.push(rows[i].storage_key);
                                    }
                                }
                            } catch (e) { /* can't parse, use Supabase */ }
                        }
                    }

                    if (useSupabase) {
                        _originalSetItem(rows[i].storage_key, rows[i].data_json);
                    }
                }
            }
            console.log('Supabase sync: loaded ' + rows.length + ' records' +
                (_localNewerKeys.length > 0 ? ' (' + _localNewerKeys.length + ' kept local - newer)' : ''));
        }
    } catch (e) {
        console.warn('Supabase hydrate failed (will use localStorage):', e.message);
    }
})();

// Re-push any local-newer keys to Supabase (ensure eventual consistency)
if (_localNewerKeys.length > 0) {
    setTimeout(function () {
        _localNewerKeys.forEach(function (key) {
            var val = localStorage.getItem(key);
            if (val) {
                fetch(_SB_URL + '/rest/v1/' + _SB_TABLE, {
                    method: 'POST',
                    headers: {
                        'apikey': _SB_KEY,
                        'Authorization': 'Bearer ' + _SB_KEY,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify({
                        storage_key: key,
                        data_json: val,
                        updated_at: new Date().toISOString()
                    })
                }).catch(function () { });
            }
        });
        console.log('Re-pushed ' + _localNewerKeys.length + ' local-newer keys to Supabase');
    }, 2000);
}


// Push ALL localStorage data to Supabase (for first-time sync)
function syncAllToCloud() {
    var count = 0;
    var keys = Object.keys(localStorage);
    var batch = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (_shouldSkip(key)) continue;
        batch.push({
            storage_key: key,
            data_json: localStorage.getItem(key),
            updated_at: new Date().toISOString()
        });
        count++;
    }
    if (batch.length === 0) {
        console.log('syncAllToCloud: nothing to sync');
        return Promise.resolve(0);
    }
    // Send in chunks of 50
    var promises = [];
    for (var j = 0; j < batch.length; j += 50) {
        var chunk = batch.slice(j, j + 50);
        promises.push(
            fetch(_SB_URL + '/rest/v1/' + _SB_TABLE, {
                method: 'POST',
                headers: {
                    'apikey': _SB_KEY,
                    'Authorization': 'Bearer ' + _SB_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(chunk)
            })
        );
    }
    return Promise.all(promises).then(function () {
        console.log('syncAllToCloud: pushed ' + count + ' records');
        return count;
    });
}

// Auto-sync: if localStorage has more data than Supabase, push it
(function _autoSync() {
    var localKeys = 0;
    for (var i = 0; i < localStorage.length; i++) {
        if (!_shouldSkip(localStorage.key(i))) localKeys++;
    }
    if (localKeys > _sbRecordCount + 2) {
        console.log('Auto-syncing ' + localKeys + ' localStorage keys to Supabase (had ' + _sbRecordCount + ')');
        syncAllToCloud();
    }
})();

// Cleanup stale __del_ and __ts_ markers after 30 seconds
// (by then Supabase DELETE/POST should have completed)
setTimeout(function () {
    var now = Date.now();
    var ONE_HOUR = 60 * 60 * 1000;
    for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k && (k.startsWith(_DEL_PREFIX) || k.startsWith(_TS_PREFIX))) {
            try {
                var ts = new Date(localStorage.getItem(k)).getTime();
                if (now - ts > ONE_HOUR) {
                    _originalRemoveItem(k);
                }
            } catch (e) { }
        }
    }
}, 30000);
