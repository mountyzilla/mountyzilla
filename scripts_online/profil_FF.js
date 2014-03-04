/*******************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/* v0.10.0 - 2013-12-13
 * - correctif freezing et check-up déploiement
 * v0.10.3a - 2013-12-22
 * - correctif BS
 * - alignement Anatrolliseur (Rotobaffe)
 * v0.10.4 - 2013-12-28
 * - allègement de code
 * v0.10.5 - 2014-01-01
 * - gestion pièges
 * v0.10.6 - 2014-01-04
 * - gestion golemo
 * v0.10.6.1 - 2014-01-06
 * - correction refreshAccel()
 * v0.10.6.2 - 2014-01-24
 * - disparition balluchonnage
 * v0.10.6.3 - 2014-02-03
 * - mise aux normes MDN
 * TODO
 * - révision des formules de trimul --> sera traité en externe dans MZ 1.1
 * - ajouter la gestion des bm de PV et du vampi... pour le trimul aussi
  --> manque d'infos
 * - (ou pas) gérer les décumuls avec la page des BM
  --> trop accessoire, ne sera pas fait
 */


/* structure générale données */
var mainTab, mainTR, pvTR;

/* Anatrolliseur */
var urlAnatrolliseur;

/* Bulles */
var hauteur = 50, bulleStyle = null, FREEZE = false;

var race;
var posX, posY, posN;
var vue, vuebm, vuetotale;
var pvbase, pvmax, pv, pvdispo;
var fatigue, bmfatigue;
// variables spéciales Kastars
var pva, minParPV, overDLA;
var inJour, inMois, inAn, inHr, inMin, inSec; // édition manuelle lastDLA
var lastDLAZone, maxAMZone, cumulZone; // auto-refresh lastDLA
var lastDLA, DLAaccel;
//
var reg, regbm, regmoy;
var att, attbm, attbmm, attmoy;
var esq, esqbm, esqmoy;
var deg, degbm, degbmm, degmoy;
var arm, armbmp, armbmm, armmoy;
var rm, rmbm, mm, mmbm;
var nbattaques, bmDDegM, bmDAttM; // nbattaques obsolète
var dtb, pdm, bmt; // détails durée du tour (calcul pvdispo)
var DLA, DLAsuiv, HeureServeur, DureeTour;
var NBjours;


/*-[functions]----------------- Fonctions utiles -----------------------------*/

function resiste(Ddeg,bm) {
	// version naive mais compréhensible ^^
	if(!bm) return Math.floor(Ddeg);
	return Math.floor(Ddeg)+Math.round(bm/2);
	}

function getPortee(param) {
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	// ça devrait être floor, +10.25, -2.5
	}

function retourAZero(fatig) {
	var varfat = fatig; var raz = 0;
	while(varfat>0) {
		raz++;
		varfat = Math.floor(varfat/1.25);
		}
	return raz;
	}

function decumulPumPrem(bonus) {
	switch(bonus) {
	case 20:
		return 33;
	case 33:
		return 41;
	case 41:
		return 46;
	case 46:
		return 49;
	case 49:
		return 51;
	default:
		return 20;
		}
	}

function coefDecumul(i) {
	switch(i) {
	case 2:
		return 0.67;
	case 3:
		return 0.4;
	case 4:
		return 0.25;
	case 5:
		return 0.15;
	default:
		return 0.1;
		}
	}

function dureeHM(dmin) {
	var ret = '';
	dmin = Math.floor(dmin);
	if(dmin>59) ret = Math.floor(dmin/60)+'h';
	var mins = dmin%60;
	if(mins!=0) ret += (ret) ? addZero(mins)+'min' : mins+'min';
	return (ret) ? ret : '-';
	}


/*-[functions]------- Extraction / Sauvegarde des données --------------------*/

function initAll() {
	mainTab = document.getElementsByClassName('mh_tdborder');
	mainTR = document.evaluate('./tbody/tr',mainTab[0],null,7,null);
	pvTR = mainTR.snapshotItem(4).childNodes[3].childNodes[1]
		.getElementsByTagName('tr');
	
	var Nbrs = {};
	var node = mainTR.snapshotItem(1).childNodes[3].childNodes[7];
	Nbrs['dtb'] = node.firstChild.nodeValue;
	if(node.childNodes.length<6) {
		// la ligne n'existe pas si pas de bm de temps
		Nbrs['bmt'] = '0_0';
		Nbrs['pdm'] = node.childNodes[4].nodeValue;
		}
	else {
		Nbrs['bmt'] = node.childNodes[2].nodeValue;
		Nbrs['pdm'] = node.childNodes[6].nodeValue;
		}
	Nbrs['pos'] = mainTR.snapshotItem(2).childNodes[3].firstChild.nodeValue;
	Nbrs['vue'] = mainTR.snapshotItem(2).childNodes[3].childNodes[3].nodeValue;
	Nbrs['niv'] = mainTR.snapshotItem(3).childNodes[3].firstChild.nodeValue;
	Nbrs['pva'] = pvTR[0].childNodes[1].childNodes[1].firstChild.nodeValue;
	Nbrs['pvm'] = pvTR[2].childNodes[1].firstChild.nodeValue;
	Nbrs['fat'] = pvTR[4].childNodes[1].firstChild.nodeValue;
	var caracs =  mainTR.snapshotItem(5).childNodes[3].childNodes[1]
		.getElementsByTagName('tr');
	Nbrs['reg'] = caracs[0].textContent;
	Nbrs['att'] = caracs[1].textContent;
	Nbrs['esq'] = caracs[2].textContent;
	Nbrs['deg'] = caracs[3].textContent;
	Nbrs['arm'] = caracs[4].textContent;
	node = mainTR.snapshotItem(9).childNodes[3];
	Nbrs['rm'] = node.firstChild.nodeValue;
	Nbrs['mm'] = node.childNodes[2].nodeValue;
	for(var key in Nbrs)
		Nbrs[key] = getNumbers(Nbrs[key]);
	
	dtb = Nbrs['dtb'][0]*60+Nbrs['dtb'][1]; // durée tour de base
	bmt = Nbrs['bmt'][0]*60+Nbrs['bmt'][1]; // bm temps
	pdm = Nbrs['pdm'][0]*60+Nbrs['pdm'][1]; // poids du matos
	
	posX = Nbrs['pos'][0];
	posY = Nbrs['pos'][1];
	posN = Nbrs['pos'][2];
	
	vue = Nbrs['vue'][0];
	vuebm = Nbrs['vue'][1];
	vuetotale = Math.max(0,vue+vuebm);
	
	nivTroll = Nbrs['niv'][0];
	
	pv = Nbrs['pva'][0];
	pvbase = Nbrs['pvm'][0];
	pvmax = pvbase;
	if(Nbrs['pvm'].length>1) // s'il y a des BM de PV
		pvmax += Nbrs['pvm'][1];
	
	fatigue = Nbrs['fat'][0];
	bmfatigue = (Nbrs['fat'].length>1) ? Nbrs['fat'][1] : 0;
	// bmfat = 0 si pas de BM fat
	
	reg = Nbrs['reg'][0];
	// les Nbrs[...][1] contiennent les 3 ou les 6 de "D3" ou "D6"
	regbm = Nbrs['reg'][2]+Nbrs['reg'][3];
	regmoy = 2*reg+regbm;
	appendTdText(caracs[0],'(moyenne : '+regmoy+')');
	/* Temps récupéré par reg (propale R') */
	var titre = 'Temps moyen récupéré par régénération : '
		+Math.floor(250*regmoy/pvmax)+' min';
	var sec = Math.floor(15000*regmoy/pvmax)%60;
	if(sec!=0) titre += ' '+sec+' sec';
	caracs[0].title = titre;
	
	att = Nbrs['att'][0];
	attbmm = Nbrs['att'][3];
	attbm = Nbrs['att'][2]+attbmm;
	attmoy = 3.5*att+attbm;
	appendTdText(caracs[1],'(moyenne : '+attmoy+')');
	
	esq = Nbrs['esq'][0];
	esqbm = Nbrs['esq'][2]+Nbrs['esq'][3];
	esqmoy = 3.5*esq+esqbm;
	appendTdText(caracs[2],'(moyenne : '+esqmoy+')');
	
	deg = Nbrs['deg'][0];
	degbmm = Nbrs['deg'][3];
	degbm = Nbrs['deg'][2]+degbmm;
	degmoy = 2*deg+degbm;
	appendTdText(caracs[3],
		'(moyenne : '+degmoy+'/'+(2*Math.floor(1.5*deg)+degbm)+')' );
	
	rm = Nbrs['rm'][0];
	rmbm = Nbrs['rm'][1];
	rmTroll = rm+rmbm;
	mm = Nbrs['mm'][0];
	mmbm = Nbrs['mm'][1];
	mmTroll = mm+mmbm;
	
	arm = Nbrs['arm'][0];
	if(Nbrs['arm'].length>4) {
		// s'il y a des D d'armure non activés
		armbmp = Nbrs['arm'][4];
		armbmm = Nbrs['arm'][5];
		}
	else {
		armbmp = Nbrs['arm'][2];
		armbmm = Nbrs['arm'][3];
		}
	armmoy = 2*arm+armbmp+armbmm;
	appendTdText(caracs[4],'(moyenne : '+armmoy+')');
	
	/* Race */
	var strRace = mainTR.snapshotItem(0).childNodes[3].childNodes[4].nodeValue;
	race = trim(strRace.substring(strRace.indexOf(':')+2));
	
	/* PuM/PréM */
	nodepum = document.evaluate("./td[2]/p/text()[contains(.,'Bonus')]",
								mainTR.snapshotItem(6),null,7,null);
	if(nodepum.snapshotLength>0) {
		bmDAttM = getNumbers( nodepum.snapshotItem(0).nodeValue )[0];
		bmDDegM = getNumbers( nodepum.snapshotItem(1).nodeValue )[0];
		}
	
	/* setDLA() */
	var str = mainTR.snapshotItem(1).childNodes[3].childNodes[1]
		.firstChild.nodeValue;
	DLA = new Date( StringToDate(str) );
	
	/* setHeureServeur() */
	var footerNode = document.getElementById('footer2');
	if(!footerNode) return;
	var str = document.evaluate(".//text()[contains(.,'Serveur')]",
		footerNode,null,9,null).singleNodeValue.nodeValue;
	str = str.substring(str.indexOf('/')-2,str.lastIndexOf(':')+3);
	HeureServeur = new Date( StringToDate(str) );

	/* initAnatrolliseur() */
	function amelio_dtb(dtb) {
		if(dtb>555)
			return Math.floor((21-Math.sqrt(8*dtb/3-1479))/2);
		return 10+Math.ceil((555-dtb)/2.5);
		}
	
	var amelio_pv = Math.floor(pvbase/10)-3;
	var amelio_vue = vue-3;
	var amelio_att = att-3;
	var amelio_esq = esq-3;
	var amelio_deg = deg-3;
	var amelio_reg = reg-1;
	var amelio_arm = arm-1;
	if(race=='Darkling') amelio_reg--;
	if(race=='Durakuir') amelio_pv--;
	if(race=='Kastar') amelio_deg--;
	if(race=='Skrim') amelio_att--;
	if(race=='Tomawak') amelio_vue--;
	
	urlAnatrolliseur = 'http://mountyhall.dispas.net/dynamic/'
		+'outils_anatrolliseur.php?anatrolliseur=v8'
		+'|r='+race.toLowerCase()
		+'|dla='+amelio_dtb(dtb)
		+'|pv='+amelio_pv+',0,'+(pvmax-pvbase)
		+'|vue='+amelio_vue+',0,'+vuebm
		+'|att='+amelio_att+','+Nbrs['att'][2]+','+attbmm
		+'|esq='+amelio_esq+','+Nbrs['esq'][2]+','+Nbrs['esq'][3]
		+'|deg='+amelio_deg+','+Nbrs['deg'][2]+','+degbmm
		+'|reg='+amelio_reg+','+Nbrs['reg'][2]+','+Nbrs['reg'][3]
		+'|arm='+amelio_arm+','+armbmp+','+armbmm
		+'|mm='+mmTroll
		+'|rm='+rmTroll+'|';
	}

