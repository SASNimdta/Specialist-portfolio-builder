(function () {
    "use strict";

    const APP_VERSION = "1.0";
    const SETTINGS_KEY = "spbUserSettings";
    const PROFILE_KEY = "portfolioProfile";

    const DISCLAIMER_HTML = `
        <p>
            This tool is to be used as a guide only and does not indicate
            the success of your application. It is your responsibility to
            ensure all criteria are fully met before submitting a final
            application.
        </p>

        <p>
            The aim of the traffic light indicator (red, amber, green) is
            to help you balance progress across all the domains. It does
            not indicate that any section is sufficiently complete, nor
            does it guarantee a successful application.
        </p>

        <p>
            The use of this tool does not replace any specific ePortfolios,
            tools or guidance provided by professional bodies, including
            but not limited to Royal Colleges and the GMC.
        </p>
    `;

    const GUIDANCE_STEPS = [
        {
            title: "Welcome to your portfolio",
            text:
                "Your portfolio is stored in this browser on this device. " +
                "It is not automatically stored online or synchronised " +
                "with another device.",
            selector: "#dashboard"
        },
        {
            title: "Upload evidence",
            text:
                "Use Upload Evidence to add a file, activity date, one or " +
                "more evidence types, and the domains and criteria " +
                "supported by that evidence.",
            selector: '[data-screen="upload"]'
        },
        {
            title: "Evidence Library",
            text:
                "The Evidence Library lets you search, edit or delete " +
                "evidence and add or amend the reflection attached to " +
                "each evidence item.",
            selector: '[data-screen="library"]'
        },
        {
            title: "Progress",
            text:
                "Progress shows outstanding, in-progress and complete " +
                "criteria. The traffic-light display is a planning aid " +
                "only. Evidence that is five years old or more is excluded " +
                "from completion calculations.",
            selector: '[data-screen="progress"]'
        },
        {
            title: "Portfolio exports",
            text:
                "The Full Portfolio Document creates one Word document " +
                "containing the portfolio and inserted evidence. The " +
                "Indexed Portfolio Pack creates an indexed portfolio " +
                "document and a folder containing the original evidence " +
                "files.",
            selector: '[data-screen="export"]'
        },
        {
            title: "Moving to another device",
            text:
                "Use Migrate Portfolio at the bottom of the app to create " +
                "a migration file. Restore that file through this web app " +
                "on the new device. The devices will not synchronise after " +
                "migration, so choose one device as the main portfolio.",
            selector: "#spbMigrateLink"
        }
    ];

    let settings = readSettings();
    let guidanceStep = 0;

    function readSettings() {
        try {
            return JSON.parse(
                localStorage.getItem(SETTINGS_KEY) || "{}"
            );
        } catch (error) {
            return {};
        }
    }

    function saveSettings() {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );
    }

    function readProfile() {
        try {
            return JSON.parse(
                localStorage.getItem(PROFILE_KEY) || "{}"
            );
        } catch (error) {
            return {};
        }
    }

    function escapeHtml(value) {
        return String(value || "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]
        );
    }

    function saveProfile(
        firstName,
        lastName,
        specialty
    ) {
        const profile = {
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            specialty
        };

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

        settings.firstName = firstName;
        settings.lastName = lastName;
        settings.specialty = specialty;
        settings.detailsComplete = true;

        saveSettings();
        renderGreeting();
    }

    function getModalLayer() {
        return document.getElementById(
            "spbModalLayer"
        );
    }

    function showModal(
        content,
        blocking = false
    ) {
        const layer = getModalLayer();

        if (!layer) {
            return;
        }

        layer.innerHTML = `
            <div
                class="spb-modal"
                role="dialog"
                aria-modal="true"
            >
                ${content}
            </div>
        `;

        layer.dataset.blocking =
            blocking ? "true" : "false";

        layer.hidden = false;

        document.body.classList.add(
            "spb-lock",
            "spb-guidance-active"
        );
    }

    function closeModal(force = false) {
        const layer = getModalLayer();

        if (!layer) {
            return;
        }

        if (
            !force &&
            layer.dataset.blocking === "true"
        ) {
            return;
        }

        layer.hidden = true;
        layer.innerHTML = "";
        layer.dataset.blocking = "false";

        document.body.classList.remove(
            "spb-lock",
            "spb-guidance-active"
        );
    }

    function showDisclaimer(
        blocking = false
    ) {
        showModal(
            `
                <h2>Important Disclaimer</h2>

                <div class="spb-legal">
                    ${DISCLAIMER_HTML}
                </div>

                ${
                    blocking
                        ? `
                            <label class="spb-check">
                                <input
                                    type="checkbox"
                                    id="spbAcceptCheck"
                                >

                                <span>
                                    I have read and understood
                                    this disclaimer.
                                </span>
                            </label>
                        `
                        : ""
                }

                <div class="spb-actions">
                    ${
                        blocking
                            ? `
                                <button
                                    type="button"
                                    id="spbAcceptBtn"
                                    class="spb-primary"
                                    disabled
                                >
                                    Acknowledge and Continue
                                </button>
                            `
                            : `
                                <button
                                    type="button"
                                    id="spbCloseModal"
                                    class="spb-primary"
                                >
                                    Close
                                </button>
                            `
                    }
                </div>

                <p>
                    <small>
                        Portfolio Builder version
                        ${APP_VERSION}
                    </small>
                </p>
            `,
            blocking
        );

        if (blocking) {
            const checkbox =
                document.getElementById(
                    "spbAcceptCheck"
                );

            const button =
                document.getElementById(
                    "spbAcceptBtn"
                );

            checkbox.addEventListener(
                "change",
                function () {
                    button.disabled =
                        !checkbox.checked;
                }
            );

            button.addEventListener(
                "click",
                function () {
                    settings.acceptedAppVersion =
                        APP_VERSION;

                    settings.disclaimerAcceptedAt =
                        new Date().toISOString();

                    saveSettings();
                    closeModal(true);
                    showDetails(true);
                }
            );

            return;
        }

        document
            .getElementById("spbCloseModal")
            .addEventListener(
                "click",
                function () {
                    closeModal(true);
                }
            );
    }

    function showDetails(
        blocking = false
    ) {
        const currentProfile =
            readProfile();

        showModal(
            `
                <h2>
                    ${
                        blocking
                            ? "Set Up Your Portfolio"
                            : "Update Details"
                    }
                </h2>

                <p>
                    Enter your name as you would like
                    it to appear on your portfolio
                    (including capitalisation).
                </p>

                <form id="spbDetailsForm">
                    <div class="spb-form-grid">
                        <label>
                            First name

                            <input
                                type="text"
                                id="spbFirstName"
                                value="${escapeHtml(
                                    currentProfile
                                        .firstName ||
                                    settings.firstName ||
                                    ""
                                )}"
                                required
                            >
                        </label>

                        <label>
                            Last name

                            <input
                                type="text"
                                id="spbLastName"
                                value="${escapeHtml(
                                    currentProfile
                                        .lastName ||
                                    settings.lastName ||
                                    ""
                                )}"
                                required
                            >
                        </label>

                        <label class="spb-wide">
                            Specialty

                            <input
                                type="text"
                                id="spbSpecialty"
                                value="${escapeHtml(
                                    currentProfile
                                        .specialty ||
                                    settings.specialty ||
                                    ""
                                )}"
                                required
                            >
                        </label>
                    </div>

                    <div class="spb-actions">
                        ${
                            blocking
                                ? ""
                                : `
                                    <button
                                        type="button"
                                        id="spbCancelDetails"
                                        class="spb-ghost"
                                    >
                                        Cancel
                                    </button>
                                `
                        }

                        <button
                            type="submit"
                            class="spb-primary"
                        >
                            ${
                                blocking
                                    ? "Save and Continue"
                                    : "Save Details"
                            }
                        </button>
                    </div>
                </form>
            `,
            blocking
        );

        const form =
            document.getElementById(
                "spbDetailsForm"
            );

        form.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const firstName =
                    document
                        .getElementById(
                            "spbFirstName"
                        )
                        .value
                        .trim();

                const lastName =
                    document
                        .getElementById(
                            "spbLastName"
                        )
                        .value
                        .trim();

                const specialty =
                    document
                        .getElementById(
                            "spbSpecialty"
                        )
                        .value
                        .trim();

                saveProfile(
                    firstName,
                    lastName,
                    specialty
                );

                closeModal(true);

                if (blocking) {
                    startGuidance();
                }
            }
        );

        if (!blocking) {
            document
                .getElementById(
                    "spbCancelDetails"
                )
                .addEventListener(
                    "click",
                    function () {
                        closeModal(true);
                    }
                );
        }
    }

    function renderGreeting() {
        const currentProfile =
            readProfile();

        let greeting =
            document.getElementById(
                "spbGreeting"
            );

        if (!greeting) {
            greeting =
                document.createElement(
                    "div"
                );

            greeting.id =
                "spbGreeting";

            greeting.className =
                "spb-greeting";

            const main =
                document.querySelector(
                    "main"
                );

            if (main) {
                main.insertAdjacentElement(
                    "beforebegin",
                    greeting
                );
            }
        }

        greeting.textContent =
            currentProfile.firstName
                ? `Hi, ${currentProfile.firstName}!`
                : "";
    }

    function removeGuidanceHighlight() {
        document
            .querySelectorAll(
                ".spb-highlight"
            )
            .forEach(element => {
                element.classList.remove(
                    "spb-highlight"
                );
            });
    }

    function startGuidance() {
        guidanceStep = 0;

        const card =
            document.getElementById(
                "spbTour"
            );

        if (!card) {
            return;
        }

        card.hidden = false;

        document.body.classList.add(
            "spb-lock"
        );

        showGuidanceStep();
    }

    function showGuidanceStep() {
        removeGuidanceHighlight();

        const step =
            GUIDANCE_STEPS[guidanceStep];

        const target =
            document.querySelector(
                step.selector
            );

        const card =
            document.getElementById(
                "spbTour"
            );

        if (!card) {
            return;
        }

        if (target) {
            target.classList.add(
                "spb-highlight"
            );

            target.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        const percentage =
            (
                (guidanceStep + 1) /
                GUIDANCE_STEPS.length
            ) * 100;

        card.innerHTML = `
            <div class="spb-tour-top">
                <span class="spb-tour-step">
                    Step ${guidanceStep + 1}
                    of ${GUIDANCE_STEPS.length}
                </span>
            </div>

            <h3>${step.title}</h3>

            <p>${step.text}</p>

            <div class="spb-tour-progress">
                <i
                    style="width: ${percentage}%"
                ></i>
            </div>

            <div class="spb-actions">
                <button
                    type="button"
                    id="spbTourBack"
                    class="spb-ghost"
                    ${
                        guidanceStep === 0
                            ? "disabled"
                            : ""
                    }
                >
                    Back
                </button>

                <button
                    type="button"
                    id="spbTourNext"
                    class="spb-primary"
                >
                    ${
                        guidanceStep ===
                        GUIDANCE_STEPS.length - 1
                            ? "Finish"
                            : "Next"
                    }
                </button>
            </div>
        `;

        document
            .getElementById(
                "spbTourBack"
            )
            .addEventListener(
                "click",
                function () {
                    if (
                        guidanceStep > 0
                    ) {
                        guidanceStep -= 1;
                        showGuidanceStep();
                    }
                }
            );

        document
            .getElementById(
                "spbTourNext"
            )
            .addEventListener(
                "click",
                function () {
                    if (
                        guidanceStep <
                        GUIDANCE_STEPS.length - 1
                    ) {
                        guidanceStep += 1;
                        showGuidanceStep();
                        return;
                    }

                    settings.onboardingComplete =
                        true;

                    settings.onboardingCompletedAt =
                        new Date().toISOString();

                    saveSettings();
                    removeGuidanceHighlight();

                    card.hidden = true;

                    document.body.classList.remove(
                        "spb-lock"
                    );
                }
            );
    }

    function fileToDataUrl(file) {
        return new Promise(
            (resolve, reject) => {
                const reader =
                    new FileReader();

                reader.onload =
                    function () {
                        resolve(
                            reader.result
                        );
                    };

                reader.onerror =
                    reject;

                reader.readAsDataURL(
                    file
                );
            }
        );
    }

    async function dataUrlToBlob(
        dataUrl
    ) {
        const response =
            await fetch(dataUrl);

        return response.blob();
    }

   async function createMigrationFile() {
    const button =
        document.getElementById(
            "spbCreateMigration"
        );

    const originalButtonText =
        button
            ? button.textContent
            : "Create Migration File";

    if (button) {
        button.disabled = true;
        button.textContent =
            "Preparing Migration File...";
    }

    try {
        if (
            typeof DB === "undefined" ||
            typeof DB.all !== "function"
        ) {
            throw new Error(
                "The portfolio database is not available."
            );
        }

        const records = await DB.all();
        const migratedEvidence = [];

        for (
            let index = 0;
            index < records.length;
            index += 1
        ) {
            const evidenceItem =
                records[index];

            if (button) {
                button.textContent =
                    `Preparing item ${index + 1} ` +
                    `of ${records.length}...`;
            }

            const migratedItem = {
                ...evidenceItem
            };

            if (
                evidenceItem.file
                instanceof Blob
            ) {
                migratedItem.fileData =
                    await fileToDataUrl(
                        evidenceItem.file
                    );

                migratedItem.fileName =
                    evidenceItem.fileName ||
                    `evidence_${evidenceItem.id}`;

                migratedItem.fileType =
                    evidenceItem.file.type ||
                    "application/octet-stream";

                delete migratedItem.file;
            }

            if (evidenceItem.reflectionFile instanceof Blob) {
                migratedItem.reflectionFileData = await fileToDataUrl(
                    evidenceItem.reflectionFile
                );
                migratedItem.reflectionFileName =
                    evidenceItem.reflectionFileName ||
                    `reflection_${evidenceItem.id}`;
                migratedItem.reflectionFileType =
                    evidenceItem.reflectionFile.type ||
                    "application/octet-stream";
                delete migratedItem.reflectionFile;
            }

            migratedEvidence.push(
                migratedItem
            );
        }

        const migration = {
            format:
                "NIMDTA-SPB-MIGRATION",

            migrationVersion: 1,

            appVersion:
                APP_VERSION,

            createdAt:
                new Date().toISOString(),

            settings: {
                ...settings
            },

            profile: {
                ...readProfile()
            },

            interviewPlans: JSON.parse(
                localStorage.getItem(
                    "spbInterviewPlans"
                ) || "{}"
            ),

            evidence:
                migratedEvidence
        };

        const migrationText =
            JSON.stringify(migration);

        const migrationBlob =
            new Blob(
                [migrationText],
                {
                    type:
                        "application/json;charset=utf-8"
                }
            );

        if (
            migrationBlob.size === 0
        ) {
            throw new Error(
                "The migration file was empty."
            );
        }

        const migrationDate =
            new Date()
                .toISOString()
                .slice(0, 10);

        const fileName =
            "Specialist_Portfolio_Migration_" +
            migrationDate +
            ".spb";

        const downloadUrl =
            URL.createObjectURL(
                migrationBlob
            );

        const existingDownloadArea =
            document.getElementById(
                "spbMigrationDownloadArea"
            );

        if (existingDownloadArea) {
            const previousUrl =
                existingDownloadArea.dataset
                    .downloadUrl;

            if (previousUrl) {
                URL.revokeObjectURL(
                    previousUrl
                );
            }

            existingDownloadArea.remove();
        }

        const downloadArea =
            document.createElement(
                "div"
            );

        downloadArea.id =
            "spbMigrationDownloadArea";

        downloadArea.className =
            "spb-summary";

        downloadArea.dataset.downloadUrl =
            downloadUrl;

        const sizeInMegabytes =
            (
                migrationBlob.size /
                1024 /
                1024
            ).toFixed(2);

const readyMessage =
    document.createElement("p");

const readyText =
    document.createElement("strong");

readyText.textContent =
    "Your migration file is ready.";

readyMessage.appendChild(
    readyText
);

const itemCount =
    document.createElement("p");

itemCount.textContent =
    "Evidence items: " +
    records.length;

const fileSize =
    document.createElement("p");

fileSize.textContent =
    "File size: " +
    sizeInMegabytes +
    " MB";

const instruction =
    document.createElement("p");

instruction.textContent =
    "Select the button below to save " +
    "the migration file to your device.";

const downloadLink =
    document.createElement("a");

downloadLink.id =
    "spbDownloadMigration";

downloadLink.href =
    downloadUrl;

downloadLink.download =
    fileName;

downloadLink.textContent =
    "Download Migration File";

downloadLink.setAttribute(
    "role",
    "button"
);

downloadArea.appendChild(
    readyMessage
);

downloadArea.appendChild(
    itemCount
);

downloadArea.appendChild(
    fileSize
);

downloadArea.appendChild(
    instruction
);

downloadArea.appendChild(
    downloadLink
);

button.insertAdjacentElement(
    "afterend",
    downloadArea
);

downloadLink.addEventListener(
    "click",
    function () {
        settings.lastMigrationAt =
            new Date().toISOString();

        saveSettings();

        downloadLink.textContent =
            "Migration File Downloaded";

        window.setTimeout(
            function () {
                URL.revokeObjectURL(
                    downloadUrl
                );
            },
            60000
        );
    },
    {
        once: true
    }
);
    } catch (error) {
        console.error(
            "Migration file creation failed:",
            error
        );

        alert(
            "The migration file could not " +
            "be created.\n\n" +
            (
                error &&
                error.message
                    ? error.message
                    : "An unknown error occurred."
            )
        );
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent =
                originalButtonText;
        }
    }
}

