# Goat Jersey · App móvil

App móvil de un **marketplace y colección de jerseys de fútbol**. Cada coleccionista registra sus jerseys (equipo, temporada, tipo, talla, estado, versión, valor estimado y foto) y los publica para vender o intercambiar.

Proyecto final · **Equipo Goat** · Grupo J-301 · Programación de Dispositivos Móviles · Universidad Autónoma de Occidente (UAdeO), Unidad Regional Culiacán.

Este repositorio es el **frontend**. El backend está en [GoatJersey-API](https://github.com/isaac06900-cell/GoatJersey-API).

## Integrantes

| Nombre | GitHub |
|---|---|
| Isaac Jasiel Herrera Ávila | [@isaac06900-cell](https://github.com/isaac06900-cell) |
| Andrew Neftalí Chaidez López | [@Andrewclz](https://github.com/Andrewclz) |
| Alan Jesús Aguilar Verdugo | [@alanjesusaguilarverdugo-lang](https://github.com/alanjesusaguilarverdugo-lang) |

## Estado actual

- [x] Registro e inicio de sesión con JWT
- [x] Sesión persistente (el token se guarda en SecureStore) y cierre de sesión
- [x] Inicio: resumen de la colección (total de jerseys, publicados y valor estimado)
- [x] Mi colección: listar, agregar, editar y eliminar jerseys
- [x] Publicar un jersey (venta, intercambio o ambos) y retirar la publicación
- [ ] Explorar las publicaciones de otros usuarios con filtros y ver su detalle (semana 4)

## Pantallas

| Pantalla | Ruta | Requiere sesión |
|---|---|---|
| Inicio de sesión | `/login` | No |
| Registro | `/register` | No |
| Inicio (resumen) | `/` (pestaña Inicio) | Sí |
| Mi colección | `/coleccion` (pestaña Mi colección) | Sí |
| Formulario de jersey (alta y edición) | `/jersey/nuevo`, `/jersey/[id]` | Sí |

## Tecnologías

Expo SDK 58 · Expo Router · React Native · TypeScript · Axios · expo-secure-store

## Estructura

```
src/
├── app/                  # Rutas (Expo Router)
│   ├── (auth)/           # Sin sesión: login y register
│   ├── (tabs)/           # Con sesión: pestañas Inicio y Mi colección
│   └── jersey/           # nuevo.tsx y [id].tsx (formulario de jersey)
├── features/
│   ├── auth/             # Sesión: pantallas, contexto, servicios, API y almacenamiento
│   ├── jerseys/          # Colección: pantallas, componentes, servicios y API
│   └── publicaciones/    # Servicios y API de publicaciones
└── shared/               # Cliente HTTP (Axios), manejo de errores, componentes y tema
```

## Cómo correrlo

1. Levanta la API y la base de datos siguiendo el README de [GoatJersey-API](https://github.com/isaac06900-cell/GoatJersey-API).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea tu archivo de variables de entorno a partir de la plantilla y pon la IP de la computadora donde corre la API.

   **macOS:**
   ```bash
   cp .env.example .env
   ipconfig getifaddr en0   # IP del Mac
   ```

   **Windows** (PowerShell):
   ```powershell
   copy .env.example .env
   ipconfig                 # usa la dirección IPv4 de tu adaptador Wi-Fi
   ```

   Después edita `.env`:
   ```
   EXPO_PUBLIC_API_URL=http://<IP_DE_LA_COMPUTADORA>:5300
   ```

   Si el teléfono no conecta con la API en Windows, abre el puerto 5300 en el firewall (PowerShell como administrador):
   ```powershell
   New-NetFirewallRule -DisplayName "GoatJersey API 5300" -Direction Inbound -Protocol TCP -LocalPort 5300 -Action Allow
   ```
4. Arranca Expo y escanea el QR con Expo Go (el teléfono y la computadora deben estar en la misma red Wi-Fi):
   ```bash
   npx expo start -c
   ```

El archivo `.env` no se sube a git: cada integrante usa su propia IP.
