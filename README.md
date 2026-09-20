# 🤖 Auditor Agéntico de Facturación de Siniestros

Solución desarrollada para el **HackIAthon 2026** orientada a la prevalidación automatizada de facturas asociadas a siniestros.

El sistema combina un **motor determinístico de reglas** con **Inteligencia Artificial local**, permitiendo detectar sobrecostos, conceptos fuera de tarifario y posibles duplicados antes de la revisión de un auditor humano.

> **Principio de diseño:** Las reglas detectan. La IA explica. El humano decide.

---

## 🎯 Problema

La revisión manual de facturas de talleres asociadas a siniestros puede requerir verificar múltiples conceptos, cantidades y tarifas antes de continuar con el proceso.

Este prototipo automatiza una primera capa de auditoría para identificar inconsistencias y presentar los resultados de forma clara al auditor.

La solución no autoriza ni rechaza pagos automáticamente.

---

## ✨ Funcionalidades

- Recepción de facturas mediante API REST.
- Comparación automática contra un tarifario.
- Detección de sobrecostos.
- Identificación de conceptos fuera del tarifario.
- Identificación preliminar de posibles duplicados.
- Cálculo del monto observado.
- Clasificación de riesgo.
- Generación de explicaciones mediante IA.
- Ejecución local del modelo de lenguaje.
- Interfaz web para demostración.
- Revisión humana para casos con hallazgos.

---

## 🧠 Arquitectura

```text
┌──────────────────┐
│   Frontend Web   │
│ HTML/CSS/JS      │
└────────┬─────────┘
         │ POST /webhook/auditar-siniestro
         ▼
┌──────────────────┐
│       n8n        │
│   Orquestador    │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Motor de reglas  │
│   JavaScript     │
└────────┬─────────┘
         │
         ├── Tarifas
         ├── Sobrecostos
         ├── Duplicados
         └── Riesgo
         │
         ▼
┌──────────────────┐
│   Qwen + Ollama  │
│    IA Local      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Respuesta JSON   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│    Frontend      │
│ Resultado final  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Revisión humana  │
└──────────────────┘
