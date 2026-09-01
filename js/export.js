/* Specialist Portfolio Builder - complete portfolio export module */

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function fmtDate(value) {
    if (!value) return "";
    return new Date(value + "T00:00:00").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function relativeEvidenceHref(fileName) {
    return "Evidence/" + String(fileName || "")
        .split("/")
        .map(encodeURIComponent)
        .join("/");
}

function blobDownload(blob, fileName) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.remove();
    }, 1500);
}

function reflectionNarrative(reflection) {
    return ["situation", "hindrances", "actions", "results", "plan"]
        .map(key => (reflection && reflection[key] || "").trim())
        .filter(Boolean)
        .join("\n\n");
}

function fileExtension(fileName) {
    const position = String(fileName || "").lastIndexOf(".");
    return position < 0 ? "" : String(fileName).slice(position).toLowerCase();
}

function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function sortEvidence(items) {
    return [...items].sort((first, second) => {
        const firstDate = first.date || "9999-12-31";
        const secondDate = second.date || "9999-12-31";
        return firstDate.localeCompare(secondDate) ||
            String(first.title || "").localeCompare(String(second.title || ""));
    });
}

function criteriaByDomain(item) {
    const grouped = {};
    (item.criteria || []).forEach(code => {
        const domain = Number(String(code).split(".")[0]);
        (grouped[domain] ??= []).push(code);
    });
    Object.values(grouped).forEach(codes => codes.sort((first, second) => {
        const firstMinor = Number(String(first).split(".")[1] || 0);
        const secondMinor = Number(String(second).split(".")[1] || 0);
        return firstMinor - secondMinor;
    }));
    return grouped;
}

async function loadScriptOnce(url, globalName) {
    if (globalName && window[globalName]) return window[globalName];

    const existing = [...document.scripts].find(script => script.src === url);
    if (existing) {
        await new Promise((resolve, reject) => {
            if (!globalName || window[globalName]) return resolve();
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            setTimeout(() => globalName && window[globalName] ? resolve() : reject(), 10000);
        });
        return globalName ? window[globalName] : true;
    }

    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    if (globalName && !window[globalName]) {
        throw new Error(globalName + " did not become available.");
    }
    return globalName ? window[globalName] : true;
}

async function ensureWordLibrary() {
    if (window.docx) return window.docx;
    const sources = [
        "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js",
        "https://unpkg.com/docx@8.5.0/build/index.umd.js"
    ];
    for (const source of sources) {
        try {
            return await loadScriptOnce(source, "docx");
        } catch (error) {
            console.warn("Word library source failed:", source, error);
        }
    }
    throw new Error("Word document support could not be loaded. Check the internet connection and try again.");
}

async function ensurePdfLibrary() {
    if (window.pdfjsLib) return window.pdfjsLib;
    await loadScriptOnce(
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
        "pdfjsLib"
    );
    return window.pdfjsLib;
}

async function ensureMammothLibrary() {
    if (window.mammoth) return window.mammoth;
    await loadScriptOnce(
        "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.12.1/mammoth.browser.min.js",
        "mammoth"
    );
    return window.mammoth;
}

function textParagraph(text, options = {}) {
    const { Paragraph, TextRun, AlignmentType } = window.docx;
    return new Paragraph({
        alignment: options.center ? AlignmentType.CENTER : undefined,
        indent: options.indent ? { left: options.indent } : undefined,
        spacing: { after: options.after ?? 120 },
        children: [new TextRun({
            text: String(text || ""),
            bold: Boolean(options.bold),
            color: options.color || "1E3C4A",
            size: options.size || 22
        })]
    });
}

function heading(text, level, pageBreakBefore = false) {
    const { Paragraph, HeadingLevel } = window.docx;
    return new Paragraph({
        text: String(text || ""),
        heading: {
            1: HeadingLevel.HEADING_1,
            2: HeadingLevel.HEADING_2,
            3: HeadingLevel.HEADING_3
        }[level],
        pageBreakBefore,
        spacing: { before: level === 1 ? 240 : 140, after: 120 }
    });
}

