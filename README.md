# Dragon Ball Coloring Book · Landing Page

## Estructura
```
dragon-ball-landing/
├── index.html
├── style.css
├── script.js
└── images/
    ├── portada.jpg            (cubierta del libro)
    ├── pagina-01.jpg … pagina-50.jpg
    ├── libro-3d.png           (libro 3D sin fondo)
    └── banner-facebook.jpg    (tu portada de Facebook)
```

## 1) Pon tu enlace de Hotmart
Abre `script.js` y edita lo que hay dentro de `CONFIG` (primeras líneas):
```js
HOTMART_URL: "https://pay.hotmart.com/TU_CODIGO_AQUI?checkoutMode=10",
PRICE: "$9.99",
OLD_PRICE: "",   // precio tachado opcional
```
Todos los botones "Comprar" de la página usan ese único enlace.

## 2) Probar en local
Con VS Code: instala la extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
(El balde de relleno del estudio de colorear necesita un servidor; con doble clic funciona el pincel.)

## 3) Publicar gratis en GitHub Pages
1. Crea un repositorio público en github.com y sube TODO el contenido de la carpeta.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. En 1–2 minutos tendrás `https://TU-USUARIO.github.io/NOMBRE-REPO/`.
4. En Hotmart, registra el producto con **Página de ventas externa** y pega esa URL.

(Alternativas gratis: Netlify Drop → arrastra la carpeta, o Vercel.)

## 4) Cambiar imágenes
Reemplaza los archivos de `images/` conservando el nombre. Si tienes más/menos páginas,
cambia `TOTAL_PAGES` en `script.js` y agrega/quita las etiquetas `<img>` de la galería en `index.html`.
