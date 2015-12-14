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


/*---------------------------- Variables globales ----------------------------*/

var
	// Anatrolliseur
	urlAnatrolliseur,
	// Infobulles talents
	hauteur = 50, bulleStyle = null,
	// Caracteristiques
		// Infos troll
	race, niv, idtroll, datecrea,
		// Etats du troll
	fatigue, bmfatigue,

		// Experience, Pi, ...
	pxdistribuables, pxperso,
	piutilisable, pitotal,
	nbmeurtres, nbmorts,
		// utilisee pour les moyennes MM/jour, kill/jour, etc
	NBjours,
		// calcul des DLA suivantes
	DLA, DLAsuiv, HeureServeur,
		// details duree du tour (calcul pvdispo) :
	dtb, pdm, bmt, adb, dpt,
		//posale
	posX, posY, posN,
		// caracs physiques
	vue, vuebp, vuebm, vuetotale,
	pvbase, pvbp, pvbm, pvtotal, pvcourant,
	reg, regbp, regbm, regmoy,
	att, attbp, attbm, attmoy, atttourD,atttourP,atttourM, attmoytour,
	esq, esqbp, esqbm, esqmoy, esqtourD,  esqmoytour,
	deg, degbp, degbm, degmoy, degmoycrit, degtourP,degtourM, degmoytour, degmoycrittour,
	arm, armbp, armbm, armmoy, armtourD, armmoytour,
	rm, rmbp, rmbm, rmtotale,
	mm, mmbp, mmbm, mmtotale,

	// Variables speciales Kastars
	pvActuelKastar, minParPV, overDLA,
		// id pour edition manuelle de lastDLA :
	inJour, inMois, inAn, inHr, inMin, inSec,
		// id pour auto-refresh lastDLA :
	lastDLAZone, maxAMZone, cumulZone,
	lastDLA, DLAaccel;


/*-[functions]----------------- Fonctions utiles -----------------------------*/

// Retourne la valeur de l'element unique et identifie par son "selector" (cf querySelector())
// http://www.w3schools.com/jsref/met_document_queryselector.asp
function getUniqueValueBySelector(selector, defaultValue){
	var valNode = document.querySelector(selector);
	if(valNode!=null){
		if(valNode.hasChildNodes()) {
			return valNode.childNodes[0].nodeValue;
		}else{
			return defaultValue;
		}
	} else{
		debugMZ("Pas d'element trouve correspondant au selecteur : " + selector);
		return defaultValue;
	}
}
function getUniqueStringValueBySelector(selector){
    return getUniqueValueBySelector(selector,"");
}
function getUniqueIntValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0);
	if(ret==null || /^\s*$/.test(ret)){ // test si chaine de caracteres composee de " "
		ret = 0;
	}
	return parseInt(ret);
}
function getUniqueFloatValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0.0);
	if(ret==null || /^\s*$/.test(ret)){  // test si chaine de caracteres composee de " "
		ret = 0.0;
	}
	return parseFloat(ret);
}


function resiste(Ddeg,bm) {
	// version naive mais compréhensible ^^
	// DEBUG: à revoir
	if(!bm) {
		return 2*Math.floor(Ddeg/2);
	}
	return 2*Math.floor(Ddeg/2)+Math.round(bm/2);
}

function getPortee(param) {
	param = Math.max(0,Number(param));
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	// ça devrait être floor, +10.25, -2.5
}

function retourAZero(fatig) {
	var fat = fatig, raz = 0;
	while(fat>0) {
		raz++;
		fat = Math.floor(fat/1.25);
	}
	return raz;
}

function decumulPumPrem(bonus) {
	switch(bonus) {
		case 20: return 33;
		case 33: return 41;
		case 41: return 46;
		case 46: return 49;
		case 49: return 51;
		default: return 20;
	}
}

function coefDecumul(i) {
	switch(i) {
		case 2: return 0.67;
		case 3: return 0.4;
		case 4: return 0.25;
		case 5: return 0.15;
		default: return 0.1;
	}
}

function dureeHM(dmin) {
	var ret = "";
	dmin = Math.floor(dmin);
	if(dmin>59) { ret = Math.floor(dmin/60)+"h"; }
	var mins = dmin%60;
	if(mins!=0) { ret += (ret) ? addZero(mins)+"min" : mins+"min"; }
	return (ret) ? ret : "-";
}


/*-[functions]------- Extraction / Sauvegarde des donnees --------------------*/

