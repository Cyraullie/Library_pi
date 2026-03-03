#!/bin/bash
# Boucle infinie pour relancer si npm plante
while true; do
  npm run prod
  echo "LibPi crashed with exit code $?. Respawning..." 
  sleep 5
done