async function createAutomaticBackupDownload() {
    if (typeof DB === "undefined" || typeof DB.all !== "function") {
        throw new Error("The portfolio database is not available.");
    }
    const records = await DB.all();
    const migratedEvidence = [];
    for (const evidenceItem of records) {
        const migratedItem = { ...evidenceItem };
        if (evidenceItem.file instanceof Blob) {
            migratedItem.fileData = await fileToDataUrl(evidenceItem.file);
            migratedItem.fileName = evidenceItem.fileName || `evidence_${evidenceItem.id}`;
            migratedItem.fileType = evidenceItem.file.type || "application/octet-stream";
            delete migratedItem.file;
        }
        if (evidenceItem.reflectionFile instanceof Blob) {
            migratedItem.reflectionFileData = await fileToDataUrl(evidenceItem.reflectionFile);
            migratedItem.reflectionFileName = evidenceItem.reflectionFileName || `reflection_${evidenceItem.id}`;
            migratedItem.reflectionFileType = evidenceItem.reflectionFile.type || "application/octet-stream";
            delete migratedItem.reflectionFile;
        }
        migratedEvidence.push(migratedItem);
    }
    const createdAt = new Date().toISOString();
    const migration = {
        format: "NIMDTA-SPB-MIGRATION",
        migrationVersion: 1,
        appVersion: APP_VERSION,
        createdAt,
        settings: { ...settings },
        profile: { ...readProfile() },
        interviewPlans: JSON.parse(localStorage.getItem("spbInterviewPlans") || "{}"),
        evidence: migratedEvidence
    };
    const blob = new Blob([JSON.stringify(migration)], { type: "application/json;charset=utf-8" });
    if (!blob.size) throw new Error("The backup file was empty.");
    const date = createdAt.slice(0, 10);
    const time = createdAt.slice(11, 16).replace(":", "-");
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `Specialist_Portfolio_Backup_${date}_${time}.spb`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    settings.lastMigrationAt = createdAt;
    settings.lastAutomaticBackupAt = createdAt;
    settings.changesSinceBackup = 0;
    settings.backupReminderDeferredAt = null;
    saveSettings();
    return { count: records.length, size: blob.size };
}
function backupIsDue() {
    const changes = Number(settings.changesSinceBackup || 0);
    if (changes <= 0) return false;
    if (!settings.lastAutomaticBackupAt && !settings.lastMigrationAt) return true;
    if (changes >= 10) return true;
    const last = new Date(settings.lastAutomaticBackupAt || settings.lastMigrationAt).getTime();
    return Number.isFinite(last) && Date.now() - last >= 30 * 24 * 60 * 60 * 1000;
}
function showAutomaticBackupReminder() {
    if (!backupIsDue() || document.getElementById("spbAutomaticBackupNow")) return;
    showModal(`
        <h2>Protect your portfolio</h2>
        <div class="spb-warning">
            <b>Download a backup to this device</b>
            <p>Your working portfolio is stored in browser storage. Clearing browser or site data can remove it.</p>
        </div>
        <p>Download a restorable Portfolio Builder backup now and save it somewhere secure on this device or an approved drive.</p>
        <div class="spb-actions">
            <button type="button" id="spbAutomaticBackupLater" class="spb-ghost">Remind Me Later</button>
            <button type="button" id="spbAutomaticBackupNow" class="spb-primary">Download Backup Now</button>
        </div>
    `, false);
    document.getElementById("spbAutomaticBackupLater").addEventListener("click", function () {
        settings.backupReminderDeferredAt = new Date().toISOString();
        saveSettings();
        closeModal(true);
    }, { once: true });
    document.getElementById("spbAutomaticBackupNow").addEventListener("click", async function () {
        const button = this;
        button.disabled = true;
        button.textContent = "Preparing Backup...";
        try {
            const result = await createAutomaticBackupDownload();
            closeModal(true);
            window.alert(`Backup downloaded to this device.\n\nEvidence items: ${result.count}`);
        } catch (error) {
            console.error("Automatic backup failed:", error);
            button.disabled = false;
            button.textContent = "Download Backup Now";
            window.alert("The backup could not be downloaded.\n\n" + (error.message || "An unknown error occurred."));
        }
    }, { once: true });
}
window.SPBAutoBackup = {
    noteChange: function () {
        settings.changesSinceBackup = Number(settings.changesSinceBackup || 0) + 1;
        saveSettings();
        window.setTimeout(showAutomaticBackupReminder, 250);
    },
    downloadNow: createAutomaticBackupDownload,
    showIfDue: showAutomaticBackupReminder
};
function showMigration() {
    showModal(
        `
            <h2>Migrate Portfolio</h2>

            <div class="spb-warning">
                <strong>Important:</strong>

                Migrating your portfolio creates
                a separate copy on the new device.
                Changes made on one device will
                not automatically appear on the
                other device. After migration,
                choose one device as the main
                portfolio.
            </div>

            <div class="spb-migrate-options">
                <div class="spb-migrate-card">
                    <h3>
                        Move the portfolio from
                        this device
                    </h3>

                    <ol>
                        <li>
                            Select Create Migration
                            File.
                        </li>

                        <li>
                            Wait for the migration
                            file to be prepared.
                        </li>

                        <li>
                            Select Download
                            Migration File.
                        </li>

                        <li>
                            Save the file somewhere
                            secure.
                        </li>

                        <li>
                            Open the Portfolio
                            Builder on the new
                            device.
                        </li>

                        <li>
                            Select Migrate Portfolio
                            and restore the saved
                            file.
                        </li>
                    </ol>

                    <button
                        type="button"
                        id="spbCreateMigration"
                        class="spb-primary"
                    >
                        Create Migration File
                    </button>
                </div>

                <div class="spb-migrate-card">
                    <h3>
                        Restore a portfolio on
                        this device
                    </h3>

                    <p>
                        Choose a migration file
                        previously created by the
                        Portfolio Builder.
                    </p>

                    <input
                        type="file"
                        id="spbRestoreFile"
                        class="spb-hidden-input"
                        accept=".spb,application/json"
                    >

                    <button
                        type="button"
                        id="spbChooseRestore"
                        class="spb-secondary"
                    >
                        Choose Migration File
                    </button>

                    <div
                        id="spbRestoreSummary"
                    ></div>
                </div>
            </div>

            <div class="spb-actions">
                <button
                    type="button"
                    id="spbCloseModal"
                    class="spb-ghost"
                >
                    Close
                </button>
            </div>
        `,
        false
    );

    document
        .getElementById(
            "spbCreateMigration"
        )
        .addEventListener(
            "click",
            createMigrationFile
        );

    document
        .getElementById(
            "spbChooseRestore"
        )
        .addEventListener(
            "click",
            function () {
                document
                    .getElementById(
                        "spbRestoreFile"
                    )
                    .click();
            }
        );

    document
        .getElementById(
            "spbRestoreFile"
        )
        .addEventListener(
            "change",
            previewMigrationFile
        );

    document
        .getElementById(
            "spbCloseModal"
        )
        .addEventListener(
            "click",
            function () {
                closeModal(true);
            }
        );
}
    async function previewMigrationFile(
        event
    ) {
        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        let migration;

        try {
            migration =
                JSON.parse(
                    await file.text()
                );
        } catch (error) {
            alert(
                "This is not a valid " +
                "Portfolio Builder " +
                "migration file."
            );

            return;
        }

        if (
            migration.format !==
                "NIMDTA-SPB-MIGRATION" ||
            !Array.isArray(
                migration.evidence
            )
        ) {
            alert(
                "This is not a valid " +
                "Portfolio Builder " +
                "migration file."
            );

            return;
        }

        const reflectionCount =
            migration.evidence.filter(
                item => {
                    return (
                        item.reflection &&
                        Object.values(
                            item.reflection
                        ).some(value => {
                            return String(
                                value || ""
                            ).trim();
                        })
                    );
                }
            ).length;

        const summary =
            document.getElementById(
                "spbRestoreSummary"
            );

        summary.innerHTML = `
            <div class="spb-summary">
                <p>
                    <b>Portfolio owner:</b>
                    ${escapeHtml(
                        migration.profile
                            ?.name ||
                        "Not recorded"
                    )}
                </p>

                <p>
                    <b>Specialty:</b>
                    ${escapeHtml(
                        migration.profile
                            ?.specialty ||
                        "Not recorded"
                    )}
                </p>

                <p>
                    <b>Evidence items:</b>
                    ${
                        migration
                            .evidence
                            .length
                    }
                </p>

                <p>
                    <b>Reflections:</b>
                    ${reflectionCount}
                </p>

                <p>
                    <b>
                        Migration file created:
                    </b>

                    ${
                        new Date(
                            migration
                                .createdAt
                        ).toLocaleString(
                            "en-GB"
                        )
                    }
                </p>
            </div>

            <div class="spb-warning">
                Restoring will replace the
                portfolio currently stored in
                this browser.
            </div>

            <button
                type="button"
                id="spbConfirmRestore"
                class="spb-primary"
            >
                Restore Portfolio
            </button>
        `;

        document
            .getElementById(
                "spbConfirmRestore"
            )
            .addEventListener(
                "click",
                function () {
                    restoreMigration(
                        migration
                    );
                }
            );
    }

    async function restoreMigration(
        migration
    ) {
        const confirmed =
            window.confirm(
                "Replace the portfolio " +
                "currently stored on this " +
                "device?"
            );

        if (!confirmed) {
            return;
        }

        try {
            const existingEvidence =
                await DB.all();

            for (
                const evidenceItem
                of existingEvidence
            ) {
                await DB.remove(
                    evidenceItem.id
                );
            }

            for (
                const migratedItem
                of migration.evidence
            ) {
                const restoredItem = {
                    ...migratedItem
                };

                delete restoredItem
                    .fileData;

                delete restoredItem
                    .fileType;

                if (
                    migratedItem.fileData
                ) {
                    restoredItem.file =
                        await dataUrlToBlob(
                            migratedItem
                                .fileData
                        );
                }

                if (migratedItem.reflectionFileData) {
                    restoredItem.reflectionFile = await dataUrlToBlob(
                        migratedItem.reflectionFileData
                    );
                }

                delete restoredItem.reflectionFileData;
                delete restoredItem.reflectionFileType;

                await DB.put(
                    restoredItem
                );
            }

            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(
                    migration.profile || {}
                )
            );

            localStorage.setItem(
                "spbInterviewPlans",
                JSON.stringify(
                    migration.interviewPlans || {}
                )
            );

            settings = {
                ...(
                    migration.settings ||
                    {}
                ),

                acceptedAppVersion:
                    APP_VERSION,

                detailsComplete:
                    true,

                onboardingComplete:
                    true,

                migratedAt:
                    new Date()
                        .toISOString()
            };

            saveSettings();

            alert(
                "Portfolio restored " +
                "successfully. The app " +
                "will now reload."
            );

            window.location.reload();
        } catch (error) {
            console.error(error);

            alert(
                "The portfolio could not " +
                "be restored."
            );
        }
    }

    function injectFooterAndModals() {
        document.body.insertAdjacentHTML(
            "beforeend",
            `
                <div
                    id="spbModalLayer"
                    class="spb-modal-layer"
                    hidden
                ></div>

                <div
                    id="spbTour"
                    class="spb-tour"
                    hidden
                ></div>

                <footer class="spb-footer">
                    <div class="spb-footer-links">
                        <button
                            type="button"
                            id="spbDisclaimerLink"
                        >
                            Disclaimer
                        </button>

                        <button
                            type="button"
                            id="spbDetailsLink"
                        >
                            Update Details
                        </button>

                        <button
                            type="button"
                            id="spbMigrateLink"
                        >
                            Migrate Portfolio
                        </button>
                    </div>

                    <p>
                        © Northern Ireland Medical
                        and Dental Training Agency
                        (NIMDTA) (Copyright 2026)
                    </p>

                    <p>
                        This application, including
                        its structure, formulas, and
                        coding, is the intellectual
                        property of NIMDTA and is
                        provided for NIMDTA SAS use
                        only. Unauthorised copying,
                        alteration, or distribution
                        is not permitted.
                    </p>

                    <p>
                        While reasonable care has been
                        taken in developing this
                        application, NIMDTA accepts no
                        responsibility or liability
                        for any errors, malfunctions,
                        data loss, corruption, or
                        adverse outcomes arising from
                        its use, including where the
                        application does not perform
                        as expected or is used outside
                        its intended purpose. Users
                        remain responsible for
                        validating outputs and
                        maintaining appropriate
                        backups.
                    </p>

                    <p>
                        If you wish to reuse, adapt,
                        or share this application
                        outside its intended purpose,
                        please contact the NIMDTA SAS
                        Career Development Team at

                        <a
                            href="mailto:sas.nimdta@hscni.net"
                        >
                            sas.nimdta@hscni.net
                        </a>

                        for advice and approval.
                    </p>

                    <p>
                        Portfolio Builder version
                        ${APP_VERSION}
                    </p>
                </footer>
            `
        );

        const modalLayer =
            getModalLayer();

        modalLayer.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                        modalLayer &&
                    modalLayer.dataset
                        .blocking !==
                        "true"
                ) {
                    closeModal(true);
                }
            }
        );

        document
            .getElementById(
                "spbDisclaimerLink"
            )
            .addEventListener(
                "click",
                function () {
                    showDisclaimer(false);
                }
            );

        document
            .getElementById(
                "spbDetailsLink"
            )
            .addEventListener(
                "click",
                function () {
                    showDetails(false);
                }
            );

        document
            .getElementById(
                "spbMigrateLink"
            )
            .addEventListener(
                "click",
                showMigration
            );

        renderGreeting();

        const currentProfile =
            readProfile();

        if (
            settings.acceptedAppVersion !==
            APP_VERSION
        ) {
            showDisclaimer(true);
            return;
        }

        if (
            !settings.detailsComplete ||
            !currentProfile.firstName
        ) {
            showDetails(true);
            return;
        }

        if (
            !settings.onboardingComplete
        ) {
            startGuidance();
        }
    }

    function initialiseOnboarding() {
        if (
            document.getElementById(
                "spbModalLayer"
            )
        ) {
            return;
        }

        injectFooterAndModals();
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialiseOnboarding,
            {
                once: true
            }
        );
    } else {
        initialiseOnboarding();
    }
   document.addEventListener(
    "click",
    function (event) {
        if (
            !document.body.classList.contains(
                "spb-guidance-active"
            )
        ) {
            return;
        }

        const guide =
            document.getElementById("spbTour");

        const modal =
            document.getElementById("spbModalLayer");

        const clickedInsideGuide =
            guide &&
            !guide.hidden &&
            guide.contains(event.target);

        const clickedInsideModal =
            modal &&
            !modal.hidden &&
            modal.contains(event.target);

        if (
            clickedInsideGuide ||
            clickedInsideModal
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    },
    true
);
})();
