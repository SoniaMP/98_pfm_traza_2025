# Proyecto de Trazabilidad de Reciclaje

## Descripción General
El proyecto implementa un sistema de trazabilidad para el reciclaje de plásticos, basado en tecnología blockchain. El objetivo es registrar y verificar todo el recorrido del material —desde el ciudadano que entrega el residuo hasta el procesado final— garantizando transparencia y facilitando la gestión de incentivos.

## Roles Principales
1. **Ciudadano**  
   Entrega los residuos plásticos en puntos de recogida.  
   - Recibe una gratificación del gobierno al verificar la entrega.  
   - Puede consultar el estado de sus entregas y las recompensas obtenidas.

2. **Centro de Recogida**  
   Recoge el material de los ciudadanos.  
   - Registra las entregas recibidas.  
   - Envía los residuos al centro de reciclaje correspondiente.

3. **Centro de Reciclaje**  
   Procesa el material recibido del centro de recogida.  
   - Registra la recepción y el resultado del proceso.  
   - Envía el material reciclado al centro de procesado final.

4. **Centro de Procesado Final**  
   Recibe el material reciclado y lo convierte en producto reutilizable.  
   - Registra la recepción y transformación final del material.  
   - Cierra el ciclo del proceso de trazabilidad.

5. **Gobierno**  
   Supervisa todo el sistema y gestiona las gratificaciones.  
   - Verifica los registros de cada etapa.  
   - Autoriza y distribuye las recompensas a los ciudadanos.  
   - Puede auditar todo el proceso.

## Flujo del Sistema
1. El **ciudadano** entrega el residuo → el **centro de recogida** lo registra.  
2. El **centro de recogida** envía el material al **centro de reciclaje**.  
3. El **centro de reciclaje** transforma el residuo y lo entrega al **procesado final**.  
4. El **procesado final** completa el ciclo y reporta el resultado.  
5. El **gobierno** valida el flujo completo y libera la recompensa al ciudadano.

## Objetivos Técnicos
- Implementar contratos inteligentes para registrar cada acción.  
- Asegurar la integridad de los datos mediante blockchain.  
- Crear un frontend intuitivo que permita visualizar el estado del reciclaje en tiempo real.  
- Gestionar usuarios por rol con permisos diferenciados.  
- Permitir auditorías transparentes por parte del gobierno o terceros.

## Stack Tecnológico
- **Frontend:** React + Vite + Material UI  
- **Smart Contracts:** Solidity  
- **Blockchain:** Ethereum / compatible (por ejemplo, Polygon)  
- **Herramientas:** Hardhat, Ethers.js  
- **Backend opcional:** Node.js para integraciones externas  
- **Base de datos auxiliar:** SQLite o MongoDB (según necesidad)

## Estado del Proyecto
Actualmente en desarrollo, con enfoque en la definición del flujo de roles y el diseño de los contratos inteligentes que representarán cada etapa del proceso de reciclaje.