function pageBreak() {
    const { Paragraph, PageBreak } = window.docx;
    return new Paragraph({ children: [new PageBreak()] });
}

function bookmarkId(prefix, value) {
    return (prefix + "_" + String(value))
        .replace(/[^A-Za-z0-9_]/g, "_")
        .slice(0, 38);
}

function bookmarkedHeading(text, level, bookmarkName, pageBreakBefore = false) {
    const { Paragraph, HeadingLevel, Bookmark, TextRun } = window.docx;
    return new Paragraph({
        heading: {
            1: HeadingLevel.HEADING_1,
            2: HeadingLevel.HEADING_2,
            3: HeadingLevel.HEADING_3
        }[level],
        pageBreakBefore,
        spacing: { before: level === 1 ? 240 : 140, after: 120 },
        children: [new Bookmark({
            id: bookmarkName,
            children: [new TextRun(String(text || ""))]
        })]
    });
}

function internalLink(text, bookmarkName, options = {}) {
    const { Paragraph, InternalHyperlink, TextRun } = window.docx;
    return new Paragraph({
        indent: options.indent ? { left: options.indent } : undefined,
        spacing: { after: options.after ?? 70 },
        children: [new InternalHyperlink({
            anchor: bookmarkName,
            children: [new TextRun({
                text: String(text || ""),
                style: "Hyperlink",
                bold: Boolean(options.bold),
                size: options.size || 22
            })]
        })]
    });
}

function addReflection(children, reflection) {
    const text = reflectionNarrative(reflection);
    if (!text) return;
    children.push(heading("Reflection", 2));
    text.split("\n\n").forEach(paragraph => {
        children.push(textParagraph(paragraph, { after: 180 }));
    });
}

async function pdfEvidenceToWord(file) {
    await ensurePdfLibrary();
    const { Paragraph, ImageRun, AlignmentType } = window.docx;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(await file.arrayBuffer())
    }).promise;
    const output = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.6 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

        const imageBlob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => blob ? resolve(blob) : reject(new Error("A PDF page could not be converted to an image.")),
                "image/jpeg",
                0.9
            );
        });

        let width = 600;
        let height = Math.round(width * canvas.height / canvas.width);
        if (height > 760) {
            height = 760;
            width = Math.round(height * canvas.width / canvas.height);
        }

        output.push(
            pageBreak(),
            textParagraph(`Page ${pageNumber} of ${pdf.numPages}`, {
                bold: true,
                center: true,
                size: 18,
                after: 80
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new ImageRun({
                    data: new Uint8Array(await imageBlob.arrayBuffer()),
                    transformation: { width, height }
                })]
            })
        );
    }
    return output;
}

async function imageEvidenceToWord(file) {
    const { Paragraph, ImageRun, AlignmentType } = window.docx;
    const bitmap = await createImageBitmap(file);
    let width = bitmap.width;
    let height = bitmap.height;
    const scale = Math.min(1, 600 / width, 760 / height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    bitmap.close();

    return [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new ImageRun({
            data: new Uint8Array(await file.arrayBuffer()),
            transformation: { width, height }
        })]
    })];
}

async function docxEvidenceToWord(file) {
    await ensureMammothLibrary();
    const result = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer()
    });
    const paragraphs = result.value
        .split(/\n+/)
        .map(cleanText)
        .filter(Boolean)
        .map(text => textParagraph(text));
    return paragraphs.length
        ? paragraphs
        : [textParagraph("The Word document contained no readable text.")];
}

