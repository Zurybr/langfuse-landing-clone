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
| `styles.css` | Design tokens reales extraídos del CSS de langfuse.com + 6 temas (claro, oscuro, rosa, verde, azul, morado) y responsive |
| `app.js` | Toggle de tema (cicla los 6 temas), header sticky, mega-menús, menú móvil, contadores animados, FAQ acordeón, reveal on scroll |

## Temas

Seis temas disponibles, seleccionables con el botón del header (cicla en orden
claro → oscuro → rosa → verde → azul → morado; el punto de color muestra el tema activo):

| Tema | `data-theme` | Apariencia | Acento |
|---|---|---|---|
| Claro | `light` | light | lima (`--surface-cta-primary`) |
| Oscuro | `dark` | dark | oliva |
| Rosa | `rosa` | light | rosa |
| Verde | `green` | light | menta |
| Azul | `blue` | light | cielo |
| Morado | `purple` | light | lavanda |

El tema se define con dos atributos en `<html>`:

- `data-theme` — la paleta (`light`, `dark`, `rosa`, `green`, `blue`, `purple`).
- `data-mode` — solo `light` / `dark`; decide qué reglas de "modo oscuro" aplican, para que un tema de color claro (rosa, verde, azul, morado) pueda reutilizarlas sin arrastrar la paleta oscura.

Cada tema redefine solo tokens de color (superficies, líneas, textos, acento) sobre
el mismo layout. Un tema nuevo es un bloque `html[data-theme="…"]` que redefine tokens;
no hace falta tocar el layout. Además de los tokens de superficie/texto, conviene redefinir
los derivados (`--accent-ink`, `--accent-line`, `--invert-bg`, `--eval-ink`…). Los estilos
que dependen de la variante clara/oscura usan `data-mode`, no `data-theme`, para que los
temas de color hereden correctamente el render oscuro.
El tema elegido se guarda en `localStorage` (`lf-theme`) y tiene prioridad sobre el
`data-theme` precargado en el HTML, que solo actúa como valor por defecto.

## Animaciones isométricas (Hairline)

Se incorporaron figuras vectoriales isométricas que responden interactivamente al puntero mediante la librería `@lucasmarkes/hairline` y la skill oficial `hairline-create`:

- **Loop de trabajo (`#loop`)**: Figuras interactivas montadas en cada tarjeta:
  - `Observe`: Terminal interactivo de trazas.
  - `Evaluate`: Sieve (tamiz).
  - `Improve`: Grafo de ramas y commits (`Branches`).
  - `Repeat`: Plato giratorio con física inercial (`Turntable`).
- **Showcase & Playground interactivo (`#hairline-showcase`)**: Galería con 8 figuras (`Terminal`, `Branches`, `Exploded`, `Dish`, `Terrain`, `Patch`, `Router`, `Sieve`), control deslizante de intensidad, selector de temas y visor de código React / Vanilla.
- **Demo React (`hairline-react-demo.html`)**: Demostración reactiva basada en `@lucasmarkes/hairline/react`.
- **Figura propia (`hairline-trace.html`)**: Generada y validada con el kernel de Hairline (`trace.js`), representando la jerarquía de spans de ejecución de agentes de IA.

## Notas

- Los tokens de color y tipografía provienen de las hojas de estilo públicas de langfuse.com.
- Las fuentes originales (Geist Mono, F37 Analog) se sustituyen por JetBrains Mono.
- Responsive: testado en breakpoints de 1440 / 1000 / 900 / 860 / 560 px.
