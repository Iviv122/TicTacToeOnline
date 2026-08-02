# TicTacToe online

lightweight platform to run online multiplayer lobbies for tictactoe

## Tech

- frontend: React + Tailwindcss + React-Toastify + pnpm
- backend: ElysiaJS + bun

## .env

- backend_domain: so frontend could properly make calls and use websockets
- backend_port: prefered port for backend
```
VITE_BACKEND_DOMAIN=localhost:3000
BACKEND_PORT=3000
```

## Openapi and websocket

under  ```https://${backend_domain}/openapi#GET/``` are located schemas

under ```wss://${backend_domain}/ws``` you can connect to main and only websocket

## Build

prerequisites

- bun
- pnpm
- filled .env 

```
chmod +x install.sh
./install.sh
```

- frontend folder: $path/client/dist

- backend exec file: $path/server_exec