async function evidenceToWord(item) {
    if (!item.file) {
        return [textParagraph(
            `No evidence file is stored for ${item.fileName || item.title}.`,
            { color: "8C307B", bold: true }
        )];
    }

    const extension = fileExtension(item.fileName);
    if (extension === ".pdf" || item.file.type === "application/pdf") {
        return pdfEvidenceToWord(item.file);
    }
    if (/^image\//.test(item.file.type) || [".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(extension)) {
        return imageEvidenceToWord(item.file);
    }
    if (extension === ".docx" || item.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return docxEvidenceToWord(item.file);
    }
    if (extension === ".txt" || item.file.type === "text/plain") {
        return (await item.file.text()).split(/\n+/).filter(Boolean).map(text => textParagraph(text));
    }
    return [textParagraph(
        `The file ${item.fileName} cannot be inserted into the Full Portfolio Document. Use the Indexed Portfolio Pack to retain the original file.`,
        { color: "8C307B", bold: true }
    )];
}

async function exportFull(items) {
    if (!items.length) return alert("Add evidence before creating a portfolio.");

    const button = document.getElementById("fullExport");
    const originalText = button ? button.textContent : "";
    if (button) {
        button.disabled = true;
        button.textContent = "Loading Word support...";
    }

    try {
        await ensureWordLibrary();
        if (button) button.textContent = "Building portfolio...";

        const {
            Document, Packer, Paragraph, TextRun, AlignmentType,
            Header, Footer, PageNumber
        } = window.docx;
        const profile = JSON.parse(localStorage.getItem("portfolioProfile") || "{}");
        const sortedItems = sortEvidence(items);
        const bookmarks = {};
        const domainIndexBookmark = bookmarkId("portfolio", "domain_criterion_index");
        sortedItems.forEach((item, index) => {
            bookmarks[item.id] = bookmarkId("evidence", `${index + 1}_${item.id}`);
        });

        const children = [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 3000, after: 300 },
                children: [new TextRun({
                    text: "Portfolio for Specialist Pathway",
                    bold: true,
                    color: "1E3C4A",
                    size: 40
                })]
            }),
            textParagraph(profile.name || "Candidate", {
                center: true, bold: true, size: 30, color: "109EAA"
            }),
            textParagraph(profile.specialty || "", {
                center: true, size: 26, color: "8C307B"
            }),
            textParagraph(`Generated ${new Date().toLocaleDateString("en-GB")}`, {
                center: true, size: 20
            }),
            pageBreak(),
            heading("Contents", 1)
        ];

        sortedItems.forEach(item => {
            children.push(internalLink(
                item.title,bookmarks[item.id],
                { size: 20, after: 60 }
            ));
        });
        children.push(pageBreak());

        for (let index = 0; index < sortedItems.length; index += 1) {
            const item = sortedItems[index];
            children.push(
                bookmarkedHeading(item.title, 1, bookmarks[item.id], index > 0),
                textParagraph(`Date: ${fmtDate(item.date) || "Date not entered"}`, { bold: true }),
                heading("Evidence types", 2)
            );

            children.push(new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun(String(item.evidenceType || (item.evidenceTypes || [])[0] || "Not recorded"))]
            }));
            (item.evidenceSubtypes || []).forEach(value => {
                children.push(new Paragraph({
                    bullet: { level: 1 },
                    children: [new TextRun(String(value))]
                }));
            });
            if (item.appraisalObjectivesCompleted) {
                children.push(textParagraph("This appraisal shows completed objectives.", { bold: true }));
            }

            children.push(heading("Domains and criteria", 2));
            const groupedCriteria = criteriaByDomain(item);
            Object.keys(groupedCriteria).map(Number).sort((a, b) => a - b).forEach(domain => {
                children.push(textParagraph(
                    `Domain ${domain}: ${groupedCriteria[domain].join(", ")}`,
                    { bold: true }
                ));
            });

            addReflection(children, item.reflection);
            if (item.reflectionFile) {
                children.push(heading("Uploaded Reflection", 2));
                try {
                    children.push(...await evidenceToWord({
                        file: item.reflectionFile,
                        fileName: item.reflectionFileName || "Uploaded reflection"
                    }));
                } catch (error) {
                    children.push(textParagraph(
                        `The uploaded reflection could not be inserted: ${error.message}`,
                        { color: "8C307B", bold: true }
                    ));
                }
            }
            children.push(heading("Evidence", 2));
            try {
                children.push(...await evidenceToWord(item));
            } catch (error) {
                children.push(textParagraph(
                    `The evidence file could not be inserted: ${error.message}`,
                    { color: "8C307B", bold: true }
                ));
            }
        }

        children.push(pageBreak(),bookmarkedHeading("Domain and Criterion Index",1,domainIndexBookmark, false));
        for (const domain of APP_DATA.domains) {
            children.push(heading(domain.name, 2));
            for (const criterion of APP_DATA.criteria.filter(entry => entry.domain === domain.id)) {
                const linked = sortedItems.filter(item => (item.criteria || []).includes(criterion.code));
                if (!linked.length) continue;
                children.push(heading(criterion.code, 3));
                linked.forEach(item => children.push(internalLink(
                    `${fmtDate(item.date) || "Date not entered"} - ${item.title}`,
                    bookmarks[item.id],
                    { indent: 360, size: 20, after: 50 }
                )));
            }
        }

        const document = new Document({
            creator: "Specialist Portfolio Builder",
            title: "Full Portfolio",
            description: "Specialist pathway portfolio",
            styles: {
                default: { document: { run: { font: "Segoe UI", size: 22 } } },
                paragraphStyles: [
                    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, color: "1E3C4A" }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
                    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, color: "109EAA" }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
                    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, color: "8C307B" }, paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 2 } }
                ]
            },
            sections: [{
                properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
                headers: { default: new Header({
                    children: [textParagraph(
                        `Portfolio - ${profile.name || "Candidate"} (${profile.specialty || ""})`,
                        { size: 18, color: "627780" }
                    )]
                }) },
                footers: { default: new Footer({
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ children: ["Page ", PageNumber.CURRENT] })]
                    })]
                }) },
                children
            }]
        });

        blobDownload(await Packer.toBlob(document), "Full_Portfolio.docx");
    } catch (error) {
        console.error(error);
        alert("The full portfolio could not be created. " + error.message);
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}