function saveProfil() {
	//MZ_setValue(numTroll+'.profilON',true); // pour remplacer isProfilActif ?
	//MZ_setValue('NIV_TROLL',nivTroll);
	MZ_setValue(numTroll+'.caracs.attaque',att);
	MZ_setValue(numTroll+'.caracs.attaque.bm',attbm);
	MZ_setValue(numTroll+'.caracs.attaque.bmp',attbm-attbmm);
	MZ_setValue(numTroll+'.caracs.attaque.bmm',attbmm);
	MZ_setValue(numTroll+'.caracs.esquive',esq);
	MZ_setValue(numTroll+'.caracs.esquive.bm',esqbm);
	MZ_setValue(numTroll+'.caracs.esquive.nbattaques',nbattaques);
	MZ_setValue(numTroll+'.caracs.degats',deg);
	MZ_setValue(numTroll+'.caracs.degats.bm',degbm);
	MZ_setValue(numTroll+'.caracs.degats.bmp',degbm-degbmm);
	MZ_setValue(numTroll+'.caracs.degats.bmm',degbmm);
	MZ_setValue(numTroll+'.caracs.regeneration',reg);
	MZ_setValue(numTroll+'.caracs.regeneration.bm',regbm);
	MZ_setValue(numTroll+'.caracs.vue',vue);
	MZ_setValue(numTroll+'.caracs.vue.bm',vuebm);
	MZ_setValue(numTroll+'.caracs.pv',pv);
	MZ_setValue(numTroll+'.caracs.pv.base',pvbase);
	MZ_setValue(numTroll+'.caracs.pv.max',pvmax);
	MZ_setValue(numTroll+'.caracs.rm',rmTroll);
	MZ_setValue(numTroll+'.caracs.rm.bm',rmbm);
	MZ_setValue(numTroll+'.caracs.mm',mmTroll);
	MZ_setValue(numTroll+'.caracs.mm.bm',mmbm);
	MZ_setValue(numTroll+'.caracs.armure',arm);
	MZ_setValue(numTroll+'.caracs.armure.bm',armbmp+armbmm);
	MZ_setValue(numTroll+'.caracs.armure.bmp',armbmp);
	MZ_setValue(numTroll+'.caracs.armure.bmm',armbmm);
	if(bmDAttM) MZ_setValue(numTroll+'.bonus.DAttM',+bmDAttM);
	if(bmDDegM) MZ_setValue(numTroll+'.bonus.DDegM',bmDDegM);
	MZ_setValue(numTroll+'.position.X',posX);
	MZ_setValue(numTroll+'.position.Y',posY);
	MZ_setValue(numTroll+'.position.N',posN);
	}


/*-[functions]----------- Fonctions modifiant la page ------------------------*/

function setAnatrolliseur() {
	appendButton(mainTR.snapshotItem(0).childNodes[1],'Anatrolliser!',
		function(){window.open(urlAnatrolliseur,'_blank')}
		);
	}

function setInfoDateCreation() {
	var node = mainTR.snapshotItem(0).childNodes[3].childNodes[6];
	var dateC = node.nodeValue;
	dateC = dateC.substring(dateC.indexOf('(')+1,dateC.indexOf(')'));
	dateC = new Date( StringToDate(dateC) );
	NBjours = Math.floor((HeureServeur-dateC)/86400000)+1;
	if(NBjours!=1)
		node.nodeValue += ' ('+NBjours+' jours dans le hall)';
	else
		node.nodeValue += ' (Bienvenue à toi pour ton premier jour dans le hall)';
	}

