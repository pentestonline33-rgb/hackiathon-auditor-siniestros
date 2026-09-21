(function () {
    // Credenciales locales únicamente para la demostración del HackIAthon.
    // La auditoría de facturas continúa utilizando el backend real n8n + Qwen.
    var DEMO_USERS = [
        {
            email: "admin@auditor.com",
            password: "admin123",
            name: "Administrador",
            role: "Administrador"
        },
        {
            email: "auditor@auditor.com",
            password: "demo1234",
            name: "Auditor",
            role: "Auditor"
        },
        {
            email: "demo@auditor.com",
            password: "demo1234",
            name: "Usuario Demo",
            role: "Demo"
        }
    ];

    var loginScreen = document.getElementById("login-screen");
    var shell = document.getElementById("admin-shell");
    var form = document.getElementById("login-form");
    var errorBox = document.getElementById("login-error");
    var submitBtn = document.getElementById("login-submit");
    var spinner = document.getElementById("login-spinner");
    var logoutBtn = document.getElementById("logout-btn");
    var userNameEl = document.getElementById("user-name");
    var userAvatarEl = document.getElementById("user-avatar");

    function showShell(user) {
        loginScreen.classList.add("hidden");
        shell.classList.remove("hidden");

        if (user && user.name) {
            if (userNameEl) {
                userNameEl.textContent = user.name;
            }

            if (userAvatarEl) {
                userAvatarEl.textContent =
                    user.name.charAt(0).toUpperCase();
            }
        }
    }

    function showLogin() {
        shell.classList.add("hidden");
        loginScreen.classList.remove("hidden");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var token;
        var userRaw;
        var user;

        try {
            token = localStorage.getItem("auditor-ia-token");
            userRaw = localStorage.getItem("auditor-ia-user");
        } catch (e) {}

        if (token) {
            try {
                user = userRaw ? JSON.parse(userRaw) : null;
            } catch (e) {}

            showShell(user);
        } else {
            showLogin();
        }

        // Navegación del sidebar
        var navItems = document.querySelectorAll(".nav-item");
        var panels = document.querySelectorAll(".content-panel");
        var panelTitle = document.getElementById("panel-title");

        navItems.forEach(function (btn) {
            btn.addEventListener("click", function () {
                navItems.forEach(function (b) {
                    b.classList.remove("active");
                });

                btn.classList.add("active");

                var target = btn.getAttribute("data-panel");

                panels.forEach(function (p) {
                    p.classList.toggle(
                        "hidden",
                        p.id !== "panel-" + target
                    );
                });

                if (panelTitle) {
                    panelTitle.textContent = btn.textContent.trim();
                }
            });
        });

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                try {
                    localStorage.removeItem("auditor-ia-token");
                    localStorage.removeItem("auditor-ia-user");
                } catch (e) {}

                showLogin();
            });
        }
    });

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            errorBox.classList.remove("show");

            var email = document
                .getElementById("login-email")
                .value
                .trim()
                .toLowerCase();

            var password =
                document.getElementById("login-password").value;

            if (!email || !password) {
                errorBox.textContent =
                    "Completa correo y contraseña.";

                errorBox.classList.add("show");
                return;
            }

            submitBtn.disabled = true;

            if (spinner) {
                spinner.classList.remove("hidden");
            }

            // Pequeña espera para simular el proceso de autenticación.
            setTimeout(function () {
                var account = DEMO_USERS.find(function (user) {
                    return (
                        user.email.toLowerCase() === email &&
                        user.password === password
                    );
                });

                if (!account) {
                    errorBox.textContent =
                        "Correo o contraseña incorrectos.";

                    errorBox.classList.add("show");

                    submitBtn.disabled = false;

                    if (spinner) {
                        spinner.classList.add("hidden");
                    }

                    return;
                }

                var sessionUser = {
                    name: account.name,
                    role: account.role,
                    email: account.email
                };

                try {
                    localStorage.setItem(
                        "auditor-ia-token",
                        "demo-session"
                    );

                    localStorage.setItem(
                        "auditor-ia-user",
                        JSON.stringify(sessionUser)
                    );
                } catch (e) {}

                showShell(sessionUser);

                submitBtn.disabled = false;

                if (spinner) {
                    spinner.classList.add("hidden");
                }
            }, 350);
        });
    }
})();