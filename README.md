# Langfuse landing — static replica

Réplica estática de la landing de [langfuse.com](https://langfuse.com/), construida con HTML + CSS + JS vanilla (sin dependencias, sin build).

## Ver

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python -m http.server 8080
# http://localhost:8080
```

## Estructura

| Archivo | Descripción |
|---|---|
| `index.html` | Estructura de la página: banner, header con mega-menús, hero, loop de trabajo, grid de herramientas, stacks soportados, open source, "Why Langfuse", CTA, FAQ y footer |
| `styles.css` | Design tokens reales extraídos del CSS de langfuse.com + tema claro/oscuro y responsive |
| `app.js` | Toggle de tema, header sticky, mega-menús, menú móvil, contadores animados, FAQ acordeón, reveal on scroll |

## Notas

- Los tokens de color y tipografía provienen de las hojas de estilo públicas de langfuse.com.
- Las fuentes originales (Geist Mono, F37 Analog) se sustituyen por JetBrains Mono.
- Responsive: testado en breakpoints de 1440 / 1000 / 900 / 860 / 560 px.
