/*********************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/
/* v1.2.3 by Dab - 2013-05-03 */

function decumul(bmt, nbr) {
	var bmr;
	if (!nbr || nbr <2) {bmr = bmt;}
	else if (nbr==2) {bmr = parseInt(0.67*bmt);}
	else if (nbr==3) {bmr = parseInt(0.40*bmt);}
	else if (nbr==4) {bmr = parseInt(0.25*bmt);}
	else if (nbr==5) {bmr = parseInt(0.15*bmt);}
	else {bmr = parseInt(0.1*bmt);}
	if (bmt<0) {return Math.min(-1,bmr);}
	return Math.max(1,bmr);
	}

function triecaracs(a,b) { // version Yoyor, mod by Dab
	switch( a ) {
	case 'ATT':
		return -1;
	case 'ESQ': 
		if (b=='ATT') return 1;
		return -1;
	case 'DEG': 
		switch( b ) {
			case 'ATT':
			case 'ESQ':
				return 1;
			default:
				return -1;
			}
	case 'REG':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
				return 1;
			default:
				return -1;
			}
	case 'Vue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
				return 1;
			default:
				return -1;
			}
	case 'TOUR':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
				return 1;
			default:
				return -1;
			}
	case 'Armure':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
				return 1;
			default:
				return -1;
			}
	case 'RM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
				return 1;
			default:
				return -1;
			}
	case 'MM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
				return 1;
			default:
				return -1;
			}
	case 'Fatigue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
				return 1;
			default:
				return -1;
			}
	case "Dés d'attaque":
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Fatigue':
				return 1;
			default:
				return -1;
			}
	case 'Dés de dégâts':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Fatigue':
			case "Dés d'attaque":
				return 1;
			default:
				return -1;
			}
	default :
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Fatigue':
			case "Dés d'attaque":
			case 'Dés de dégâts':
				return 1;
			default:
				return -1;
			}
		}
	}
	