function extractionDonnees() {
	    // Variables temporaires
	var Nbrs = {};

// *********************
// Cadre "Description"
// *********************
	race = getUniqueStringValueBySelector('#descr #race');
	debugMZ("Race : " + race);
	idtroll = getUniqueStringValueBySelector('#descr #id');
	debugMZ("Id troll : " + idtroll);
	var strDateCrea = getUniqueStringValueBySelector('#descr td#crea>span');
	strDateCrea = strDateCrea.slice(strDateCrea.indexOf("(") + 1, strDateCrea.indexOf(")"));
	datecrea = new Date(StringToDate(strDateCrea));
	debugMZ("Date creation : " + datecrea);

// *******************
// Cadre "Experience"
// *******************
        // Niveau de troll
	niv = getUniqueIntValueBySelector('#exp #niv');
	nivTroll = niv;
	debugMZ("Niveau : " + niv);
        // PX
	pxdistribuables = getUniqueIntValueBySelector('#exp #px');
	pxperso = getUniqueIntValueBySelector('#exp #px_perso');
	debugMZ("Px Distrib/Perso: "+pxdistribuables+" / "+pxperso);
        // PI
	piutilisable = getUniqueIntValueBySelector('#exp #pi');
	pitotal = parseInt(document.querySelector('#exp #pi').parentElement.nextElementSibling.childNodes[2].textContent);
	debugMZ("PI utilisables/total: "+piutilisable+" / "+pitotal);
        // Meutres/Morts
	nbmeurtres = getUniqueIntValueBySelector('#exp #kill');
	nbmorts = getUniqueIntValueBySelector('#exp #mort');
	debugMZ("Nb Meutres/Morts: "+nbmeurtres+" / "+nbmorts);

// *********************
// Cadre "Tour de Jeu"
// *********************
	    // DLA
	Nbrs["dla"] = getUniqueStringValueBySelector("#dla #dla>b");
	DLA = new Date(StringToDate(Nbrs["dla"]));
	debugMZ("DLA: " + DLA);
	    // DLA suivante
	Nbrs["dlasuiv"] = getUniqueStringValueBySelector("#dla #dla_next");
	DLAsuiv = new Date(StringToDate(Nbrs["dlasuiv"]));
	debugMZ("DLAsuiv: " + DLAsuiv);
	    // Duree normale de mon Tour
	Nbrs["dtb"] = getNumbers(getUniqueStringValueBySelector("#dla #tour"));
	dtb = Nbrs["dtb"][0] * 60 + Nbrs["dtb"][1];
	debugMZ("Duree normale de mon Tour : " + dtb);
	    // Bonus/Malus sur la duree
	Nbrs["bmt"] = getNumbers(getUniqueStringValueBySelector("#dla #bm"));
	bmt = Nbrs["bmt"][0] * 60 + Nbrs["bmt"][1];
	debugMZ("Bonus/Malus sur la duree : " + bmt);
	    // Augmentation due aux blessures
	Nbrs["adb"] = getNumbers(getUniqueStringValueBySelector("#dla #blessure"));
	adb = Nbrs["adb"][0] * 60 + Nbrs["adb"][1];
	debugMZ("Augmentation due aux blessures : " + adb);
	    // Poids de l'equipement
	Nbrs["pdm"] = getNumbers(getUniqueStringValueBySelector("#dla #poids"));
	pdm = Nbrs["pdm"][0] * 60 + Nbrs["pdm"][1];
	debugMZ("Poids de l'equipement : " + pdm);
	    // Duree de mon prochain Tour
	Nbrs["dpt"] = getNumbers(getUniqueStringValueBySelector("#dla #duree>b"));
	dpt = Nbrs["dpt"][0] * 60 + Nbrs["dpt"][1];
	debugMZ('Duree de mon prochain Tour : ' + dpt);

// ****************
// Cadre "Etats"
// ****************
	    // Position du troll :
	posX = getUniqueIntValueBySelector('#pos #x');
	posY = getUniqueIntValueBySelector('#pos #y');
	posN = getUniqueIntValueBySelector('#pos #n');
	debugMZ("(X Y Z) : " + posX + " " + posY + " " + posN);
	    // PV actuel
	pvcourant = getUniqueIntValueBySelector('#pos #pv_courant');
	pvActuelKastar = pvcourant;
	debugMZ("PV actuel : " + pvcourant)
	    // Fatigue
	fatigue = getUniqueIntValueBySelector('#pos #fatigue');
	debugMZ('Fatigue : ' + fatigue);// bmfat = 0 si pas de BM fat
	bmfatigue = 0;

// **************************
// Cadre "Caracteristiques"
// **************************
	    // Attaque
	att = getUniqueIntValueBySelector('#carac #att');
	attbp = getUniqueIntValueBySelector('#carac #att_p');
	attbm = getUniqueIntValueBySelector('#carac #att_m');
	atttourD = getUniqueIntValueBySelector('#carac #att_tour_d');
    atttourP = getUniqueIntValueBySelector('#carac #att_tour_p');
    atttourM = getUniqueIntValueBySelector('#carac #att_tour_m');
	attmoy = 3.5*att + attbp + attbm;
    var bmDAttTotalTour = atttourD + Math.floor(((att+atttourD)*(atttourP+atttourM)/100));
	attmoytour = 3.5*(att+bmDAttTotalTour) + attbp + attbm;
	debugMZ("ATT: "+att+"+("+attbp+")+("+attbm+") ;AttMoy:"+attmoy+"; BM Dé att/tour:("+atttourD+"D;"+atttourP+"%;"+atttourM+"%)"+bmDAttTotalTour+" ;AttMoyTour:"+attmoytour);
	    // Esquive
	esq = getUniqueIntValueBySelector('#carac #esq');
	esqbp = getUniqueIntValueBySelector('#carac #esq_p');
	esqbm = getUniqueIntValueBySelector('#carac #esq_m');
	esqtourD = getUniqueIntValueBySelector('#carac #esq_tour_d');
	esqmoy = 3.5*esq + esqbp+esqbm;
	esqmoytour = 3.5*(esq+esqtourD) + esqbp+esqbm;
	debugMZ("ESQ: "+esq+"+("+esqbp+")+("+esqbm+") ;EsqMoy:"+esqmoy+"; esq/tour:"+esqtourD+" ;EsqMoyTour:"+esqmoytour);
	    // Degat
	deg = getUniqueIntValueBySelector('#carac #deg');
	degbp = getUniqueIntValueBySelector('#carac #deg_p');
	degbm = getUniqueIntValueBySelector('#carac #deg_m');
	degtourP = getUniqueIntValueBySelector('#carac #deg_tour_p');
    degtourM = getUniqueIntValueBySelector('#carac #deg_tour_m');
	degmoy = 2*deg + degbp+degbm;
	degmoycrit = 3*deg + degbp+degbm;
    var bmDDegTotalTour = Math.floor(deg*(degtourP+degtourM)/100);
	degmoytour = 2*(deg + bmDDegTotalTour) + degbp + degbm;
	degmoycrittour = 3 * (deg + bmDDegTotalTour) + degbp + degbm;
	debugMZ("DEG: "+deg+"+("+degbp+")+("+degbm+") ;DegMoy:"+degmoy+"/"+degmoycrit+" ;deg/tour:("+degtourP+"%;"+degtourM+"%)"+bmDDegTotalTour+"; DegMoyTour:"+degmoytour+"/"+degmoycrittour);
	    // PV
	pvbase = getUniqueIntValueBySelector('#carac #pv');
	pvbp = getUniqueIntValueBySelector('#carac #pv_p');
	pvbm = getUniqueIntValueBySelector('#carac #pv_m');
	pvtotal = getUniqueIntValueBySelector('#carac #pv_tot');
	debugMZ("PV: " + pvbase + " + (" + pvbp + ") + (" + pvbm + ") = " + pvtotal);
	    // Regeneration
	reg = getUniqueIntValueBySelector('#carac #reg');
	regbp = getUniqueIntValueBySelector('#carac #reg_p');
	regbm = getUniqueIntValueBySelector('#carac #reg_m');
	regmoy = 2 * reg + regbp + regbm; // D3
	debugMZ("REG: "+reg+"+("+regbp+")+("+regbm+") ;RegMoy:" + regmoy);
	    // Armure
	arm = getUniqueIntValueBySelector('#carac #arm');
	armbp = getUniqueIntValueBySelector('#carac #arm_p');
	armbm = getUniqueIntValueBySelector('#carac #arm_m');
	armtourD = getUniqueIntValueBySelector('#carac #arm_tour_d');
	armmoy = 2*arm + armbp+armbm;
	armmoytour = 2*(arm+armtourD) + armbp+armbm;
	debugMZ("ARM: "+arm+"+("+armbp+")+("+armbm+"); ArmMoy:"+armmoy+"; arm/tour:"+armtourD+"; ArmMoyTour:"+armmoytour);
	// TODO : D d'armure non active
	    // Vue
	vue = getUniqueIntValueBySelector('#carac #vue');
	vuebp = getUniqueIntValueBySelector('#carac #vue_p');
	vuebm = getUniqueIntValueBySelector('#carac #vue_m');
	vuetotale = getUniqueIntValueBySelector('#carac #vue_tot');
	debugMZ("Vue: " + vue + " + (" + vuebp + ") + (" + vuebm + ") = " + vuetotale);
	    // RM
	rm = getUniqueIntValueBySelector('#carac #rm');
	rmbp = getUniqueIntValueBySelector('#carac #rm_p');
	rmbm = getUniqueIntValueBySelector('#carac #rm_m');
	rmtotale = getUniqueIntValueBySelector('#carac #rm_tot');
	rmTroll = rmtotale;
	debugMZ("RM: " + rm + " + (" + rmbp + ") + (" + rmbm + ") = " + rmtotale);
	    // MM
	mm = getUniqueIntValueBySelector('#carac #mm');
	mmbp = getUniqueIntValueBySelector('#carac #mm_p');
	mmbm = getUniqueIntValueBySelector('#carac #mm_m');
	mmtotale = getUniqueIntValueBySelector('#carac #mm_tot');
	mmTroll = mmtotale;
	debugMZ("MM: " + mm + " + (" + mmbp + ") + (" + mmbm + ") = " + mmtotale);

	// Heure Serveur
	try {
        var heureServeurSTR = document.querySelector("#hserveur").innerHTML;
        heureServeurSTR = heureServeurSTR.slice(heureServeurSTR.indexOf("/") - 2, heureServeurSTR.lastIndexOf(":") + 3);
		HeureServeur = new Date(StringToDate(heureServeurSTR));
	} catch (e) {
		window.console.warn(
			"[MZ] Heure Serveur introuvable, utilisation de l'heure actuelle", e
		);
		HeureServeur = new Date();
	}
	debugMZ("HeureServeur: " + HeureServeur);

	// ***INIT GLOBALE*** NBjours
	NBjours = Math.floor((HeureServeur-datecrea)/864e5)+1;

	    // Calcul debut lien anatroliseur avec les caracteristiques connues
	var amelio_dtb = function(dtb) {
			if(dtb>555) {
				return Math.floor((21-Math.sqrt(8*dtb/3-1479))/2);
			}
			return 10+Math.ceil((555-dtb)/2.5);
		},
		amelio_pv = Math.floor(pvbase/10)-3,
		amelio_vue = vue-3,
		amelio_att = att-3,
		amelio_esq = esq-3,
		amelio_deg = deg-3,
		amelio_reg = reg-1,
		amelio_arm = arm-1;
	if(race==="Darkling"){amelio_reg--; }
	if(race==="Durakuir"){amelio_pv-- ; }
	if(race==="Kastar")  {amelio_deg--; }
	if(race==="Skrim")   {amelio_att--; }
	if(race==="Tomawak") {amelio_vue--; }

	urlAnatrolliseur = "http://mountyhall.dispas.net/dynamic/"
	+"outils_anatrolliseur.php?anatrolliseur=v8"
	+"|r="+race.toLowerCase()
	+"|dla="+amelio_dtb(dtb)
	+"|pv="+amelio_pv+","+pvbp+","+pvbm
	+"|vue="+amelio_vue+","+vuebp+","+vuebm
	+"|att="+amelio_att+","+attbp+","+attbm
	+"|esq="+amelio_esq+","+esqbp+","+esqbm
	+"|deg="+amelio_deg+","+degbp+","+degbm
	+"|reg="+amelio_reg+","+regbp+","+regbm
	+"|arm="+amelio_arm+","+armbp+","+armbm
	+"|mm="+mmtotale
	+"|rm="+rmtotale+"|";
}

