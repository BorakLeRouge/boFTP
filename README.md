# boftp README

boFTP, une solution pour transferer un fichier sur un site.
Le paramétrage étant dans un fichier YAML à la racine..

Exemple de contenu du fichier YAML :

```
comment:         Les connexions FTP
connexions:
    - connexion: pi
      adresse:   192.168.1.1
      user:      borakLeRouge
      password:  ilEstTropBeau
      dossier:   /var/www
```

## Release Notes

### 0.0.2

Première version fonctionnelle.

### 0.0.1

Initialisation du projet.

