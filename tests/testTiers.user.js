// ==UserScript==
// @name        test_externe_MZ
// @namespace   MH
// @description Test interaction script tiers et MZ
// @include     */mountyhall/*
// @exclude     *trolls.ratibus.net*
// @exclude     *it.mh.raistlin.fr*
// @exclude     *mh2.mh.raistlin.fr*
// @exclude     *mhp.mh.raistlin.fr*
// @exclude     *mzdev.mh.raistlin.fr*
// @version     1.9
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setValue
// ==/UserScript==

// vérif UTF-8 ş

try {
	var prevEtat;
	function MZTEST_Callback_init() {
		window.console.log("MZTEST_Callback_init a été appelé");
	}
	function MZTEST_Callback_fin_vue() {
		window.console.log("MZTEST_Callback_fin_vue a été appelé");
	}
	function MZTEST_wait_init() {
		var MZ_Etat = document.body.dataset.MZ_Etat;
		if (MZ_Etat !== prevEtat) {
			window.console.log("MZ_Etat=" + MZ_Etat);
			prevEtat = MZ_Etat;
		}
		setTimeout(MZTEST_wait_init, 500);
	}
	MZTEST_wait_init();
	if (document.body.MZ_Callback_init === undefined) {
		document.body.MZ_Callback_init = [MZTEST_Callback_init];
	} else {
		document.body.MZ_Callback_init.push(MZTEST_Callback_init);
	}
	window.console.log("MZTEST : set Callback_init");
	if (document.body.MZ_Callback_fin_vue === undefined) {
		document.body.MZ_Callback_fin_vue = [MZTEST_Callback_fin_vue];
	} else {
		document.body.MZ_Callback_fin_vue.push(MZTEST_Callback_fin_vue);
	}
	window.console.log("MZTEST : set Callback_fin_vue");
} catch(e) {
	window.console.log("catch général test_externe_MZ\n" + e.message);
}
