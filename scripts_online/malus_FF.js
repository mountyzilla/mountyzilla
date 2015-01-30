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

/* v1.4 - 2014-01-06
 * - Gestion des sorts double composante
 * v1.4.1 - 2014-01-22
 * - Correction décumul
 * TODO
 * - Identifier la position de "PV" dans l'ordre MH
 */

var listeBM;


/* [functions]                     Utilitaires                                  */

function decumul(bmt,nbr) {
	var bmr;
	if(!nbr || nbr<2) bmr = bmt;
	else if(nbr==2) bmr = parseInt(0.67*bmt);
	else if(nbr==3) bmr = parseInt(0.40*bmt);
	else if(nbr==4) bmr = parseInt(0.25*bmt);
	else if(nbr==5) bmr = parseInt(0.15*bmt);
	else bmr = parseInt(0.1*bmt);
	if(bmt<0) return Math.min(-1,bmr);
	return Math.max(1,bmr);
	}

function triecaracs(a,b) { // version Yoyor, mod by Dab
	switch( a ) {
	case 'ATT':
		return -1;
	case 'ESQ': 
		if(b=='ATT') return 1;
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
	case 'Concentration':
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
			case 'Concentration':
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
			case 'Concentration':
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
			case 'Concentration':
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
			case 'Concentration':
			case 'Fatigue':
			case "Dés d'attaque":
			case 'Dés de dégâts':
				return 1;
			default:
				return -1;
			}
		}
	}


/* [functions]              Fonctions hide / display                            */

function toggleDetails() {
	if(MZ_getValue('BMDETAIL')!='false') {
		MZ_setValue('BMDETAIL','false');
		var trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';	
		}
	else {	
		MZ_setValue('BMDETAIL','true');
		var trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';
		}
	}

function toggleBMList() {
	if(MZ_getValue('BMHIDELIST')=='true') {
		MZ_setValue('BMHIDELIST','false');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style = '';
		document.getElementsByTagName('thead')[0].style = '';
		document.getElementById('trhelp').style = '';
		}
	else {
		MZ_setValue('BMHIDELIST','true');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		document.getElementById('trhelp').style.display = 'none';
		}
	}

function setDisplayBM() {
	if(!listeBM) return;
	
	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleBMList;
		}
	
	var tfoot = document.getElementsByTagName('tfoot')[0];
	var tr = document.evaluate("./tr/td/text()[contains(.,'décumul')]/../..",
								tfoot, null, 9, null).singleNodeValue;
	tr.id = 'trhelp';
	
	if(MZ_getValue('BMHIDELIST')=='true') {
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		tr.style.display = 'none';
		}
	}


/* [functions]                 Fonction principale                              */