function saveProfil() {
	MZ_setValue(idtroll+'.caracs.attaque',att);
	MZ_setValue(idtroll+'.caracs.attaque.bm',(attbp+attbm));
	MZ_setValue(idtroll+'.caracs.attaque.bmp',attbp);
	MZ_setValue(idtroll+'.caracs.attaque.bmm',attbm);
    if(atttourD||atttourP||atttourM) {
        var bmDAttTotalTour = atttourD + Math.floor(((att+atttourD)*(atttourP+atttourM)/100));
        MZ_setValue(idtroll+'.bonus.DAttM',bmDAttTotalTour);
    }
	MZ_setValue(idtroll+'.caracs.esquive',esq);
    MZ_setValue(idtroll+'.caracs.esquive.bm',(esqbp+esqbm));
	MZ_setValue(idtroll+'.caracs.esquive.bmp',esqbp);
	MZ_setValue(idtroll+'.caracs.esquive.bmm',esqbm);
    MZ_setValue(idtroll+'.caracs.esquive.nbattaques',esqtourD);
	MZ_setValue(idtroll+'.caracs.degats',deg);
    MZ_setValue(idtroll+'.caracs.degats.bm',(degbp+degbm));
	MZ_setValue(idtroll+'.caracs.degats.bmp',degbp);
	MZ_setValue(idtroll+'.caracs.degats.bmm',degbm);
    if(degtourP||degtourM){
        var bmDDegTotalTour = Math.floor(deg*(degtourP+degtourM)/100);
        MZ_setValue(idtroll+'.bonus.DDegM',bmDDegTotalTour);
    }
	MZ_setValue(idtroll+'.caracs.regeneration',reg);
	MZ_setValue(idtroll+'.caracs.regeneration.bm',(regbp+regbm));
	MZ_setValue(idtroll+'.caracs.regeneration.bmp',regbp);
	MZ_setValue(idtroll+'.caracs.regeneration.bmm',regbm);
	MZ_setValue(idtroll+'.caracs.vue',vue);
	MZ_setValue(idtroll+'.caracs.vue.bm',(vuebp+vuebm));
	MZ_setValue(idtroll+'.caracs.vue.bmp',vuebp);
	MZ_setValue(idtroll+'.caracs.vue.bmm',vuebm);
	MZ_setValue(idtroll+'.caracs.pv',pvcourant);
	MZ_setValue(idtroll+'.caracs.pv.base',pvbase);
	MZ_setValue(idtroll+'.caracs.pv.max',pvtotal);
	MZ_setValue(idtroll+'.caracs.rm',rm);
    MZ_setValue(idtroll+'.caracs.rm.bm',(rm+rmbp+rmbm));
	MZ_setValue(idtroll+'.caracs.rm.bmp',rmbp);
	MZ_setValue(idtroll+'.caracs.rm.bmm',rmbm);
	MZ_setValue(idtroll+'.caracs.mm',mm);
    MZ_setValue(idtroll+'.caracs.mm.bm',(mm+mmbp+mmbm));
	MZ_setValue(idtroll+'.caracs.mm.bmp',mmbp);
	MZ_setValue(idtroll+'.caracs.mm.bmm',mmbm);
	MZ_setValue(idtroll+'.caracs.armure',arm);
	MZ_setValue(idtroll+'.caracs.armure.bm',(armbp+armbm));
	MZ_setValue(idtroll+'.caracs.armure.bmp',armbp);
	MZ_setValue(idtroll+'.caracs.armure.bmm',armbm);
	MZ_setValue(idtroll+'.position.X',posX);
	MZ_setValue(idtroll+'.position.Y',posY);
	MZ_setValue(idtroll+'.position.N',posN);
	MZ_setValue(idtroll+'.race',race);
	MZ_setValue(idtroll+'.niveau',niv);
}


/*-[functions]----------- Fonctions modifiant la page ------------------------*/

