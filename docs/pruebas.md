\# Pruebas - Auditor Agéntico de Facturación de Siniestros



\## Caso de prueba 01 - Factura con anomalías



\### Objetivo



Validar que el agente pueda detectar automáticamente sobrecostos y posibles conceptos duplicados antes de la revisión humana.



\### Datos de entrada



Factura:



`FAC-2026-00125`



Siniestro:



`SIN-2026-00987`



Taller:



`Taller Demo Panama`



Total facturado:



`$1,080.00`



Cantidad de conceptos:



`4`



\---



\## Anomalías incluidas intencionalmente



\### Sobrecosto



Concepto:



`PIN-001 - Pintura de parachoques`



Precio facturado:



`$210.00`



Precio máximo permitido:



`$120.00`



Diferencia detectada:



`$90.00`



\### Posible duplicado



Concepto:



`REP-002 - Reemplazo de faro`



El concepto aparece repetido en la factura.



Impacto económico identificado:



`$360.00`



\---



\## Resultado del motor determinístico



El motor de auditoría produjo:



\- Total facturado: `$1,080.00`

\- Cantidad de hallazgos: `2`

\- Sobrecosto detectado: `$90.00`

\- Posible duplicado: `$360.00`

\- Monto total observado: `$450.00`

\- Riesgo: `ALTO`

\- Estado: `REVISION\_REQUERIDA`

\- Requiere revisión humana: `true`



\---



\## Análisis mediante IA



Después de ejecutar las reglas determinísticas, los resultados fueron enviados al modelo local ejecutado mediante Ollama.



Modelo:



`qwen3:0.6b`



El modelo generó:



\- Resumen de la auditoría.

\- Explicación de los hallazgos.

\- Recomendación para revisión humana.



La IA no recalcula ni modifica los importes determinados por el motor de reglas.



\---



\## Resultado esperado



La factura no debe rechazarse automáticamente.



Debe quedar marcada como:



`REVISION\_REQUERIDA`



El auditor humano recibe los hallazgos y puede verificar la documentación antes de continuar con el proceso.



\---



\## Estado de la prueba



\*\*PRUEBA EXITOSA\*\*

