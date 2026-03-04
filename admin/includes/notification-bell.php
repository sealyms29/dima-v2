<!-- Notification Bell — shared include for admin pages -->
<style>
.notif-bell-wrap{position:relative;display:inline-block;margin-right:12px;vertical-align:middle}
.notif-bell-btn{background:none;border:none;cursor:pointer;padding:6px;position:relative;color:#555;transition:color .2s}
.notif-bell-btn:hover{color:#d4af37}
.notif-bell-btn svg{width:22px;height:22px;display:block}
.notif-badge{position:absolute;top:0;right:0;background:#dc3545;color:#fff;font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;line-height:1;pointer-events:none}
.notif-badge.hidden{display:none}
.notif-dropdown{display:none;position:absolute;right:0;top:calc(100% + 8px);width:380px;max-height:480px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:9999;overflow:hidden}
.notif-dropdown.open{display:flex;flex-direction:column}
.notif-dropdown-hdr{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;font-weight:600;font-size:15px;color:#333}
.notif-mark-all{background:none;border:none;color:#007bff;cursor:pointer;font-size:13px;padding:0}
.notif-mark-all:hover{text-decoration:underline}
.notif-list{overflow-y:auto;flex:1;max-height:400px}
.notif-item{display:flex;gap:10px;padding:12px 16px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background .15s}
.notif-item:hover{background:#f7f7f7}
.notif-item.unread{background:#fffbeb}
.notif-item.unread:hover{background:#fff3cd}
.notif-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.notif-icon.quotation{background:#e8f5e9;color:#2e7d32}
.notif-icon.contact{background:#e3f2fd;color:#1565c0}
.notif-icon.complaint{background:#fce4ec;color:#c62828}
.notif-icon.appeal{background:#fff3e0;color:#e65100}
.notif-body{flex:1;min-width:0}
.notif-msg{font-size:13px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.notif-meta{font-size:11px;color:#999;margin-top:2px}
.notif-empty{padding:40px 16px;text-align:center;color:#999;font-size:14px}
.notif-read-dot{width:8px;height:8px;border-radius:50%;background:#007bff;flex-shrink:0;align-self:center}
.notif-read-dot.read{background:transparent}
</style>

<div class="notif-bell-wrap" id="notifBellWrap">
    <button class="notif-bell-btn" id="notifBellBtn" title="Notifications" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="notif-badge hidden" id="notifBadge">0</span>
    </button>
    <div class="notif-dropdown" id="notifDropdown">
        <div class="notif-dropdown-hdr">
            <span>Notifications</span>
            <button class="notif-mark-all" id="notifMarkAll" type="button">Mark all as read</button>
        </div>
        <div class="notif-list" id="notifList">
            <div class="notif-empty">No notifications</div>
        </div>
    </div>
</div>

<script>
(function(){
    var BASE = '<?= BASE_PATH ?>';
    var badge = document.getElementById('notifBadge');
    var dropdown = document.getElementById('notifDropdown');
    var list = document.getElementById('notifList');
    var bellBtn = document.getElementById('notifBellBtn');
    var markAllBtn = document.getElementById('notifMarkAll');
    var isOpen = false;

    var typeIcons = {quotation:'📋',contact:'✉️',complaint:'⚠️',appeal:'📨'};

    function timeAgo(dateStr){
        var diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if(diff < 60) return 'Just now';
        if(diff < 3600) return Math.floor(diff/60) + 'm ago';
        if(diff < 86400) return Math.floor(diff/3600) + 'h ago';
        return Math.floor(diff/86400) + 'd ago';
    }

    function fetchCount(){
        fetch(BASE + '/api/admin-notifications-unread-count.php', {credentials:'same-origin'})
            .then(function(r){return r.json()})
            .then(function(j){
                if(j.success){
                    var c = j.data.count;
                    badge.textContent = c;
                    badge.classList.toggle('hidden', c === 0);
                }
            }).catch(function(){});
    }

    function fetchList(){
        fetch(BASE + '/api/admin-notifications.php?limit=10', {credentials:'same-origin'})
            .then(function(r){return r.json()})
            .then(function(j){
                if(!j.success || !j.data || j.data.length === 0){
                    list.innerHTML = '<div class="notif-empty">No notifications</div>';
                    return;
                }
                var html = '';
                j.data.forEach(function(n){
                    var unread = !n.read_at;
                    var icon = typeIcons[n.type] || '📋';
                    var typeClass = n.type || 'quotation';
                    html += '<div class="notif-item ' + (unread?'unread':'') + '" data-id="'+n.id+'" data-type="'+n.type+'" data-sid="'+(n.submission_id||'')+'">';
                    html += '<div class="notif-icon '+typeClass+'">'+icon+'</div>';
                    html += '<div class="notif-body">';
                    html += '<div class="notif-msg">' + escHtml(n.message || '') + '</div>';
                    html += '<div class="notif-meta">';
                    if(n.email) html += escHtml(n.email) + ' &middot; ';
                    html += timeAgo(n.created_at);
                    html += '</div></div>';
                    html += '<div class="notif-read-dot ' + (unread?'':'read') + '"></div>';
                    html += '</div>';
                });
                list.innerHTML = html;

                // Click handlers for each item
                list.querySelectorAll('.notif-item').forEach(function(el){
                    el.addEventListener('click', function(){
                        var nid = el.getAttribute('data-id');
                        markRead(nid, el);
                    });
                });
            }).catch(function(){});
    }

    function escHtml(s){
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(s));
        return d.innerHTML;
    }

    function markRead(nid, el){
        fetch(BASE + '/api/admin-notifications-read.php', {
            method:'POST',
            credentials:'same-origin',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({id: parseInt(nid)})
        }).then(function(r){return r.json()})
        .then(function(j){
            if(j.success && el){
                el.classList.remove('unread');
                var dot = el.querySelector('.notif-read-dot');
                if(dot) dot.classList.add('read');
                fetchCount();
            }
        }).catch(function(){});
    }

    // Toggle dropdown
    bellBtn.addEventListener('click', function(e){
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.classList.toggle('open', isOpen);
        if(isOpen) fetchList();
    });

    // Close on outside click
    document.addEventListener('click', function(e){
        if(isOpen && !document.getElementById('notifBellWrap').contains(e.target)){
            isOpen = false;
            dropdown.classList.remove('open');
        }
    });

    // Mark all as read
    markAllBtn.addEventListener('click', function(e){
        e.stopPropagation();
        fetch(BASE + '/api/admin-notifications-read-all.php', {
            method:'POST',
            credentials:'same-origin',
            headers:{'Content-Type':'application/json'},
            body: '{}'
        }).then(function(r){return r.json()})
        .then(function(j){
            if(j.success){
                fetchCount();
                fetchList();
            }
        }).catch(function(){});
    });

    // Initial load + polling every 30s
    fetchCount();
    setInterval(fetchCount, 30000);
})();
</script>
