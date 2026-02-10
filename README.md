# DOCE - Sorteo de Carnaval 2026

Este proyecto es una web app interactiva tipo "Rasca y Gana" con temática de la ONCE ("DOCE") para Carnaval.

## 🚀 Cómo Desplegar en GitHub Pages

1.  Sube la carpeta `Carnaval2026` a un repositorio de GitHub (o el contenido de la carpeta a la raíz del repo).
2.  Ve a **Settings** > **Pages** en tu repositorio.
3.  En **Branch**, selecciona `main` (o `master`) y guarda.
4.  GitHub te dará una URL (ej: `https://usuario.github.io/repo/`).

## 🖨️ Generar Códigos QR

Para que la gente juegue, necesitan escanear un QR que les lleve a la web con el parámetro de ganar o perder.

1.  Una vez desplegada la web, abre el archivo `qr_generator.html` en tu navegador local.
2.  Pega la URL de tu web en el campo de texto.
3.  Pulsa **Generar QRs**.
4.  Haz clic derecho en los QRs generados para guardarlos como imagen (`qr_ganador.png`, `qr_perdedor.png`).

## 🎟️ Imprimir Cupones

Usa la plantilla HTML disponible (o el diseño web) para imprimir tus tickets. Pega el QR físico sobre el área designada si lo imprimes en papel, o muéstralo en pantalla.

## 🎮 Funcionamiento

*   **Ganador Aleatorio**: `.../index.html?win=true` (Asigna uno de los premios definidos aleatoriamente).
*   **Premio Específico**: `.../index.html?win=calero` (O cualquiera de las claves definidas en `script.js`).
*   **Perdedor**: `.../index.html?win=false` (O sin parámetros).

## 🛠️ Personalización

Edita `script.js` para cambiar los premios o los nombres de usuario de Instagram.
Edita `index.html` para cambiar los textos del cupón.
