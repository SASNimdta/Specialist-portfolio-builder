(function () {
    "use strict";

    let deferredInstallPrompt = null;

    function isInstalled() {
        return (
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches ||
            window.navigator.standalone === true
        );
    }

    function getFooterLinks() {
        return document.querySelector(
            ".spb-footer-links"
        );
    }

    function createInstallButton() {
        if (
            document.getElementById(
                "spbInstallApp"
            )
        ) {
            return;
        }

        const footerLinks =
            getFooterLinks();

        if (!footerLinks) {
            return;
        }

        const installButton =
            document.createElement("button");

        installButton.type = "button";
        installButton.id = "spbInstallApp";
        installButton.textContent = "Install App";
        installButton.hidden = true;

        footerLinks.insertBefore(
            installButton,
            footerLinks.firstChild
        );

        installButton.addEventListener(
            "click",
            installApplication
        );
    }

    async function installApplication() {
        if (!deferredInstallPrompt) {
            showInstallationHelp();
            return;
        }

        const installButton =
            document.getElementById(
                "spbInstallApp"
            );

        if (installButton) {
            installButton.disabled = true;
            installButton.textContent =
                "Opening Installer...";
        }

        try {
            deferredInstallPrompt.prompt();

            const choice =
                await deferredInstallPrompt
                    .userChoice;

            deferredInstallPrompt = null;

            if (
                choice.outcome === "accepted"
            ) {
                if (installButton) {
                    installButton.hidden = true;
                }
            } else if (installButton) {
                installButton.disabled = false;
                installButton.textContent =
                    "Install App";
            }
        } catch (error) {
            console.error(
                "App installation failed:",
                error
            );

            if (installButton) {
                installButton.disabled = false;
                installButton.textContent =
                    "Install App";
            }

            showInstallationHelp();
        }
    }

    function showInstallationHelp() {
        if (isInstalled()) {
            window.alert(
                "The Specialist Portfolio Builder " +
                "is already installed on this device."
            );

            return;
        }

        const isAppleMobile =
            /iphone|ipad|ipod/i.test(
                navigator.userAgent
            );

        if (isAppleMobile) {
            window.alert(
                "To install the Portfolio Builder:\n\n" +
                "1. Open this page in Safari.\n" +
                "2. Select the Share button.\n" +
                "3. Select Add to Home Screen.\n" +
                "4. Turn on Open as Web App.\n" +
                "5. Select Add."
            );

            return;
        }

        window.alert(
            "The browser has not made installation " +
            "available yet.\n\n" +
            "In Microsoft Edge, open the browser menu, " +
            "select Apps, then select Install this site " +
            "as an app.\n\n" +
            "If the app is already installed, open it " +
            "from the Start menu."
        );
    }

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {
            event.preventDefault();

            deferredInstallPrompt = event;

            createInstallButton();

            const installButton =
                document.getElementById(
                    "spbInstallApp"
                );

            if (
                installButton &&
                !isInstalled()
            ) {
                installButton.hidden = false;
                installButton.disabled = false;
                installButton.textContent =
                    "Install App";
            }
        }
    );

    window.addEventListener(
        "appinstalled",
        function () {
            deferredInstallPrompt = null;

            const installButton =
                document.getElementById(
                    "spbInstallApp"
                );

            if (installButton) {
                installButton.hidden = true;
            }
        }
    );

    function initialiseInstallButton() {
        createInstallButton();

        const installButton =
            document.getElementById(
                "spbInstallApp"
            );

        if (
            installButton &&
            isInstalled()
        ) {
            installButton.hidden = true;
        }
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseInstallButton,
            {
                once: true
            }
        );
    } else {
        initialiseInstallButton();
    }
})();