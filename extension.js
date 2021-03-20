
const vscode = require('vscode');

// * * * Modules * * *
const path   = require('path') ;
const fs     = require('fs') ;
const yaml   = require('js-yaml') ;	
const os     = require('os') ;  

// ==============================
//    CCC   L       OOO    GGGG
//   C   C  L      O   O  G
//   C      L      O   O  G  GG
//   C   C  L      O   O  G   G
//    CCC   LLLLL   OOO    GGG
// ==============================
function clog(...tb) {
    console.log(tb[0]) ;
    if (tb.length > 1) { 
        console.log(tb) ;
}   }

  
// ======================================================================
//    CCC    OOO   DDDD    AAA    GGGG  EEEEE       PPPP   W   W  DDDD
//   C   C  O   O  D   D  A   A  G      E           P   P  W   W  D   D
//   C      O   O  D   D  AAAAA  G  GG  EEEE        PPPP   W W W  D   D
//   C   C  O   O  D   D  A   A  G   G  E           P      W W W  D   D
//    CCC    OOO   DDDD   A   A   GGG   EEEEE       P       W W   DDDD
// ======================================================================
//* Encodage et décodage du password  
// * * * Encodage utf-8 * * *
function encodPW(t) {
	let res = '' ;
	let prc = 42 ;
	for(let i in t) {
		let c   = Number(t.charCodeAt(i)) ; 
		let cc  = c + prc ; 
		prc = c ; 
		if (cc > 255) { cc = cc - 255 ; }
		res += cc.toString(16) 
	}
	return res
}
// * * * Décodage utf-8 * * *
function decodPW(t) {
	let res = '' ;
	let prc = 42 ;
	for(let i = 0; i < t.length; i+=2) {
		let v = parseInt(t.substr(i, 2), 16) ; 
		prc = v - prc ;
		if (prc < 0) {prc = prc + 255 ; } 
		res += String.fromCharCode(prc) ; 
	}
	return res ;
}

// ==================================================================================================
//   RRRR   EEEEE   CCC   U   U  PPPP        PPPP    AAA    SSSS   SSSS  W   W   OOO   RRRR   DDDD
//   R   R  E      C   C  U   U  P   P       P   P  A   A  S      S      W   W  O   O  R   R  D   D
//   RRRR   EEEE   C      U   U  PPPP        PPPP   AAAAA   SSS    SSS   W W W  O   O  RRRR   D   D
//   R  R   E      C   C  U   U  P           P      A   A      S      S  W W W  O   O  R  R   D   D
//   R   R  EEEEE   CCC    UUU   P           P      A   A  SSSS   SSSS    W W    OOO   R   R  DDDD
// ==================================================================================================
// a partir du compte, récupération du password (ou demande du password)
let recupPassword = async function(adresse, fichierYaml) {
	let fichierPassword = path.join(path.dirname(fichierYaml), 'boFTP.password') ;
	let objPassword = {} ;
	let password = '' ;
	if (fs.existsSync(fichierPassword)) {	
		let t = fs.readFileSync(fichierPassword, 'latin1') ;
		objPassword = JSON.parse(t);
		password = objPassword[adresse] ;
	} 
	if (password == undefined || password == null || password == '') {
		password = '' ;
		let pass = await vscode.window.showInputBox({ placeHolder: 'Mot de passe', prompt: 'Saisissez votre Mot de Passe Mainframe', password: true});
		if (pass && pass != '') {
		     password = pass ;
			 // * * * sauvegarde fichier password * * *
			 objPassword[adresse] = encodPW(password) ;
			 let cont = JSON.stringify(objPassword) ;
			 fs.writeFileSync(fichierPassword, cont, 'latin1') ;
		}
	} else {
		password = decodPW(password) ;
	}
	return password ;
}  

  
// ==================================================================================================
//   RRRR   EEEEE   CCC   H   H  EEEEE  RRRR    CCC   H   H  EEEEE       Y   Y   AAA   M   M  L
//   R   R  E      C   C  H   H  E      R   R  C   C  H   H  E            Y Y   A   A  MM MM  L
//   RRRR   EEEE   C      HHHHH  EEEE   RRRR   C      HHHHH  EEEE          Y    AAAAA  M M M  L
//   R  R   E      C   C  H   H  E      R  R   C   C  H   H  E             Y    A   A  M   M  L
//   R   R  EEEEE   CCC   H   H  EEEEE  R   R   CCC   H   H  EEEEE         Y    A   A  M   M  LLLLL
// ==================================================================================================
let lectureYAML = async function(dirFich) {

	// * * * Recherche du fichier YAML et alim sous-dossier ftp * * *
	let fi     = dirFich ;
	let fp     = '' ;
	let fiYaml = '' ;
	let dossierFtp = '' ;
	while (fi.length > 5 && fi != fp && fi != undefined && fiYaml == '') {
		let t = path.join(fi, 'boFTP.yaml') ;
		if (fs.existsSync(t)) {	
			fiYaml = t ;
			dossierFtp = dirFich.substr(path.dirname(fiYaml).length + 1) ;
		} else {
			fi = path.dirname(fi) ;
		}
	}
	dossierFtp = dossierFtp.replace(/\\/g, "/") ;
	// * * * controle présence YAML * * *
	if (fiYaml == '') {
		vscode.window.showErrorMessage('boFTP - désolé : fichier "boFTP.yaml" non trouvé !');
		clog('Yaml non trouvé !') ;
		return { retour: false };
	}

	// * * * Ouverture du fichier YAML * * *
	let fiYamlCont = fs.readFileSync(fiYaml) ;
	let connexionList = yaml.safeLoad(fiYamlCont) ; 
	let connActif = connexionList.actif ; 
	if (connActif == undefined) {
		vscode.window.showErrorMessage('boFTP - manque le paramètre "actif" dans le fichier "boFTP.yaml" !');
		clog('connActif undefined') ;
		return { retour: false };
	}
	let connex = connexionList.connexions[connActif] ;
	if (connex == undefined || connex.adresse == undefined || connex.user == undefined) {
		vscode.window.showErrorMessage('boFTP - fichier "boFTP.yaml" non conforme !');
		clog('connex', connex) ;
		return { retour: false };
	}
	if (connex.dossier == undefined) {connex.dossier = '' ; }

	// * * * Récupération du password * * *
	let password = await recupPassword(connex.adresse + '-' + connActif, fiYaml, connexionList.actif) ;
	if (password == '') {
		vscode.window.showErrorMessage('boFTP - manque le mot de passe !');
		clog('password innexistant') ;
		return { retour: false }
	}

	// * * * Retour * * *
	return { retour: true, connex: connex, dossierFtp: dossierFtp, fichierYaml: fiYaml, password: password } ;

}
  
