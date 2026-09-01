(function () {
    "use strict";

    let deferredInstallPrompt = null;
    let installButton = null;
    let installState = "checking";

    function isRunningAsInstalledApp() {
        return window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;
    }

    function isAppleMobile() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    }

    function isSafari() {
        return /safari/i.test(navigator.userAgent) &&
            !/chrome|crios|chromium|edg|opr|opera|fxios/i.test(navigator.userAgent);
    }

    function isFirefox() {
        return /firefox|fxios/i.test(navigator.userAgent);
    }

    function modal(html, buttonLabel) {
        const layer = document.getElementById("spbModalLayer");
        if (!layer) {
            window.alert(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
            return;
        }
        layer.innerHTML = `
            <div class="spb-modal" role="dialog" aria-modal="true">
                ${html}
                <div class="spb-actions">
                    <button type="button" id="spbInstallModalClose" class="spb-primary">
                        ${buttonLabel || "Close"}
                    </button>
                </div>
            </div>`;
        layer.dataset.blocking = "false";
        layer.hidden = false;
        document.body.classList.add("spb-lock");
        document.getElementById("spbInstallModalClose").addEventListener("click", closeModal, { once: true });
    }

    function closeModal() {
        const layer = document.getElementById("spbModalLayer");
        if (!layer) return;
        layer.hidden = true;
        layer.innerHTML = "";
        layer.dataset.blocking = "false";
        document.body.classList.remove("spb-lock");
    }

    function showInstallWarning() {
        modal(`
            <h2>Install Portfolio Builder</h2>
            <div class="spb-warning">
                <b>Important</b>
                <p>Installing the Portfolio Builder does not synchronise portfolio content between devices. Portfolio files and information remain stored on this device.</p>
            </div>
            <p>To move a portfolio to another device, use <b>Migrate Portfolio</b> and restore the migration file on the new device.</p>
            <div class="spb-actions">
                <button type="button" id="spbCancelInstall" class="spb-ghost">Cancel</button>
                <button type="button" id="spbContinueInstall" class="spb-primary">Continue Installation</button>
            </div>`, "Close");

        const extraClose = document.getElementById("spbInstallModalClose");
        if (extraClose) extraClose.closest(".spb-actions").remove();
        document.getElementById("spbCancelInstall").addEventListener("click", closeModal, { once: true });
        document.getElementById("spbContinueInstall").addEventListener("click", function () {
            closeModal();
            installOrExplain();
        }, { once: true });
    }

    function showManualInstallInstructions() {
        if (isAppleMobile()) {
            modal(`
                <h2>Install Portfolio Builder</h2>
                <p>On iPhone or iPad, installation is completed from the browser menu:</p>
                <ol>
                    <li>Open the browser's <b>Share</b> menu.</li>
                    <li>Select <b>Add to Home Screen</b>.</li>
                    <li>Select <b>Add</b>.</li>
                </ol>`, "Close");
            return;
        }
        if (isSafari()) {
            modal(`
                <h2>Install Portfolio Builder</h2>
                <p>In Safari on Mac, select <b>File</b> then <b>Add to Dock</b>.</p>`, "Close");
            return;
        }
        if (isFirefox()) {
            modal(`
                <h2>Installation Not Available</h2>
                <p>This version of Firefox has not provided an app installation option for this page.</p>
                <p>Open the Portfolio Builder in Chrome, Edge, Safari, or another browser that supports installing web apps.</p>`, "Close");
            return;
        }
        modal(`
            <h2>Installation Not Available</h2>
            <p>The browser has confirmed that it cannot open an installation prompt for this page.</p>
            <p>Check the browser menu for an option such as <b>Install app</b>, <b>Install this site as an app</b>, or <b>Add to Home Screen</b>.</p>`, "Close");
    }

    async function installOrExplain() {
        if (isRunningAsInstalledApp()) {
            modal("<h2>Already Installed</h2><p>The Specialist Portfolio Builder is already installed on this device.</p>", "Close");
            return;
        }

        if (deferredInstallPrompt) {
            const prompt = deferredInstallPrompt;
            deferredInstallPrompt = null;
            try {
                await prompt.prompt();
                const choice = await prompt.userChoice;
                if (choice.outcome === "accepted") {
                    if (installButton) installButton.hidden = true;
                } else {
                    installState = "ready";
                    if (installButton) installButton.disabled = false;
                }
            } catch (error) {
                console.error("App installation failed:", error);
                showManualInstallInstructions();
            }
            return;
        }

        showManualInstallInstructions();
    }

    function createInstallButton() {
        if (installButton) return installButton;
        const existing = document.getElementById("spbInstallApp");
        if (existing) {
            installButton = existing;
            return installButton;
        }
        const footerLinks = document.querySelector(".spb-footer-links");
        if (!footerLinks) return null;
        installButton = document.createElement("button");
        installButton.type = "button";
        installButton.id = "spbInstallApp";
        installButton.textContent = "Install Portfolio Builder";
        installButton.hidden = isRunningAsInstalledApp();
        installButton.addEventListener("click", showInstallWarning);
        footerLinks.insertBefore(installButton, footerLinks.firstChild);
        return installButton;
    }

    function initialiseInstallFeature() {
        const button = createInstallButton();
        if (!button) {
            const observer = new MutationObserver(function () {
                if (createInstallButton()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        if (isRunningAsInstalledApp()) {
            installState = "installed";
            if (installButton) installButton.hidden = true;
            return;
        }

        // Safari/iOS and Firefox do not provide beforeinstallprompt. Their fallback
        // is shown only after the user presses the install button.
        if (isAppleMobile() || isSafari() || isFirefox()) {
            installState = "manual";
        }
    }

    window.addEventListener("beforeinstallprompt", function (event) {
        event.preventDefault();
        deferredInstallPrompt = event;
        installState = "ready";
        const button = createInstallButton();
        if (button) {
            button.hidden = false;
            button.disabled = false;
            button.textContent = "Install Portfolio Builder";
        }
    });

    window.addEventListener("appinstalled", function () {
        deferredInstallPrompt = null;
        installState = "installed";
        const button = createInstallButton();
        if (button) button.hidden = true;
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiseInstallFeature, { once: true });
    } else {
        initialiseInstallFeature();
    }
})();
