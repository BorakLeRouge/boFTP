# boFTP - Le transfert de fichier via FTP.

boFTP, une solution pour transférer un fichier sur un site.    
Le paramétrage étant dans un fichier YAML à la racine (ou la racine en dessous du dépot).. 
Et ce paramètre permet de faire un transfert FTP pour tous les sous-repertoires.

C'est seulement une possibilité de transfert de fichier. Pas de création de repertoire, les nouveaux repertoires seront à créer avec un autre logiciel FTP (fizilla, cyberduck, ...).

Une commande pour valider la connexion : `Ctrl` + `shift` + `p` : `boFTP-Validation accès FTP`    
Une commande pour faire le transfert : `Ctrl` + `shift` + `p` : `boFTP-Transfert de fichier`    
Un menu contextuel permet aussi le transfert : `boFTP-Transfert de fichier`


Exemple de contenu du fichier de paramétrage : `boFTP.yaml` :     
Ici deux connexions possibles `connex1` et `connex2`, et on choisit par le champ `actif`.     
Au premier lancement, il vous demandera le `mot de passe` du compte actif, ce mot de passe sera stocké dans un fichier : `boFTP.password`.

```
comment:         Les connexions FTP
actif:           connex1
connexions:
    connex1:
      adresse:   192.168.1.1
      user:      borakLeRouge
      dossier:   /var/www
    connex2:
      adresse:   192.168.1.1
      user:      MarcellusWallace
      dossier:   /var/www
```

Dans le fichier `.gitignore`, il sera utile d'ignorer les fichiers `boFTP.*`.

## Release Notes

### 0.1.*

Première version fonctionnelle avec ses retouches.

### 0.0.4

Gestion du mot de passe.

### 0.0.3

YAML multicible.

### 0.0.2

Première version fonctionnelle.

### 0.0.1

Initialisation du projet.