function setInfosCaracteristiques() {
        // Modification de l'entete
    var thTotal = document.querySelector("table#caracs>thead>tr>th:nth-child(6)");
    thTotal.innerHTML+='|<i>Moyenne</i>';
    thTotal.title="Moyenne (Moyenne ce tour)";

	    // Ajout des informations calculees
	var tdAttTotal = document.querySelector("table#caracs td#att").parentElement.children[5];
	tdAttTotal.innerHTML="<i>"+attmoy+"</i>";
	if(attmoy!=attmoytour){tdAttTotal.innerHTML+=" ("+attmoytour+")";}

	var tdEsqTotal = document.querySelector("table#caracs td#esq").parentElement.children[5];
    tdEsqTotal.innerHTML="<i>"+esqmoy+"</i>";
	if(esqmoy!=esqmoytour){tdEsqTotal.innerHTML+=" ("+esqmoytour+")";}

	var tdDegTotal = document.querySelector("table#caracs td#deg").parentElement.children[5];
	tdDegTotal.innerHTML="<i>"+degmoy+"/"+degmoycrit+"</i>";
	if(degmoy!=degmoytour){tdDegTotal.innerHTML+=" ("+degmoytour+"/"+degmoycrittour+")";}

	var trRegeneration = document.querySelector("table#caracs td#reg").parentElement;
    var tdRegTotal = trRegeneration.children[5];
    tdRegTotal.innerHTML = "<i>"+regmoy+"</i>";
	    // Temps recupere par reg (propale R')
	var regmoyTemp = Math.max(0, regmoy);
	var regTitle = "Temps moyen récupéré par régénération: " + Math.floor(250 * regmoyTemp / pvtotal) + " min";
	var sec = Math.floor(15000 * regmoyTemp / pvtotal) % 60;
	if (sec != 0) {
		regTitle += " " + sec + " sec";
	}
	trRegeneration.title = regTitle;

	var tdArmTotal = document.querySelector("table#caracs td#arm").parentElement.children[5];
	tdArmTotal.innerHTML= "<i>"+armmoy+"</i>";
	if(armmoy!=armmoytour){tdArmTotal.innerHTML+=" ("+armmoytour+")";}

	var trRM=document.querySelector("table#caracs #rm").parentElement;
	trRM.title = (Math.round(10*rm/NBjours)/10)+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
				+(Math.round(10*rm/niv)/10)+' ('+(Math.round(10*rmtotale/niv)/10)+') points de RM par niveau';


	var trMM=document.querySelector("table#caracs #mm").parentElement;
	trMM.title = (Math.round(10*mm/NBjours)/10)+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
				+(Math.round(10*mm/niv)/10)+' ('+(Math.round(10*mmtotale/niv)/10)+') points de MM par niveau';

    var tdRefl=document.querySelector("#refl");
    // TODO : prendre en compte bonus/malus D esq du tour ?
    var refMoy = Math.floor(2*(reg+esq)/3)*3.5 + (esqbp);
    tdRefl.innerHTML+=" <i>(moyenne : "+refMoy+")</i>";
}

function setLienAnatrolliseur(){
	var pTableAmelio = document.querySelector("#carac>div>p");
    pTableAmelio.innerHTML+=" - ";
    var aElt = document.createElement("a");
    aElt.setAttribute("href",urlAnatrolliseur);
    aElt.setAttribute("target","_blank");
    aElt.className="AllLinks";
    aElt.innerHTML="Anatrolliser";
    pTableAmelio.appendChild(aElt);
}
function setInfoDescription() {
	var txtDateCrea = (NBjours!=1) ?
		" ("+NBjours+" jours dans le hall)" :
		" (Bienvenue à toi pour ton premier jour dans le hall)" ;
	appendText(document.querySelector("#descr td#crea"), txtDateCrea, false);
}

function setInfosEtatLieux() {
	var urlBricol = 'http://trolls.ratibus.net/mountyhall/lieux.php'+
		'?search=position&orderBy=distance&posx='+
		posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3';
	var tdPosition = document.querySelector("#pos td span#x").parentElement;
	appendBr(tdPosition);
    var aElt = document.createElement("a");
    aElt.setAttribute("href",urlBricol);
    aElt.setAttribute("target","_blank");
    aElt.className="AllLinks";
    aElt.innerHTML="Lieux à proximité";
    tdPosition.appendChild(aElt);
}

function setInfosEtatPV() { // pour AM et Sacro
	var
		txt = "1 PV de perdu = +"+Math.floor(250/pvtotal)+" min",
		sec = Math.floor(15000/pvtotal)%60,
		lifebar = document.querySelector("#pos .barre-vie");
	if(sec!=0) { txt += " "+sec+" sec"; }
	if(lifebar) { lifebar.title = txt; }
	if(pvcourant<=0) { return; }
	
	// Difference PV p/r a equilibre de temps (propale R')
	// Note : pvmin pour 0 malus = pvtotal + ceiling(pvtotal/250*(bmt+pdm))
	// ***INIT GLOBALE*** pvdispo
	var pvdispo = pvcourant-pvtotal-Math.ceil((bmt+pdm)*pvtotal/250);
	var	span = document.createElement("span");
	span.title = txt;
	span.style.fontStyle = "italic";
	if(bmt+pdm>=0) {
		txt = "Vous ne pouvez compenser aucune blessure actuellement.";
	} else if(pvdispo>0) {
		txt = "Vous pouvez encore perdre "+
			Math.min(pvdispo,pvcourant)+
			" PV sans malus de temps.";
	} else if(pvdispo<0) {
		txt = "Il vous manque "
			+(-pvdispo)
			+" PV pour ne plus avoir de malus de temps.";
	} else {
		txt = "Vous êtes à l'équilibre en temps (+/- 30sec).";
	}
	appendText(span,txt);
	document.querySelector("#pos #pv_courant").parentElement.parentElement.appendChild(span);
}

// Complete le cadre "Experience"
function setInfosExp() {
    var tdNiv = document.querySelector("#exp #niv");

    // Calcul niveau monstre/troll min pour gain PX
    var nivCibleMin = Math.ceil((2 * nivTroll - 10) / 3);
    tdNiv.parentElement.title = "Vos cibles doivent être au minim de niveau " + nivCibleMin + " pour qu'elles vous rapportent des PX";

    // Calcul PX restant
    var pxRestant = (pxdistribuables + pxperso) - 2 * nivTroll;
    if (pxRestant >= 0) {
        var tdinfoEntrainement = document.querySelector("#exp table tr:nth-child(4) td span");
        tdinfoEntrainement.innerHTML += " <i>Il vous restera " + pxRestant + " PX</i>";
    }

    // Calul pi/jour
    var
    	tdPiTotal=document.querySelector("#exp #pitot").parentElement,
    	tdPi = document.querySelector("#exp #pi").parentElement;
    tdPiTotal.title=(Math.round(10 * (pitotal + pxperso + pxdistribuables) / NBjours) / 10) + ' PI par jour'
    tdPi.title = tdPiTotal.title;

    // Rapports meurtres,morts
    var tdKill = document.querySelector("#exp #kill");
    tdKill.setAttribute("colspan", 1);
    appendTdText(tdKill.parentElement, (Math.round(10 * NBjours / nbmeurtres) / 10) + ' jours/kill', false);

    var tdMort = document.querySelector("#exp #mort");
    tdMort.setAttribute("colspan", 1);
    appendTdText(tdMort.parentElement, (Math.round(10 * NBjours / nbmorts) / 10) + ' jours/mort', false);

    tdKill.parentElement.title = 'Rapport meurtres/décès: ' + Math.floor((nbmeurtres / nbmorts) * 100) / 100;
    tdMort.parentElement.title = 'Rapport décès/meurtres: ' + Math.floor((nbmorts / nbmeurtres) * 100) / 100;
}