function crcTable() {
    const table = [];
    for (let number = 0; number < 256; number += 1) {
        let current = number;
        for (let bit = 0; bit < 8; bit += 1) {
            current = current & 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
        }
        table[number] = current >>> 0;
    }
    return table;
}

const CRCT = crcTable();
function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) value = CRCT[(value ^ byte) & 255] ^ (value >>> 8);
    return (value ^ 0xffffffff) >>> 0;
}
function u16(number) { return new Uint8Array([number & 255, number >>> 8 & 255]); }
function u32(number) {
    return new Uint8Array([number & 255, number >>> 8 & 255, number >>> 16 & 255, number >>> 24 & 255]);
}
function join(arrays) {
    const length = arrays.reduce((total, array) => total + array.length, 0);
    const output = new Uint8Array(length);
    let position = 0;
    for (const array of arrays) {
        output.set(array, position);
        position += array.length;
    }
    return output;
}

async function makeZip(files) {
    const encoder = new TextEncoder();
    const localFiles = [];
    const centralDirectory = [];
    let offset = 0;
    for (const file of files) {
        const name = encoder.encode(file.name.replace(/\\/g, "/"));
        const data = new Uint8Array(await file.data.arrayBuffer());
        const checksum = crc32(data);
        const localHeader = join([
            u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
            u32(checksum), u32(data.length), u32(data.length),
            u16(name.length), u16(0), name, data
        ]);
        localFiles.push(localHeader);
        centralDirectory.push(join([
            u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
            u32(checksum), u32(data.length), u32(data.length),
            u16(name.length), u16(0), u16(0), u16(0), u16(0),
            u32(0), u32(offset), name
        ]));
        offset += localHeader.length;
    }
    const central = join(centralDirectory);
    const body = join(localFiles);
    const end = join([
        u32(0x06054b50), u16(0), u16(0),
        u16(files.length), u16(files.length),
        u32(central.length), u32(body.length), u16(0)
    ]);
    return new Blob([body, central, end], { type: "application/zip" });
}

