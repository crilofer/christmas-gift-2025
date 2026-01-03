# 🎁 Memory de Reyes Magos para Silvia

Un juego de memoria especial para revelar un regalo de Reyes Magos.

## 📋 Cómo usar

### 1. Añade tus fotos

Coloca **12 fotos** vuestras en la carpeta `assets/fotos/` con los nombres:
- `1.jpg`
- `2.jpg`
- `3.jpg`
- ... hasta `12.jpg`

**Consejo:** Usa fotos cuadradas o casi cuadradas para mejor visualización.

### 2. Añade la foto del regalo

Coloca la foto del vale/regalo en `assets/regalo.jpg`

### 3. Personaliza los mensajes (opcional)

Edita el archivo `script.js` y modifica:

```javascript
const ROMANTIC_MESSAGES = [
    "Cada momento contigo es un regalo...",
    "Eres la estrella que guía mi camino ⭐",
    // Añade o cambia los mensajes que quieras
];
```

También puedes cambiar el mensaje final en `index.html`:

```html
<p class="final-message" id="final-message">
    Tu mensaje personalizado aquí...
</p>
```

### 4. Abre en navegador

Simplemente abre el archivo `index.html` en tu navegador.

## 🚀 Despliegue online (opcional)

### GitHub Pages (recomendado)

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona "main" branch y carpeta "/ (root)"
4. Tu URL será: `https://tu-usuario.github.io/nombre-repo/`

### Vercel / Netlify

1. Conecta tu repositorio
2. Deploy automático
3. Comparte el enlace generado

## 🎮 Cómo funciona el juego

1. Silvia verá una pantalla de bienvenida
2. Al hacer clic en "Descubrir mi regalo", empezará el juego
3. Debe encontrar las 12 parejas de fotos
4. Cada 3 parejas, aparecerá un mensaje romántico
5. Al completar el juego, ¡se revelará el regalo con confeti!

## 📁 Estructura del proyecto

```
/
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica del juego
├── README.md           # Este archivo
└── assets/
    ├── regalo.jpg      # Foto del regalo final
    └── fotos/
        ├── 1.jpg       # Foto pareja 1
        ├── 2.jpg       # Foto pareja 2
        └── ...         # (hasta 12.jpg)
```

---

Hecho con ❤️ para Silvia