function setNextDLA() {
	var node = mainTR.snapshotItem(1).childNodes[3].childNodes[8].childNodes[1];
	var nbrs = node.firstChild.nodeValue.match(/\d+/g);
	DureeTour = nbrs[0]*3600000+nbrs[1]*60000;
	var DLAsuivMSec = DLA.getTime()+DureeTour; var loupes = 0;
	while(DLAsuivMSec<HeureServeur) {
		DLAsuivMSec += DureeTour;
		loupes++;
		}
	DLAsuiv = new Date( DLAsuivMSec );
	appendBr(node);
	appendText(node,
		'---> Prochaine DLA (estimée)............: '+DateToString(DLAsuiv)
		);
	if(loupes==1)
		node.nextSibling.nodeValue = ' (Vous avez manqué votre dernier tour)';
	else if(loupes>1)
		node.nextSibling.nodeValue =
			' (Vous avez manqué vos '+loupes+' derniers tours)';
	}

function vueCarac() {
	var caracBody = mainTR.snapshotItem(5).childNodes[3].childNodes[1];
	var tr = document.createElement('tr');
	appendTdText(tr,'Vue..................:');
	var td = appendTdText(tr,vue+' Cases');
	td.colSpan = '2';
	td.align = 'right';
	td = appendTdText(tr,aff(vuebm));
	td.align = 'right';
	insertBefore(caracBody.firstChild,tr);
	var vueParent = mainTR.snapshotItem(2).childNodes[3];
	vueParent.removeChild(vueParent.childNodes[2]);
	vueParent.removeChild(vueParent.childNodes[2]);
	}

function setLieu() {
	var urlBricol = 'http://trolls.ratibus.net/mountyhall/lieux.php'
		+'?search=position&orderBy=distance&posx='
		+posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3';
	if(MZ_getValue('VUECARAC')=='true')
		insertButton(mainTR.snapshotItem(2).childNodes[3].childNodes[2],
			'Lieux à proximité',function(){window.open(urlBricol,'_blank')}
			);
	else {
		appendBr(mainTR.snapshotItem(2).childNodes[1]);
		appendButton(mainTR.snapshotItem(2).childNodes[1],
			'Lieux à proximité',function(){window.open(urlBricol,'_blank')}
			);
		}
	}

function setInfosPxPi() {
	if(nivTroll==60) return;
	
	/* Extraction des données */
	var TDexp = mainTR.snapshotItem(3).childNodes[3];
	var node = TDexp.firstChild;
	var str = node.nodeValue;
	var pi_tot = parseInt(str.match(/\d+/g)[1]);
	var nbrs = getNumbers(TDexp.childNodes[2].nodeValue);
	var px = nbrs[0]+nbrs[1];
	var pi_nextLvl = nivTroll*(nivTroll+3)*5;
	var px_ent = 2*nivTroll;
	if(nivTroll<3) px_ent=Math.max(px_ent,Math.min(px,5));
	var nb_ent = Math.ceil((pi_nextLvl-pi_tot)/px_ent);
	
	/* Modification ligne "Niveau" */
	str = str.substring(0,str.length-1)+' | Niveau '+(nivTroll+1)+' : '
		+pi_nextLvl+' PI => '+nb_ent+' entraînement';
	if(nb_ent>1) str += 's';
	str += ')';
	var span = document.createElement('span');
	span.title = (Math.round(10*(pi_tot+px)/NBjours)/10)+' PI par jour';
	appendText(span,str);
	TDexp.replaceChild(span,node);
	
	/* Ajout ligne PX entrainement */
	insertBr(TDexp.childNodes[3]);
	node = document.createElement('i');
	if(px<px_ent)
		appendText(node,
			'Il vous manque '+(px_ent-px)+' PX pour vous entraîner.'
			);
	else
		appendText(node,
			'Entraînement possible. Il vous restera '+(px-px_ent)+' PX.'
			);
	insertBefore(TDexp.childNodes[4],node);
	}

function setInfosPV() { // pour AM et Sacro
	var texte = '1 PV de perdu = +'+Math.floor(250/pvmax)+' min';
	var sec = Math.floor(15000/pvmax)%60;
	if(sec!=0) texte += ' '+sec+' sec';
	
	var lifebar = pvTR[1].childNodes[1].firstChild;
	if(lifebar) lifebar.title = texte;

	/* Différence PV p/r à équilibre de temps (propale R') */
	if(pv<=0) return;
	// pvmin0malus = pvm + ceiling(pvm/250*(bmt+pdm))
	pvdispo = pv-pvmax-Math.ceil((bmt+pdm)*pvmax/250);
	var td = appendTd(pvTR[3]);
	var span = document.createElement('span');
	span.title = texte;
	var i = document.createElement('i');
	if(bmt+pdm>=0)
		texte = 'Vous ne pouvez compenser aucune blessure actuellement.';
	else if(pvdispo>0)
		texte = 'Vous pouvez encore perdre '+Math.min(pvdispo,pv)
			+' PV sans malus de temps.';
	else if(pvdispo<0)
		texte = 'Il vous manque '+(-pvdispo)
			+' PV pour ne plus avoir de malus de temps.';
	else
		texte = '';
	appendText(i,texte);
	span.appendChild(i);
	td.appendChild(span);
	}

function setCurrentEsquive() {
	var pnode = mainTR.snapshotItem(6).childNodes[3].firstChild;
	var attmod = pnode.childNodes[3].nodeValue.match(/\d+/);
	pnode.childNodes[3].nodeValue +=
		' (moyenne attaque : '+Math.max(attmoy-3.5*attmod,attbm,0)+')';
	var esqmod = pnode.childNodes[5].nodeValue.match(/\d+/);
	pnode.childNodes[5].nodeValue +=
		' (moyenne esquive : '+Math.max(esqmoy-3.5*esqmod,esqbm,0)+')';
	nbattaques = parseInt(esqmod);
	var armmod = pnode.childNodes[7].nodeValue.match(/\d+/);
	pnode.childNodes[7].nodeValue +=	
		' (moyenne armure : '+Math.max(armmoy-2*armmod,armbmp+armbmm,0)+')';
	}

function setStabilite() {
	var node = mainTR.snapshotItem(5).childNodes[3].childNodes[2];
	appendBr(node);
	appendText(node,
		'- Stabilité..........: '+Math.floor(2*(esq+reg)/3)+' D6 '+aff(esqbm)
		+' (moyenne : '+Math.round(3.5*Math.floor(2*(esq+reg)/3)+esqbm)+')'
		);
	}

function setRatioKillDeath() {
	try{
		var node = document.evaluate(
			"./td[2]/p[contains(./text(),'Adversaires tués')]",
			mainTR.snapshotItem(6),null,9,null).singleNodeValue;
		var killnode = node.firstChild;
		var deathnode = node.childNodes[2];
		}
	catch(e){return;}
	var kill = getNumbers(killnode.nodeValue)[0];
	var span = document.createElement('span');
	span.title  = 'Un kill tous les '
		+(Math.round(10*NBjours/kill)/10)+' jours';
	appendText(span,killnode.nodeValue);
	node.replaceChild(span,killnode);
	var death = getNumbers(deathnode.nodeValue)[0];
	if(death) {
		span = document.createElement('span');
		span.title = 'Une mort tous les '
			+(Math.round(10*NBjours/death)/10)+' jours';
		appendText(span,deathnode.nodeValue);
		node.replaceChild(span,deathnode);
		appendBr(node);
		appendText(node,
			'Rapport meurtres/décès : '+Math.floor((kill/death)*1000)/1000
			);
		}
	}

function setTotauxMagie() {
	var td = mainTR.snapshotItem(9).childNodes[3];
	/* RM */
	var span = document.createElement('span');
	span.title = (Math.round(10*rm/NBjours)/10)
				+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
				+(Math.round(10*rm/nivTroll)/10)+
				' ('+(Math.round(10*rmTroll/nivTroll)/10)+') points de RM par niveau';
	appendText(span,td.firstChild.nodeValue+' (Total : '+rmTroll+')');
	td.replaceChild(span,td.firstChild);
	/* MM */
	span = document.createElement('span');
	span.title = (Math.round(10*mm/NBjours)/10)
				+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
				+(Math.round(10*mm/nivTroll)/10)
				+' ('+(Math.round(10*mmTroll/nivTroll)/10)+') points de MM par niveau';
	appendText(span,td.childNodes[2].nodeValue+' (Total : '+mmTroll+')');
	td.replaceChild(span,td.childNodes[2]);
	}


