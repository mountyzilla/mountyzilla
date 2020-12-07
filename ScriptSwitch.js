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

// vérif UTF-8 ş (le site servant ce script doit gérer l'encodage dans l'entête HTTP, c'est le cas du serveur Raistlin)

// script qui charge dynamiquement les autres scripts

try {

var MZ_Switch = {
	ChangeLog: [
		"V1.1.3 20/01/2020 Poissotron actif par défaut sur mhp.mh",
		"V1.1.2 15/12/2019 ajout du Poissotron V2",
		"V1.1.1 11/07/2018 retour MZ sur greasyfork qui est plus réactif",
		"V1.1 19/03/2018 disable ou delete des scripts persos",
		"V1.0 20/10/2017 multiscript",
		],

	listeScript: {
		'Mountyzilla': 'https://greasyfork.org/scripts/23602-tout-mz/code/Tout_MZ.user.js',
		'Poissotron': 'https://mz.mh.raistlin.fr/poissotron/js/poissotron.user.js',
		'Trajet_canvas': 'https://greasyfork.org/scripts/23887-trajet-des-gowap-mkii/code/Trajet%20des%20gowap%20MkII.user.js',
		'Capitan': 'https://greasyfork.org/scripts/23991-capitan/code/Capitan.user.js',
		'Grattage': 'https://greasyfork.org/scripts/23993-grattagefd/code/GrattageFD.user.js',
		'Messagerie': 'https://greasyfork.org/scripts/23992-messagerie/code/Messagerie.user.js',
		'Telek': 'https://greasyfork.org/scripts/24709-mh-raistlin-pr%C3%A9s%C3%A9lection-t%C3%A9l%C3%A9k/code/MH%20-%20Raistlin%20-%20Pr%C3%A9s%C3%A9lection%20T%C3%A9l%C3%A9k.user.js',
		},


// pour les tests, utiliser https://mzdev.mh.raistlin.fr
	listeScriptDEV: {
		//'Mountyzilla': 'https://cdn.rawgit.com/AlainArachnid/mountyzilla/MZ-extern/Tout_MZ.user.js',
		'Mountyzilla': 'https://mz.mh.raistlin.fr/mzdev/js/Tout_MZ.user.js',
		'Poissotron': 'https://mz.mh.raistlin.fr/poissotron/js/poissotron.user.js',
		'Trajet_canvas': 'https://greasyfork.org/scripts/23887-trajet-des-gowap-mkii/code/Trajet%20des%20gowap%20MkII.user.js',
		'Capitan': 'https://greasyfork.org/scripts/23991-capitan/code/Capitan.user.js',
		'Grattage': 'https://greasyfork.org/scripts/23993-grattagefd/code/GrattageFD.user.js',
		'Messagerie': 'https://greasyfork.org/scripts/23992-messagerie/code/Messagerie.user.js',
		'Telek': 'https://greasyfork.org/scripts/24709-mh-raistlin-pr%C3%A9s%C3%A9lection-t%C3%A9l%C3%A9k/code/MH%20-%20Raistlin%20-%20Pr%C3%A9s%C3%A9lection%20T%C3%A9l%C3%A9k.user.js',
		},

	URL_XPATH: 'https://mz.mh.raistlin.fr/mz/js/mz-xpath.js',
	URL_XPATH_DEV: 'https://mz.mh.raistlin.fr/mzdev/js/mz-xpath.js',

	init: function() {
		this.bDev = window.location.host.indexOf('dev') >= 0;
		this.injectAllScripts();
		if (this.bDev) window.console.log('MZ_switch mode DEV, url=' + window.location);

		// injection de notre outil de configuration sur la page 'Options/Play_o_Interface.php
		if (window.location.pathname.indexOf('Options/Play_o_Interface.php') >= 0) this.insertBlocConfig();
	},

	injectOneScript: function(url, defer) {
		var head = window.head;
		if (!head) head = document.getElementsByTagName('head')[0];	// IE ancien
		var script = document.createElement("script");
		script.src = url;
		if (this.bDev) window.console.log('MZ_switch mode DEV, injection de ' + url);
		if (defer) script.defer = true;
		head.appendChild(script);
	},

	injectAllScripts: function() {
		// charger la liste de scripts
		var tabKnownScript;
		if (this.bDev) {
			if (document.evaluate === undefined)
				MZ_add_script(URL_XPATH_DEV, true);
			tabKnownScript = this.listeScriptDEV;
		} else {
			if (document.evaluate === undefined)
				MZ_add_script(URL_XPATH, true);
			tabKnownScript = this.listeScript;
		}
		// scripts connus
		for (var k in tabKnownScript) {
			if (!this.isActiv(k)) continue;
			this.injectOneScript(tabKnownScript[k], true);
		}
		// scripts perso
		var tabScriptPerso = this.getScriptPerso();
		for (var i = 0, l= tabScriptPerso.length; i < l; i++) {
			if (!tabScriptPerso[i].enabled) continue;
			this.injectOneScript(tabScriptPerso[i].script, true);
		}
	},

	isActiv: function(k) {
		var activ = window.localStorage.getItem('MZ_SW_' + k);
		if (activ == undefined) {
			if (k == 'Mountyzilla') {
				activ = true;	// Mountyzilla actif par défaut
			} else if (k == 'Poissotron') {
				activ = window.location.href.includes('mhp.mh');	// Le poissotron est actif par défaut sur mhp.mh....
				//window.console.log('Poissotron href=' + window.location.href + ', activ=' + activ);
			} else {
				activ = false;	// les autres sont inactifs par défaut
			}
		} else {
			activ = activ == 0 ? false : true; // le localStorage est mal adapté aux booléens :(
		}
		return activ;
	},

	// rend un tableau d'objets, chaque objet a une propriété key, une propriété script et une propriété enabled
	getScriptPerso: function() {
		var tabRet = new Array;
		var localScripts = window.localStorage.getItem('MZ_SW__perso');
		if (localScripts != undefined) {
			var tabLocalScript = localScripts.split(/;/);
			for (var i = 0, l = tabLocalScript.length; i < l; i+=2) {
				var script = tabLocalScript[i+1];
				if (script.substr(0, 1) == '*') {
					var enabled = false;
					script = script.substr(1);
				} else {
					var enabled = true;
				}
				tabRet.push({'key': tabLocalScript[i], 'script': script, 'enabled': enabled});
			}
		}
		return tabRet;
	},

	// reçoit un tableau d'objets, chaque objet a une propriété key, une propriété script et une propriété enabled
	setScriptPerso: function(tabScriptPerso) {
		if (tabScriptPerso == undefined) {
			window.localStorage.removeItem('MZ_SW__perso');
			return;
		}
		var l = tabScriptPerso.length;
		if (l == 0) {
			window.localStorage.removeItem('MZ_SW__perso');
			return;
		}
		var tabStr = new Array;
		for (var i=0; i < l; i++) {
			var oScript = tabScriptPerso[i];
			tabStr.push(oScript.key);
			if (oScript.enabled)
				tabStr.push(oScript.script);
			else
				tabStr.push('*' + oScript.script);
		}
		window.localStorage.setItem('MZ_SW__perso', tabStr.join(';'));
	},

	displayMsg: function(msg, tr) {
		if (!tr) {
			//console.log('msg: ' + msg);
			alert(msg);
			return;
		}
		var prevMsgEle = document.getElementById('MZ_Switch_msg');
		if (prevMsgEle) prevMsgEle.parentNode.removeChild(prevMsgEle);
		var msgEle = document.createElement('span');
		msgEle.id = 'MZ_Switch_msg';
		msgEle.style.color = 'purple';
		msgEle.appendChild(document.createTextNode(' [' + msg + ']'));
		tr.cells[2].appendChild(msgEle);
	},

	onCheckChange: function() {
		var k = this.id.substr(6, 99);
		var tr = this.parentNode.parentNode;
		//console.log('id=' + this.id + ', k=' + k);
		if (this.checked) {
			if (this.MZ_perso) {
				var tabScriptPerso = MZ_Switch.getScriptPerso();
				for (var i = tabScriptPerso.length - 1; i >= 0; i--) {
					if (tabScriptPerso[i].key != k) continue;
					tabScriptPerso[i].enabled = true;
				}
				MZ_Switch.setScriptPerso(tabScriptPerso);
			} else {
				window.localStorage.setItem('MZ_SW_' + k, 1);
			}
			MZ_Switch.displayMsg('Le script ' + k + ' a été activé', tr);
		} else {
			if (this.MZ_perso) {
				var tabScriptPerso = MZ_Switch.getScriptPerso();
				for (var i = tabScriptPerso.length - 1; i >= 0; i--) {
					if (tabScriptPerso[i].key != k) continue;
					tabScriptPerso[i].enabled = false;
				}
				MZ_Switch.setScriptPerso(tabScriptPerso);
			} else {
				window.localStorage.setItem('MZ_SW_' + k, 0);
			}
			MZ_Switch.displayMsg('Le script ' + k + ' a été désactivé', tr);
		}
	},

	onAddClick: function() {
		//console.log('addClick, this=', this);
		var key = document.getElementById('MZ_SW-2').value.replace(/^\s+|\s+$/gm,'');
		var script = document.getElementById('MZ_SW-3').value.replace(/^\s+|\s+$/gm,'');
		if (key == '') {
			alert('Il faut donner un nom à ce script');
			return;
		}
		if (!script.match(/^(https*|file):\/\//i)) {
			alert('il faut donner une URL commençant par http://, https:// ou file://');
			return;
		}
		// obtenir la liste des scripts perso
		var tabScriptPerso = MZ_Switch.getScriptPerso();
		// ajouter ce script
		tabScriptPerso.push({'key': key, 'script': script, 'enabled': true});
		// sauver la liste des scripts perso
		MZ_Switch.setScriptPerso(tabScriptPerso);
		MZ_Switch.displayMsg('Le script ' + key + ' a été ajouté');
		// refresh de la frame pour afficher à nouveau la liste des scripts
		document.location.href = document.location.href;
	},

	onDelete: function() {
		var k = this.parentNode.id.substr(7);
		console.log('onDelete, this=', this.parentNode, 'key=', k);
		var tabScriptPerso = MZ_Switch.getScriptPerso();
		var nDeleted = 0;
		for (var i = tabScriptPerso.length - 1; i >= 0; i--) {
			if (tabScriptPerso[i].key != k) continue;
			tabScriptPerso.splice(i, 1);
			nDeleted++;
		}
		MZ_Switch.setScriptPerso(tabScriptPerso);
		if (nDeleted == 1)
			MZ_Switch.displayMsg('Le script ' + k + ' a été supprimé');
		else
			MZ_Switch.displayMsg(nDeleted + ' script(s) ont été supprimé(s). C\'est étrange');
		// refresh de la frame pour afficher à nouveau la liste des scripts
		document.location.href = document.location.href;
	},

	addTrScript: function(tbody, activ, perso, key, script) {
		var tr = document.createElement('tr');
		tr.className = 'mh_tdpage';
		tr.id = 'MZ_SW2_' + key;
		// cache à cocher
		var td = document.createElement('td');
		var input = document.createElement('input');
		input.className = 'TextboxV2';
		input.type = 'checkbox';
		input.name = 'MZ_SW_' + key;
		input.id = 'MZ_SW_' + key;
		input.checked = activ;
		input.onchange = this.onCheckChange;
		input.MZ_perso = perso;
		td.appendChild(input);
		tr.appendChild(td);
		// nom
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(key));
		tr.appendChild(td);
		// URL
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(script));
		tr.appendChild(td);
		// delete
		var td = document.createElement('td');
		if (perso) {
			// bouton "Supprimer"
			var input = document.createElement('a');
			input.appendChild(document.createTextNode('Supprimer'));
			td.onclick = this.onDelete;
			td.style.cursor = 'pointer';
			td.style.color = 'blue';
			td.style.textDecoration = 'underline';
			td.appendChild(input);
		}
		tr.appendChild(td);
		tbody.appendChild(tr);
	},

	insertBlocConfig: function() {
		// gestion des scripts dans la page "Pack Graphique"
		var insertPoint = document.getElementById('footer1');
		if (!insertPoint) insertPoint = document.getElementById('footer');	// mode smartphone

		// aérer
		insertPoint.parentNode.insertBefore(document.createElement('p'),insertPoint);

		// titre
		var ti = document.createElement('div');
		ti.className = 'titre2';
		ti.appendChild(document.createTextNode('Mountyzilla : Scripts complémentaires'));
		insertPoint.parentNode.insertBefore(ti, insertPoint);

		// liste de scripts
		var table = document.createElement('table');
		table.width = '98%';
		table.border = 0;
		table.align = 'center';
		table.cellPadding = 2;
		table.cellSpacing = 1;
		table.className =  'mh_tdborder';
		table.id = 'MZ_switch_table';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPoint.parentNode.insertBefore(table, insertPoint);

		var tabKnownScript = this.bDev ? this.listeScriptDEV : this.listeScript;
		for (var k in tabKnownScript) {
			this.addTrScript(tbody, this.isActiv(k), false, k, decodeURIComponent(tabKnownScript[k]));
		}
		// scripts persos
		var tabScriptPerso = MZ_Switch.getScriptPerso();
		if (tabScriptPerso != undefined) {
			for (var i = 0, l = tabScriptPerso.length; i < l; i++) {
				var oScript = tabScriptPerso[i];
				this.addTrScript(tbody, oScript.enabled, true, oScript.key, oScript.script);
			}
		}
		// ligne vide
		var tr = document.createElement('tr');
		tr.className = 'mh_tdpage';
		// bouton "add"
		var td = document.createElement('td');
		var input = document.createElement('a');
		input.appendChild(document.createTextNode('Ajouter'));
		td.onclick = this.onAddClick;
		td.style.cursor = 'pointer';
		td.style.color = 'blue';
		td.style.textDecoration = 'underline';
		td.appendChild(input);
		tr.appendChild(td);
		// nom
		var td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'text';
		input.id = 'MZ_SW-2';
		input.style.width = '60px';
		td.appendChild(input);
		tr.appendChild(td);
		// URL
		var td = document.createElement('td');
		input = document.createElement('input');
		input.type = 'text';
		input.id = 'MZ_SW-3';
		input.style.width = '500px';
		td.appendChild(input);
		tr.appendChild(td);
		td = document.createElement('td');
		tr.appendChild(td);
		tbody.appendChild(tr);
	},
}

MZ_Switch.init();

} catch(e) {
	window.console.log('[MH Script switcher] catch general page ' + window.location.pathname + "\n" + e.message);
	window.console.log(e.stack);
}
