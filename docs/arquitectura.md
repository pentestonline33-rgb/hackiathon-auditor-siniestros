# Arquitectura de la solución

## Auditor Agéntico de Facturación de Siniestros

La solución implementa un flujo de auditoría asistida por inteligencia artificial para realizar una prevalidación de facturas asociadas a siniestros antes de su revisión humana.

El diseño separa los cálculos y reglas de negocio del análisis realizado por el modelo de lenguaje.

---

## Arquitectura general

El flujo principal es:

Frontend Web
↓
Webhook REST
↓
n8n
↓
Motor determinístico (JavaScript)
↓
Agente IA (Qwen)
↓
Respuesta estructurada
↓
Frontend
↓
Revisión humana

---

## 1. Frontend Web

La interfaz permite ingresar y modificar los datos de una factura:

- Número de factura.
- Número de siniestro.
- Taller.
- Total facturado.
- Código del concepto.
- Descripción.
- Cantidad.
- Precio unitario.

Al seleccionar **Auditar factura**, los datos son enviados mediante una solicitud HTTP POST al Webhook publicado por n8n.

La interfaz muestra posteriormente:

- Total facturado.
- Monto observado.
- Cantidad de hallazgos.
- Nivel de riesgo.
- Estado de la auditoría.
- Hallazgos determinísticos.
- Explicación generada por IA.

---

## 2. Webhook de n8n

n8n funciona como orquestador del proceso.

El Webhook recibe la factura enviada por el frontend y activa automáticamente el workflow de auditoría.

Endpoint utilizado durante el desarrollo:

POST /webhook/auditar-siniestro

El Webhook no contiene las reglas de auditoría; su función es recibir la solicitud e iniciar el flujo.

---

## 3. Motor determinístico

El motor de auditoría está implementado mediante JavaScript dentro del workflow de n8n.

Su función es ejecutar reglas de negocio reproducibles sin depender del modelo de inteligencia artificial.

Entre las validaciones implementadas se encuentran:

- Comparación del precio facturado contra el precio máximo del tarifario.
- Identificación de conceptos fuera del tarifario.
- Identificación preliminar de posibles conceptos duplicados.
- Cálculo del monto asociado a sobrecostos.
- Cálculo del monto asociado a posibles duplicados.
- Clasificación preliminar del nivel de riesgo.
- Determinación de si se requiere revisión humana.

El motor genera una salida JSON estructurada que posteriormente es utilizada por el componente de IA.

---

## 4. Agente de Inteligencia Artificial

La solución utiliza un modelo Qwen ejecutado localmente mediante Ollama.

El modelo no realiza los cálculos financieros ni determina por sí mismo las irregularidades.

Su función consiste en interpretar y explicar los resultados generados previamente por el motor determinístico.

El prompt establece restricciones explícitas para evitar que el modelo:

- Invente irregularidades.
- Recalcule montos.
- Modifique la clasificación de riesgo.
- Afirme la existencia de fraude.
- Autorice pagos.
- Rechace pagos.

Esto permite utilizar IA generativa como componente explicativo manteniendo las decisiones críticas bajo reglas controladas.

---

## 5. Respuesta estructurada

Después del análisis, n8n devuelve al frontend información como:

- Identificador de factura.
- Identificador del siniestro.
- Estado.
- Nivel de riesgo.
- Resumen de auditoría.
- Hallazgos.
- Indicador de revisión humana.
- Análisis generado por IA.

El frontend utiliza estos datos para construir visualmente el resultado de la auditoría.

---

## 6. Control humano

La solución aplica un enfoque Human-in-the-Loop.

Cuando existen hallazgos, el sistema no rechaza automáticamente una factura ni determina la existencia de fraude.

El resultado se marca para revisión y corresponde a un auditor humano validar la información antes de continuar con el proceso.

Cuando no existen hallazgos detectados, la factura puede quedar en estado PREVALIDADA, sin que esto represente una autorización automática de pago.

---

## 7. Tecnologías utilizadas

| Componente | Tecnología |
|---|---|
| Orquestación | n8n |
| Motor de reglas | JavaScript |
| Modelo de IA | Qwen |
| Ejecución del modelo | Ollama |
| Contenedores | Docker |
| Frontend | HTML, CSS y JavaScript |
| Comunicación | REST / JSON |
| Control de versiones | Git / GitHub |

---

## 8. Flujo de procesamiento

1. El usuario introduce o modifica los datos de la factura.
2. El frontend construye un objeto JSON.
3. La factura es enviada mediante POST al Webhook.
4. n8n recibe la solicitud.
5. El motor determinístico ejecuta las reglas de auditoría.
6. Se generan los hallazgos y la clasificación de riesgo.
7. Qwen recibe únicamente los resultados estructurados.
8. El modelo genera una explicación en español.
9. n8n construye la respuesta final.
10. El frontend presenta el resultado.
11. Cuando corresponde, el caso queda sujeto a revisión humana.

---

## Principio de diseño

La arquitectura sigue el principio:

**Las reglas detectan. La IA explica. El humano decide.**

Esta separación busca mantener los cálculos críticos de auditoría bajo reglas determinísticas y utilizar la inteligencia artificial como apoyo para interpretar los resultados.

