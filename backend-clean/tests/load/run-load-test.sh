#!/bin/bash

echo "=== Verificando que el servidor esté corriendo ==="
curl -s http://localhost:3001/health > /dev/null
if [ $? -ne 0 ]; then
    echo "ERROR: El servidor no está corriendo en http://localhost:3001"
    echo "Primero ejecuta: npm run dev"
    exit 1
fi

echo "=== Servidor OK, iniciando pruebas de carga ==="
echo ""
echo "--- Prueba 1: Configuración básica ---"
npx artillery run tests/load/artillery-config.yml

echo ""
echo "--- Prueba 2: Autenticación y flujo completo ---"
npx artillery run tests/load/artillery-auth.yml

echo ""
echo "=== Pruebas de carga completadas ==="