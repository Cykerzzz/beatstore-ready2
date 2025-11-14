Beatstore-ready — mode d’emploi
1) Copie tes covers dans assets/img/ (les fichiers cover-*.jpg existent déjà en placeholders).
2) Copie tes sons dans assets/audio/<categorie>/
3) Mets à jour la base :
   python3 generate_packs.py --assets ./assets --out ./data/packs.json
4) Lance :
   python3 -m http.server 5173
   puis ouvre http://localhost:5173/index.html