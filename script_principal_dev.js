/*******************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv LIGNE A EDITER vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
var scriptsDev = "file:///répertoire_du_repo_git/scripts_online/";
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var scriptsMZ = "http://mountyzilla.tilk.info/scripts_0.9/";

function isPage(url) {
	return window.location.pathname.indexOf("/mountyhall/"+url) == 0;
}

function chargerScriptMZ(script) {
	// (mauvaise) Détection du chargement de la page
	if(document.getElementsByTagName("A").length>0) {
		MZ_appendNewScript(
			script.indexOf("http://") != -1 ?
				script :
				scriptsMZ+script+"_FF.js"
		);
	}
}

function chargerScriptDev(script) {
	if(document.getElementsByTagName("A").length>0) {
		window.console.debug(
			"[MZ-main] loading: "+script+" on: "+window.location.pathname
		);
		MZ_appendNewScript(scriptsDev+script+"_FF.js");
	}
}

/*--------------------------------- Dispatch ---------------------------------*/

chargerScriptDev("libs");
chargerScriptDev("ALWAYS");

// Détection de la page à traiter
if(isPage("Messagerie/ViewMessageBot")) {
	chargerScriptDev("cdmbot");
} else if(isPage("MH_Play/Actions/Competences/Play_a_Competence16b")) {
	chargerScriptDev("cdmcomp");
} else if(isPage("MH_Guildes/Guilde_o_AmiEnnemi")) {
	chargerScriptDev("diplo");
} else if(isPage("MH_Play/Play_equipement")) {
	chargerScriptDev("equip");
} else if(isPage("MH_Play/Play_menu")) {
	chargerScriptDev("menu");
} else if(isPage("MH_Play/Options/Play_o_Interface") ||
	isPage("installPack")) {
	chargerScriptDev("option");
} else if(isPage("View/PJView")) {
	chargerScriptDev("pjview");
} else if(isPage("MH_Play/Play_profil")) {
	chargerScriptDev("profil");
} else if(isPage("MH_Taniere/TanierePJ_o_Stock") ||
	isPage("MH_Comptoirs/Comptoir_o_Stock")) {
	chargerScriptDev("tancompo");
} else if(isPage("MH_Play/Play_vue")) {
	chargerScriptDev("vue");
} else if(isPage("MH_Play/Play_news")) {
	chargerScriptDev("news");
} else if(isPage("MH_Play/Actions/Play_a_Move") ||
	isPage("MH_Lieux/Lieu_Teleport")) {
	chargerScriptDev("move");
} else if(isPage("MH_Missions/Mission_Etape")) {
	chargerScriptDev("mission");
} else if(isPage("View/MonsterView")) {
	chargerScriptDev("infomonstre");
} else if(isPage("MH_Play/Actions/Play_a_Attack")) {
	chargerScriptDev("attaque");
} else if(isPage("MH_Follower/FO_Ordres")) {
	chargerScriptDev("ordresgowap");
} else if(isPage("MH_Follower/FO_Equipement")) {
	chargerScriptDev("equipgowap");
} else if(isPage("MH_Play/Play_mouche")) {
	chargerScriptDev("mouches");
} else if(isPage("MH_Play/Play_BM")) {
	chargerScriptDev("malus");
} else if(isPage("MH_Play/Play_evenement")) {
	chargerScriptDev("myevent");
} else if(isPage("MH_Lieux/Lieu_DemanderEnchantement")) {
	chargerScriptDev("enchant");
} else if(isPage("MH_Lieux/Lieu_Enchanteur")) {
	chargerScriptDev("pre-enchant");
}

if(isPage("MH_Play/Actions") ||
	isPage("Messagerie/ViewMessageBot")) {
	chargerScriptDev("actions");
}
