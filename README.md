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
| `styles.css` | Design tokens reales extraídos del CSS de langfuse.com + temas claro/oscuro/rosa y responsive |
| `app.js` | Toggle de tema (claro → oscuro → rosa), header sticky, mega-menús, menú móvil, contadores animados, FAQ acordeón, reveal on scroll |

## Temas

El botón de tema del header rota entre **claro → oscuro → rosa** y guarda la elección en `localStorage` (`lf-theme`).

El tema se define con dos atributos en `<html>`:

- `data-theme` — la paleta (`light`, `dark`, `rosa`).
- `data-mode` — solo `light` / `dark`; decide qué reglas de "modo oscuro" aplican, para que un tema de color claro (rosa) pueda reutilizarlas sin arrastrar la paleta oscura.

Un tema nuevo es un bloque `html[data-theme="…"]` que redefine tokens; no hace falta tocar el layout. Además de los tokens de superficie/texto, conviene redefinir los derivados (`--accent-ink`, `--accent-line`, `--invert-bg`, `--eval-ink`…).

## Notas

- Los tokens de color y tipografía provienen de las hojas de estilo públicas de langfuse.com.
- Las fuentes originales (Geist Mono, F37 Analog) se sustituyen por JetBrains Mono.
- Responsive: testado en breakpoints de 1440 / 1000 / 900 / 860 / 560 px.
