const WEBHOOK_URL =
    "https://api-auditor.shadowseclabs.xyz/webhook/auditar-siniestro";

const form = document.getElementById("auditForm");
const itemsBody = document.getElementById("itemsBody");
const addItemButton = document.getElementById("addItem");
const auditButton = document.getElementById("auditButton");


// ============================================================
// AGREGAR CONCEPTO
// ============================================================

addItemButton?.addEventListener("click", () => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input
                type="text"
                class="item-code"
                placeholder="Código"
                required
            >
        </td>

        <td>
            <input
                type="text"
                class="item-description"
                placeholder="Descripción"
                required
            >
        </td>

        <td>
            <input
                type="number"
                class="item-quantity"
                min="1"
                value="1"
                required
            >
        </td>

        <td>
            <input
                type="number"
                class="item-price"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
            >
        </td>

        <td>
            <button
                type="button"
                class="remove-item"
                title="Eliminar concepto"
            >
                ×
            </button>
        </td>
    `;

    itemsBody.appendChild(row);
});


// ============================================================
// ELIMINAR CONCEPTO
// ============================================================

itemsBody?.addEventListener("click", (event) => {

    if (event.target.classList.contains("remove-item")) {

        const rows = itemsBody.querySelectorAll("tr");

        if (rows.length <= 1) {
            alert("La factura debe contener al menos un concepto.");
            return;
        }

        event.target.closest("tr").remove();
    }
});


// ============================================================
// CONSTRUIR FACTURA
// ============================================================

function buildInvoice() {

    const rows = itemsBody.querySelectorAll("tr");

    const items = Array.from(rows).map((row) => {

        // Tomamos los 4 inputs de cada fila por su posición
        const inputs = row.querySelectorAll("input");

        return {
            codigo: inputs[0].value.trim(),
            descripcion: inputs[1].value.trim(),
            cantidad: Number(inputs[2].value),
            precio_unitario: Number(inputs[3].value)
        };
    });

    return {

        factura_id:
            document.getElementById("facturaId").value.trim(),

        siniestro_id:
            document.getElementById("siniestroId").value.trim(),

        taller:
            document.getElementById("taller").value.trim(),

        items,

        total_facturado:
            Number(
                document.getElementById("totalFacturado").value
            )
    };
}

// ============================================================
// AUDITAR FACTURA
// ============================================================

form?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const invoice = buildInvoice();

    setLoading(true);

    try {

        const response = await fetch(WEBHOOK_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(invoice)
        });


        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );
        }


        const result = await response.json();

        renderAudit(result);

    } catch (error) {

        console.error(error);

        alert(
            "No fue posible ejecutar la auditoría.\n\n" +
            "Comprueba que n8n esté ejecutándose y que " +
            "el Webhook esté esperando una solicitud de prueba."
        );

    } finally {

        setLoading(false);
    }
});


// ============================================================
// LOADING
// ============================================================

function setLoading(active) {

    const loading =
        document.getElementById("loadingPanel");

    if (active) {

        loading?.classList.remove("hidden");

        auditButton.disabled = true;

        auditButton.innerHTML =
            "Analizando factura...";

    } else {

        loading?.classList.add("hidden");

        auditButton.disabled = false;

        auditButton.innerHTML =
            "Auditar factura";
    }
}


// ============================================================
// MOSTRAR RESULTADOS
// ============================================================

function renderAudit(data) {

    const results =
        document.getElementById("results");

    results?.classList.remove("hidden");

    // --------------------------------------------------------
    // Datos generales
    // --------------------------------------------------------

    setText("resultInvoice", data.factura_id || "-");
    setText("metricRisk", data.riesgo || "-");

    // Los montos vienen dentro del objeto "resumen"
    const resumen = data.resumen || {};

    setText(
    "metricTotal",
    formatMoney(resumen.total_facturado || 0)
);

    setText(
    "metricObserved",
    formatMoney(resumen.monto_total_observado || 0)
);

    setText(
        "resultOvercharge",
        formatMoney(resumen.monto_sobrecosto || 0)
    );

    setText(
        "resultDuplicate",
        formatMoney(resumen.monto_posible_duplicado || 0)
    );

    // Cantidad de hallazgos
    setText(
    "metricFindings",
    resumen.cantidad_hallazgos || 0
);


    // --------------------------------------------------------
    // Hallazgos determinísticos
    // --------------------------------------------------------

    const findingsContainer =
        document.getElementById("findingsList");

    if (findingsContainer) {

        findingsContainer.innerHTML = "";

        const hallazgos = data.hallazgos || [];

        if (hallazgos.length === 0) {

            findingsContainer.innerHTML =
                "<p>No se detectaron hallazgos.</p>";

        } else {

            hallazgos.forEach((hallazgo) => {

                const item =
                    document.createElement("div");

                item.className = "finding-item";

                let detalle = "";

                if (hallazgo.tipo === "SOBRECOSTO") {

                    detalle =
                        `${hallazgo.descripcion || hallazgo.codigo}: ` +
                        `precio facturado ${formatMoney(hallazgo.precio_facturado)}, ` +
                        `máximo permitido ${formatMoney(hallazgo.precio_maximo)}. ` +
                        `Diferencia: ${formatMoney(hallazgo.diferencia)}.`;

                } else if (
                    hallazgo.tipo === "POSIBLE_DUPLICADO"
                ) {

                    detalle =
                        `${hallazgo.descripcion || hallazgo.codigo}: ` +
                        `posible concepto duplicado. ` +
                        `Impacto: ${formatMoney(hallazgo.impacto)}.`;

                } else {

                    detalle =
                        hallazgo.detalle ||
                        hallazgo.descripcion ||
                        hallazgo.codigo ||
                        "Hallazgo detectado.";
                }

                item.innerHTML = `
                    <strong>${hallazgo.tipo || "HALLAZGO"}</strong>
                    <p>${detalle}</p>
                `;

                findingsContainer.appendChild(item);
            });
        }
    }


    // --------------------------------------------------------
    // Análisis de IA - Qwen / Ollama
    // --------------------------------------------------------

    const aiAnalysis =
        document.getElementById("aiAnalysis");

    if (aiAnalysis) {

        aiAnalysis.textContent =
            data.analisis_ia ||
            "No se recibió análisis del modelo.";
    }


    // --------------------------------------------------------
    // Estado de auditoría
    // --------------------------------------------------------

    const status =
    document.getElementById("resultStatus");

    if (status) {

    	const estado = data.estado || "SIN_ESTADO";

    status.textContent =
        estado.replaceAll("_", " ");

    status.classList.remove(
        "status-ok",
        "status-review"
    );

    if (estado === "PREVALIDADA") {

        status.classList.add("status-ok");

    } else {

        status.classList.add("status-review");
    }
}

const risk =
    document.getElementById("metricRisk");

if (risk) {

    const nivel =
        (data.riesgo || "").toUpperCase();

    risk.classList.remove(
        "risk-low",
        "risk-medium",
        "risk-high"
    );

    if (nivel === "BAJO") {

        risk.classList.add("risk-low");

    } else if (nivel === "MEDIO") {

        risk.classList.add("risk-medium");

    } else if (nivel === "ALTO") {

        risk.classList.add("risk-high");
    }
}

    // --------------------------------------------------------
    // Revisión humana
    // --------------------------------------------------------

    const humanReview =
        document.getElementById("humanReview");

    if (humanReview) {

        if (data.requiere_revision_humana) {

            humanReview.classList.remove("hidden");

        } else {

            humanReview.classList.add("hidden");
        }
    }


    // Llevar al usuario al resultado
    results?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ============================================================
// UTILIDADES
// ============================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value ?? "-";
    }
}


function formatMoney(value) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(Number(value || 0));
}




