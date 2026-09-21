(function () {
    var API_URL = "https://apart-updating-within-instrumentation.trycloudflare.com/";

    var loginScreen = document.getElementById('login-screen');
    var shell = document.getElementById('admin-shell');
    var form = document.getElementById('login-form');
    var errorBox = document.getElementById('login-error');
    var submitBtn = document.getElementById('login-submit');
    var spinner = document.getElementById('login-spinner');
    var logoutBtn = document.getElementById('logout-btn');
    var userNameEl = document.getElementById('user-name');
    var userAvatarEl = document.getElementById('user-avatar');

    function showShell(user) {
        loginScreen.classList.add('hidden');
        shell.classList.remove('hidden');
        if (user && user.name) {
            userNameEl.textContent = user.name;
            userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
        }
    }

    function showLogin() {
        shell.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var token, userRaw, user;

        try {
            token = localStorage.getItem('auditor-ia-token');
            userRaw = localStorage.getItem('auditor-ia-user');
        } catch (e) {}

        if (token) {
            try { user = userRaw ? JSON.parse(userRaw) : null; } catch (e) {}
            showShell(user);
        } else {
            showLogin();
        }

        // Navegación del sidebar
        var navItems = document.querySelectorAll('.nav-item');
        var panels = document.querySelectorAll('.content-panel');
        var panelTitle = document.getElementById('panel-title');

        navItems.forEach(function (btn) {
            btn.addEventListener('click', function () {
                navItems.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var target = btn.getAttribute('data-panel');
                panels.forEach(function (p) {
                    p.classList.toggle('hidden', p.id !== 'panel-' + target);
                });

                if (panelTitle) panelTitle.textContent = btn.textContent.trim();
            });
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                try {
                    localStorage.removeItem('auditor-ia-token');
                    localStorage.removeItem('auditor-ia-user');
                } catch (e) {}
                showLogin();
            });
        }
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorBox.classList.remove('show');

            var email = document.getElementById('login-email').value.trim();
            var password = document.getElementById('login-password').value;

            if (!email || !password) {
                errorBox.textContent = 'Completa correo y contraseña.';
                errorBox.classList.add('show');
                return;
            }

            submitBtn.disabled = true;
            if (spinner) spinner.classList.remove('hidden');

            fetch(API_URL + 'login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
                .then(function (res) {
                    if (!res.ok) {
                        return res.json().catch(function () { return {}; }).then(function (data) {
                            throw new Error((data && data.message) || 'Correo o contraseña incorrectos.');
                        });
                    }
                    return res.json().catch(function () { return {}; });
                })
                .then(function (data) {
                    var token = data.token || data.access_token || 'session';
                    var user = data.user || {
                        name: data.name || email.split('@')[0],
                        role: data.role || 'Administrador'
                    };

                    try {
                        localStorage.setItem('auditor-ia-token', token);
                        localStorage.setItem('auditor-ia-user', JSON.stringify(user));
                    } catch (e) {}

                    showShell(user);
                })
                .catch(function (err) {
                    errorBox.textContent = err.message || 'No se pudo conectar con el servidor. Intenta de nuevo.';
                    errorBox.classList.add('show');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    if (spinner) spinner.classList.add('hidden');
                });
        });
    }
})();
