# Addon crédits — beatstore-ready2

Déposez ces fichiers **dans votre dossier du site** (conservez l'arborescence) :

```
/css/credits.css
/js/credits.js
/js/autoload-credits.js
/topup.html
/README-CREDITS.md
```

## Activation (1 ligne)

Dans `index.html` **et** `category.html`, avant `</body>` ajoutez :
```html
<script src="js/autoload-credits.js"></script>
```

(Optionnel) Ajoutez un slot si vous voulez contrôler l’emplacement du badge :
```html
<div id="creditsSlot" style="display:flex;justify-content:flex-end;margin-bottom:10px"></div>
```

Sinon, le badge s’insère automatiquement en haut de `.wrap`.

### Comment ça marche ?
- Le badge affiche les crédits (stockés dans `localStorage`).
- Cliquer sur un lien de téléchargement d’un audio (href commençant par `assets/audio/` ou `<a download>`) **coûte 1 crédit**.
- Si solde insuffisant, redirection vers `topup.html` (page de recharge démo).

### Configurer le prix
Modifiez `COST_PER_DOWNLOAD` dans `js/credits.js`.

100% statique, compatible Netlify.
