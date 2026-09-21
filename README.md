# 🤖 Auditor Agéntico de Facturación de Siniestros

Solución desarrollada para el **HackIAthon 2026** orientada a la prevalidación automatizada de facturas asociadas a siniestros.

El sistema combina un **motor determinístico de reglas** con **Inteligencia Artificial local**, permitiendo detectar sobrecostos, conceptos fuera de tarifario y posibles duplicados antes de la revisión de un auditor humano.

> **Principio de diseño:** Las reglas detectan. La IA explica. El humano decide.


## 🚀 Demo en vivo

La solución se encuentra disponible para demostración en:

**Aplicación:** https://auditor.shadowseclabs.xyz/

### 🔐 Acceso de demostración

- **Usuario:** `demo@auditor.com`
- **Contraseña:** `demo1234`

> Las credenciales corresponden únicamente al entorno demostrativo del HackIAthon 2026. El acceso implementado en el frontend no representa un mecanismo de autenticación para un entorno de producción.

La aplicación incluye una factura sintética precargada, por lo que el flujo de auditoría puede probarse inmediatamente después de iniciar sesión.

### 🧪 Caso de demostración

La factura sintética incluida permite validar el comportamiento del auditor con un escenario que contiene un sobrecosto y un posible concepto duplicado.

Al ejecutar **Auditar factura**, el resultado esperado es:

| Resultado | Valor |
|---|---:|
| Total facturado | $1,080.00 |
| Monto observado | $450.00 |
| Hallazgos detectados | 2 |
| Sobrecosto | $90.00 |
| Posible duplicado | $360.00 |
| Nivel de riesgo | ALTO |
| Estado | REVISIÓN REQUERIDA |

El motor determinístico identifica los hallazgos y calcula los montos observados. Posteriormente, el modelo local **Qwen**, ejecutado mediante **Ollama**, genera una explicación de los resultados sin modificar los cálculos ni tomar la decisión final.

> **Control humano:** un resultado con hallazgos requiere revisión de un auditor. La IA no autoriza ni rechaza pagos.

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

---

## 🛠️ Tecnologías utilizadas

La solución fue construida utilizando componentes locales y servicios de exposición controlada para demostrar el flujo completo de auditoría.

| Tecnología | Función |
|---|---|
| **n8n** | Orquestación del flujo de auditoría y ejecución del motor de reglas |
| **JavaScript** | Lógica determinística para validaciones, cálculos y frontend |
| **Ollama** | Ejecución local del modelo de lenguaje |
| **Qwen** | Generación de explicaciones a partir de los hallazgos detectados |
| **Docker** | Ejecución y administración de los servicios del prototipo |
| **Cloudflare Tunnel** | Publicación segura del frontend y del endpoint de auditoría |
| **HTML / CSS / JavaScript** | Interfaz web del auditor |
| **Git / GitHub** | Control de versiones y publicación del código fuente |

### 🔒 Enfoque local de IA

El modelo de lenguaje se ejecuta localmente mediante **Ollama**, por lo que el prototipo no depende de una API externa de un proveedor de LLM para generar el análisis.

El servicio de Ollama no se expone directamente a Internet. Las solicitudes de auditoría son recibidas por el flujo de **n8n**, que controla la interacción con el motor determinístico y el modelo local.

---

## ⚙️ Ejecución del proyecto

### Requisitos

Para ejecutar el prototipo localmente se requiere:

- Docker Desktop
- Docker Compose
- Ollama
- Modelo Qwen disponible en Ollama
- Navegador web moderno

### 1. Clonar el repositorio

```bash
git clone https://github.com/pentestonline33-rgb/hackiathon-auditor-siniestros.git
cd hackiathon-auditor-siniestros

---

## ⚙️ Motor determinístico + Inteligencia Artificial

La solución separa la detección de inconsistencias de la generación de explicaciones. De esta forma, los cálculos críticos de la auditoría no dependen de la respuesta generada por un modelo de lenguaje.

### Motor determinístico

El motor de reglas ejecutado dentro de **n8n** es responsable de:

- Comparar los conceptos facturados contra el tarifario configurado.
- Detectar precios superiores al máximo permitido (`SOBRECOSTO`).
- Identificar conceptos que no existen en el tarifario (`FUERA_TARIFARIO`).
- Señalar códigos repetidos como posibles duplicados (`POSIBLE_DUPLICADO`).
- Calcular el monto observado.
- Determinar el nivel de riesgo.
- Definir si el caso requiere revisión humana.

### Inteligencia Artificial local

Una vez obtenidos los resultados determinísticos, **Qwen**, ejecutado localmente mediante **Ollama**, recibe los hallazgos y genera una explicación comprensible para el auditor.

El modelo de IA:

- No recalcula los montos.
- No crea nuevos hallazgos.
- No determina si existe fraude.
- No autoriza ni rechaza pagos.
- No sustituye la decisión del auditor humano.

> **Las reglas detectan. La IA explica. El humano decide.**