// ===========================================================================================
//    AAA   FFFFF  FFFFF  IIIII   CCC   H   H   AAA    GGGG  EEEEE       W   W  EEEEE  BBBB
//   A   A  F      F        I    C   C  H   H  A   A  G      E           W   W  E      B   B
//   AAAAA  FFFF   FFFF     I    C      HHHHH  AAAAA  G  GG  EEEE        W W W  EEEE   BBBB
//   A   A  F      F        I    C   C  H   H  A   A  G   G  E           W W W  E      B   B
//   A   A  F      F      IIIII   CCC   H   H  A   A   GGG   EEEEE        W W   EEEEE  BBBB
// ===========================================================================================
  
let affichageWeb = async function(contenu, cmd) {
		// * * * Preparation Panel Web * * *
		const panel = vscode.window.createWebviewPanel(
			'Display',
			'Display',
			vscode.ViewColumn.One,
			{
			  // Enable scripts in the webview
			  enableScripts: false
			  // ne réinitialise pas l'affichage HTML
		    , retainContextWhenHidden: false
			}
		);
		let t = '<pre>'+cmd+"\r\n\r\n"+contenu+'</pre>' ;
		t = t.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "\r\n") ;
		panel.webview.html = t ;
}
  
  
// ===============================================================
//   EEEEE  N   N  V   V   OOO   IIIII       FFFFF  TTTTT  PPPP
//   E      NN  N  V   V  O   O    I         F        T    P   P
//   EEEE   N N N  V   V  O   O    I         FFFF     T    PPPP
//   E      N  NN   V V   O   O    I         F        T    P
//   EEEEE  N   N    V     OOO   IIIII       F        T    P
// ===============================================================
// module d'envoi de la commande FTP present dans un fichier 
let envoiFTP = function(cmdFTP, password, mode, visuCR) {


	// * * * Paramètre fichier * * *
	let fichierCmdFTP = path.join(os.tmpdir(),'cmdftp.prm') ; 
	
	let cmd ;
	if (os.platform().substr(0,3) == 'win') {
		// * * * Version Windows * * *
		cmd =  'FTP -n -s:"' + fichierCmdFTP + '"' ; 
		fichierCmdFTP.replace(/\n/g, "\r\n")
		fs.writeFileSync(fichierCmdFTP, cmdFTP) ;
	} else {
		// * * * Version Macintosh (ou Unix) * * *
		cmd = "cat '" + fichierCmdFTP + "' | ftp -nv" ; 
		fichierCmdFTP.replace(/\r\n/g, "\n")
		fs.writeFileSync(fichierCmdFTP, cmdFTP) ;
	}

	let cmdResult ;
	try {
		cmdResult = require('child_process').execSync(cmd).toString() ;
		let res = cmdResult.replace(password, "********") ;
		if (mode == 'test' || visuCR ) {
			affichageWeb(res, cmdFTP.replace(password, "********")) ;
		} else {
		vscode.window.showInformationMessage(res);
		}
	} catch (err) {
		vscode.window.showErrorMessage('IT-CE : Problème de transfert FTP ! '+cmdResult);
		clog('err', err) ;
		return  false ;
	}	

	return  true ;	
}

