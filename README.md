# Scout Rutas 🌍🚶

**Scout Rutas** es una Progressive Web App (PWA) desarrollada con Angular, diseñada para crear, visualizar y navegar rutas georreferenciadas en actividades Scouts. Optimizada para funcionar sin conexión y ser utilizada fácilmente desde dispositivos móviles en el campo.

---

## 🧭 Características

- 🌐 Uso de Google Maps para marcar puntos de ruta
- 🧩 SPA con Angular 17 y routing interno
- 📲 Compatible con instalación como app móvil (PWA)
- 📡 Funciona offline después de ser instalada
- ✏️ Crear, guardar y editar rutas
- 🔐 Interfaz ligera y sin necesidad de login en la versión pública

---

## 🚀 Demo

👉 [Ver aplicación en vivo](https://creatibyte.github.io/scout-rutas/)

> Sugerencia: Instálala en tu teléfono desde el navegador como app para experiencia completa sin conexión.

---

## 🛠️ Instalación local

```bash
git clone https://github.com/CreatiBYTE/scout-rutas.git
cd scout-rutas
npm install
ng serve
```

> Requiere Node.js 18+ y Angular CLI 17+.

---

## 📦 Build y Deploy

```bash
ng build --configuration production
npx angular-cli-ghpages --dir=dist/scout-rutas
```

> El sitio se publica en el branch `gh-pages` de este repositorio.

---

## 📁 Estructura

- `src/app/pages/crear-ruta/` — Formulario para crear nuevas rutas
- `src/app/pages/navegar-ruta/` — Modo navegación paso a paso
- `src/assets/` — Recursos estáticos y configuraciones
- `src/styles.scss` — Estilos globales

---

## 🙌 Autor

José Esteban García Luna Cortés  
[CreatiBYTE](https://www.creatibyte.com.mx)  
Contacto: akela@creatibyte.com.mx

---

## 🧪 Licencia

MIT License — libre uso con atribución.

---

## ✨ ¡Apóyalo!

Si esta herramienta te ha servido, considera darle ⭐️ al repositorio o compartirla con otros scouters.
