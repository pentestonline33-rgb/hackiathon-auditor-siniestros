\# 🤖 Auditor Agéntico de Facturación de Siniestros



Solución desarrollada para HackIAthon orientada a automatizar la revisión inicial de facturas asociadas a siniestros de seguros.



El sistema analiza los conceptos facturados por talleres, compara los importes contra un tarifario de referencia, identifica posibles sobrecostos y cargos duplicados y utiliza un modelo de inteligencia artificial local para generar un análisis comprensible para el auditor humano.



\## 🎯 Reto



\*\*Reto 2 - Auditor Agéntico de Facturación de Siniestros\*\*



El objetivo es automatizar la auditoría de documentación y facturas enviadas por talleres a una aseguradora, verificando que los insumos y honorarios correspondan con el tarifario y con el siniestro reportado, permitiendo detectar discrepancias o posibles cargos duplicados antes de la revisión humana.



\## 🧠 Arquitectura



```text

Factura / Siniestro

&#x20;       │

&#x20;       ▼

&#x20;   Webhook API

&#x20;       │

&#x20;       ▼

&#x20;      n8n

&#x20;       │

&#x20;       ▼

Motor determinístico

&#x20;       │

&#x20;       ├── Validación de tarifario

&#x20;       ├── Detección de sobrecostos

&#x20;       └── Detección de posibles duplicados

&#x20;       │

&#x20;       ▼

&#x20;Ollama + Qwen

&#x20;       │

&#x20;       ▼

&#x20;Análisis asistido por IA

&#x20;       │

&#x20;       ▼

Resultado estructurado

&#x20;       │

&#x20;       ▼

&#x20;Revisión humana