/*-[functions]----------- Fonctions spéciales Kastars ------------------------*/

function minParPVsac(fatig,bm) {
	var out = [];
	if(fatig>4)
		out[0] = Math.floor(120/( fatig*(1+Math.floor(fatig/10)) ));
	else
		out[0] = 30;
	if(bm && bm>0) {
		var totalfat=fatig+bm;
		if(totalfat>4)
			out[1] = Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) ));
		else
			out[1] = 30; // inutile avec bmfat >= 15 mais bon
		}
	return out;
	}

function toInt(str) {
	str = parseInt(str);
	return (str) ? str : 0;
	}

function saveLastDLA() {
	// pour les calculs d'AM max
	var str = addZero(toInt(inJour.value))+'/'+addZero(toInt(inMois.value))
		+'/'+toInt(inAn.value)+' '+addZero(toInt(inHr.value))
		+':'+addZero(toInt(inMin.value))+':'+addZero(toInt(inSec.value));
	lastDLA = new Date( StringToDate(str) );
	MZ_setValue(numTroll+'.DLA.ancienne',str);
	lastDLAZone.innerHTML = '';
	var b = document.createElement('b');
	b.addEventListener('click',inputMode,false);
	appendText(b,str);
	lastDLAZone.appendChild(b);
	refreshAccel();
	}

function inputMode() {
	// édition manuelle lastDLA
	var date;
	if(lastDLA)
		date = new Date( lastDLA );
	else
		date = new Date( DLAaccel );
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone,'text','inJour',1,2,date.getDate());
	appendText(lastDLAZone,'/');
	inMois = appendTextbox(lastDLAZone,'text','inMois',1,2,1+date.getMonth());
	appendText(lastDLAZone,'/');
	inAn = appendTextbox(lastDLAZone,'text','inAn',3,4,date.getFullYear());
	appendText(lastDLAZone,' - ');
	inHr = appendTextbox(lastDLAZone,'text','inHr',1,2,date.getHours()+'');
	appendText(lastDLAZone,':');
	inMin = appendTextbox(lastDLAZone,'text','inMin',1,2,date.getMinutes()+'');
	appendText(lastDLAZone,':');
	inSec = appendTextbox(lastDLAZone,'text','inSec',1,2,date.getSeconds()+'');
	appendText(lastDLAZone,' - ');
	appendButton(lastDLAZone,'Enregistrer',saveLastDLA);
	}

function setAccel() {
	/* Création d'une nouvelle ligne du profil spéciale AM */
	var tr = document.createElement('tr');
	tr.className = 'mh_tdpage';
	var td = document.createElement('td');
	td.className = 'mh_tdtitre';
	td.vAlign = 'top';
	appendText(td,'Fatigue et AM',true);
	tr.appendChild(td);
	td = document.createElement('td');
	tr.appendChild(td);
	// si pas PDA, augmenter hauteur bannière
	if(mainTR.snapshotItem(0).childNodes.length>5)
		mainTR.snapshotItem(0).childNodes[5].rowSpan = 12;
	insertBefore(mainTR.snapshotItem(5),tr);
	
	/* Récupération des données */
	overDLA = (HeureServeur>DLA.getTime()+3e5);
	fatigue = (overDLA) ? Math.floor(fatigue/1.25) : fatigue ;
	var varfat = fatigue;
	var BMfrais = false;
	var varbm = [];
	if(bmfatigue>0) {
		/* Récupération des BM de fatigue depuis la page des BM */
		if(MZ_getValue(numTroll+'.bm.fatigue')) {
			var listefat = MZ_getValue(numTroll+'.bm.fatigue').split(';');
			listefat.pop();
			var tour = 0;
			for(var i=0 ; i<listefat.length ; i++) {
				var nbrs = listefat[i].match(/\d+/g); // [tour,fatigue]
				while(tour<=parseInt(nbrs[0])) {
					varbm[tour]=parseInt(nbrs[1]);
					tour++;
					}
				}
			}
		if(varbm[0]==bmfatigue)
			BMfrais = true;
		}
	else
		BMfrais = true;
	if(!BMfrais && bmfatigue>0) {
		// si les BM n'ont pas été rafraîchis
		if(bmfatigue==15)
			varbm = [15,15,15];
		else
			varbm = [30,30,15];
		}
	if(overDLA) varbm.shift(); // décalage BM en overDLA
	var minppv = minParPVsac(varfat,varbm[0]);
	minParPV = (varbm[0]==undefined) ? minppv[0] : minppv[1];
	
	/* Tableau des fatigues et accel futures */
	if(fatigue>0 || varbm[0]>0) {
		var table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style = 'text-align:center;';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		td.appendChild(table);
		
		var ligneTour = appendTr(tbody,'mh_tdtitre');
		ligneTour.style = 'font-weight:bold;';
		var tdl = appendTdText(ligneTour,'Tour :',true);
		tdl.align = 'left';
		var ligneFat = appendTr(tbody,'mh_tdpage');
		tdl = appendTdText(ligneFat,'Fatigue :',true);
		tdl.className = 'mh_tdtitre';
		tdl.align = 'left';
		var ligneMin = appendTr(tbody,'mh_tdpage');
		tdl = appendTdText(ligneMin,'1 PV =',true);
		tdl.className = 'mh_tdtitre';
		tdl.align = 'left';
		var col=0;
		while(col<9 && (varfat>0 || varbm[col])) {
			if(col==0) {
				if(overDLA) {
					var i = document.createElement('i');
					appendText(i,'À activer');
					ligneTour.appendChild(i);
					}
				else
					appendTdText(ligneTour,'En cours');
				}
			else
				appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
			if(varbm[col]) {
				if(BMfrais || (!overDLA && col==0)) {
					appendTdText(ligneFat,varfat+'+'+varbm[col]);
					appendTdText(ligneMin,minppv[1]+'\'');
					}
				else {
					appendTdText(ligneFat,varfat+'+'+varbm[col]+' (?)');
					appendTdText(ligneMin,minppv[1]+'\' ('+minppv[0]+'\')');
					}
				}
			else {
				appendTdText(ligneFat,varfat);
				appendTdText(ligneMin,minppv[0]+'\'');
				}
			col++;
			varfat = Math.floor(varfat / 1.25);
			minppv = minParPVsac(varfat,varbm[col]);
			}
		if(varfat>1 || (varfat==1 && !overDLA)) {
			appendTdText(ligneTour,'\u00A0 ... \u00A0',true);
			appendTdText(ligneFat,'-');
			appendTdText(ligneMin,'-');
			}
		col = (overDLA) ?	
			Math.max(retourAZero(fatigue)-1,col) :
			Math.max(retourAZero(fatigue),col);
		appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
		appendTdText(ligneFat,'0');
		appendTdText(ligneMin,'30\'');
		
		if(!BMfrais && bmfatigue) { // si les BM n'ont pas été rafraîchis
			appendText(td,'/!\\ Visitez la page des Bonus/Malus'
				+'pour mettre à jour votre fatigue. /!\\',
				true);
			appendBr(td);
			}
		appendBr(td);
		}
	
	if(pv<=0) {
		appendText(td,'Aucun calcul possible : vous êtes mort voyons !');
		return;
		}
	
	/* Setup lastDLAZone */
	if(overDLA) { // bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date( DLAsuiv );
		lastDLA = new Date( DLA );
		MZ_setValue(numTroll+'.DLA.ancienne',DateToString(DLA));
		pva = Math.min(pv+regmoy,pvmax);
		appendText(td,'/!\\ Votre DLA est dépassée,'
			+'calculs basés sur des estimations. /!\\',
			true);
		appendBr(td);
		}
	else {
		DLAaccel = new Date(DLA);
		pva = pv;
		if(MZ_getValue(numTroll+'.DLA.ancienne'))
			lastDLA = new Date(StringToDate(MZ_getValue(numTroll+'.DLA.ancienne')));
		else
			lastDLA = false;
		}
	appendText(td,'Dernière DLA enregistrée : ');	
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var b = document.createElement('b');
	b.onclick = inputMode;
	lastDLAZone.appendChild(b);
	td.appendChild(lastDLAZone);
	if(lastDLA)
		appendText(b,DateToString(lastDLA) );
	else
		appendText(b,'aucune');
	appendBr(td);
	
	/* Setup maxAMZone et cumulZone */
	appendText(td,'Accélération maximale possible : ');
	maxAMZone = document.createElement('b');
	td.appendChild(maxAMZone);
	appendBr(td);
	cumulZone = document.createElement('span');
	td.appendChild(cumulZone);
	
	refreshAccel();
	}

