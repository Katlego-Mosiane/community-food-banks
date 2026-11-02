/* ==========================================================================
   Community Food Banks — main.js
   Shared interactivity: scroll reveal, counters, back-to-top, accordion,
   tabs, modal, gallery lightbox, and the searchable programmes list.
   Every feature checks that its elements exist, so one file serves all pages.
   Author: ST10528288
   ========================================================================== */
(function () {
    'use strict';

    document.documentElement.classList.add('js-ready');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Helper: build an element safely (no innerHTML) ---------- */
    function el(tag, attrs, text) {
        var node = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                if (k === 'class') { node.className = attrs[k]; }
                else { node.setAttribute(k, attrs[k]); }
            });
        }
        if (text !== undefined) { node.textContent = text; }
        return node;
    }

    /* ---------- 1. Scroll reveal animation (CSS transition + IntersectionObserver) ---------- */
    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) { return; }
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (i) { i.classList.add('is-visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        items.forEach(function (i) { io.observe(i); });
    }

    /* ---------- 2. Animated impact counters ---------- */
    function initCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) { return; }
        function run(node) {
            var target = parseInt(node.getAttribute('data-count'), 10);
            var suffix = node.getAttribute('data-suffix') || '';
            var plain = node.hasAttribute('data-plain');
            function fmt(n) { return plain ? String(n) : n.toLocaleString('en-ZA'); }
            if (reduceMotion) { node.textContent = fmt(target) + suffix; return; }
            var start = null, duration = 1600;
            function step(ts) {
                if (!start) { start = ts; }
                var p = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                node.textContent = fmt(Math.round(target * eased)) + suffix;
                if (p < 1) { window.requestAnimationFrame(step); }
            }
            window.requestAnimationFrame(step);
        }
        if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { io.observe(c); });
    }

    /* ---------- 3. Back-to-top button (created with DOM manipulation) ---------- */
    function initBackToTop() {
        var btn = el('button', { type: 'button', 'class': 'back-to-top', 'aria-label': 'Back to top' }, '\u2191');
        document.body.appendChild(btn);
        window.addEventListener('scroll', function () {
            btn.classList.toggle('is-shown', window.scrollY > 400);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- 4. Accordion (FAQ) ---------- */
    function initAccordion() {
        document.querySelectorAll('.accordion').forEach(function (acc) {
            var buttons = acc.querySelectorAll('.accordion__trigger');
            buttons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var open = btn.getAttribute('aria-expanded') === 'true';
                    // only one panel open at a time
                    buttons.forEach(function (b) {
                        b.setAttribute('aria-expanded', 'false');
                        document.getElementById(b.getAttribute('aria-controls')).classList.remove('is-open');
                    });
                    if (!open) {
                        btn.setAttribute('aria-expanded', 'true');
                        document.getElementById(btn.getAttribute('aria-controls')).classList.add('is-open');
                    }
                });
            });
        });
    }

    /* ---------- 5. Tabs (Mission / Vision / Values) with arrow-key support ---------- */
    function initTabs() {
        document.querySelectorAll('.tabs').forEach(function (wrap) {
            var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
            function select(tab, focus) {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                    t.setAttribute('tabindex', on ? '0' : '-1');
                    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
                });
                if (focus) { tab.focus(); }
            }
            tabs.forEach(function (tab, i) {
                tab.addEventListener('click', function () { select(tab, false); });
                tab.addEventListener('keydown', function (e) {
                    var next = null;
                    if (e.key === 'ArrowRight') { next = tabs[(i + 1) % tabs.length]; }
                    if (e.key === 'ArrowLeft') { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
                    if (e.key === 'Home') { next = tabs[0]; }
                    if (e.key === 'End') { next = tabs[tabs.length - 1]; }
                    if (next) { e.preventDefault(); select(next, true); }
                });
            });
        });
    }

    /* ---------- 6. Modal dialog (native <dialog>) ---------- */
    function initModal() {
        document.querySelectorAll('[data-modal-open]').forEach(function (opener) {
            var dlg = document.getElementById(opener.getAttribute('data-modal-open'));
            if (!dlg) { return; }
            opener.addEventListener('click', function () {
                if (typeof dlg.showModal === 'function') { dlg.showModal(); }
                else { dlg.setAttribute('open', ''); }
            });
            dlg.querySelectorAll('[data-modal-close]').forEach(function (c) {
                c.addEventListener('click', function () {
                    if (typeof dlg.close === 'function') { dlg.close(); } else { dlg.removeAttribute('open'); }
                });
            });
            // click on the backdrop closes the dialog
            dlg.addEventListener('click', function (e) {
                if (e.target === dlg && typeof dlg.close === 'function') { dlg.close(); }
            });
        });
    }

    /* ---------- 7. Gallery lightbox ---------- */
    function initLightbox() {
        var links = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
        if (!links.length) { return; }

        var overlay = el('div', { 'class': 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Image viewer', hidden: '' });
        var img = el('img', { alt: '' });
        var caption = el('p', { 'class': 'lightbox__caption' });
        var counter = el('p', { 'class': 'lightbox__counter', 'aria-live': 'polite' });
        var closeBtn = el('button', { type: 'button', 'class': 'lightbox__btn lightbox__close', 'aria-label': 'Close image viewer' }, '\u00D7');
        var prevBtn = el('button', { type: 'button', 'class': 'lightbox__btn lightbox__prev', 'aria-label': 'Previous image' }, '\u2039');
        var nextBtn = el('button', { type: 'button', 'class': 'lightbox__btn lightbox__next', 'aria-label': 'Next image' }, '\u203A');
        var figure = el('figure', { 'class': 'lightbox__figure' });
        figure.appendChild(img); figure.appendChild(caption); figure.appendChild(counter);
        [closeBtn, prevBtn, nextBtn, figure].forEach(function (n) { overlay.appendChild(n); });
        document.body.appendChild(overlay);

        var index = 0, lastFocus = null;

        function show(i) {
            index = (i + links.length) % links.length;
            var a = links[index];
            var thumb = a.querySelector('img');
            img.classList.remove('is-loaded');
            img.onload = function () { img.classList.add('is-loaded'); };
            img.src = a.getAttribute('href');
            img.alt = thumb ? thumb.alt : '';
            caption.textContent = a.getAttribute('data-caption') || (thumb ? thumb.alt : '');
            counter.textContent = (index + 1) + ' of ' + links.length;
        }
        function open(i) {
            lastFocus = document.activeElement;
            show(i);
            overlay.hidden = false;
            document.body.classList.add('no-scroll');
            closeBtn.focus();
        }
        function close() {
            overlay.hidden = true;
            document.body.classList.remove('no-scroll');
            img.removeAttribute('src');
            if (lastFocus) { lastFocus.focus(); }
        }

        links.forEach(function (a, i) {
            a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
        });
        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', function () { show(index - 1); });
        nextBtn.addEventListener('click', function () { show(index + 1); });
        overlay.addEventListener('click', function (e) { if (e.target === overlay) { close(); } });
        document.addEventListener('keydown', function (e) {
            if (overlay.hidden) { return; }
            if (e.key === 'Escape') { close(); }
            if (e.key === 'ArrowLeft') { show(index - 1); }
            if (e.key === 'ArrowRight') { show(index + 1); }
            if (e.key === 'Tab') {            // keep keyboard focus inside the viewer
                var f = [closeBtn, prevBtn, nextBtn];
                var pos = f.indexOf(document.activeElement);
                e.preventDefault();
                f[(pos + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
            }
        });
        // basic swipe support for phones
        var startX = null;
        overlay.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
        overlay.addEventListener('touchend', function (e) {
            if (startX === null) { return; }
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); }
            startX = null;
        }, { passive: true });
    }

    /* ---------- 8. Programmes: dynamic content + search / filter / sort ---------- */
    function initProgrammes() {
        var list = document.getElementById('programme-list');
        if (!list || !window.CFB_PROGRAMMES) { return; }
        var search = document.getElementById('programme-search');
        var filter = document.getElementById('programme-filter');
        var sort = document.getElementById('programme-sort');
        var status = document.getElementById('programme-status');
        var data = window.CFB_PROGRAMMES;

        function render(items) {
            while (list.firstChild) { list.removeChild(list.firstChild); }
            if (!items.length) {
                list.appendChild(el('p', { 'class': 'empty-state' }, 'No programmes match your search. Try a different word or clear the filter.'));
            }
            items.forEach(function (p) {
                var card = el('article', { 'class': 'card' });
                card.appendChild(el('span', { 'class': 'badge badge--' + p.category.toLowerCase() }, p.category));
                card.appendChild(el('h3', null, p.title));
                card.appendChild(el('p', null, p.description));
                var dl = el('dl', { 'class': 'card__facts' });
                [['Cost', p.costPerUnit === 0 ? 'Free to join' : 'From R' + p.costPerUnit.toLocaleString('en-ZA') + ' per ' + p.unit],
                 ['Availability', p.availability],
                 ['Places', p.spots],
                 ['Best for', p.audience]].forEach(function (f) {
                    var row = el('div');
                    row.appendChild(el('dt', null, f[0]));
                    row.appendChild(el('dd', null, f[1]));
                    dl.appendChild(row);
                });
                card.appendChild(dl);
                card.appendChild(el('a', { 'class': 'btn btn--small', href: 'Enquiry.html?programme=' + encodeURIComponent(p.id) }, 'Enquire about this'));
                list.appendChild(card);
            });
            status.textContent = items.length + (items.length === 1 ? ' programme found' : ' programmes found');
        }

        function update() {
            var q = search.value.trim().toLowerCase();
            var cat = filter.value;
            var items = data.filter(function (p) {
                var hay = (p.title + ' ' + p.description + ' ' + p.category + ' ' + p.audience + ' ' + p.availability).toLowerCase();
                return (cat === 'all' || p.category === cat) && (!q || hay.indexOf(q) !== -1);
            });
            var s = sort.value;
            items.sort(function (a, b) {
                if (s === 'az') { return a.title.localeCompare(b.title); }
                if (s === 'za') { return b.title.localeCompare(a.title); }
                if (s === 'low') { return a.costPerUnit - b.costPerUnit; }
                if (s === 'high') { return b.costPerUnit - a.costPerUnit; }
                return 0;
            });
            render(items);
        }

        // build the category dropdown from the data itself
        var cats = [];
        data.forEach(function (p) { if (cats.indexOf(p.category) === -1) { cats.push(p.category); } });
        cats.sort().forEach(function (c) { filter.appendChild(el('option', { value: c }, c)); });

        search.addEventListener('input', update);
        filter.addEventListener('change', update);
        sort.addEventListener('change', update);
        document.getElementById('programme-reset').addEventListener('click', function () {
            search.value = ''; filter.value = 'all'; sort.value = 'az'; update(); search.focus();
        });
        update();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initReveal();
        initCounters();
        initBackToTop();
        initAccordion();
        initTabs();
        initModal();
        initLightbox();
        initProgrammes();
    });
}());
