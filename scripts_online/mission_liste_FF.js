/*
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Patch :
 * gestion des missions terminées
 */

function checkLesMimis() {
	try {
		var titresMimis = document.evaluate(
			"//div[@class='mh_titre3']/b/a[contains(@href,'Mission_')]",
			document, null, 7, null
		);
		var obMissions = JSON.parse(MZ_getValue(numTroll+'.MISSIONS'));
	} catch(e) {
		window.console.error('[MZ mission_liste] Erreur initialisation:\n'+e);
		return;
	}
	
	var enCours = {};
	for(var i=0 ; i<titresMimis.snapshotLength ; i++) {
		var num = titresMimis.snapshotItem(i).textContent.match(/\d+/)[0];
		enCours[num] = true;
	}
	
	for(var numMimi in obMissions) {
		if(!enCours[numMimi]) {
			delete obMissions[numMimi];
		}
	}
	MZ_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
}

checkLesMimis();