function refreshAccel() {
	/* Accélération pour cumul instantané */
	if(lastDLA) {
		pvsmax = Math.min(pva-1,
			Math.ceil( Math.floor((DLAaccel-lastDLA)/6e4)/minParPV ));
		maxAMZone.innerHTML = pvsmax+' PV';
		}
	else {
		pvsmax = pva-1;
		maxAMZone.innerHTML = 'inconnue'
		}
	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	var pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/6e4) / minParPV );
	cumulZone.innerHTML = '';
	if(pvs<=pvsmax) {
		appendText(cumulZone,'Vous devez accélérer d\'au moins ');
		appendText(cumulZone,pvs+' PV', true);
		appendText(cumulZone,' pour activer immédiatement un nouveau tour.');
		if(pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1e3)
				-(pvs-1)*60*minParPV;
			appendText(cumulZone,
							' ('+(pvs-1)+' PV dans '
							+Math.floor(gainSec/60)+'min'+addZero(gainSec%60)+'s)'
							);
			}
		}
	else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*6e4 );
		appendText(cumulZone,
					'Après votre accélération maximale, il vous faudra encore attendre '
					+dureeHM(avantDLA/6e4)+' avant de réactiver.'
					);
		}
	}


/*-[functions]-------- Fonctions gérant les infos-bulles ---------------------*/

function traitementTalents() {
	removeAllTalents();
	try{
		var talTabs = document.evaluate("./tbody/tr/td/table",
			mainTab[1],null,7,null);
		var listeComp = talTabs.snapshotItem(0);
		var listeSort = talTabs.snapshotItem(1);
		var titres = document.evaluate("./tbody/tr/td/b/text()",
			mainTab[1],null,7,null);
		}
	catch(e) {return;}
	var totalComp = injecteInfosBulles(listeComp,'competences');
	var totalSort = injecteInfosBulles(listeSort,'sortileges');
	titres.snapshotItem(0).nodeValue += ' (Total : '+totalComp+'%)';
	titres.snapshotItem(1).nodeValue += ' (Total : '+totalSort+'%)';
	listeComp.parentNode.onclick = toggleFreeze;
	listeSort.parentNode.onclick = toggleFreeze;
	}

function injecteInfosBulles(liste,fonction) {
	var listeTR = liste.getElementsByTagName('tr');
	var totalpc = 0;
	for(var i=0 ; i<listeTR.length ; i++) {
		var node = listeTR[i].childNodes[3].firstChild;
		var nom = epure(trim(node.firstChild.nodeValue));
		var nbrs = getNumbers(listeTR[i].childNodes[5].firstChild
			.firstChild.nodeValue);
		if(nom.indexOf('Piege')!=-1 || nom.indexOf('Golemo')!=-1) {
			var lstNoms = trim(epure(listeTR[i].childNodes[3].lastChild.nodeValue))
				.slice(1,-1).split(', ');
			for(var j=0 ; j<lstNoms.length ; j++)
				setTalent(lstNoms[j],nbrs[1],nbrs[0]);
			setInfos(node,lstNoms.join(', '),fonction,nbrs[0]);
			totalpc += nbrs[1];
			continue;
			}
		setInfos(node,nom,fonction,nbrs[0]);
		setTalent(nom,nbrs[1],nbrs[0]);
		totalpc += nbrs[1];
		for(var j=3 ; j<listeTR[i].childNodes[5].childNodes.length ; j+=2) {
			nbrs = getNumbers(listeTR[i].childNodes[5].childNodes[j].nodeValue);
			setTalent(nom,nbrs[1],nbrs[0]);
			totalpc += nbrs[1];
			}
		}
	return totalpc;
	}

function setInfos(node,nom,fonction,niveau) {
	node.nom = nom;
	node.fonction = fonction;
	node.niveau = niveau;
	node.onmouseover = setBulle;
	node.onmouseout = cacherBulle;
	}

var arrayModifAnatroll = {
	'Glue':'Glu',
	'PuM':'PuiM',
	'HE':'Hurlement',
	//'Insultes':'Insu',
	'Pistage':'Pist',
	'PuC':'Planter'
	}

function setTalent(nom,pc,niveau) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement 
	// (et pas les % dont osf) ne serait pas plus rentable
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) return;
	pc = parseInt(pc);
	if(!niveau) niveau = 1;
	
	switch(nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur += 'Insu'+niveau+'|';
		case 'IdT':
			nomEnBase += niveau;
			break;
		case 'AP':
		case 'Baroufle':
		case 'CdB':
		case 'CdM':
		case 'Parer':
		case 'Retraite':
		case 'RB':
		case 'SInterposer':
			nomEnBase += niveau;
		default:
			urlAnatrolliseur += (arrayModifAnatroll[nomEnBase] ? 
				arrayModifAnatroll[nomEnBase] : nomEnBase) + '|';
		}
	
	MZ_setValue(numTroll+'.talent.'+nomEnBase,pc);
	}

