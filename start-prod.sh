#!/bin/bash
cd /home/cgoldens/Library_pi || exit 1

# Boucle infinie pour relancer si npm plante
while true; do
  npm run prod
  echo "LibPi crashed with exit code $?. Respawning..." 
  sleep 5
done