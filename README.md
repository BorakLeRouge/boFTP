# boftp README

boFTP, une solution pour transférer un fichier sur un site.
Le paramétrage étant dans un fichier YAML à la racine..

Seulement une possibilité de transfert de fichier. Pas de création de repertoire.

Une commande pour valider la connexion : Ctrl + shift + p : boFTP-Validation accès FTP    
Une commande pour faire le transfert : Ctrl + shift + p : boFTP-Transfert de fichier    
Un menu contextuel permet aussi le transfert


Exemple de contenu du fichier YAML :
Avec deux connexions possibles pi1 et pi2, et on choisit par le champ "actif"

```
comment:         Les connexions FTP
actif:           pi1
connexions:
    pi1:
      adresse:   192.168.1.1
      user:      borakLeRouge
      password:  ilEstTropBeau
      dossier:   /var/www
    pi2
      adresse:   192.168.1.1
      user:      macelluswallace
      password:  ilEstTropBeau2
      dossier:   /var/www
```

## Release Notes

### 0.0.4

Gestion du mot de passe

### 0.0.3

YAML multicible.

### 0.0.2

Première version fonctionnelle.

### 0.0.1

Initialisation du projet.