/*-[functions]----------- Fonctions speciales Kastars ------------------------*/

function minParPVsac(fat,bm) {
// Calcule le nombre de min gagnees / PV sacrifies pour une AM realisee sous
// fatigue = 'fat', sans et avec un bm de fatigue = 'bm'
	var out = [];
	out[0] = (fat>4) ?
		Math.floor(120/( fat*(1+Math.floor(fat/10)) )) :
		30;
	if(bm && bm>0) {
		var totalfat=fat+bm;
		out[1] = (totalfat>4) ?
			Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) )) :
			30; // en principe inutile pour des bm fat >= 15 mais bon...
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
	// Edition manuelle lastDLA
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
	var
		BMfrais=false,
		fat=fatigue, listeBmFat=[],
		tr, th, insertPt;

	// Creation ligne speciale pour AM dans le cadre "Etat"
	tr = document.createElement('tr');
	th = document.createElement('th');
	appendText(th,'Fatigue et AM',true);
	tr.appendChild(th);
	insertPt = document.createElement('td');
	tr.appendChild(insertPt);
	document.querySelector('#pos table>tbody').insertBefore(tr,null);

	// Est-on en over-DLA ?
	// ***INIT GLOBALE*** overDLA
	overDLA = (HeureServeur>DLA.getTime()+3e5);
	if(overDLA) {
		fat=Math.floor(fatigue/1.25);
	}

	// Gestion des BM de fatigue
	if(bmfatigue>0) {
		// On tente de recuperer les BM de fatigue de la page des BM
		if(MZ_getValue(numTroll+'.bm.fatigue')) {
			var BMmemoire = MZ_getValue(numTroll+'.bm.fatigue').split(';');
			BMmemoire.pop();
			var tour = 0;
			for(var i=0 ; i<BMmemoire.length ; i++) {
				var nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				while(tour<=parseInt(nbrs[0])) {
					listeBmFat[tour]=parseInt(nbrs[1]);
					tour++;
				}
			}
		}
		if(listeBmFat[0]==bmfatigue) {
			// Si (bm profil=1er bm stocke), on suppose que les bm stockes sont a jour
			BMfrais = true;
			MZ_removeValue(numTroll+".bm.fatigue");
		}
	} else {
		// S'il n'y a pas de bm de fatigue sur le profil, on est a jour
		BMfrais = true;
	}
	if(!BMfrais && bmfatigue>0) {
		// si les BM n'ont pas ete rafraichis, on conjecture le pire:
		if(bmfatigue==15) {
			listeBmFat = [15,15,15];
		} else {
			listeBmFat = [30,30,15];
		}
	}
	if(overDLA) {
		// Si on est en over-DLA, on decale les bm d'un tour
		listeBmFat.shift();
	}
	
	// Tableau des fatigues et accel futures
	var
		minppv = minParPVsac(fat,listeBmFat[0]),
		table, tbody,
		ligneTour, ligneFat, ligneMin,
		col;
	// ***INIT GLOBALE*** minParPV
	minParPV = (listeBmFat[0]==void(0)) ? minppv[0] : minppv[1];
	if(fat>0 || listeBmFat[0]>0) {
		table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style.textAlign = "center";
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPt.appendChild(table);
		
		ligneTour = appendTr(tbody,'mh_tdtitre');
		ligneTour.style.fontWeight = "bold";
		var td = appendTdText(ligneTour,'Tour :',true);
		td.align = 'left';
		ligneFat = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneFat,'Fatigue :',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		ligneMin = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneMin,'1 PV =',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		col=0;
		while(col<9 && (fat>0 || listeBmFat[col])) {
			if(col==0) {
				if(overDLA) {
					var i = document.createElement('i');
					appendText(i,'A activer');
					ligneTour.appendChild(i);
				} else {
					appendTdText(ligneTour,'En cours');
				}
			} else {
				appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
			}
			if(listeBmFat[col]) {
				if(BMfrais || (!overDLA && col==0)) {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]);
					appendTdText(ligneMin,minppv[1]+'\'');
				} else {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]+' (?)');
					appendTdText(ligneMin,minppv[1]+'\' ('+minppv[0]+'\')');
				}
			} else {
				appendTdText(ligneFat,fat);
				appendTdText(ligneMin,minppv[0]+'\'');
			}
			col++;
			fat = Math.floor(fat / 1.25);
			minppv = minParPVsac(fat,listeBmFat[col]);
		}
		if(fat>1 || (fat==1 && !overDLA)) {
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
		
		if(!BMfrais && bmfatigue) {
			// si les BM n'ont pas ete rafraichis, on signale:
			appendText(
				insertPt,
				'/!\\ Visitez la page des Bonus/Malus '+
				'pour mettre à jour votre fatigue. /!\\',
				true
			);
			appendBr(insertPt);
		}
		appendBr(insertPt);
	}
	
	if(pvcourant<=0) {
		appendText(insertPt,'Aucun calcul possible : vous êtes mort voyons !');
		return;
	}
	
	if(fatigue>30) {
		appendText(insertPt,'Vous êtes trop fatigué pour accélérer.');
		return;
	}
	
	// Setup lastDLAZone
	if(overDLA) {
		// bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date(  DLAsuiv );
		lastDLA = new Date( DLA );
		MZ_setValue(numTroll+'.DLA.ancienne',DateToString(DLA));
		// ***INIT GLOBALE*** pvActuelKastar
		pvActuelKastar = Math.min(pvcourant+regmoy,pvtotal);
		appendText(
			insertPt,
			'/!\\ Votre DLA est dépassée, calculs basés sur des estimations. /!\\',
			true
		);
		appendBr(insertPt);
	} else {
		DLAaccel = new Date( DLA );
		pvActuelKastar = pvcourant;
		if(MZ_getValue(numTroll+'.DLA.ancienne')) {
			lastDLA = new Date(StringToDate(MZ_getValue(numTroll+'.DLA.ancienne')));
		} else {
			lastDLA = false;
		}
	}
	appendText(insertPt,'Dernière DLA enregistrée : ');
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var b = document.createElement('b');
	b.onclick = inputMode;
	lastDLAZone.appendChild(b);
	insertPt.appendChild(lastDLAZone);
	if(lastDLA) {
		appendText(b,DateToString(lastDLA));
	} else {
		appendText(b,'aucune');
	}
	appendBr(insertPt);
	
	// Setup maxAMZone et cumulZone
	appendText(insertPt,'Accélération maximale possible : ');
	maxAMZone = document.createElement('b');
	insertPt.appendChild(maxAMZone);
	appendBr(insertPt);
	cumulZone = document.createElement('span');
	insertPt.appendChild(cumulZone);
	
	refreshAccel();
}