// ======================================================================
//   M   M   OOO   DDDD   U   U  L      EEEEE       FFFFF  TTTTT  PPPP
//   MM MM  O   O  D   D  U   U  L      E           F        T    P   P
//   M M M  O   O  D   D  U   U  L      EEEE        FFFF     T    PPPP
//   M   M  O   O  D   D  U   U  L      E           F        T    P
//   M   M   OOO   DDDD    UUU   LLLLL  EEEEE       F        T    P
// ======================================================================
  
  
let moduleFTP = async function(mode='trsf') {

	// * * * Récupération Paramètre extension * * *
	let configuration  = vscode.workspace.getConfiguration('boFTP') ;
	let visuCR         = configuration.CompteRenduText ;
	
	// * * * Information du fichier en cours * * *
	let textEdit    = vscode.window.activeTextEditor ;
	if (textEdit == undefined) {
		vscode.window.showErrorMessage('boFTP - Vous ne n\'êtes pas sur un fichier en édition !');
		return ;	
	}
	if (textEdit.document.isDirty || textEdit.document.isUntitled) {
		vscode.window.showErrorMessage('boFTP - Vous n\'avez pas sauvegardé votre fichier !');
		return ;
	}
	let adrFich     = textEdit.document.fileName ;
	let nomFich     = path.basename(adrFich) ; 
	let dirFich     = path.dirname(adrFich) ;

	// * * * Lecture du fichier YAML
	let lectYaml = await lectureYAML(dirFich) ;
	if (lectYaml.retour == false) { return ; }
	let connex     = lectYaml.connex ;
	let dossierFtp = lectYaml.dossierFtp ;
	let password   = lectYaml.password ;

	// * * * Lancement FTP * * *
	let cmdFTP =
			  "open " + connex.adresse + " \n" +
			  "user " + connex.user + ' ' + password + " \n" ;
	if (connex.dossier != '') {
		cmdFTP +=
			  "cd \"" + connex.dossier + "\" \n" ;
	}
	if (dossierFtp != '') {
		cmdFTP +=
			  "cd \"" + dossierFtp + "\" \n" ;
	}
	if (mode == 'trsf') {
		cmdFTP +=
			  "put \""+ adrFich +"\" \"" + nomFich + "\" \n" ;
	}
	if (mode == 'test' || visuCR) {
		cmdFTP +=
		 	  "ls -l\n" ; 
	}
    cmdFTP += "pwd \n" ; 	
    cmdFTP += "bye "; 		

	// * * * Envoi de la commande FTP * * *
		envoiFTP(cmdFTP, password, mode, visuCR) ;
		
	// * * * Fin * * *
	vscode.window.showInformationMessage('Commande de transfert du fichier "'+nomFich+'" executée !');

	clog('* * * * nickel * * * *') ;

	return

}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	clog('boftp est maintenant Actif !');

	let disposable ;

// =========================================================================================================
//   DDDD   EEEEE  BBBB   U   U  TTTTT        CCC    OOO   M   M  M   M   AAA   N   N  DDDD   EEEEE   SSSS
//   D   D  E      B   B  U   U    T         C   C  O   O  MM MM  MM MM  A   A  NN  N  D   D  E      S
//   D   D  EEEE   BBBB   U   U    T         C      O   O  M M M  M M M  AAAAA  N N N  D   D  EEEE    SSS
//   D   D  E      B   B  U   U    T         C   C  O   O  M   M  M   M  A   A  N  NN  D   D  E          S
//   DDDD   EEEEE  BBBB    UUU     T          CCC    OOO   M   M  M   M  A   A  N   N  DDDD   EEEEE  SSSS
// =========================================================================================================
  
	disposable = vscode.commands.registerCommand('boftp.transfertFTP', async function () {
		moduleFTP() ;
	});
	context.subscriptions.push(disposable);
    
	disposable = vscode.commands.registerCommand('boftp.testFTP', async function () {
		moduleFTP('test') ;
	});
	context.subscriptions.push(disposable);
    
// ===========================================================================================
//   FFFFF  IIIII  N   N        CCC    OOO   M   M  M   M   AAA   N   N  DDDD   EEEEE   SSSS
//   F        I    NN  N       C   C  O   O  MM MM  MM MM  A   A  NN  N  D   D  E      S
//   FFFF     I    N N N       C      O   O  M M M  M M M  AAAAA  N N N  D   D  EEEE    SSS
//   F        I    N  NN       C   C  O   O  M   M  M   M  A   A  N  NN  D   D  E          S
//   F      IIIII  N   N        CCC    OOO   M   M  M   M  A   A  N   N  DDDD   EEEEE  SSSS
// ===========================================================================================
  
  
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
