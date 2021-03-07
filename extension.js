
const vscode = require('vscode');

// * * * Modules * * *
const path   = require('path') ;
const fs     = require('fs') ;
const yaml   = require('js-yaml') ;	
  
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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	clog('boftp est maintenant Actif !');

	let disposable ;

  
	// =======================================================================================================================
	//   TTTTT  RRRR    AAA   N   N   SSSS  FFFFF  EEEEE  RRRR   TTTTT       FFFFF  IIIII   CCC   H   H  IIIII  EEEEE  RRRR
	//     T    R   R  A   A  NN  N  S      F      E      R   R    T         F        I    C   C  H   H    I    E      R   R
	//     T    RRRR   AAAAA  N N N   SSS   FFFF   EEEE   RRRR     T         FFFF     I    C      HHHHH    I    EEEE   RRRR
	//     T    R  R   A   A  N  NN      S  F      E      R  R     T         F        I    C   C  H   H    I    E      R  R
	//     T    R   R  A   A  N   N  SSSS   F      EEEEE  R   R    T         F      IIIII   CCC   H   H  IIIII  EEEEE  R   R
	// =======================================================================================================================
  
	disposable = vscode.commands.registerCommand('boftp.transfertFTP', async function () {


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
		while (fi.length > 5 && fi != fp && fi != undefined && fiYaml == '') {
			let t = path.join(fi, 'boFTP.yaml') ;
			if (fs.existsSync(t)) {	
				fiYaml = t ;
			} else {
				fi = path.dirname(fi) ;
			}
		}
		clog('fiYaml', fiYaml) ;
		if (fiYaml == '') {
			vscode.window.showErrorMessage('boFTP - désolé : fichier "boFTP.yaml" non trouvé !');
			clog('Yaml non trouvé !') ;
			return ;
		}

		// * * * Ouverture du fichier YAML * * *
		let fiYamlCont = fs.readFileSync(fiYaml, 'utf8') ;
		let connexionList = yaml.safeLoad(fiYamlCont) ;
		clog('connexionList', connexionList) ;

		// * * * Lancement FTP * * *


		
		// * * * Fin * * *

		vscode.window.showInformationMessage('Ca marche !');
		clog('* * * * nickel * * * *') ;

	});

	context.subscriptions.push(disposable);
  
	// ===========================================================================================
	//   FFFFF  IIIII  N   N       TTTTT  RRRR    AAA   N   N   SSSS  FFFFF  EEEEE  RRRR   TTTTT
	//   F        I    NN  N         T    R   R  A   A  NN  N  S      F      E      R   R    T
	//   FFFF     I    N N N         T    RRRR   AAAAA  N N N   SSS   FFFF   EEEE   RRRR     T
	//   F        I    N  NN         T    R  R   A   A  N  NN      S  F      E      R  R     T
	//   F      IIIII  N   N         T    R   R  A   A  N   N  SSSS   F      EEEEE  R   R    T
	// ===========================================================================================
  

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
