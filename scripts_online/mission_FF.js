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

/* TODO
 * MZ2.0 : ajouter un nettoyage sur la page de la liste des missions
 */

function saveMission(num,obEtape) {
	var obMissions = {};
	if(MZ_getValue(numTroll+'.MISSIONS')) {
		try {
			obMissions = JSON.parse(MZ_getValue(numTroll+'.MISSIONS'));
		}
		catch(e) { console.error('Erreur Mission:\n'+e) }
	}
	obMissions[num] = obEtape;
	window.alert(JSON.stringify(obMissions));
	MZ_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
}

function traiteMission() {
	try {
		var titreMission = document.getElementsByClassName('titre2')[0];
		var numMission = titreMission.textContent.match(/\d+/);
		var missionForm = document.getElementsByName('ActionForm')[0];
		var tdLibelle = document.evaluate(
			"./table/tbody/tr/td/input[starts-with(@value,'Valider')]/../../td[2]",
			missionForm, null, 9, null).singleNodeValue;
		/*window.alert(
			titreMission.textContent+'\n'+
			numMission+'\n'+
			missionForm.name+'\n'+
			tdLibelle.textContent
		);*/
	} catch(e) { console.error(e); return; }
	if(!numMission || !tdLibelle) { return; }
	
	var libelle = trim(tdLibelle.textContent);
	var siMundidey = libelle.indexOf('Mundidey')!=-1;
	if(libelle.indexOf('niveau égal à')!=-1) {
		var nbKills = 1, niveau, mod;
		if(tdLibelle.firstChild.nodeValue.indexOf('niveau égal à')==-1) {
			// Étape de kill multiple de niveau donné
			nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			niveau = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
			// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
			mod = tdLibelle.childNodes[4].nodeValue.match(/\d+/);
			mod = mod ? Number(mod) : 'plus';
		}
		else {
			// Étape de kill unique de niveau donné
			niveau = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
			mod = mod ? mod : 'plus';
		}
		saveMission(numMission,{
			type: 'Niveau',
			nbKills: nbKills,
			niveau: niveau,
			mod: mod,
			mundidey: siMundidey,
			libelle: libelle
		});
	}
	else if(libelle.indexOf('de la race')!=-1) {
		var nbKills = 1, race;
		if(tdLibelle.firstChild.nodeValue.indexOf('de la race')==-1) {
			// Étape de kill multiple de race donnée
			nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			race = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
		}
		else {
			// Étape de kill unique de race donnée
			race = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
		}
		saveMission(numMission,{
			type: 'Race',
			nbKills: nbKills,
			race: race.replace(/\"/g,''),
			mundidey: siMundidey,
			libelle: libelle
		});
	}
	else if(libelle.indexOf('de la famille')!=-1) {
		var nbKills = 1, famille;
		if (tdLibelle.firstChild.nodeValue.indexOf('de la famille')==-1) {
			// Étape de kill multiple de famille donnée
			nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			famille = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
		}
		else {
			// Étape de kill unique de famille donnée
			famille = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
		}
		saveMission(numMission,{
			type: 'Famille',
			nbKills: nbKills,
			famille: famille,
			mundidey: siMundidey,
			libelle: libelle
		});
	}
	else if(enonce.indexOf('capacité spéciale')!=-1) {
		var pouvoir = epure(trim(tdLibelle.childNodes[1].firstChild.nodeValue));
		saveMission(numMission,{
			type: 'Pouvoir',
			pouvoir: pouvoir,
			libelle: libelle
		});
	}
}

start_script(60);

/* DEBUG : pour nettoyage */
MZ_removeValue(numTroll+'.MISSION');
traiteMission();

displayScriptTime();