function refreshAccel() {
	var pvs, pvsmax;
	
	// Acceleration pour cumul instantane
	//window.console.debug('refreshAccel',pvActuelKastar,DLAaccel,lastDLA,minParPV);
	if(lastDLA) {
		pvsmax = Math.min(
			pvActuelKastar-1,
			Math.ceil( Math.floor((DLAaccel-lastDLA)/6e4)/minParPV )
		);
		maxAMZone.innerHTML = pvsmax+" PV";
	} else {
		pvsmax = pvActuelKastar-1;
		maxAMZone.innerHTML = "inconnue";
	}
	
	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/6e4) / minParPV );
	cumulZone.innerHTML = '';
	if(pvs<=pvsmax) {
		appendText(cumulZone,'Vous devez accélérer d\'au moins ');
		appendText(cumulZone,pvs+' PV', true);
		appendText(cumulZone,' pour activer immédiatement un nouveau tour.');
		if(pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1e3)
				-(pvs-1)*60*minParPV;
			appendText(
				cumulZone,
				' ('+(pvs-1)+' PV dans '+
				Math.floor(gainSec/60)+'min'+
				addZero(gainSec%60)+'s)'
			);
		}
	} else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*6e4 );
		appendText(
			cumulZone,
			'Après votre accélération maximale, il vous faudra encore attendre '+
			dureeHM(avantDLA/6e4)+
			' avant de réactiver.'
		);
	}
}


/*-[functions]-------- Fonctions gerant les infos-bulles ---------------------*/

function traitementTalents() {
	trCompetence = document.querySelectorAll("#comp table#competences>tbody>tr");
	trSorts = document.querySelectorAll("#sort table#sortileges>tbody>tr");
	removeAllTalents();
	var totalComp = injecteInfosBulles(trCompetence,'competences');
	var totalSort = injecteInfosBulles(trSorts,'sortileges');
	document.querySelector('#comp>div>h3.mh_tdtitre').textContent+=' (Total : '+totalComp+'%)';
	document.querySelector('#sort>div>h3.mh_tdtitre').textContent+=' (Total : '+totalSort+'%)';
}

