(function () {
    "use strict";

    let deferredInstallPrompt = null;

    function isRunningAsInstalledApp() {
        return (
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches ||
            window.navigator.standalone === true
        );
    }

    function createInstallButton() {
        const existingButton =
            document.getElementById(
                "spbInstallApp"
            );

        if (existingButton) {
            return existingButton;
        }

        const footerLinks =
            document.querySelector(
                ".spb-footer-links"
            );

        if (!footerLinks) {
            return null;
        }

        const installButton =
            document.createElement("button");

        installButton.type = "button";
        installButton.id = "spbInstallApp";
        installButton.textContent =
            "Install App";

        /*
         * Keep the button visible in a normal browser tab.
         * Hide it only when the application is already
         * running in its installed standalone window.
         */
        installButton.hidden =
            isRunningAsInstalledApp();

        footerLinks.insertBefore(
            installButton,
            footerLinks.firstChild
        );

        installButton.addEventListener(
            "click",
            handleInstallClick
        );

        return installButton;
    }

    async function handleInstallClick() {
        if (isRunningAsInstalledApp()) {
            window.alert(
                "The Specialist Portfolio Builder " +
                "is already running as an installed app."
            );

            return;
        }

        if (!deferredInstallPrompt) {
            showInstallInstructions();
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
            await deferredInstallPrompt.prompt();

            const choice =
                await deferredInstallPrompt.userChoice;

            deferredInstallPrompt = null;

            if (
                choice.outcome === "accepted"
            ) {
                if (installButton) {
                    installButton.hidden = true;
                }

                return;
            }

            if (installButton) {
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

            showInstallInstructions();
        }
    }

    function showInstallInstructions() {
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
            "Installation is not currently available " +
            "from this browser page.\n\n" +
            "This may be because the app is already " +
            "installed, the page is being tested on " +
            "localhost, or the browser has not yet " +
            "confirmed that the app is installable.\n\n" +
            "In Microsoft Edge, you can also open " +
            "the three-dot menu, select Apps, then " +
            "select Install this site as an app."
        );
    }

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {
            event.preventDefault();

            deferredInstallPrompt = event;

            const installButton =
                createInstallButton();

            if (installButton) {
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

    function initialiseInstallFeature() {
        const installButton =
            createInstallButton();

        if (installButton) {
            installButton.hidden =
                isRunningAsInstalledApp();

            return;
        }

        /*
         * onboarding.js creates the footer dynamically.
         * Watch for the footer and add the button as
         * soon as it appears.
         */
        const observer =
            new MutationObserver(function () {
                const button =
                    createInstallButton();

                if (button) {
                    button.hidden =
                        isRunningAsInstalledApp();

                    observer.disconnect();
                }
            });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseInstallFeature,
            {
                once: true
            }
        );
    } else {
        initialiseInstallFeature();
    }
})();