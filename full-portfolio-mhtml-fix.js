/* Specialist Portfolio Builder: MHTML full-portfolio export fix.
   Add this script AFTER js/export.js and BEFORE js/app.js. */
(function () {
    function bytesToBase64(bytes) {
        let binary = "";
        const blockSize = 0x8000;
        for (let index = 0; index < bytes.length; index += blockSize) {
            binary += String.fromCharCode(...bytes.subarray(index, index + blockSize));
        }
        return btoa(binary);
    }

    function stringToBase64(value) {
        return bytesToBase64(new TextEncoder().encode(value));
    }

    function wrapBase64(value) {
        const lines = value.match(/.{1,76}/g);
        return lines ? lines.join("\r\n") : "";
    }

    function createMhtmlDocument(html) {
        const boundary = "----=_NextPart_SPB_" + Date.now();
        const assets = [];
        let imageNumber = 0;

        const rewrittenHtml = html.replace(
            /data:(image\/(?:png|jpeg|jpg|gif));base64,([A-Za-z0-9+/=]+)/g,
            function (_match, mimeType, base64Data) {
                imageNumber += 1;

                const extension = mimeType.includes("png")
                    ? "png"
                    : mimeType.includes("gif")
                    ? "gif"
                    : "jpg";

                const fileName =
                    "portfolio_image_" +
                    String(imageNumber).padStart(5, "0") +
                    "." +
                    extension;

                assets.push({
                    fileName,
                    mimeType:
                        mimeType === "image/jpg"
                            ? "image/jpeg"
                            : mimeType,
                    base64Data
                });

                return fileName;
            }
        );

        const output = [
            "MIME-Version: 1.0",
            'Content-Type: multipart/related; type="text/html"; boundary="' +
                boundary +
                '"',
            "",
            "--" + boundary,
            'Content-Type: text/html; charset="utf-8"',
            "Content-Transfer-Encoding: base64",
            "Content-Location: Full_Portfolio.html",
            "",
            wrapBase64(stringToBase64(rewrittenHtml)),
            ""
        ];

        for (const asset of assets) {
            output.push(
                "--" + boundary,
                "Content-Type: " + asset.mimeType,
                "Content-Transfer-Encoding: base64",
                "Content-Location: " + asset.fileName,
                "",
                wrapBase64(asset.base64Data),
                ""
            );
        }

        output.push("--" + boundary + "--", "");
        return output.join("\r\n");
    }

    window.exportFull = async function exportFullMhtml(items) {
        if (!items || !items.length) {
            alert("Add evidence before creating a portfolio.");
            return;
        }

        const button = document.getElementById("fullExport");
        const originalText = button ? button.textContent : "";

        if (button) {
            button.disabled = true;
            button.textContent = "Building portfolio...";
        }

        try {
            const html = await buildPortfolioHtml(items, false);
            const mhtml = createMhtmlDocument(html);

            blobDownload(
                new Blob([mhtml], { type: "multipart/related" }),
                "Full_Portfolio.mht"
            );
        } catch (error) {
            console.error(error);
            alert(
                "The full portfolio could not be created. " +
                    (error && error.message ? error.message : "Unknown error")
            );
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    };
})();