function injecteInfosBulles(liste,fonction) {
	var totalpc = 0;
	// on parse la liste des talents du type 'fonction'
	for(var i=0 ; i<liste.length ; i++) {
		var
			trTalent=liste[i],
			node=trTalent.cells[1].querySelector('a'),
			nomTalent=epure(trim(node.textContent)),
			indiceTDniveaux=7,
			indiceTDSousCompetence=2,
			sousCompetences=undefined;
		if(fonction=="competences"){
			// un TD en plus pour des information complementaire liees a la comp
			indiceTDniveaux++;
			// chercher les sous-compétence (type de golem, type de piège) s'il y a
			sousCompetences = trTalent.cells[indiceTDSousCompetence].textContent.split(',');
			for (var j=0; j < sousCompetences.length; j++) {
				sousCompetences[j] = sousCompetences[j].epure().trim();
				if (arrayTalents[sousCompetences[j]]) sousCompetences[j] = arrayTalents[sousCompetences[j]];
			}
		}
		var niveauxMaitrisesTalentArray=getNumbers(trTalent.cells[indiceTDniveaux].textContent);
		setInfos(node,nomTalent,fonction,niveauxMaitrisesTalentArray[0]);
		setTalent(nomTalent,niveauxMaitrisesTalentArray[1],niveauxMaitrisesTalentArray[0],sousCompetences);
		totalpc += niveauxMaitrisesTalentArray[1];

		// stockage des niveaux inferieurs du talent si presents
		for(var j=2 ; j<niveauxMaitrisesTalentArray.length ; j+=2) {
			setTalent(nomTalent,niveauxMaitrisesTalentArray[j+1],niveauxMaitrisesTalentArray[j],sousCompetences);
			totalpc+=niveauxMaitrisesTalentArray[j+1];
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

function setTalent(nom,pc,niveau,sousCompetences) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement 
	// (et pas les % dont osf) ne serait pas plus rentable
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) { return; }
	if(!niveau) { niveau = 1; }
	
	switch(nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur += 'Insu'+niveau+'|';
		case 'IdT':
			nomEnBase += niveau;
			break;
		case 'Golemo':
		case 'Piege':
			for (var i=0 ; i < sousCompetences.length ; i++) {
				urlAnatrolliseur += (arrayModifAnatroll[sousCompetences[i]] ? 
					arrayModifAnatroll[sousCompetences[i]] : sousCompetences[i]) + '|';
			}
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
	var tr = appendTr(table,'mh_tdtitre');
	appendTdText(tr,'Titre');
	tr = appendTr(table,'mh_tdpage');
	appendTdText(tr,'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(table);
	}

function cacherBulle() {
	if(bulleStyle)
        bulleStyle.visibility = 'hidden';
}

function setBulle(evt) {
	var nom = this.nom;
	var fonction = this.fonction;
	var niveau = parseInt(this.niveau);
	var str='';
	if(fonction=='competences'){
		str=competences(nom,niveau);
	} else if(fonction=='sortileges') {
		str=sortileges(nom,true);
	}
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


/*-[functions] Textes des infos-bulles pour les competences et sortileges ----*/

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
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetatt = Math.round(3.5*Math.min(Math.floor(1.5*att),att+3*i))+
				attbp+attbm;
			texte += 'Attaque niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(att*1.5),att+3*i)+'</b> D6 '+aff(attbp+attbm)+
				' => <b>'+jetatt+'</b><br/>';
			espatt += (pc-lastmax)*jetatt;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<i>Attaque moyenne (si réussite) : <b>'+
				Math.floor(10*espatt/lastmax)/10+'</b></i><br/>';
		}
		texte += 'Dégâts : <b>'+deg+'</b> D3 '+aff(degbp+degbm)+
			' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Balayage')!=-1)
		texte = 'Déstabilisation : <b>'+att+'</b> D6 '+aff(attbp+attbm)
			+' => <b>'+attmoy+'</b><br/>'
			+'Effet : <b>Met à terre l\'adversaire</b>';
	else if(comp.indexOf('Bidouille')!=-1)
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet '
			+'de votre inventaire avec le texte de votre choix.';
	else if(comp.indexOf('Baroufle')!=-1){
		texte = 'Vous voulez encourager vos compagnons de chasse ? '
			+'Ramassez quelques Coquillages, et en avant la musique !<br>';
        texte +='<table class="mh_tdborder" cellspacing="1" cellpadding="1" border="0"><tbody>' +
            '<tr class="mh_tdtitre"><th>Nom</th><th>Effet</th></tr>' +
            '<tr class="mh_tdpage"><td>Booong</td><td>deg +1 / esq -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Badaboum</td><td>att +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Zbouing </td><td>reg +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Whoooom</td><td>concentration +2</td></tr>' +
            '<tr class="mh_tdpage"><td>Krouiiik</td><td>concentration -2</td></tr>' +
            '<tr class="mh_tdpage"><td>Tuutuuuut</td><td>att -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Gaaaw</td><td>Fatigue +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Huitsch</td><td>deg -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Kliketiiik</td><td>esq -1 / concentration -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Kssksss</td><td>esq +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Praaaouuut</td><td>reg-1 </td></tr>'+
            '<tr class="mh_tdpage"><td>Sssrileur</td><td>seuil 6, rend visible</td></tr>' +
            '<tr class="mh_tdpage"><td>Tagadagada</td><td>augmente le nombre de tours (1 tour par tranche de 2)</td></tr>' +
            '<tr class="mh_tdpage"><td>Ytseukayndof</td><td>seuil 2, rend les bonus magiques</td></tr>' +
            '<tr class="mh_tdpage"><td>Whaaag</td><td>augmente la portée horizontale (1 case par tranche de 4)</td></tr>' +
        '</tbody></table>';
    }
    else if(comp.indexOf('Botte Secrete')!=-1){
		texte = 'Attaque : <b>'
			+Math.floor(2*att/3)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2))
			+' => <b>'
			+Math.round(3.5*Math.floor(2*att/3)+Math.floor((attbp+attbm)/2))
			+'</b><br/>Dégâts : <b>'
			+Math.floor(att/2)+'</b> D3 '+aff(Math.floor((degbp+degbm)/2))
			+' => <b>'
			+(2*Math.floor(att/2)+Math.floor((degbp+degbm)/2))
			+'/'+(2*Math.floor(1.5*Math.floor(att/2))+Math.floor((degbp+degbm)/2))
			+'</b>';
	}
	else if(comp.indexOf('Camouflage')!=-1) {
		var camou = getTalent('Camouflage');
		texte = 'Pour conserver son camouflage, il faut réussir un jet sous:<br/>'
			+'<i>Déplacement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+'<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+'<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
	}
	else if(comp.indexOf('Charger')!=-1) {
		if(pvcourant<=0)
			return '<i>On ne peut charger personne quand on est mort !</i>';
		var portee = Math.min(
			getPortee(reg+Math.floor(pvcourant/10))-Math.floor((fatigue+bmfatigue)/5),
			vuetotale);
		if(portee<1)
			return '<b>Impossible de charger</b>';
		else {
			texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
				+' => <b>'+attmoy+'</b><br/>'
				+'Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
				+' => <b>'+degmoy+'/'+degmoycrit+'</b>'
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
			if(texte){
				texte += ' À moins que vous ne préfériez les envoyer en l\'air !<br/>';
			}
			texte += 'Dégats du piège à feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
				+' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b>';
		}
	}
	else if(comp.indexOf('Contre-Attaquer')!=-1){
		texte = 'Attaque : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2))
			+' => <b>'+Math.round(3.5*Math.floor(att/2)+Math.floor((attbp+attbm)/2))
			+'</b><br/>Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
			+' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Coup de Butoir')!=-1) {
		var pc, lastmax=0, espdeg=0;
		var notMaxedOut = false;
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
			+' => <b>'+attmoy+'</b>';
		for(var i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetdeg = 2*Math.min(Math.floor(1.5*deg),deg+3*i)+(degbp+degbm);
			texte += '<br/>Dégâts niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(deg*1.5),deg+3*i)+'</b> D6 '+aff((degbp+degbm))+
				' => <b>'+jetdeg+'/'+(jetdeg+2*Math.floor(deg/2))+'</b>';
			espdeg += (pc-lastmax)*jetdeg;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<br/><i>Dégâts moyens (si réussite) : <b>'+
				Math.floor(10*espdeg/lastmax)/10+'/'+
				(Math.floor(10*espdeg/lastmax)/10+2*Math.floor(deg/2))+'</b></i>';
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
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
			+' => <b>'+attmoy+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
			+' => <b>'+degmoy+'/'+degmoycrit+'</b>';
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
			+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff((esqbp+esqbm))
			+' => <b>'+Math.round(3.5*Math.floor(2*(esq+reg)/3)+(esqbp+esqbm))+'</b>';
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
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor((attbp+attbm))/2)
			+' => <b>'
			+Math.round(3.5*Math.floor(att/2)+Math.floor((attbp+attbm)/2))
			+'</b><hr><i>Equivalent esquive : <b>'
			+(Math.floor(att/2)+esq)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2)+(esqbp+esqbm))
			+' => <b>'
			+(Math.round(3.5*(Math.floor(att/2)+esq)+Math.floor((attbp+attbm)/2))+(esqbp+esqbm))
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
		texte = 'Régénération : <b>'+Math.floor(pvtotal/15)+'</b> D3'
			+' => <b>+'+2*Math.floor(pvtotal/15)+'</b> PV';
	else if(comp.indexOf('Reparation')!=-1)
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+'et réparez vous-même votre matériel !';
	else if(comp.indexOf('Retraite')!=-1)
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait '
			+'préférable de préparer un repli stratégique pour déconcerter '
			+'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! '
			+'Quelle intelligence démoniaque.';
	else if(comp.indexOf('Rotobaffe')!=-1) {
		var Datt = att, vattbm = attbp+attbm;
		var Ddeg = deg, vdegbm = degbp+degbm;
		for(var i=1 ; i<niveau+2 ; i++) {
			texte += '<b>Attaque n°'+i+' :</b><br/>'
				+'Attaque : <b>'+Datt+'</b> D6 '+aff(vattbm)
				+' => <b>'+(Math.round(3.5*Datt)+vattbm)+'</b><br/>'
				+'Dégâts : <b>'+Ddeg+'</b> D3 '+aff(vdegbm)
				+' => <b>'+(2*Ddeg+vdegbm)+'</b>';
			Datt = Math.floor(0.75*Datt); vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75*Ddeg); vdegbm = Math.floor(0.75*vdegbm);
			if(i<niveau+1) texte += '<hr>';
		}
	}
	else if(comp.indexOf('Shamaner')!=-1)
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux '
			+'des monstres en utilisant des champignons (de 1 à 3).';
	else if(comp.indexOf('Tailler')!=-1){
		texte = 'Permet d\'augmenter sensiblement la valeur marchande de certains '
			+'minerais. Mais cette opération délicate n\'est pas sans risques...';
	}
	return texte;
	}