function indexedAnchor(item, index) {
    return "evidence_" + String(index + 1) + "_" + String(item.id).replace(/[^A-Za-z0-9_-]/g, "_");
}
async function uploadedReflectionText(item) {
    if (!item.reflectionFile) return "";
    const extension = fileExtension(item.reflectionFileName);
    if (extension === ".txt" || item.reflectionFile.type === "text/plain") {
        return await item.reflectionFile.text();
    }
    if (extension === ".docx" || item.reflectionFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        await ensureMammothLibrary();
        const result = await mammoth.extractRawText({ arrayBuffer: await item.reflectionFile.arrayBuffer() });
        return result.value || "";
    }
    return "The uploaded reflection could not be inserted because it is not a supported text-based reflection file.";
}
function portableEvidenceHref(fileName) {
    return "Evidence/" + String(fileName || "")
        .replace(/\\/g, "/")
        .split("/")
        .map(segment => encodeURIComponent(segment))
        .join("/");
}
function htmlParagraphs(value) {
    return String(value || "")
        .split(/\r?\n+/)
        .map(cleanText)
        .filter(Boolean)
        .map(paragraph => `<p>${esc(paragraph)}</p>`)
        .join("");
}
async function buildIndexedHtml(items, names) {
    const profile = JSON.parse(localStorage.getItem("portfolioProfile") || "{}");
    const sortedItems = sortEvidence(items);
    const anchors = {};
    sortedItems.forEach((item, index) => {
        anchors[item.id] = indexedAnchor(item, index);
    });
    const pageBreak = '<br clear="all" style="mso-special-character:line-break;page-break-before:always">';

    let contents = '<a name="contents" id="contents"></a><h1>Contents</h1><ul>';
    sortedItems.forEach(item => {
        contents += `<li><a href="#${anchors[item.id]}">${esc(item.title)}</a></li>`;
    });
    contents += '</ul><p><a href="#domainCriterionIndex">Go to Domain and Criterion Index</a></p>';

    let body = "";
    for (const item of sortedItems) {
        body += pageBreak;
        body += `<a name="${anchors[item.id]}" id="${anchors[item.id]}"></a>`;
        body += '<div class="evidence-section">';
        body += `<h1>${esc(item.title)}</h1>`;
        body += `<p><b>Evidence date:</b> ${esc(fmtDate(item.date) || "Date not entered")}</p>`;
        body += '<h2>Evidence type</h2><ul>';
        body += `<li>${esc(item.evidenceType || (item.evidenceTypes || [])[0] || "Not recorded")}</li>`;
        body += (item.evidenceSubtypes || []).map(value => `<li>${esc(value)}</li>`).join("");
        body += '</ul>';
        if (item.appraisalObjectivesCompleted) body += '<p><b>This appraisal shows completed objectives.</b></p>';
        body += '<h2>Domains and criteria</h2>';
        const grouped = criteriaByDomain(item);
        Object.keys(grouped).map(Number).sort((a,b)=>a-b).forEach(domain => {
            body += `<p><b>Domain ${domain}:</b> ${esc(grouped[domain].join(", "))}</p>`;
        });
        const written = reflectionNarrative(item.reflection);
        const uploaded = await uploadedReflectionText(item);
        if (written || cleanText(uploaded)) {
            body += '<h2>Reflection</h2>';
            if (written) body += htmlParagraphs(written);
            if (cleanText(uploaded)) body += '<h3>Uploaded reflection</h3>' + htmlParagraphs(uploaded);
        }
        const packedName = names[item.id];
        body += '<h2>Evidence</h2>';
        body += packedName ? `<p><a href="${portableEvidenceHref(packedName)}">Open evidence: ${esc(packedName)}</a></p>` : '<p>No file attached</p>';
        body += '</div>';
    }

    let index = pageBreak + '<a name="domainCriterionIndex" id="domainCriterionIndex"></a><h1>Domain and Criterion Index</h1>';
    for (const domain of APP_DATA.domains) {
        index += `<h2>${esc(domain.name)}</h2>`;
        for (const criterion of APP_DATA.criteria.filter(entry => entry.domain === domain.id)) {
            const linked = sortedItems.filter(item => (item.criteria || []).includes(criterion.code));
            if (!linked.length) continue;
            index += `<h3>${esc(criterion.code)}</h3><ul>`;
            index += linked.map(item => `<li><a href="#${anchors[item.id]}">${esc(fmtDate(item.date) || "Date not entered")} - ${esc(item.title)}</a></li>`).join("");
            index += '</ul>';
        }
    }

    return `<!doctype html><html><head><meta charset="utf-8"><title>Portfolio Document</title><style>
@page{size:8.27in 11.69in;margin:1in}
body,p,li{font-family:"Segoe UI",Arial,sans-serif;font-size:11pt;color:#1E3C4A;line-height:1.15}
p{margin:0 0 8pt 0}ul{margin:0 0 12pt 20pt;padding-left:14pt}li{margin:0 0 4pt 0}
h1{font-family:"Segoe UI",Arial,sans-serif;font-size:18pt;font-weight:700;color:#1E3C4A;margin:24pt 0 12pt;page-break-before:avoid;page-break-after:avoid}
h2{font-family:"Segoe UI",Arial,sans-serif;font-size:14pt;font-weight:600;color:#109EAA;margin:18pt 0 6pt;page-break-before:avoid;page-break-after:avoid}
h3{font-family:"Segoe UI",Arial,sans-serif;font-size:12pt;font-weight:600;color:#1F3763;margin:12pt 0 6pt;page-break-before:avoid;page-break-after:avoid}
.cover{text-align:center;padding-top:180pt}.cover h1{margin:0 0 24pt}.cover h2{color:#109EAA;margin:0 0 8pt}.cover p{margin:0}
.evidence-section{margin:0;page-break-before:avoid}a{color:#0563C1;text-decoration:underline}
</style></head><body><div class="cover"><h1>Portfolio for Specialist Pathway</h1><h2>${esc(profile.name || "Candidate")}</h2><p>${esc(profile.specialty || "")}</p></div>${pageBreak}${contents}${body}${index}</body></html>`;
}
function showIndexedPortfolioDownloadNotice(){
    const html=`<h2>Important!</h2><p>Please ensure you extract or unzip the files before use to enable indexed evidence files to open.</p><p>Advise anyone receiving the zipped file to extract or unzip it before opening the Portfolio Document.</p><p>The <b>Portfolio Document and folder</b> may be renamed, but the structure inside the folder <b>must not</b> be changed.</p>`;
    if(typeof modalChoice==="function"){modalChoice(html,[{id:"spbCloseIndexedNotice",className:"spb-primary",label:"I understand",value:"close"}]);return;}
    alert("Important!\n\nPlease extract or unzip the files before use. The Portfolio Document and folder may be renamed, but the structure inside the folder MUST not be changed.");
}
async function exportIndexed(items){
    const files=[],usedNames={},indexedNames={};
    for(const item of items){
        if(!item.file)continue;
        let name=(item.fileName||`evidence_${item.id}`).replace(/[<>:"/\\|?*]/g,"_");
        if(usedNames[name.toLowerCase()])name=`${item.id}_${name}`;
        usedNames[name.toLowerCase()]=true;indexedNames[item.id]=name;
        files.push({name:"Evidence/"+name,data:item.file});
    }
    files.unshift({name:"Portfolio Document.doc",data:new Blob(["\ufeff",await buildIndexedHtml(items,indexedNames)],{type:"application/msword"})});
    blobDownload(await makeZip(files),"Indexed_Portfolio_Pack.zip");
    window.setTimeout(showIndexedPortfolioDownloadNotice,300);
}
