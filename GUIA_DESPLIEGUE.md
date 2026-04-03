# 🚀 Guía de Despliegue - DulcesApp

## Resumen
- **Frontend**: Next.js 14 (App Router)
- **Base de datos**: Firebase (Firestore + Authentication)
- **Hosting**: Vercel
- **Número de Proyecto Firebase**: 932867399727

---

## PASO 1: Configurar Firebase

### 1.1 Ir a Firebase Console
Ve a [https://console.firebase.google.com](https://console.firebase.google.com)

### 1.2 Habilitar Authentication
1. En tu proyecto → **Authentication** → **Get started**
2. En la pestaña **Sign-in method**
3. Habilitar **Email/Password** → Guardar

### 1.3 Habilitar Firestore
1. En tu proyecto → **Firestore Database** → **Create database**
2. Seleccionar modo **Production**
3. Elegir región (recomendado: `us-central1`)

### 1.4 Configurar reglas de Firestore
En **Firestore → Rules**, pega estas reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 1.5 Crear índices en Firestore (automático ✅)

**No necesitas crear índices manualmente.** Firebase los genera por ti:

1. Corre la app y navega por las secciones (Historial, Ventas, etc.)
2. Cuando una consulta necesite un índice, aparece en la consola del navegador (F12):
   ```
   FirebaseError: The query requires an index. You can create it here: https://...
   ```
3. Haz clic en ese link → Firebase te lleva a crear el índice con un solo botón

Repite este proceso hasta que no aparezcan más errores de índice.

### 1.6 Obtener las credenciales
1. En Firebase → ⚙️ **Project Settings** → **General**
2. Baja hasta **Your apps** → clic en el ícono `</>`
3. Registra la app con el nombre "dulces-app"
4. Copia los valores de `firebaseConfig`

---

## PASO 2: Crear archivo .env.local

En la carpeta del proyecto, copia `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Luego edítalo con tus valores reales:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=932867399727
NEXT_PUBLIC_FIREBASE_APP_ID=1:932867399727:web:...
```

---

## PASO 3: Correr localmente

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## PASO 4: Subir a GitHub

```bash
# Inicializar repo
git init

# Agregar archivos (NO incluye .env.local por el .gitignore)
git add .
git commit -m "feat: DulcesApp - sistema de inventario y ventas"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/dulces-app.git
git branch -M main
git push -u origin main
```

---

## PASO 5: Desplegar en Vercel

### Opción A: Desde la interfaz de Vercel (recomendado)
1. Ve a [https://vercel.com](https://vercel.com) → **New Project**
2. Importa tu repositorio de GitHub
3. En **Environment Variables**, agrega todas las variables de `.env.local`
4. Clic en **Deploy**

### Opción B: Con Vercel CLI
```bash
npm install -g vercel
vercel
```

### 5.1 Variables de entorno en Vercel
En tu proyecto Vercel → **Settings** → **Environment Variables**, agrega:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## ✅ ¡Listo! Tu app está live

Vercel te dará un URL del tipo:
```
https://dulces-app-tu-usuario.vercel.app
```

---

## 📱 Funcionalidades incluidas

- ✅ Registro e inicio de sesión
- ✅ Dashboard con métricas del día
- ✅ Inventario (crear, editar, eliminar productos)
- ✅ Gestión de clientes
- ✅ Combos/Promociones
- ✅ Sistema de ventas con carrito
- ✅ Pagos: pagado / parcial / fiado
- ✅ Deudas con fecha límite y alertas
- ✅ Historial con filtros
- ✅ Navegación móvil optimizada
- ✅ Transacciones atómicas en Firebase
- ✅ Datos 100% aislados por usuario

---

## 🔧 Solución de problemas comunes

**Error "Missing index"**: Firebase te muestra un link en la consola del navegador → haz clic para crear el índice automáticamente.

**Error de CORS o permisos**: Verifica que las reglas de Firestore estén correctamente configuradas.

**App en blanco**: Verifica que todas las variables de entorno estén bien escritas en Vercel.