function decumul_buff(nom,str,buff) {
	// Decumul des sorts de buff
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
	// Si mainCall==false, affichage réduit des infos des sorts d'attaque pour PuM/PréM
	var texte = '';
	if (mainCall) {
        /* pourcentages Des bonus/malus du a PuM/PreM : Att et Deg*/
		pcA = (atttourP+atttourM);
		pcD = (degtourP+degtourM);
	}
	if (sort.indexOf('Analyse Anatomique') != -1) {
		texte = 'Portée horizontale : <b>'
			+ Math.floor(vuetotale / 2) + '</b> case';
		if (vuetotale > 3){ texte += 's'; }
		texte += '<br/>Portée verticale : <b>'
			+ Math.floor((vuetotale+1)/4)+'</b> case';
		if (vuetotale > 7){ texte += 's'; }
	}
	else if (sort.indexOf('Armure Etheree') != -1){
		texte = decumul_buff('AE', 'Armure magique', reg);
	}
	else if (sort.indexOf('Augmentation') != -1 && sort.indexOf('Attaque') != -1){
		texte = decumul_buff('AdA', 'Attaque physique', 1+Math.floor((att-3)/2));
	}
	else if (sort.indexOf('Augmentation') != -1 && sort.indexOf('Esquive') != -1){
		texte = decumul_buff('AdE', 'Esquive', 1+Math.floor((esq-3)/2));
	}
	else if (sort.indexOf('Augmentation des Degats') != -1){
		texte = decumul_buff('AdD', 'Dégâts physiques', 1 + Math.floor((deg-3)/2));
	}
	else if(sort.indexOf('Bulle Anti-Magie')!=-1){
		texte = 'RM : <b>+'+rm+'</b><br/>MM : <b>-'+mm+'</b>';
	}
	else if(sort.indexOf('Bulle Magique')!=-1){
		texte = 'RM : <b>-'+rm+'</b><br/>MM : <b>+'+mm+'</b>';
	}
	else if(sort.indexOf('Explosion')!=-1){
		texte = 'Dégâts : <b>'
			+Math.floor( 1+(deg+Math.floor(pvtotal/10))/2 )+'</b> D3 '
			+' => <b>'+2*Math.floor(1+(deg+Math.floor(pvtotal/10))/2)
			+' ('+resiste(1+(deg+Math.floor(pvtotal/10))/2 )+')</b>';
	}
	else if(sort.indexOf('Faiblesse Passagere')!=-1){
		if(pvcourant<=0)
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		texte = 'Portée horizontale : <b>'
			+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Dégâts physiques : <b>-'
			+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/4 )
			+' (-'+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/8 )+')</b><br/>'
			+'Dégâts magiques : <b>-'
			+Math.floor( (Math.floor(pvcourant/10)+deg-4)/4 )
			+' (-'+Math.floor( (Math.floor(pvcourant/10)+deg-2)/8 )+')</b>';
	}
	else if(sort.indexOf('Flash Aveuglant')!=-1){
		texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>';
	}
	else if(sort.indexOf('Glue')!=-1) {
		texte = 'Portée : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if(vuetotale>2) texte += 's';
	}
	else if(sort.indexOf('Griffe du Sorcier')!=-1){
		/* Frappe */
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA!=0){
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+(Math.round(3.5*(att+modD))+attbm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(deg/2)+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(Math.floor(deg/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)+' => <b>'
			+(2*(Math.floor(deg/2)+modD)+degbm)
			+'/'+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbm)
			+' ('+resiste(Math.floor(deg/2)+modD,degbm)
			+'/'+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbm)
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
	else if(sort.indexOf('Precision')!=-1 || sort.indexOf('Puissance')!=-1) {
		var eps = 1,
            pc = 20;
		var str = 'PréM';
		var newSort;
		var sortAtt = [
			'Projectile Magique',
			'Rafale Psychique',
			'Siphon des Ames',
			'Vampirisme',
			'Griffe du Sorcier'
		];
		if(sort.indexOf('Puissance')!=-1) {
			eps = -1; str='PuM';
		}
		for(var i=1 ; i<4 ; i++) {
			if(texte) { texte += '<hr>'; }
			texte += '<b>'+i+'<sup>e</sup> '+str+' ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for(var j=0 ; j<sortAtt.length ; j++) {
				if(getTalent(sortAtt[j])) {
					if(newSort) { texte += '<br/><br/>'; }
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
		if(pcA!=0) {
			modD = parseInt(vue*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+(Math.round(3.5*(vue+modD))+attbm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(vue/2)+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(Math.floor(vue/2)+pcD);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
            modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(Math.floor(vue/2)+modD)+degbm)
			+'/'+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbm)
			+' ('+resiste(Math.floor(vue/2)+modD,degbm)
			+'/'+resiste(1.5*Math.floor(vue/2)+modD,degbm)+')</b>';
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
		if(pcD!=0) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}
		texte += aff(degbm)
			+' => <b>'+(2*(deg+modD)+degbm)+' ('+resiste(deg+modD,degbm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Malus : régénération <b>-'+deg+'</b>';
	}
	else if(sort.indexOf('Sacrifice')!=-1) {
		if(pvcourant<=0)
			return '<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>';

		function perteSacro(sac) {
			return ' (-'+(sac+2*(1+Math.floor(sac/5)))+' PV)';
		}

		var sac = Math.floor((pvcourant-1)/2);
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Soin maximal : <b>'+sac+'</b> PV'+perteSacro(sac);
		/* Sacros max et optimal sans malus (propale R') */
        var pvdispoSansMalusTemps = pvcourant-pvtotal-Math.ceil((bmt+pdm)*pvtotal/250);
        sac = Math.floor((pvdispoSansMalusTemps-2)*5/7);
		if(sac>0)
			texte += '<hr>Soin maximum limitant les risques de malus de temps : <b>' +sac+'</b> PV'+perteSacro(sac);
        else
            texte += '<hr>Vous ne pouvez pas compenser de blessures dues à un sacrifice';
		/*if(sac>3) {
			sac = 5*Math.floor((sac+1)/5)-1;
			texte += '<br/>Soin optimal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
		}*/
	}
	else if(sort.indexOf('Siphon')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA!=0) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+Math.round(3.5*(att+modD)+attbm)+'</b><br/>'
			+'Dégâts : <b>'+reg+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(reg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(reg+modD)+degbm)+'/'+(2*(Math.floor(1.5*reg)+modD)+degbm)
			+' ('+resiste(reg+modD,degbm)+'/'+resiste(1.5*reg+modD,degbm)+')</b>';
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
		if(pcA!=0) {
			modD = parseInt(Math.floor(2*deg/3)*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+Math.round(3.5*(Math.floor(2*deg/3)+modD)+attbm)+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(deg+modD)+degbm)+'/'+(2*(Math.floor(1.5*deg)+modD)+degbm)
			+' ('+resiste(deg+modD,degbm)+'/'+resiste(1.5*deg+modD,degbm)+')</b>';
	}
	else if(sort.indexOf('Vision Accrue')!=-1)
		texte = decumul_buff('VA','Vue',Math.floor(vue/2));
	else if(sort.indexOf('Vision lointaine')!=-1)
		texte = 'En ciblant une zone située n\'importe où dans le '
			+'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	else if(sort.indexOf('Voir le Cache')!=-1)
		texte = '<b>Sur soi :</b><br/>Portée horizontale : <b>'
			+Math.min(5,getPortee(vue))+'</b> cases<hr>'
			+'<b>A distance :</b><br/>Portée horizontale : <b>'
			+getPortee(vuetotale)+'</b> cases';
	else if(sort.indexOf('Vue Troublee')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Vue : <b>-'+Math.floor(vue/3)+'</b>';
	return texte;
}


/*---------------------------------- Main ------------------------------------*/

try {
	start_script(31);

	extractionDonnees();
	setInfosCaracteristiques();
	setInfoDescription();
	setInfosEtatLieux();
	setInfosEtatPV();
	setInfosExp();

	creerBulleVide();
	traitementTalents();
	setLienAnatrolliseur();

	// Cette fonction modifie lourdement le DOM, à placer en dernier :
	if(race=='Kastar'){ setAccel(); }
	saveProfil();
	displayScriptTime();
} catch(e) {
	avertissement("[MZ] Une erreur s'est produite.");
	window.console.error("[MZ] Erreur générale Profil",e);
}
