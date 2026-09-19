\# Arquitectura - Auditor Agéntico de Facturación de Siniestros



\## 1. Objetivo



El proyecto implementa un auditor automatizado para analizar facturas asociadas a siniestros antes de su revisión humana.



La solución permite detectar:



\- Conceptos fuera del tarifario autorizado.

\- Precios superiores al máximo permitido.

\- Posibles conceptos duplicados.

\- Diferencias económicas asociadas a los hallazgos.

\- Facturas que requieren revisión humana.



Además, utiliza un modelo de lenguaje local para generar una explicación comprensible de los resultados de la auditoría.



\---



\## 2. Arquitectura de la solución



Flujo principal:



Cliente / Sistema externo

&#x20;       |

&#x20;       v

Webhook REST - n8n

&#x20;       |

&#x20;       v

Motor determinístico - JavaScript

&#x20;       |

&#x20;       v

Análisis IA - Ollama / Qwen

&#x20;       |

&#x20;       v

Respuesta estructurada JSON

&#x20;       |

&#x20;       v

Auditor humano



\---



\## 3. Componentes



\### n8n



Orquesta el flujo completo de auditoría.



Responsabilidades:



\- Recibir la factura mediante Webhook.

\- Ejecutar las reglas determinísticas.

\- Enviar los resultados al modelo de IA.

\- Consolidar el resultado.

\- Retornar la respuesta mediante API.



\### Motor determinístico



Implementado mediante un nodo Code en JavaScript.



Realiza validaciones matemáticas y de negocio que no deben depender de un modelo generativo.



Actualmente verifica:



\- Tarifas máximas.

\- Conceptos no incluidos en el tarifario.

\- Posibles duplicados.

\- Impacto económico de los hallazgos.



\### Ollama



Permite ejecutar el modelo de lenguaje localmente.



Modelo utilizado:



`qwen3:0.6b`



Su función es interpretar y explicar los hallazgos generados por el motor determinístico.



La IA no modifica los cálculos originales.



\### Docker



Se utiliza para ejecutar los servicios necesarios de manera aislada y reproducible.



\---



\## 4. Principio de diseño



La solución separa las decisiones determinísticas del análisis generativo.



Los cálculos financieros y las reglas de negocio son realizados mediante código.



La inteligencia artificial se utiliza para:



\- Interpretar hallazgos.

\- Resumir resultados.

\- Generar recomendaciones para el auditor.



Esto reduce el riesgo de utilizar resultados matemáticos generados directamente por un modelo de lenguaje.



\---



\## 5. Supervisión humana



La solución no aprueba ni rechaza automáticamente pagos.



Cuando se detectan anomalías, la factura se marca como:



`REVISION\_REQUERIDA`



El resultado es presentado a un auditor humano para su validación.



\---



\## 6. Datos utilizados



Todos los datos incluidos en este repositorio son sintéticos y fueron creados exclusivamente para demostración.



No contienen información real de aseguradoras, talleres, clientes o siniestros.



\---



\## 7. Tecnologías



\- n8n

\- Docker

\- Ollama

\- Qwen

\- JavaScript

\- REST API

\- JSON

\- Git

\- GitHub

