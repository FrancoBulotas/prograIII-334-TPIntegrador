
# 🛠️ TP Integrador 2025 - Programacion III

## Reglas generales

- **Nunca trabajar directamente en la rama `main`**.
- **Cada funcionalidad se desarrolla en su propia rama** (`feature-*`, `fix-*`, etc.).
- **Antes de empezar a codear, hacer `git pull` de tu rama**.
- **Antes de subir cambios, hacer `commit` y `push` en la rama correspondiente**.
- **Los merges a `main` deben hacerse solo si el código funciona correctamente**.

---

## Pasos para comenzar el proyecto

### 1. Crear repositorio (solo uno lo hace)
```bash
mkdir tp-autoservicio
cd tp-autoservicio
git init
git remote add origin https://github.com/usuario/tp-autoservicio.git
git add .
git commit -m "Primer commit"
git branch -M main
git push -u origin main
```

### 2. Clonar el repo (lo hace la otra persona)
```bash
git clone https://github.com/usuario/tp-autoservicio.git
cd tp-autoservicio
```

---

## Trabajo con ramas

### Crear una nueva rama
```bash
git checkout -b feature-frontend
```

### Cambiar de rama
```bash
git checkout feature-frontend
```

### Ver ramas existentes
```bash
git branch
```

---

## Flujo de trabajo diario

### Antes de empezar a trabajar
```bash
git pull origin nombre-de-tu-rama
```

### Guardar tus cambios
```bash
git add .
git commit -m "Mensaje claro de lo que hiciste"
git push origin nombre-de-tu-rama
```

---

## 🔃 Fusionar cambios a `main`
```bash
git checkout main
git pull origin main
git merge nombre-de-tu-rama
git push origin main
```

✅ Alternativamente, pueden usar un **Pull Request** en GitHub para revisar los cambios antes de hacer merge.

---

## 🧪 Comandos resumen

| Acción                     | Comando                                 |
|----------------------------|-----------------------------------------|
| Clonar repo                | `git clone URL`                         |
| Crear rama nueva           | `git checkout -b nombre-rama`           |
| Cambiar de rama            | `git checkout nombre-rama`              |
| Ver ramas                  | `git branch`                            |
| Guardar cambios            | `git add . && git commit -m "msg"`      |
| Subir cambios              | `git push origin nombre-rama`           |
| Traer cambios del remoto   | `git pull origin nombre-rama`           |
| Merge a `main`             | `git merge nombre-rama`                 |

---

## Nombres de ramas

- `feature-login-admin`
- `feature-carrito-compra`
- `fix-titulo-footer`
- `refactor-rutas-backend`

---

¡A escribir buen código y a trabajar en equipo como profesionales! 💪
