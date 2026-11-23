# Goat Jersey · App móvil

App móvil de un **marketplace y colección de jerseys de fútbol**. Cada coleccionista registra sus jerseys (equipo, temporada, talla, estado, autenticidad y foto) y los publica para vender o intercambiar.

Proyecto final · **Equipo Goat** · Grupo J-301 · Universidad Autónoma de Occidente (UAdeO).

Este repositorio es el **frontend**. El backend está en [GoatJersey-API](https://github.com/isaac06900-cell/GoatJersey-API).

## Integrantes

| Nombre | GitHub |
|---|---|
| Isaac Jasiel Herrera Avila | [@isaac06900-cell](https://github.com/isaac06900-cell) |
| Andrew | [@Andrewclz](https://github.com/Andrewclz) |
| Alan | _(por agregar)_ |

## Estado actual

- [x] Registro de usuarios
- [x] Inicio de sesión con JWT
- [x] Sesión persistente (el token se guarda en SecureStore)
- [x] Pantalla principal con correo y rol, y cierre de sesión
- [ ] Colección de jerseys (listar, crear, editar y borrar)
- [ ] Publicaciones: explorar, publicar y retirar

## Tecnologías

Expo SDK 58 · Expo Router · React Native · TypeScript · Axios · expo-secure-store

## Estructura

```
src/
├── app/                  # Rutas (Expo Router): (auth)/login, (auth)/register, index
├── features/auth/        # Pantallas, contexto, servicios, API y almacenamiento de la sesión
└── shared/               # Cliente HTTP (Axios), manejo de errores, componentes y tema
```

## Cómo correrlo

1. Levanta la API y la base de datos siguiendo el README de [GoatJersey-API](https://github.com/isaac06900-cell/GoatJersey-API).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia la plantilla de variables de entorno y pon la IP de la computadora donde corre la API:
   ```bash
   cp .env.example .env
   ipconfig getifaddr en0   # IP del Mac
   ```
   ```
   EXPO_PUBLIC_API_URL=http://<IP_DEL_MAC>:5300

      **En Windows**, en vez de `cp` y `ipconfig getifaddr en0`:
   ```powershell
   copy .env.example .env
   ipconfig
   ```
   Usa la dirección **IPv4** de tu adaptador Wi-Fi:
   ```
   EXPO_PUBLIC_API_URL=http://<IP_DE_LA_PC>:5300
   ```
   Si el teléfono no conecta con la API, abre el puerto 5300 en el firewall (PowerShell como administrador):
   ```powershell
   New-NetFirewallRule -DisplayName "GoatJersey API 5300" -Direction Inbound -Protocol TCP -LocalPort 5300 -Action Allow
   ```
   ```
4. Arranca Expo y escanea el QR con Expo Go (el teléfono y la computadora deben estar en la misma red Wi-Fi):
   ```bash
   npx expo start -c
   ```

El archivo `.env` no se sube a git: cada integrante usa su propia IP.
