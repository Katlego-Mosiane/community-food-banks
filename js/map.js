/* ==========================================================================
   Community Food Banks — map.js
   Interactive Leaflet + OpenStreetMap map for the Contact page.
   Author: ST10528288
   ========================================================================== */
(function () {
    'use strict';
    var box = document.getElementById('map');
    if (!box) { return; }
    if (typeof L === 'undefined') {
        box.textContent = 'The interactive map could not be loaded. Please check your internet connection or use the directions link below.';
        box.classList.add('map-fallback');
        return;
    }

    var office = [-26.122574, 27.964046];   // 11 Duchesses Avenue, Windsor West (from the original Google embed)
    var map = L.map('map', { scrollWheelZoom: false }).setView(office, 15);

    var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap (CC-BY-SA)'
    });
    L.control.layers({ 'Street map': street, 'Terrain map': topo }).addTo(map);
    L.control.scale({ imperial: false }).addTo(map);

    // build the pop-up with DOM methods rather than HTML strings
    var pop = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = 'Community Food Banks';
    var a = document.createElement('p'); a.textContent = '11 Duchesses Avenue, Windsor West, Johannesburg, 2194';
    var link = document.createElement('a');
    link.href = 'https://www.openstreetmap.org/directions?to=' + office[0] + '%2C' + office[1];
    link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Get directions';
    pop.appendChild(h); pop.appendChild(a); pop.appendChild(link);

    L.marker(office, { title: 'Community Food Banks' }).addTo(map).bindPopup(pop).openPopup();
    L.circle(office, { radius: 600, color: '#3f7d3f', fillColor: '#87af8a', fillOpacity: 0.2 }).addTo(map);

    // scroll-wheel zoom only after the map has been clicked, so the page still scrolls normally
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

    // "Reset view" and "Find my location" buttons
    var reset = document.getElementById('map-reset');
    if (reset) { reset.addEventListener('click', function () { map.setView(office, 15); }); }
    var locate = document.getElementById('map-locate');
    var status = document.getElementById('map-status');
    if (locate) {
        locate.addEventListener('click', function () {
            if (!navigator.geolocation) { status.textContent = 'Location is not supported by this browser.'; return; }
            status.textContent = 'Finding your location\u2026';
            navigator.geolocation.getCurrentPosition(function (pos) {
                var me = [pos.coords.latitude, pos.coords.longitude];
                L.circleMarker(me, { radius: 8, color: '#1d4ed8', fillOpacity: 0.8 }).addTo(map).bindPopup('You are here');
                map.fitBounds([office, me], { padding: [40, 40] });
                status.textContent = 'Showing your location and our office.';
            }, function () { status.textContent = 'We could not get your location. You can still use the Get directions link.'; });
        });
    }
}());