function traiteMalus() {
	var listeBM = document.getElementsByClassName('mh_tdpage');
	var uniListe = [], listeDurees = [], listeDecumuls = [];
	/* Suppression des BM de fatigue stockés */
	if (MZ_getValue(numTroll+'.bm.fatigue'))
		MZ_removeValue(numTroll+'.bm.fatigue');
	
	/* Extraction des données */
	nb = 0;
	while (nb < listeBM.length) {
		tr = listeBM[nb]; nb++;
		var type = tr.childNodes[3].textContent;
		// si c'est un type à décumul ... NB : TP n'est plus décumulé
		if (type=='Potion' || type=='Parchemin' || type=='Sortilège' || type=='Capacité Spéciale')
			var nom = tr.childNodes[1].textContent;
		else
			var nom = 'pasdedecumul';
		if (nom.indexOf('Amnésie')!=-1) // Amnésie n'est pas décumulée
			nom = 'pasdedecumul';
		var effetsT = tr.childNodes[5].textContent.split(' | ');
		var phymag = tr.childNodes[9].textContent;
		var duree = parseInt( tr.childNodes[11].textContent.match(/\d+/) );
		
		uniListe[nb] = [];
		uniListe[nb]['duree'] = duree;
		uniListe[nb]['nom'] = nom;
		uniListe[nb]['caracs'] = [];
		for (var i=0 ; i<effetsT.length ; i++) {
			if (effetsT[i].indexOf(':')==-1)
				continue;
			// structure : liste[nb]=[duree , nom , Array[carac.type] ]
			// nom = 'pasdedecumul' si pas de décumul
			// carac = ATT.Physique, DEG.Magie ...
			var carac = trim( effetsT[i].substring(0,effetsT[i].indexOf(':')) )+'.'+phymag ;
			var bm = parseInt( effetsT[i].match(/-?\d+/) );
			uniListe[nb]['caracs'][carac] = bm;
			listeDurees[duree] = true;
			}
		}

	/* Gestion des décumuls et cumuls des durées */
	var toursGeres = [];
	for (var d in listeDurees) toursGeres.push(d);
	toursGeres.sort( function (a, b){return a-b;} );
	
	var strfat = ''; // pour sauvegarder les bm de fatigue
	for (var i=0 ; i<toursGeres.length ; i++) {
		var tour = toursGeres[i];
		var effetsCeTour = []; decumulsCeTour = [];
		for (var nb=1 ; nb<uniListe.length ; nb++) {
			if (uniListe[nb]['duree']<toursGeres[i]) // si durée pvr < durée analysée, on passe
				continue;
			var nom = uniListe[nb]['nom'];
			if (nom!='pasdedecumul') {
				if (decumulsCeTour[nom]==null)
					decumulsCeTour[nom] = 0;
				decumulsCeTour[nom]++;
				}
			for (var carac in uniListe[nb]['caracs']) {
				var nomcarac = carac.substring(0,carac.indexOf('.'));
				var typecarac = carac.substring(carac.indexOf('.')+1);
				var bm = uniListe[nb]['caracs'][carac];
				if (effetsCeTour[nomcarac]==null) {
					effetsCeTour[nomcarac] = [];
					effetsCeTour[nomcarac]['Physique'] = 0;
					effetsCeTour[nomcarac]['Magie'] = 0;
					}
				if (nom=='pasdedecumul' || nomcarac=='Fatigue')
					effetsCeTour[nomcarac][typecarac] += bm;
				else if (nomcarac=='TOUR') // les durees se comptent en demi-minutes dans MH
					effetsCeTour[nomcarac][typecarac] += decumul(2*bm,decumulsCeTour[nom])/2;
				else
					effetsCeTour[nomcarac][typecarac] += decumul(bm,decumulsCeTour[nom]);
				}
			}
		
		/* Création du bilan du tour */
		var texte = '';
		var caracGerees = [];
		for (var k in effetsCeTour)
			caracGerees.push(k);
		caracGerees.sort( triecaracs );
		
		for (var j=0 ; j<caracGerees.length ; j++) {
			if (texte.length>0) {texte += ' | ';}
			if (caracGerees[j]=='TOUR') {
				texte += 'TOUR : '
					+aff( effetsCeTour['TOUR']['Physique']+effetsCeTour['TOUR']['Magie'] )+' min';
				}
			else if (caracGerees[j]=='Fatigue') {
				texte += 'Fatigue : '
					+aff( effetsCeTour['Fatigue']['Physique']+effetsCeTour['Fatigue']['Magie'] );
				// mémorisation fatigue
				strfat+= toursGeres[i]+'-'
					+(effetsCeTour['Fatigue']['Physique']+effetsCeTour['Fatigue']['Magie'])+';';
				}
			else if (caracGerees[j]=='PV') {
				texte += 'PV : '
					+aff( effetsCeTour['PV']['Physique']+effetsCeTour['PV']['Magie'] );
				}
			else if (caracGerees[j].length==3 || caracGerees[j]=='Armure') {
				texte += caracGerees[j]+' : '
					+aff( effetsCeTour[ caracGerees[j] ]['Physique'] )+'/'
					+aff( effetsCeTour[ caracGerees[j] ]['Magie'] );
				if (effetsCeTour[ caracGerees[j] ]['Physique']!=0 && effetsCeTour[ caracGerees[j] ]['Magie']!=0)
					texte += ' ('+aff( effetsCeTour[ caracGerees[j] ]['Physique']
									+effetsCeTour[ caracGerees[j] ]['Magie'])+')';
				}
			else {
				texte += caracGerees[j]+' : '
					+aff(effetsCeTour[caracGerees[j]]['Physique']+effetsCeTour[caracGerees[j]]['Magie'])+' %';
				}
			}
		
		/* Affichage */
		// adpatation affichage dynamique (footable.js)
		var thead = document.getElementsByTagName('thead')[0];
		var nbHidden = document.evaluate("./tr/th[@style='display: none;']", thead, null, 7, null).snapshotLength;
		var tfoottr = document.getElementsByTagName('tfoot')[0].childNodes[1];
		var tr = insertTr(tfoottr.nextSibling, 'mh_tdpage');
		var td = appendTdText(tr, texte);
		td.setAttribute('colspan',5-nbHidden);
		texte = toursGeres[i]+' Tour';
		if (toursGeres[i]>1) {texte += 's';}
		appendTdText(tr, texte);
		}
	
	if (strfat) // stockage fatigue : tour-fatigue;tour-fatigue;...
		MZ_setValue(numTroll+'.bm.fatigue', strfat);
	}

try {
start_script();
traiteMalus();
displayScriptTime()
}
catch(e) {alert(e)};
