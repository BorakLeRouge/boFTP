# boFTP - Le transfert de fichier via FTP.

**boFTP**, une solution pour transférer un fichier sur un site avec la commande terminal FTP.    
Le paramétrage se fait dans un fichier **YAML** à la racine (ou la racine en dessous du dépot). 
Et ce paramètre unique permet de faire des transferts FTP pour tous les sous-repertoires.

C'est seulement une possibilité de transfert de fichier texte. Pas de création de répertoire, les nouveaux repertoires seront à créer avec un autre logiciel FTP (FileZilla, Cyberduck, ...).

  
Un menu contextuel permet de faire le transfert : `boFTP-Transfert de fichier`    
Une commande pour faire le transfert : `Ctrl` + `shift` + `p` : `boFTP-Transférer le fichier`    
Une commande pour tester et valider la connexion : `Ctrl` + `shift` + `p` : `boFTP-Valider l'accès FTP`   
Une commande changer le mot de passe : `Ctrl` + `shift` + `p` : `boFTP-Changer le mot de passe` 


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
      secure:    false
    connex2:
      adresse:   192.168.1.1
      user:      MarcellusWallace
      dossier:   /var/www
```

Dans le fichier `.gitignore`, il sera utile d'ignorer les fichiers `boFTP.*`.

Une option de l'extension permet de récupérer le compte-rendu de l'extension lors du transfert (comme pour la vérification ou le changement de mot de passe, ce qui s'effectue automatiquement). Ca peut être utile, mais c'est un peu encombrant. 

----

## Contraintes

BoFTP utilise maintenant le module npm basic-ftp pour effectuer les accès FTP.

----

## Capture d'écrans

Le fichier paramètre :

![Paramètres](https://raw.githubusercontent.com/BorakLeRouge/boFTP/master/boFTPparam.png)

Le menu de transfert :

![Menu](https://raw.githubusercontent.com/BorakLeRouge/boFTP/master/boFTPmenu.png) 

Le compte-rendu de transfert (optionnel) :

![Compte-rendu](https://raw.githubusercontent.com/BorakLeRouge/boFTP/master/boFTPcr.png) 

----

## Release Notes

### 2.2.0

Utilisation du module npm 'basic-ftp'.    
Affichage des accès dans la sortie dédiée.    
Ajout d'une possibilité de FTPS dans le yaml (paramètre secure).

### 0.2.0

Ajout d'une commande de changement de mot de passe.
Modification des libellés des commandes.

### 0.1.4

Quelques photos d'écran dans le ReadMe.

### 0.1.2

Amélioration du ReadMe.

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

