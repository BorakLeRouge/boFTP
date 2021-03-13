
const vscode = require('vscode');

// * * * Modules * * *
const path   = require('path') ;
const fs     = require('fs') ;
const yaml   = require('js-yaml') ;	
const os     = require('os') ;  
const { cpuUsage } = require('node:process');
  
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
		panel.webview.html = '<pre>'+cmd+"\n\r\n\r"+contenu+'</pre>' ;
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

	// * * * Recherche du fichier YAML * * *
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

	if (fiYaml == '') {
		vscode.window.showErrorMessage('boFTP - désolé : fichier "boFTP.yaml" non trouvé !');
		clog('Yaml non trouvé !') ;
		return ;
	}

	// * * * Ouverture du fichier YAML * * *
	let fiYamlCont = fs.readFileSync(fiYaml, 'utf8') ;
	let connexionList = yaml.safeLoad(fiYamlCont) ; 
	let connActif = connexionList.actif ; clog(connActif) ;
	if (connActif == undefined) {
		vscode.window.showErrorMessage('boFTP - manque le paramètre "actif" dans le fichier "boFTP.yaml" !');
		clog('connActif undefined') ;
		return ;
	}
	let connex = connexionList.connexions[connActif] ;
	if (connex == undefined || connex.adresse == undefined 
		|| connex.user == undefined || connex.dossier == undefined) {
		vscode.window.showErrorMessage('boFTP - fichier "boFTP.yaml" non conforme !');
		clog('connex', connex) ;
		return ;
	}
	//clog('connex', connex) ;

	// * * * Paramètre fichier * * *
	let tmpFTP     = path.join(os.tmpdir(),'cmdftp.prm') ; 

	// * * * Lancement FTP * * *
	let cmdFTP =
			  "open " + connex.adresse + " \n" +
			  "user " + connex.user + ' ' + connex.password + " \n" ;
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
		 	  "ls \n" ;
	}
    cmdFTP += "bye "; 		

	fs.writeFileSync(tmpFTP, cmdFTP) ;

	let cmd = "cat '" + tmpFTP + "' | ftp -nv" ; 
	//cmd = "echo '"+cmd+"'" ;
	//clog (cmdFTP, cmd) ;

	let cmdResult ;
	try {
		cmdResult = require('child_process').execSync(cmd).toString() ;
		let res = cmdResult.replace(/\n/g, "\r\n").replace(connex.password, "********") ;
		if (mode == 'test' || visuCR ) {
			affichageWeb(res, cmdFTP.replace(/\n/g, "\r\n").replace(connex.password, "********")) ;
		} else {
		   //clog(res) ;
		   vscode.window.showInformationMessage(res);
		}
	} catch (err) {
		vscode.window.showErrorMessage('IT-CE : Problème de transfert FTP ! '+cmdResult);
		clog('err', err) ;
		return ;
	}		

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
