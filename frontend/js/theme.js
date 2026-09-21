(function () {
    var root = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        try { localStorage.setItem('auditor-ia-theme', theme); } catch (e) {}
        updateToggleUI(theme);
    }

    function updateToggleUI(theme) {
        var pairs = [
            ['theme-btn-dark', 'theme-btn-light'],
            ['theme-btn-dark-shell', 'theme-btn-light-shell']
        ];
        pairs.forEach(function (pair) {
            var btnDark = document.getElementById(pair[0]);
            var btnLight = document.getElementById(pair[1]);
            if (!btnDark || !btnLight) return;
            btnDark.classList.toggle('active', theme === 'dark');
            btnLight.classList.toggle('active', theme !== 'dark');
        });
    }

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateToggleUI(currentTheme());

        [
            ['theme-btn-dark', 'dark'],
            ['theme-btn-light', 'light'],
            ['theme-btn-dark-shell', 'dark'],
            ['theme-btn-light-shell', 'light']
        ].forEach(function (pair) {
            var btn = document.getElementById(pair[0]);
            if (btn) btn.addEventListener('click', function () { applyTheme(pair[1]); });
        });
    });
})();
