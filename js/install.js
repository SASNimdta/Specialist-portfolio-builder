(function () {
    "use strict";

    let deferredInstallPrompt = null;

    function isRunningAsInstalledApp() {
        return (
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true
        );
    }

    function createInstallButton() {
        const existingButton = document.getElementById("spbInstallApp");

        if (existingButton) {
            return existingButton;
        }

        const footerLinks = document.querySelector(".spb-footer-links");

        if (!footerLinks) {
            return null;
        }

        const installButton = document.createElement("button");

        installButton.type = "button";
        installButton.id = "spbInstallApp";
        installButton.textContent = "Install Portfolio Builder";
        installButton.hidden = isRunningAsInstalledApp();

        footerLinks.insertBefore(
            installButton,
            footerLinks.firstChild
        );

        installButton.addEventListener(
            "click",
            showInstallWarning
        );

        return installButton;
    }

    function showInstallWarning() {
        const modalLayer = document.getElementById("spbModalLayer");

        if (!modalLayer) {
            return;
        }

        modalLayer.innerHTML = `
            <div
                class="spb-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="spbInstallWarningTitle"
            >
                <h2 id="spbInstallWarningTitle">
                    Install Portfolio Builder
                </h2>

                <div class="spb-warning">
                    <strong>Important</strong>

                    <p>
                        Installing the Portfolio Builder does not
                        synchronise portfolio content between devices.
                    </p>
                </div>

                <p>
                    Your portfolio files and information remain stored
                    on this device.
                </p>

                <p>
                    The browser message stating that the app
                    “syncs across multiple devices” relates only to
                    the installed app.
                    <strong>
                        Browser sync across multiple devices does not
                        transfer portfolio files, evidence, reflections
                        or progress information.
                    </strong>
                </p>

                <p>
                    To move your portfolio to another device:
                </p>

                <ol>
                    <li>
                        Select <strong>Migrate Portfolio</strong>.
                    </li>
                    <li>
                        Create and securely save a migration file.
                    </li>
                    <li>
                        Open the Portfolio Builder on the new device.
                    </li>
                    <li>
                        Restore the migration file on the new device.
                    </li>
                </ol>

                <p>
                    After migration, changes made on one device will not
                    automatically appear on another device.
                </p>

                <div class="spb-actions">
                    <button
                        type="button"
                        id="spbCancelInstall"
                        class="spb-ghost"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="spbContinueInstall"
                        class="spb-primary"
                    >
                        Continue Installation
                    </button>
                </div>
            </div>
        `;

        modalLayer.dataset.blocking = "false";
        modalLayer.hidden = false;
        document.body.classList.add("spb-lock");

        document
            .getElementById("spbCancelInstall")
            .addEventListener("click", closeInstallWarning);

        document
            .getElementById("spbContinueInstall")
            .addEventListener("click", function () {
                closeInstallWarning();
                handleInstallClick();
            });
    }

    function closeInstallWarning() {
        const modalLayer = document.getElementById("spbModalLayer");

        if (!modalLayer) {
            return;
        }

        modalLayer.hidden = true;
        modalLayer.innerHTML = "";
        modalLayer.dataset.blocking = "false";
        document.body.classList.remove("spb-lock");
    }

    async function handleInstallClick() {
        if (isRunningAsInstalledApp()) {
            window.alert(
                "The Specialist Portfolio Builder is already installed " +
                "on this device."
            );
            return;
        }

        if (!deferredInstallPrompt) {
            showInstallUnavailableMessage();
            return;
        }

        const installButton = document.getElementById("spbInstallApp");

        if (installButton) {
            installButton.disabled = true;
            installButton.textContent = "Opening Installer...";
        }

        try {
            await deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;

            if (choice.outcome === "accepted") {
                if (installButton) {
                    installButton.hidden = true;
                }
                return;
            }

            if (installButton) {
                installButton.disabled = false;
                installButton.textContent = "Install Portfolio Builder";
            }
        } catch (error) {
            console.error("App installation failed:", error);

            if (installButton) {
                installButton.disabled = false;
                installButton.textContent = "Install Portfolio Builder";
            }

            showInstallUnavailableMessage();
        }
    }

    function showInstallUnavailableMessage() {
        const modalLayer = document.getElementById("spbModalLayer");

        if (!modalLayer) {
            return;
        }

        modalLayer.innerHTML = `
            <div
                class="spb-modal"
                role="dialog"
                aria-modal="true"
            >
                <h2>Installation Not Available</h2>

                <p>
                    The browser has not made installation available
                    from this page.
                </p>

                <p>
                    This may mean that the Portfolio Builder is already
                    installed, or that the browser has not yet confirmed
                    that the app is ready to install.
                </p>

                <p>
                    In Microsoft Edge, you can also select:
                </p>

                <p>
                    <strong>
                        Three-dot menu → Apps →
                        Install this site as an app
                    </strong>
                </p>

                <div class="spb-actions">
                    <button
                        type="button"
                        id="spbCloseInstallMessage"
                        class="spb-primary"
                    >
                        Close
                    </button>
                </div>
            </div>
        `;

        modalLayer.hidden = false;
        document.body.classList.add("spb-lock");

        document
            .getElementById("spbCloseInstallMessage")
            .addEventListener("click", closeInstallWarning);
    }

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {
            event.preventDefault();
            deferredInstallPrompt = event;

            const installButton = createInstallButton();

            if (installButton) {
                installButton.hidden = false;
                installButton.disabled = false;
                installButton.textContent = "Install Portfolio Builder";
            }
        }
    );

    window.addEventListener(
        "appinstalled",
        function () {
            deferredInstallPrompt = null;

            const installButton = document.getElementById("spbInstallApp");

            if (installButton) {
                installButton.hidden = true;
            }
        }
    );

    function initialiseInstallFeature() {
        const installButton = createInstallButton();

        if (installButton) {
            installButton.hidden = isRunningAsInstalledApp();
            return;
        }

        const observer = new MutationObserver(function () {
            const button = createInstallButton();

            if (button) {
                button.hidden = isRunningAsInstalledApp();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseInstallFeature,
            { once: true }
        );
    } else {
        initialiseInstallFeature();
    }
})();
