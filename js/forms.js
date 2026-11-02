/* ==========================================================================
   Community Food Banks — forms.js
   Client-side validation, error handling and processing for the Enquiry
   and Contact forms. Author: ST10528288
   ========================================================================== */
(function () {
    'use strict';

    /* The recipient for the Contact page email is stated here in the code. */
    var CONTACT_RECIPIENT = 'info@communityfoodbanks.org';

    function el(tag, attrs, text) {
        var n = document.createElement(tag);
        if (attrs) { Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); }); }
        if (text !== undefined) { n.textContent = text; }
        return n;
    }
    function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

    /* ---------- Validators: each returns an error message, or '' when valid ---------- */
    var rules = {
        name: function (v) {
            v = v.trim();
            if (!v) { return 'Please enter your full name.'; }
            if (v.length < 2 || v.length > 60) { return 'Your name must be between 2 and 60 characters.'; }
            if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F\s'\-\.]*$/.test(v)) { return 'Names may only contain letters, spaces, apostrophes and hyphens.'; }
            return '';
        },
        email: function (v) {
            v = v.trim();
            if (!v) { return 'Please enter your email address.'; }
            if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return 'Enter a valid email address, for example name@example.com.'; }
            return '';
        },
        phoneRequired: function (v) {
            if (!v.trim()) { return 'Please enter your phone number.'; }
            return rules.phoneOptional(v);
        },
        phoneOptional: function (v) {
            v = v.replace(/[\s\-()]/g, '');
            if (!v) { return ''; }
            if (!/^(\+27|0)[1-9][0-9]{8}$/.test(v)) { return 'Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.'; }
            return '';
        },
        select: function (v) { return v ? '' : 'Please choose an option from the list.'; },
        quantity: function (v) {
            if (v === '') { return 'Please enter a number.'; }
            var n = Number(v);
            if (!Number.isInteger(n) || n < 1 || n > 500) { return 'Enter a whole number between 1 and 500.'; }
            return '';
        },
        futureDate: function (v) {
            if (!v) { return 'Please choose a preferred start date.'; }
            var d = new Date(v + 'T00:00:00');
            var today = new Date(); today.setHours(0, 0, 0, 0);
            if (isNaN(d.getTime())) { return 'Enter a valid date.'; }
            if (d < today) { return 'The date cannot be in the past.'; }
            var max = new Date(today); max.setFullYear(max.getFullYear() + 2);
            if (d > max) { return 'Please choose a date within the next two years.'; }
            return '';
        },
        subject: function (v) {
            v = v.trim();
            if (!v) { return 'Please enter a subject.'; }
            if (v.length < 5 || v.length > 100) { return 'The subject must be between 5 and 100 characters.'; }
            return '';
        },
        checked: function (checked) { return checked ? '' : 'You need to tick this box to continue.'; }
    };

    function setError(field, message) {
        var err = document.getElementById(field.id + '-error');
        if (err) { err.textContent = message; }
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        var wrap = field.closest('.form-field');
        if (wrap) { wrap.classList.toggle('has-error', !!message); wrap.classList.toggle('is-valid', !message && !!field.value); }
        return !message;
    }

    /* Wire up a form: config = [{id, rule(valueOrChecked), optional, ...}] */
    function makeValidator(form, config) {
        function check(item) {
            var field = document.getElementById(item.id);
            if (!field || field.closest('[hidden]')) { return true; }   // skip fields that are hidden
            var value = field.type === 'checkbox' ? field.checked : field.value;
            return setError(field, item.rule(value));
        }
        config.forEach(function (item) {
            var field = document.getElementById(item.id);
            if (!field) { return; }
            var evt = (field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'date') ? 'change' : 'blur';
            field.addEventListener(evt, function () { check(item); });
            // once a field has shown an error, re-check live as the user fixes it
            field.addEventListener('input', function () {
                if (field.getAttribute('aria-invalid') === 'true') { check(item); }
            });
        });
        return function validateAll() {
            var firstBad = null;
            config.forEach(function (item) {
                if (!check(item) && !firstBad) { firstBad = document.getElementById(item.id); }
            });
            if (firstBad) { firstBad.focus(); }
            return !firstBad;
        };
    }

    function charCounter(textarea, counter, max) {
        function update() {
            var left = max - textarea.value.length;
            counter.textContent = left + ' characters remaining';
            counter.classList.toggle('is-low', left < 30);
        }
        textarea.addEventListener('input', update);
        update();
    }

    function isBot(form) {                 // honeypot: real people never fill this field
        var trap = form.querySelector('.hp-field input');
        return trap && trap.value.trim() !== '';
    }

    /* ======================================================================
       ENQUIRY FORM
       ====================================================================== */
    function initEnquiry() {
        var form = document.getElementById('enquiry-form');
        if (!form) { return; }

        var typeSel = document.getElementById('enquiryType');
        var progSel = document.getElementById('programme');
        var qtyLabel = document.getElementById('quantity-label');
        var durationWrap = document.getElementById('duration-wrap');
        var availWrap = document.getElementById('availability-wrap');
        var orgWrap = document.getElementById('org-wrap');
        var result = document.getElementById('enquiry-result');
        var dateInput = document.getElementById('startDate');
        var programmes = window.CFB_PROGRAMMES || [];

        // today's date as the minimum selectable date
        var t = new Date();
        dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');

        function fillProgrammes() {
            var type = typeSel.value;
            clear(progSel);
            progSel.appendChild(el('option', { value: '' }, 'Select a programme'));
            programmes.filter(function (p) {
                if (type === 'volunteer') { return p.category === 'Volunteering'; }
                if (type === 'sponsor') { return p.costPerUnit > 0; }
                return true;
            }).forEach(function (p) { progSel.appendChild(el('option', { value: p.id }, p.title)); });
        }
        function toggleFields() {
            var type = typeSel.value;
            var vol = type === 'volunteer';
            availWrap.hidden = !vol;
            durationWrap.hidden = vol || !type;
            orgWrap.hidden = type !== 'sponsor';
            qtyLabel.textContent = vol ? 'Number of volunteers' : 'Number of units (parcels, loads or months)';
        }
        typeSel.addEventListener('change', function () { fillProgrammes(); toggleFields(); });
        fillProgrammes(); toggleFields();

        // Pre-select a programme when arriving from the Services page (?programme=id)
        var wanted = new URLSearchParams(window.location.search).get('programme');
        if (wanted) {
            var match = programmes.filter(function (p) { return p.id === wanted; })[0];
            if (match) {
                typeSel.value = match.category === 'Volunteering' ? 'volunteer' : 'sponsor';
                fillProgrammes(); toggleFields();
                progSel.value = match.id;
            }
        }

        charCounter(document.getElementById('comments'), document.getElementById('comments-count'), 500);

        var validate = makeValidator(form, [
            { id: 'fullName', rule: rules.name },
            { id: 'email', rule: rules.email },
            { id: 'phone', rule: rules.phoneRequired },
            { id: 'enquiryType', rule: rules.select },
            { id: 'programme', rule: rules.select },
            { id: 'quantity', rule: rules.quantity },
            { id: 'duration', rule: rules.select },
            { id: 'startDate', rule: rules.futureDate },
            { id: 'comments', rule: function (v) { return v.length > 500 ? 'Comments must be 500 characters or fewer.' : ''; } },
            { id: 'consent', rule: rules.checked }
        ]);

        // availability checkboxes: volunteers must pick at least one
        function availabilityOk() {
            var err = document.getElementById('availability-error');
            if (availWrap.hidden) { err.textContent = ''; return true; }
            var any = form.querySelectorAll('input[name="availability"]:checked').length > 0;
            err.textContent = any ? '' : 'Please choose at least one time that suits you.';
            return any;
        }
        form.querySelectorAll('input[name="availability"]').forEach(function (c) { c.addEventListener('change', availabilityOk); });

        /* AJAX: fetch the pricing/orientation data asynchronously (no page reload).
           Falls back to the embedded copy if the file cannot be fetched (e.g. opened from disk). */
        function loadPricing() {
            return fetch('data/pricing.json', { headers: { 'Accept': 'application/json' } })
                .then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r.json(); })
                .catch(function () { return window.CFB_PRICING; });
        }

        function rand(n) { return 'R' + n.toLocaleString('en-ZA'); }

        function showResponse(info, pricing) {
            clear(result);
            result.hidden = false;
            result.appendChild(el('h2', null, 'Thank you, ' + info.fullName.trim().split(/\s+/)[0] + '!'));
            result.appendChild(el('p', null, 'We have received your enquiry about \u201C' + info.prog.title + '\u201D.'));

            var dl = el('dl', { 'class': 'result__facts' });
            function row(k, v) { var d = el('div'); d.appendChild(el('dt', null, k)); d.appendChild(el('dd', null, v)); dl.appendChild(d); }

            if (info.type === 'volunteer') {
                row('Volunteers', String(info.qty));
                row('Availability', info.prog.availability);
                row('Your preferred times', info.avail.join(', '));
                row('Orientation session', info.avail.map(function (a) { return pricing.orientation[a]; }).join(' or '));
                row('Preferred start', info.dateText);
                row('Places', info.prog.spots);
                result.appendChild(dl);
                result.appendChild(el('p', null, 'There is no cost to volunteer. Please bring closed shoes and an ID document to your orientation. A coordinator will confirm by email at ' + info.email + '.'));
            } else {
                var months = Number(info.months);
                var subtotal = info.qty * info.prog.costPerUnit * (info.prog.unit === 'month' ? 1 : months);
                var rate = 0;
                pricing.discounts.forEach(function (d) { if (months >= d.minMonths) { rate = Math.max(rate, d.rate); } });
                var discount = Math.round(subtotal * rate);
                row('Programme cost', rand(info.prog.costPerUnit) + ' per ' + info.prog.unit);
                row('Quantity', info.prog.unit === 'month' ? info.qty + ' month(s) of partnership' : info.qty + ' ' + info.prog.unit + '(s) per month for ' + months + ' month(s)');
                row('Subtotal', rand(subtotal));
                row('Long-term discount', rate ? '\u2212' + rand(discount) + ' (' + Math.round(rate * 100) + '%)' : 'None (6+ months earns 5%, 12 months earns 10%)');
                row('Estimated total', rand(subtotal - discount));
                row('Availability', info.prog.availability);
                row('Preferred start', info.dateText);
                result.appendChild(dl);
                result.appendChild(el('p', null, 'This is an estimate based on illustrative rates. A coordinator will contact you on ' + info.phone + ' to confirm details and arrange payment.'));
            }
            var again = el('button', { type: 'button', 'class': 'btn btn--outline' }, 'Make another enquiry');
            again.addEventListener('click', function () {
                result.hidden = true; form.hidden = false; form.reset(); fillProgrammes(); toggleFields();
                form.querySelectorAll('.form-field').forEach(function (f) { f.classList.remove('has-error', 'is-valid'); });
                document.getElementById('fullName').focus();
            });
            result.appendChild(again);
            form.hidden = true;
            result.setAttribute('tabindex', '-1');
            result.focus();
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var okA = validate();
            var okB = availabilityOk();
            if (!okA || !okB) { return; }
            if (isBot(form)) { return; }     // silently ignore bot submissions

            var submit = form.querySelector('button[type="submit"]');
            submit.disabled = true; submit.textContent = 'Processing\u2026';

            var info = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                type: typeSel.value,
                prog: programmes.filter(function (p) { return p.id === progSel.value; })[0],
                qty: Number(document.getElementById('quantity').value),
                months: document.getElementById('duration').value || '1',
                avail: Array.prototype.map.call(form.querySelectorAll('input[name="availability"]:checked'), function (c) { return c.value; }),
                dateText: new Date(dateInput.value + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            loadPricing().then(function (pricing) {
                showResponse(info, pricing);
            }).finally(function () {
                submit.disabled = false; submit.textContent = 'Submit enquiry';
            });
        });
    }

    /* ======================================================================
       CONTACT FORM — validated, then compiled into an email (mailto:)
       ====================================================================== */
    function initContact() {
        var form = document.getElementById('contact-form');
        if (!form) { return; }
        var preview = document.getElementById('email-preview');

        charCounter(document.getElementById('message'), document.getElementById('message-count'), 1000);

        var validate = makeValidator(form, [
            { id: 'cName', rule: rules.name },
            { id: 'cEmail', rule: rules.email },
            { id: 'cPhone', rule: rules.phoneOptional },
            { id: 'messageType', rule: rules.select },
            { id: 'subject', rule: rules.subject },
            { id: 'message', rule: function (v) {
                v = v.trim();
                if (!v) { return 'Please type your message.'; }
                if (v.length < 10) { return 'Your message must be at least 10 characters.'; }
                if (v.length > 1000) { return 'Your message must be 1000 characters or fewer.'; }
                return '';
            } }
        ]);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate() || isBot(form)) { return; }

            var name = document.getElementById('cName').value.trim();
            var from = document.getElementById('cEmail').value.trim();
            var phone = document.getElementById('cPhone').value.trim();
            var type = document.getElementById('messageType').value;
            var subject = '[' + type + '] ' + document.getElementById('subject').value.trim();
            var body = 'Hello Community Food Banks,\n\n' +
                document.getElementById('message').value.trim() + '\n\n' +
                '--\nName: ' + name + '\nEmail: ' + from + '\nPhone: ' + (phone || 'Not provided') + '\nMessage type: ' + type;

            clear(preview);
            preview.hidden = false;
            preview.appendChild(el('h2', null, 'Your email is ready'));
            preview.appendChild(el('p', null, 'Check the message below, then choose \u201CSend email\u201D to open it in your email app.'));
            var box = el('div', { 'class': 'email-box' });
            [['To', CONTACT_RECIPIENT], ['Subject', subject]].forEach(function (r) {
                var p = el('p'); p.appendChild(el('strong', null, r[0] + ': ')); p.appendChild(document.createTextNode(r[1])); box.appendChild(p);
            });
            box.appendChild(el('pre', null, body));
            preview.appendChild(box);

            var actions = el('div', { 'class': 'form-actions' });
            var send = el('a', { 'class': 'btn', href: 'mailto:' + CONTACT_RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) }, 'Send email');
            var copy = el('button', { type: 'button', 'class': 'btn btn--outline' }, 'Copy message');
            var edit = el('button', { type: 'button', 'class': 'btn btn--outline' }, 'Edit message');
            var note = el('p', { 'class': 'form-note', role: 'status' });
            copy.addEventListener('click', function () {
                var text = 'To: ' + CONTACT_RECIPIENT + '\nSubject: ' + subject + '\n\n' + body;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(function () { note.textContent = 'Copied to clipboard.'; },
                        function () { note.textContent = 'Could not copy automatically. Please select the text and copy it.'; });
                } else { note.textContent = 'Copying is not supported in this browser. Please select the text and copy it.'; }
            });
            edit.addEventListener('click', function () { preview.hidden = true; form.hidden = false; document.getElementById('message').focus(); });
            [send, copy, edit].forEach(function (b) { actions.appendChild(b); });
            preview.appendChild(actions);
            preview.appendChild(note);
            form.hidden = true;
            preview.setAttribute('tabindex', '-1');
            preview.focus();
        });
    }

    document.addEventListener('DOMContentLoaded', function () { initEnquiry(); initContact(); });
}());