function creerBulleVide() {
	var table = document.createElement('table');
	table.id = 'bulle';
	table.className = 'mh_tdborder';
	table.width = 300;
	table.border = 0;
	table.cellPadding = 5;
	table.cellSpacing = 1;
	table.style =	
		 'position:absolute;'
		+'visibility:hidden;'
		+'z-index:800;'
		+'height:auto;';
	table.onclick = toggleFreeze;
	var tr = appendTr(table,'mh_tdtitre');
	appendTdText(tr,'Titre');
	tr = appendTr(table,'mh_tdpage');
	appendTdText(tr,'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(table);
	}

function toggleFreeze() {
	FREEZE = !FREEZE;
	if(!FREEZE) cacherBulle();
	}

function cacherBulle() {
	if(bulleStyle && !FREEZE) bulleStyle.visibility = 'hidden';
	}

function setBulle(evt) {
	var nom = this.nom;
	var fonction = this.fonction;
	var niveau = parseInt(this.niveau);
	var str='';
	if(fonction=='competences') str=competences(nom,niveau);
	else if(fonction=='sortileges') str=sortileges(nom,true);
	if(str=='') return;
	if(nom.indexOf('Golem')!=-1) nom='Golemologie';
	
	var xfenetre, yfenetre, xpage, ypage, element = null;
	var offset = 15;
	var bulleWidth = 300;
	if(!hauteur) hauteur = 50;
	element = document.getElementById('bulle');
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if(evt.pageX) xpage = evt.pageX;
	if(evt.pageY) ypage = evt.pageY;
	if(element) {
		bulleStyle = element.style;
		element.firstChild.firstChild.innerHTML = '<b>'+nom+'</b>';
		element.childNodes[1].firstChild.innerHTML = str;
		}
	if(bulleStyle) {
		if(xfenetre>bulleWidth+offset)
			xpage -= bulleWidth+offset;
		else
			xpage += offset;
		if(yfenetre>hauteur+offset)
			ypage -= hauteur + offset;
		bulleStyle.width = bulleWidth;
		bulleStyle.left = xpage + 'px';
		bulleStyle.top = ypage + 'px';
		bulleStyle.visibility = 'visible';
		}
	}


/*-[functions] Textes des infos-bulles pour les compétences et sortilèges ----*/

function competences(comp,niveau) {
	var texte = '';
	if(comp.indexOf('Acceleration du Metabolisme')!=-1 && minParPV!=null) {
		texte = '<b>1</b> PV = <b>'+minParPV+'</b> minute';
		if(minParPV>1) texte += 's';
		if(overDLA) texte += '<br/><i>(Votre DLA est dépassée.)</i>';
		}
	else if(comp.indexOf('Attaque Precise')!=-1) {
		var pc, lastmax=0, espatt=0;
		var notMaxedOut = false;
		for(var i=Math.min(niveau+1,5) ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			if(i>niveau) texte += '<i>';
			var jetatt = Math.round(3.5*Math.min(Math.floor(1.5*att),att+3*i))+attbm;
			texte += 'Attaque (niveau '+i+') : <b>'
				+Math.min(Math.floor(att*1.5),att+3*i)+'</b> D6 '+aff(attbm)
				+' => <b>'+jetatt+'</b>';
			if(i>niveau) texte += '</i><hr>';
			else {
				texte += '<br/>';
				espatt += (pc-lastmax)*jetatt;
				if(i<niveau) notMaxedOut = true;
				}
			lastmax = pc;
			}
		if(notMaxedOut) {
			texte += 'Attaque moyenne (si réussite) : <b>'
				+Math.floor(10*espatt/lastmax)/10+'</b><br/>'
				}
		texte += 'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if(comp.indexOf('Balayage')!=-1)
		texte = 'Déstabilisation : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+(Math.round(3.5*att)+attbm)+'</b><br/>'
			+'Effet : <b>Met à terre l\'adversaire</b>';
	else if(comp.indexOf('Bidouille')!=-1)
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet '
			+'de votre inventaire avec le texte de votre choix.';
	else if(comp.indexOf('Baroufle')!=-1)
		texte = 'Vous voulez encourager vos compagnons de chasse ? '
			+'Ramassez quelques Coquillages, et en avant la musique !';
	else if(comp.indexOf('Botte Secrete')!=-1)
		texte = 'Attaque : <b>'
			+Math.floor(2*att/3)+'</b> D6 '+aff(Math.floor(attbm/2))
			+' => <b>'
			+Math.round(3.5*Math.floor(2*att/3)+Math.floor(attbm/2))
			+'</b><br/>Dégâts : <b>'
			+Math.floor(att/2)+'</b> D3 '+aff(Math.floor(degbm/2))
			+' => <b>'
			+(2*Math.floor(att/2)+Math.floor(degbm/2))
			+'/'+(2*Math.floor(1.5*Math.floor(att/2))+Math.floor(degbm/2))
			+'</b>';
	else if(comp.indexOf('Camouflage')!=-1) {
		var camou = getTalent('Camouflage');
		texte = 'Pour conserver son camouflage, il faut réussir un jet sous:<br/>'
			+'<i>Déplacement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+'<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+'<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
		}
	else if(comp.indexOf('Charger')!=-1) {
		if(pv<=0)
			return '<i>On ne peut charger personne quand on est mort !</i>';
		var portee = Math.min(
			getPortee(reg+Math.floor(pv/10))-Math.floor((fatigue+bmfatigue)/5),
			vuetotale);
		if(portee<1)
			return '<b>Impossible de charger</b>';
		else {
			texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
				+' => <b>'+attmoy+'</b><br/>'
				+'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
				+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>'
				+'<br/>Portée : <b>'+portee+'</b> case';
			if(portee>1) texte += 's';
			}
		}
	else if(comp.indexOf('Connaissance des Monstres')!=-1) {
		texte = 'Portée horizontale : <b>'+vuetotale+'</b> case';
		if(vuetotale>1) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		}
	else if(comp.indexOf('Piege')!=-1) {
		if(comp.indexOf('Glue')!=-1)
			texte = 'Et si vous colliez vos adversaires au sol ?';
		if(comp.indexOf('Feu')!=-1) {
			if(texte)
				texte += ' À moins que vous ne préfériez les envoyer en l\'air !<br/>';
			texte += 'Dégats du piège à feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
				+' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b>';
			}
		}
	else if(comp.indexOf('Contre-Attaquer')!=-1)
		texte = 'Attaque : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor(attbm/2))
			+' => <b>'+Math.round(3.5*Math.floor(att/2)+Math.floor(attbm/2))
			+'</b><br/>Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
	else if(comp.indexOf('Coup de Butoir')!=-1) {
		var pc, lastmax=0, espdeg=0;
		var notMaxedOut = false;
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+attmoy+'</b>';
		for(var i=Math.min(niveau+1,5) ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			if(i>niveau) texte += '<hr><i>';
			var jetdeg = 2*Math.min(Math.floor(1.5*deg),deg+3*i)+degbm;
			texte += 'Dégats (niveau '+i+') : <b>'
				+Math.min(Math.floor(deg*1.5),deg+3*i)+'</b> D6 '+aff(degbm)
				+' => <b>'+jetdeg+'/'+(jetdeg+2*Math.floor(deg/2))+'</b>';
			if(i>niveau) texte += '</i><hr>';
			else {
				texte += '<br/>';
				espdeg += (pc-lastmax)*jetdeg;
				if(i<niveau) notMaxedOut = true;
				}
			lastmax = pc;
			}
		if(notMaxedOut) {
			texte += 'Dégâts moyens (si réussite) : <b>'
				+Math.floor(10*espdeg/lastmax)/10+'/'+
				+(Math.floor(10*espdeg/lastmax)/10+2*Math.floor(deg/2))+'</b><br/>';
				}
		}
	else if(comp.indexOf('Course')!=-1)
		texte = 'Déplacement gratuit : <b>'
			+Math.floor(getTalent('Course')/2)
			+' %</b> de chance';
	else if(comp.indexOf('Deplacement Eclair')!=-1)
		texte = 'Permet d\'économiser <b>1</b> PA '
			+'par rapport au déplacement classique';
	else if(comp.indexOf('Dressage')!=-1)
		texte = 'Le dressage permet d\'apprivoiser un gowap redevenu sauvage '
			+'ou un gnu sauvage.';
	else if(comp.indexOf('Ecriture Magique')!=-1)
		texte = 'Réaliser la copie d\'un sortilège après en avoir découvert '
			+'la formule nécessite de réunir les composants de cette formule, '
			+'d\'obtenir un parchemin vierge sur lequel écrire, et de récupérer '
			+'un champignon adéquat pour confectionner l\'encre.';
	else if(comp.indexOf('Frenesie')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+attmoy+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if(comp.indexOf('Golem')!=-1)
		texte = 'Animez votre golem en assemblant divers matériaux '
			+'autour d\'un cerveau minéral.'
	else if(comp.indexOf('Grattage')!=-1) {
		texte = 'Permet de confectionner un Parchemin Vierge '
			+'à partir de composants et de Gigots de Gob\'.';
		}
	else if(comp.indexOf('Hurlement Effrayant')!=-1)
		texte = 'Fait fuir un monstre si tout se passe bien.'
			+'<br/>Lui donne de gros bonus sinon...';
	else if(comp.indexOf('Identification des Champignons')!=-1) {
		texte = 'Portée horizontale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/4)+'</b> case';
		if(vuetotale>4) texte += 's';
		}
	else if(comp.indexOf('Insultes')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(vuetotale,1)+'</b> case';
	else if(comp.indexOf('interposer')!=-1)
		texte = 'Jet de réflexe : <b>'
			+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff(esqbm)
			+' => <b>'+Math.round(3.5*Math.floor(2*(esq+reg)/3)+esqbm)+'</b>';
	else if(comp.indexOf('Lancer de Potions') != -1)
		texte = 'Portée : <b>'+(2+Math.floor(vuetotale/5))+'</b> cases';
	else if(comp.indexOf('Marquage')!=-1)
		texte = 'Marquage permet de rajouter un sobriquet à un monstre. Il faut '
			+'bien choisir le nom à ajouter car celui-ci sera définitif. Il faut '
			+'se trouver dans la même caverne que le monstre pour le marquer.';
	else if(comp.indexOf('Melange Magique')!=-1)
		texte = 'Cette Compétence permet de combiner deux Potions pour '
			+'en réaliser une nouvelle dont l\'effet est la somme '
			+'des effets des potions initiales.';
	else if(comp.indexOf('Miner')!=-1)
		texte = 'Portée horizontale (officieuse) : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale (officieuse) : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Necromancie')!=-1)
		texte = 'La Nécromancie permet à partir des composants d\'un monstre '
			+'de faire "revivre" ce monstre.';
	else if(comp.indexOf('Painthure de Guerre')!=-1)
		texte = 'Grimez vos potrõlls et réveillez l\'esprit guerrier '
			+'qui sommeille en eux ! Un peu d\'encre, une Tête Réduite '
			+'pour s\'inspirer, et laissez parler votre créativité.'
	else if(comp.indexOf('Parer')!=-1)
		texte = 'Jet de parade : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor(attbm)/2)
			+' => <b>'
			+Math.round(3.5*Math.floor(att/2)+Math.floor(attbm/2))
			+'</b><hr><i>Equivalent esquive : <b>'
			+(Math.floor(att/2)+esq)+'</b> D6 '+aff(Math.floor(attbm/2)+esqbm)
			+' => <b>'
			+(Math.round(3.5*(Math.floor(att/2)+esq)+Math.floor(attbm/2))+esqbm)
			+'</b></i>';
	else if(comp.indexOf('Pistage')!=-1)
		texte = 'Portée horizontale : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Planter un Champignon')!=-1)
		texte = 'Planter un Champignon est une compétence qui vous permet de '
			+'créer des colonies d\'une variété donnée de champignon à partir de '
			+'quelques exemplaires préalablement enterrés.';
	else if(comp.indexOf('Regeneration Accrue')!=-1)
		texte = 'Régénération : <b>'+Math.floor(pvbase/15)+'</b> D3'
			+' => <b>+'+2*Math.floor(pvbase/15)+'</b> PV';
	else if(comp.indexOf('Reparation')!=-1)
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+'et réparez vous-même votre matériel !';
	else if(comp.indexOf('Retraite')!=-1)
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait '
			+'préférable de préparer un repli stratégique pour déconcerter '
			+'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! '
			+'Quelle intelligence démoniaque.';
	else if(comp.indexOf('Rotobaffe')!=-1) {
		var Datt = att, vattbm = attbm;
		var Ddeg = deg, vdegbm = degbm;
		for(var i=1 ; i<niveau+2 ; i++) {
			texte += '<b>Attaque n°'+i+' :</b><br/>'
				+'Attaque : <b>'+Datt+'</b> D6 '+aff(attbm)
				+' => <b>'+(Math.round(3.5*Datt)+attbm)+'</b><br/>'
				+'Dégâts : <b>'+Ddeg+'</b> D3 '+aff(degbm)
				+' => <b>'+(2*Ddeg+degbm)+'</b>';
			Datt = Math.floor(0.75*Datt); vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75*Ddeg); vdegbm = Math.floor(0.75*vdegbm);
			if(i<niveau+1) texte += '<hr>';
			}
		}
	else if(comp.indexOf('Shamaner')!=-1)
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux '
			+'des monstres en utilisant des champignons (de 1 à 3).';
	else if(comp.indexOf('Tailler')!=-1)
		texte = 'Permet d\'augmenter sensiblement la valeur marchande de certains '
			+'minerais. Mais cette opération délicate n\'est pas sans risques...';
	return texte;
	}

