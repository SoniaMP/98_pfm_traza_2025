# ♻️ EcoTrack – Proyecto de Trazabilidad Blockchain

## 🧩 Descripción del proyecto

El objetivo del proyecto es **garantizar la trazabilidad de materiales reciclables** desde su origen (el ciudadano que los deposita) hasta su procesamiento y recompensa final por parte de una **autoridad reguladora**.  
Cada material se representa como un **token único** en la blockchain que pasa por varias etapas controladas por roles con permisos específicos.

El proyecto implementa un flujo multirol (ciudadano → transportista → procesador → autoridad) en el que cada acción queda registrada on-chain, asegurando transparencia y responsabilidad en toda la cadena.

## Enlace del vídeo

Puedes ver un resumen de la aplicación [aquí](https://www.loom.com/share/045e11d8191345f79fe04ee9340055f1).

## 🧠 Conceptos clave

- Cada **token** representa un lote o unidad de material reciclado.
- Los **roles** controlan quién puede realizar cada acción.
- Cada cambio de estado o propietario emite un **evento inmutable**.
- La autoridad puede recompensar los tokens procesados.

El flujo general es:

1. **Ciudadano** crea un token del material reciclado (ej. plástico, vidrio).
2. **Transportista** recoge el material y lo transfiere al **procesador**.
3. **Procesador** acepta la transferencia, procesa el material y lo envía a la **autoridad reguladora**.
4. **Autoridad reguladora** revisa y recompensa el token, cerrando el ciclo de trazabilidad.

Cada transición emite eventos (`CustodyChanged`, `TransferStatusChanged`) que reflejan el cambio de estado y de propietario en la cadena.

---

## 🧩 Roles y permisos

| Rol                  | Permisos principales                                       |
| -------------------- | ---------------------------------------------------------- |
| **Admin**            | Aprueba o rechaza cuentas.                                 |
| **Citizen**          | Crea nuevos tokens de materiales reciclables.              |
| **Transporter**      | Recoge materiales y los envía al procesador.               |
| **Processor**        | Acepta materiales, los procesa y los envía a la autoridad. |
| **Reward Authority** | Revisa, valida y recompensa los materiales procesados.     |

---

## 🏗️ Arquitectura

```plaintext
┌────────────────────┐
│ AccessManager.sol  │
│ (roles & permisos) │
└──────────┬─────────┘
           │
           ▼
┌───────────────────────────┐
│ RecyclingTraceability.sol │
│   (gestión del flujo)     │
└──────────┬────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Frontend (React + MUI + Ethers) │
│   · Gestión de roles            │
│   · Creación y envío de tokens  │
│   · Procesamiento y recompensa  │
└─────────────────────────────────┘
```

---

## 🧠 Stack tecnológico

| Capa                             | Tecnología                                |
| -------------------------------- | ----------------------------------------- |
| **Smart Contracts**              | Solidity 0.8.20                           |
| **Framework de test/despliegue** | Foundry (`forge`, `cast`, `anvil`)        |
| **Control de acceso**            | OpenZeppelin AccessControl                |
| **Frontend DApp**                | React + Vite + Material UI + Ethers.js v6 |
| **Blockchain local**             | Anvil (parte de Foundry)                  |
| **Gestión de roles**             | Contrato `AccessManager`                  |
| **Trazabilidad**                 | Contrato `RecyclingTraceability`          |

---

## ⚙️ Descripción de contratos

### `AccessManager.sol`

Gestiona las cuentas y roles del sistema:

- `ADMIN`
- `CITIZEN`
- `TRANSPORTER`
- `PROCESSOR`
- `REWARD_AUTHORITY`

Cada cuenta puede **solicitar un rol**, y un administrador aprueba o rechaza la solicitud.

**Funciones clave:**

- `requestRole(bytes32 role)` → Un usuario solicita un rol.
- `approveAccount(address account)` → El admin aprueba y activa el rol.
- `hasActiveRole(address account, bytes32 role)` → Comprueba si un usuario tiene un rol activo.

---

### `RecyclingTraceability.sol`

Registra toda la trazabilidad de los tokens de reciclaje y su movimiento entre entidades.

**Etapas del token:**

1. `Created` → creado por un ciudadano.
2. `Collected` → recogido por un transportista.
3. `Processed` → procesado por un centro autorizado.
4. `Rewarded` → recompensado por la autoridad.

**Funciones clave:**

- `createToken(name, totalSupply, citizenFeatures, parentId)`  
  Crea un nuevo token de reciclaje.
- `collectToken(tokenId)`  
  Marca el token como recogido por un transportista.
- `transfer(to, tokenId, amount)`  
  Crea una transferencia pendiente entre dos roles.
- `setTransferStatus(transferId, accept)`  
  El receptor acepta o rechaza la transferencia.
- `processToken(tokenId, processorFeatures)`  
  El procesador añade información técnica y cambia el estado.
- `rewardToken(tokenId)`  
  La autoridad finaliza el ciclo y recompensa el token.

**Eventos clave:**

- `CustodyChanged(tokenId, from, to, stage, timestamp)`
- `TransferInitiated(transferId, tokenId, from, to, amount, timestamp)`
- `TransferStatusChanged(transferId, tokenId, from, status, timestamp)`
- `TokenProcessed(tokenId, processor)`
- `TokenRewarded(tokenId, authority)`

---

### 🚀 Flujo completo

| Etapa | Actor                   | Acción                | Resultado                            |
| ----- | ----------------------- | --------------------- | ------------------------------------ |
| 1️⃣    | Citizen                 | `createToken()`       | Crea el token inicial.               |
| 2️⃣    | Transporter             | `collectToken()`      | Recoge el material.                  |
| 3️⃣    | Transporter → Processor | `transfer()`          | Crea transferencia pendiente.        |
| 4️⃣    | Processor               | `setTransferStatus()` | Acepta y obtiene custodia.           |
| 5️⃣    | Processor               | `processToken()`      | Procesa y actualiza características. |
| 6️⃣    | Processor → Authority   | `transfer()`          | Envío al regulador.                  |
| 7️⃣    | Authority               | `setTransferStatus()` | Acepta el envío.                     |
| 8️⃣    | Authority               | `rewardToken()`       | Finaliza el ciclo con recompensa.    |

---

## 🧰 Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/SoniaMP/98_pfm_traza_2025.git
cd supply-chain-tracker
```

### 2️⃣ Instalar dependencias de Foundry

```bash
cd smart
forge install
```

### 3️⃣ Instalar dependencias del frontend

```bash
cd frontend
npm install
```

---

## 🧪 Arranque de entorno local

### 1️⃣ Iniciar blockchain local

```bash
anvil
```

Esto levantará una red local en `http://127.0.0.1:8545` con 10 cuentas prefundidas.

### 2️⃣ Desplegar contratos

En otra terminal:

```bash
# Desplegar AccessManager y RecyclingTraceability usando script
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PK_ADMIN --broadcast
```

Se puede usar el script `InitalizeRoles.s.sol` para inicializar los roles de la aplicación.

---

## 🧩 Pruebas manuales con `cast`

```bash
# 1️⃣ Solicitar un rol

cast send <ACCESS_MANAGER_ADDRESS> "requestRole(bytes32)"   $(cast keccak "CITIZEN")   --private-key <PRIVATE_KEY_USER>

# 2️⃣ Aprobar un rol (desde admin)

cast send <ACCESS_MANAGER_ADDRESS> "approveAccount(address)"   <USER_ADDRESS>   --private-key <PRIVATE_KEY_ADMIN>

# 3️⃣ Crear un token

cast send <TRACEABILITY_ADDRESS>   "createToken(string,uint256,string,uint256)"   "Plástico verde" 100 "PET reciclado" 0   --private-key <PRIVATE_KEY_CITIZEN>

# 4️⃣ Recoger el token (transportista)

cast send <TRACEABILITY_ADDRESS> "collectToken(uint256)"   1   --private-key <PRIVATE_KEY_TRANSPORTER>

# 5️⃣ Transferirlo al procesador

cast send <TRACEABILITY_ADDRESS> "transfer(address,uint256,uint256)"   <PROCESSOR_ADDRESS> 1 100   --private-key <PRIVATE_KEY_TRANSPORTER>

# 6️⃣ Aceptar la transferencia (procesador)

cast send <TRACEABILITY_ADDRESS> "setTransferStatus(uint256,bool)"   1 true   --private-key <PRIVATE_KEY_PROCESSOR>

# 7️⃣ Procesar el token

cast send <TRACEABILITY_ADDRESS> "processToken(uint256,string)"   1 "Limpieza y triturado completado"   --private-key <PRIVATE_KEY_PROCESSOR>

# 8️⃣ Transferirlo a la autoridad

cast send <TRACEABILITY_ADDRESS> "transfer(address,uint256,uint256)"   <AUTHORITY_ADDRESS> 1 100   --private-key <PRIVATE_KEY_PROCESSOR>

# 9️⃣ Aceptar y recompensar (autoridad)

cast send <TRACEABILITY_ADDRESS> "setTransferStatus(uint256,bool)"   2 true   --private-key <PRIVATE_KEY_AUTHORITY>
cast send <TRACEABILITY_ADDRESS> "rewardToken(uint256)"   1   --private-key <PRIVATE_KEY_AUTHORITY>
```

---

## 🧭 Comprobaciones

```bash
# Ver historial completo del token:

cast call <TRACEABILITY_ADDRESS> "getToken(uint256)" 1

# Consultar transferencias:

cast call <TRACEABILITY_ADDRESS> "getTransfers(uint8)" 0

# Ver estado de una cuenta:

cast call <ACCESS_MANAGER_ADDRESS> "getAccountInfo(address)" <USER_ADDRESS>
```

---

## 🖥️ DApp Frontend

Lanzar la interfaz de React:

```bash
cd frontend
npm start
```

Incluye componentes:

- `RegisterOrganization.tsx` (roles)
- `Admin.tsx` (panel gestión de usuarios por un administrador)
- `Citizen.tsx` (menú del ciudadano -- Para crear tokens y ver el resumen de recompensas)
- `Transporter.tsx` (gestión de envíos)
- `Processor.tsx` (procesado y envío a autoridad)
- `RewardAuthority.tsx` (recompensa final)

---

## 🏁 Fin del ciclo

**Cuando la autoridad recompensa el token, el ciclo de trazabilidad se completa:**

- El token queda en estado `Rewarded`.
- La custodia final pertenece a la autoridad.
- Todos los eventos (`CustodyChanged`, `TokenRewarded`) quedan registrados en blockchain.

---

> 🚀 El lema de EcoTrack... “Nada se pierde, todo se transforma. Pero en esta DApp, además, ¡todo se rastrea!”