function traiteMalus() {
	var mainTab = document.getElementsByTagName('table')[0];
	listeBM = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	if(listeBM.snapshotLength==0) return;
	
	/* Suppression des BM de fatigue stockés */
	if(MZ_getValue(numTroll+'.bm.fatigue'))
		MZ_removeValue(numTroll+'.bm.fatigue');
	
	/* Extraction des données */
	var uniListe = [], listeDurees = {}, listeDecumuls = {};
	var nb = 0;
	while(nb<listeBM.snapshotLength) {
		tr = listeBM.snapshotItem(nb); nb++;
		var effetsT = tr.childNodes[5].textContent.split(' | ');
		var phymag = tr.childNodes[9].textContent;
		var duree = Number(tr.childNodes[11].textContent.match(/\d+/)[0]);
		var type = tr.childNodes[3].textContent, nom;
		// si c'est un type à décumul
		switch(type) {
			case 'Potion':
			case 'Parchemin':
			case 'Sortilège':
			case 'Capacité Spéciale':
				nom = tr.childNodes[1].textContent+phymag;
				break;
			default:
				nom = 'pasdedecumul';
			}
		if(nom.indexOf('Amnésie')!=-1) // !! Amnésie = Capa, mais pas décumulée
			nom = 'pasdedecumul';
		
		uniListe[nb] = {
			'duree':duree,
			'nom':nom, // permet de gérer le non décumul des sorts à double composante
			'caracs':{}
			}
		for(var i=0 ; i<effetsT.length ; i++) {
			if(effetsT[i].indexOf(':')==-1) continue;
			// structure : liste[nb]=[duree , nom , [type ,] Array[caracs] ]
			// nom = 'pasdedecumul' si pas de décumul
			var carac = trim( effetsT[i].substring(0,effetsT[i].indexOf(':')) ) ;
			if(carac=='ATT' || carac=='DEG' || carac=='Armure')
				uniListe[nb]['type'] = phymag;
			var bm = Number(effetsT[i].match(/-?\d+/)[0]);
			uniListe[nb]['caracs'][carac] = bm;
			listeDurees[duree] = true;
			}
		}
	
	/* Gestion des décumuls et cumuls des durées */
	var toursGeres = [];
	for(var d in listeDurees) toursGeres.push(d);
	toursGeres.sort( function (a,b){return b-a;} );
	// pour sauvegarder les bm de fatigue
	var strfat = '';
	// Pour affichage & adpatation à footable.js (statique)
	var thead = document.getElementsByTagName('thead')[0];
	var nbHidden = document.evaluate("./tr/th[@style='display: none;']",
									thead, null, 7, null).snapshotLength;
	var tfoot = document.getElementsByTagName('tfoot')[0];
	
	for(var i=0 ; i<toursGeres.length ; i++) {
		var tour = toursGeres[i];
		var effetsCeTour = {}; decumulsCeTour = {};
		for(var nb=1 ; nb<uniListe.length ; nb++) {
			if(uniListe[nb]['duree']<toursGeres[i]) // si durée pvr < durée analysée, on passe
				continue;
			var nom = uniListe[nb]['nom'];
			if(nom!='pasdedecumul') {
				if(decumulsCeTour[nom]==null) decumulsCeTour[nom] = 0;
				decumulsCeTour[nom]++;
				}
			for(var carac in uniListe[nb]['caracs']) {
				var bm = uniListe[nb]['caracs'][carac];
				if(carac=='ATT' || carac=='DEG' || carac=='Armure') {
					var type = uniListe[nb]['type'];
					if(!effetsCeTour[carac])
						effetsCeTour[carac] = {'Physique':0, 'Magie':0};
					if(nom=='pasdedecumul')
						effetsCeTour[carac][type] += bm;
					else
						effetsCeTour[carac][type] += decumul(bm,decumulsCeTour[nom]);
					}
				else {
					if(!effetsCeTour[carac]) effetsCeTour[carac]=0;
					if(nom=='pasdedecumul' || carac=='Fatigue')
						effetsCeTour[carac] += bm;
					else if(carac=='TOUR') // les durees se comptent en demi-minutes dans MH
						effetsCeTour[carac] += decumul(2*bm,decumulsCeTour[nom])/2;
					else 
						effetsCeTour[carac] += decumul(bm,decumulsCeTour[nom]);
					}
				}
			}
		
		/* Création du bilan du tour */
		var texteD = '', texteS = '';
		var caracGerees = [];
		for(var k in effetsCeTour) caracGerees.push(k);
		caracGerees.sort( triecaracs );
		
		for(var j=0 ; j<caracGerees.length ; j++) {
			var carac = caracGerees[j], str = '';
			
			switch( carac ) {
				case 'ATT':
				case 'DEG':
				case 'Armure':
					var phy = effetsCeTour[carac]['Physique'];
					var mag = effetsCeTour[carac]['Magie'];
					texteD += (phy || mag)? ' | '+carac+' : '+aff(phy)+'/'+aff(mag) : '';
					texteS += (phy+mag) ? ' | '+carac+' : '+aff(phy+mag) : '';
					break;
				case 'TOUR':
					str = effetsCeTour[carac]? ' | TOUR : '+aff( effetsCeTour[carac] )+' min' : '';
					break;
 				case 'Fatigue':
					strfat += toursGeres[i]+'-'+effetsCeTour[carac]+';';
				case 'PV':
				case 'ESQ':
				case 'REG':
				case 'Vue':
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] ) : '';
					break;
				default:
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] )+' %' : '';
				}
			if(str) {
				texteD += str;
				texteS += str;
				}
			}
		
		/* Affichage */
		// Si rien à afficher on passe
		if(!texteD) continue;
		// Si BMM+BMP=0
		texteS = texteS ? texteS.substring(3) : 'Aucun effet';
		var tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanDetail');
		if(MZ_getValue('BMDETAIL')=='false')
			tr.style.display = 'none';
		var td = appendTdText(tr,texteD.substring(3));
		td.colSpan = 5-nbHidden;
		var txttour = toursGeres[i]+' Tour';
		if(toursGeres[i]>1) txttour += 's';
		appendTdText(tr,txttour);
		
		tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanSomme');
		if(MZ_getValue('BMDETAIL')!='false')
			tr.style.display = 'none';
		td = appendTdText(tr,texteS);
		td.colSpan = 5-nbHidden;
		appendTdText(tr,txttour);
		}
	
	/* mise en place toggleDetails */
	tfoot.style.cursor = 'pointer';
	tfoot.onclick = toggleDetails;
	
	/* Stockage fatigue : tour-fatigue;tour-fatigue;... */
	if(strfat)
		MZ_setValue(numTroll+'.bm.fatigue',strfat);
	}

try {
start_script();
traiteMalus();
setDisplayBM();
displayScriptTime();
}
catch(e) {window.alert(e)};
