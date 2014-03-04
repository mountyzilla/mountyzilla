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

var pageDispatcher = "http://mountypedia.free.fr/mz/cdmdispatcher.php";
//var pageDispatcher = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var pageEffetDispatcher = "http://mountypedia.free.fr/mz/effetdispatcher.php";
var buttonCDM;

/*

Vous avez utilisé le Sortilège : CONNAISSANCE DES MONSTRES sur un Gritche [Favori] (2010762)

Le Monstre ciblé fait partie des : Démon

Niveau : Impressionnant (entre 27 et 29)
Points de Vie : Excellent (entre 230 et 250)
Blessure : 95 % (approximativement)
Points de Vie restants (Approximatif) : Entre 1 et 11
Dés d'Attaque : Excellent (entre 26 et 28)
Dés d'Esquive : Fort (entre 11 et 13)
Dés de Dégât : Fort (entre 13 et 15)
Dés de Régén. : Moyen (égal à 4)
Armure : Remarquable (entre 21 et 23)
Vue : Très Faible (entre 2 et 4)
Capacité spéciale : Coup Perforant - Affecte : Armure | Durée 2 tour(s)
Maitrise Magique : Jamais vu (supérieur à 4000)
Résistance Magique : Jamais vu (entre 3900 et 4100)
Nombre d'attaques : 1
Vitesse de Déplacement : Lente
Voir le Caché : Oui
Attaque à distance : Non
DLA : Milieu
Durée tour : Fort (entre 6 et 8)
Chargement : Vide
Bonus Malus : Faiblesse Passagère
Portée du Pouvoir : Au toucher

-->

Le Monstre Ciblé fait partie des : Mort-Vivant (Maître Nécrochore [Vénérable] - N°1249810)
Niveau : Incroyable (entre 36 et 39)
*/
function sendCDM()
{
	var td = document.evaluate("//td/text()[contains(.,'Le Monstre ciblé fait partie des')]/..",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!td)
		return false;
		
	cdm = td.innerHTML;
	cdm = cdm.replace(/.*Vous avez utilisé.* MONSTRES sur une? ([^(]+) \(([0-9]+)\)(.*partie des : )([^<]+)<br>/,"$3$4 ($1 - N°$2)<br>");
	cdm = cdm.replace(/<br>/g,"\n");
	cdm = cdm.replace(/Blessure :[\s]*[0-9]+ % \(approximativement\)/g, "Blessure : XX % (approximativement)");

	MZ_xmlhttpRequest({
				method: 'GET',
				url: pageDispatcher+"?cdm="+escape(cdm),
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				onload: function(responseDetails) {
					buttonCDM.value=responseDetails.responseText;
					buttonCDM.disabled = true;
				}
				});
}

function traiteCdM() {
	// Teste si ce message du bot est un message de CdM
	var td = document.evaluate("//td/text()[contains(.,'Le Monstre ciblé fait partie des')]/..",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!td)
		return false;
		
	cdm = td.innerHTML;
	// pour mettre les points de vie restants estimés
	var des = cdm.indexOf('Dés');
	var pv = cdm.substring(cdm.indexOf('Points de Vie'), cdm.indexOf('Blessure'));
	pv = getPVsRestants(pv, cdm.substring(cdm.indexOf('Blessure :') + 12, des));
	if (pv)
		td.innerHTML = cdm.substring(0, des - 4) + "<br>" + pv[0]+ pv[1] + cdm.substring(des - 4);

	// Pas de blessure quand on envoie un message du bot
	cdm = cdm.replace(/Blessure : [0-9]+ % (approximativement)/g, "Blessure : XX % (approximativement)");

	// On insère le bouton et un espace
	var button = insertButtonCdm('bClose');
	buttonCDM = button;
/*	button.setAttribute("onClick", "window.open('" + pageCdmRecord + "?cdm=" + escape(cdm)
			+ "&source=mountyzilla/script_teubreu&forwardTo=" + pageDispatcher
			+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
			+ "this.value='Merci de votre participation'; this.disabled = true;");*/
			
	button.addEventListener("click",sendCDM, true);
}

function traitePouvoir() {
	// Teste si ce message du bot est un message de CdM
	var td = document.evaluate("//td/text()[contains(.,'Vous avez été impliqué dans un événement : POUVOIR')]/../text()[contains(.,'sa capacité spéciale')]/..",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!td)
		return false;
		
	var infos = td.innerHTML;
	var id = /monstre n°([0-9]+) /.exec(infos)[1];
	var nomMonstre = /\(une? ([^)]+)\)/.exec(infos)[1];
	var nomPouvoir = /spéciale : ([^<]+)/.exec(infos)[1];
	var date = /alors : ([^<]+)\./.exec(infos)[1];
	date = new Date(date.replace(/([0-9]+)\/([0-9]+)\//,"$2/$1/"));
	var effetPouvoir="";
	var full=false;
	if(infos.indexOf("REDUIT")!=-1)
	{
		effetPouvoir = /effet REDUIT : ([^<]+)/.exec(infos)[1];
	}
	else
	{
		effetPouvoir = /effet : ([^<]+)/.exec(infos)[1];
		full=true;
	}
	var dureePouvoir = /durée de ([0-9]+)/.exec(infos)[1];
	// On insère le bouton et un espace
	var url = pageEffetDispatcher + "?pouv="+escape(nomPouvoir)+"&monstre="+escape(nomMonstre)+"&id="+escape(id)+"&effet="+escape(effetPouvoir)+"&duree="+escape(dureePouvoir)+"&date="+escape(Math.round(date.getTime()/1000));
	if(!MZ_getValue('AUTOSENDPOUV'))
	{
		var button = insertButtonCdm('bClose',null,"Collecter les infos du pouvoir");
		button.setAttribute("onClick", "window.open('" + url
				+ "', 'popupEffet', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value='Merci de votre participation'; this.disabled = true;");
	}
	else
	{
		MZ_xmlhttpRequest({
				method: 'GET',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				}});
	}
}

traiteCdM();
traitePouvoir();