function decumul_buff(nom,str,buff) {
	// Décumul des sorts de buff
	var ret = '1<sup>ere</sup>'+nom+' : <b>'+str+' +'+buff+'</b>';
	var dec = buff, total = buff, i=1;
	while(i<6) {
		i++;
		dec = Math.floor(coefDecumul(i)*buff);
		if(dec<=1 || i==6) break;
		total += dec;
		ret += '<br/><i>'+i+'<sup>e</sup> '+nom+' : '
			+str+' +'+dec+' (+'+total+')</i>';
		}
	ret += '<br/><i>'+i+'<sup>e</sup> et + : '+str+' +'+dec+'</i>';
	return ret;
	}


function sortileges(sort,mainCall,pcA,pcD) {
	// Si mainCall==false, affichage réduit des infos (pour PuM/PréM)
	var texte = '';
	if(mainCall) {
		var pcA = (bmDAttM) ? bmDAttM : false;
		var pcD = (bmDDegM) ? bmDDegM : false;
		}
	if(sort.indexOf('Analyse Anatomique')!=-1) {
		texte = 'Portée horizontale : <b>'
			+Math.floor(vuetotale/2)+'</b> case';
		if(vuetotale>3) texte += 's';
		texte += '<br/>Portée verticale : <b>'
			+Math.floor((vuetotale+1)/4)+'</b> case';
		if(vuetotale>7) texte += 's';
		}
	else if(sort.indexOf('Armure Etheree')!=-1)
		texte = decumul_buff('AE','Armure magique',reg);
	else if(sort.indexOf('Augmentation')!=-1 && sort.indexOf('Attaque')!=-1)
		texte = decumul_buff('AdA','Attaque physique',1+Math.floor((att-3)/2));
	else if(sort.indexOf('Augmentation')!=-1 && sort.indexOf('Esquive')!=-1)
		texte = decumul_buff('AdE','Esquive',1+Math.floor((esq-3)/2));
	else if(sort.indexOf('Augmentation des Degats')!=-1)
		texte = decumul_buff('AdD','Dégâts physiques',1+Math.floor((deg-3)/2));
	else if(sort.indexOf('Bulle Anti-Magie')!=-1)
		texte = 'RM : <b>+'+rm+'</b> (Total : <b>'+(2*rm+rmbm)+'</b>)<br/>'
			+'MM : <b>-'+mm+'</b> (Total : <b>'+mmbm+'</b>)';
	else if(sort.indexOf('Bulle Magique')!=-1)
		texte = 'RM : <b>-'+rm+'</b> (Total : <b>'+rmbm+'</b>)<br/>'
			+'MM : <b>+'+mm+'</b> (Total : <b>'+(2*mm+mmbm)+'</b>)';
	else if(sort.indexOf('Explosion')!=-1)
		texte = 'Dégâts : <b>'
			+Math.floor( 1+(deg+Math.floor(pvbase/10))/2 )+'</b> D3 '
			+' => <b>'+2*Math.floor( 1+(deg+Math.floor(pvbase/10))/2 )
			+' ('+resiste( 1+(deg+Math.floor(pvbase/10))/2 )+')</b>';
	else if(sort.indexOf('Faiblesse Passagere')!=-1) {
		if(pv<=0)
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		texte = 'Portée horizontale : <b>'
			+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Dégâts physiques : <b>-'
			+Math.ceil( (Math.floor(pv/10)+deg-5)/4 )
			+' (-'+Math.ceil( (Math.floor(pv/10)+deg-5)/8 )+')</b><br/>'
			+'Dégâts magiques : <b>-'
			+Math.floor( (Math.floor(pv/10)+deg-4)/4 )
			+' (-'+Math.floor( (Math.floor(pv/10)+deg-2)/8 )+')</b>';
		}
	else if(sort.indexOf('Flash Aveuglant')!=-1)	
		texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>';
	else if(sort.indexOf('Glue')!=-1) {
		texte = 'Portée : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if(vuetotale>2) texte += 's';
		}
	else if(sort.indexOf('Griffe du Sorcier')!=-1) {
		/* Frappe */
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+(Math.round(3.5*(att+modD))+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(deg/2)+'</b> D3 ';
		if(pcD) {
			modD = parseInt(Math.floor(deg/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)+' => <b>'
			+(2*(Math.floor(deg/2)+modD)+degbmm)
			+'/'+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbmm)
			+' ('+resiste(Math.floor(deg/2)+modD,degbmm)
			+'/'+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbmm)
			+')</b>';
		if(!mainCall) return texte;
		/* Venins */
		function addVenin(type,effet,duree) {
			var ret = '<b>Venin '+type+' : </b><br/><b>'+effet+'</b> D3'
				+' pendant <b>'+duree+'</b> tour';
			if(duree>1) ret += 's';
			var dred = Math.max(Math.floor(duree/2),1);
			return ret+' => <b>'+2*effet+' x '+duree+' = '+2*effet*duree
				+'</b> ('+2*effet+' x '+dred+' = '+2*effet*dred+')';
			}
		var effet = 1+Math.floor((Math.floor(pvbase/10)+reg)/3);
		texte += '<hr>'+addVenin('insidieux',effet,2+Math.floor(vue/5));
		effet = Math.floor(1.5*effet);
		texte += '<hr>'+addVenin('virulent',effet,1+Math.floor(vue/10));
		}
	else if(sort.indexOf('Hypnotisme')!=-1)
		texte = 'Esquive : <b>-'+Math.floor(1.5*esq)+'</b> Dés'
			+' (<b>-'+Math.floor(esq/3)+'</b> Dés)';
	else if(sort.indexOf('Identification des tresors')!=-1)
		texte = 'Permet de connaitre les caractéristiques et effets précis '
			+'d\'un trésor.';
	else if(sort.indexOf('Invisibilite')!=-1)
		texte = 'Un troll invisible est indétectable même quand on se trouve '
			+'sur sa zone. Toute action physique ou sortilège d\'attaque '
			+'fait disparaître l\'invisibilité.';
	else if(sort.indexOf('Levitation')!=-1)
		texte = 'Prendre un peu de hauteur permet parfois d\'éviter les ennuis. '
			+'Comme les pièges ou les trous par exemple...';
	else if(sort.indexOf('Precision')!=-1 || sort.indexOf('Puissance')!=-1) {
		var eps = 1, pc = 20;
		var str = 'PréM';
		var newSort;
		var sortAtt = [
			'Projectile Magique',
			'Rafale Psychique',
			'Siphon des Ames',
			'Vampirisme',
			'Griffe du Sorcier'];
		if(sort.indexOf('Puissance')!=-1) {
			eps = -1; str='PuM';
			}
		for(var i=1 ; i<4 ; i++) {
			if(texte) texte += '<hr>';
			texte += '<b>'+i+'<sup>e</sup> '+str+' ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for(var j=0 ; j<5 ; j++) {
				if(getTalent(sortAtt[j])) {
					if(newSort) texte += '<br/><br/>';
					texte += '<i>'+sortAtt[j]+' :</i><br/>'
						+sortileges(sortAtt[j],false,eps*pc,-eps*pc);
					newSort = true;
					}
				}
			pc = decumulPumPrem(pc);
			}
		}	
	else if(sort.indexOf('Projectile Magique')!=-1) {
		var modD = 0;
		var portee = getPortee(vuetotale);
		texte = 'Attaque : <b>'+vue+'</b> D6 ';
		if(pcA) {
			modD = parseInt(vue*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+(Math.round(3.5*(vue+modD))+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(vue/2)+'</b> D3 ';
		if(pcD) {
			modD = parseInt(Math.floor(vue/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+' => <b>'+(2*(Math.floor(vue/2)+modD)+degbmm)
			+'/'+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbmm)
			+' ('+resiste(Math.floor(vue/2)+modD,degbmm)
			+'/'+resiste(1.5*Math.floor(vue/2)+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Portée : <b>'+portee+'</b> case';
		if(portee>1) texte += 's';
		}
	else if(sort.indexOf('Projection')!=-1) {
		texte = 'Si le jet de résistance de la victime est raté:<br/>'
			+'la victime est <b>déplacée</b> et perd <b>1D6</b> d\'Esquive<hr>'
			+'Si le jet de résistance de la victime est réussi:<br/>'
			+'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
		}
	else if(sort.indexOf('Rafale Psychique')!=-1) {
		var modD = 0;
		texte = 'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		texte += aff(degbmm)
			+' => <b>'+(2*(deg+modD)+degbmm)+' ('+resiste(deg+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Malus : régénération <b>-'+deg+'</b>';
		}
	else if(sort.indexOf('Sacrifice')!=-1) {
		if(pv<=0)
			return '<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>';
		
		function perteSacro(sac) {
			return ' (-'+(sac+2*Math.floor(sac/5)+2)+' PV)';
			}
		
		var sac = Math.floor((pv-1)/2);
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Soin maximal : <b>'+sac+'</b> PV'+perteSacro(sac);
		/* Sacros max et optimal sans malus (propale R') */
		sac = Math.floor(pvdispo/1.4)-1;
		if(sac>0)
			texte += '<hr>Soin maximal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
		if(sac>3) {
			sac = 5*Math.floor((sac+1)/5)-1;
			texte += '<br/>Soin optimal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
			}
		}
	else if(sort.indexOf('Siphon')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+Math.round(3.5*(att+modD)+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+reg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(reg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)
			+' => <b>'+(2*(reg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*reg)+modD)+degbmm)
			+' ('+resiste(reg+modD,degbmm)+'/'+resiste(1.5*reg+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Nécrose : attaque magique <b>-'+reg+'</b>';
		}
	else if(sort.indexOf('Telekinesie')!=-1) {
		texte = 'Portée horizontale  :';
		var vt = Math.floor(vuetotale/2)+2;
		var strList = ['d\'une Plum\' ou Très Léger','Léger',
					'Moyen','Lourd','Très Lourd ou d\'une Ton\''];
		for(var i=0 ; i<5 ; i++) {
			texte += '<br/><i>Trésor '+strList[i]+' : </i><b>'+vt+'</b> case';
			if(vt>1) texte += 's';
			vt=Math.max(0,vt-1);
			}
		}
	else if(sort.indexOf('Teleportation')!=-1) {
		var portee = getPortee(mmTroll/5);
		var pmh = (20+vue+portee);
		var pmv = 3+Math.floor(portee/3);
		texte = 'Portée horizontale : <b>'+pmh+'</b> cases<br/>'
			+'Portée verticale : <b>'+pmv+'</b> cases<hr>'
			+'X compris entre '+(posX-pmh)+' et '+(posX+pmh)+'<br/>'
			+'Y compris entre '+(posY-pmh)+' et '+(posY+pmh)+'<br/>'
			+'N compris entre '+(posN-pmv)+' et '+Math.min(-1,posN+pmv)+'<br/>';
		}
	else if(sort.indexOf('Vampirisme')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+Math.floor(2*deg/3)+'</b> D6 ';
		if(pcA) {
			modD = parseInt(Math.floor(2*deg/3)*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+Math.round(3.5*(Math.floor(2*deg/3)+modD)+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)
			+' => <b>'+(2*(deg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*deg)+modD)+degbmm)
			+' ('+resiste(deg+modD,degbmm)+'/'+resiste(1.5*deg+modD,degbmm)+')</b>';
		}
	else if(sort.indexOf('Vision Accrue')!=-1)
		texte = decumul_buff('VA','Vue',Math.floor(vue/2));
	else if(sort.indexOf('Vision lointaine')!=-1)
		texte = 'En ciblant une zone située n\'importe où dans le '
			+'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	else if(sort.indexOf('Voir le Cache')!=-1)
		texte = '<b>Sur soi :</b><br/>Portée horizontale : <b>'
			+Math.min(5,getPortee(vue))+'</b> cases<hr>'
			+'<b>À distance :</b><br/>Portée horizontale : <b>'
			+getPortee(vuetotale)+'</b> cases';
	else if(sort.indexOf('Vue Troublee')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Vue : <b>-'+Math.floor(vue/3)+'</b>';
	return texte;
	}


/*---------------------------------- Main ------------------------------------*/

try {
start_script(31);
creerBulleVide();
initAll();
setInfoDateCreation();
setNextDLA();
setInfosPV();
setInfosPxPi();
if(MZ_getValue('VUECARAC')=='true') vueCarac();
setLieu();
setStabilite();
setCurrentEsquive();
setRatioKillDeath();
setTotauxMagie();
traitementTalents();
// À lancer après traitementTalents() :
setAnatrolliseur();
// Cette fonction modifie lourdement le DOM, à placer en dernier :
if(race=='Kastar') setAccel();
saveProfil();
displayScriptTime();
}
catch(e) {window.alert(e)}
