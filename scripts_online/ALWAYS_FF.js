window.console.debug('GOD MODE ON: +Invi +Projo +Telek +Charger');
MZ_setValue(numTroll+'.talent.Invi',80);
MZ_setValue(numTroll+'.talent.Projo',80);
MZ_setValue(numTroll+'.talent.Telek',80);
MZ_setValue(numTroll+'.talent.Charger',90);

/*window.alert(
	window.location.toString()+'\n'+
	window.self.location.toString()+'\n'+
	window.location.href+'\n'+
	currentURL
);*/

/*try{
var node = document.evaluate("//table[@id='no_way_in_hell']", document, null, 9, null).singleNodeValue;
// pas d'erreur
var test = node.nodeValue;
// erreur
}
catch(e) {window.alert('smooth')}*/

function zalert() {
	window.alert(
		'From: '+window.location+'\n'+
		'To: '+window.top.location+'\n'+
		'Main (Play2): '+window.top.Main.location+'\n'+
		'Contenu (Play2/Top): '+window.top.Main.Contenu.location
	);
}

function faitLeDiv() {
	var div = window.top.Main.Contenu.document.createElement('div');
	div.id = 'leDiv';
	window.top.Main.Contenu.document.body.appendChild(div);
}

function choppeLeDiv() {
	var leDiv = window.top.Main.Contenu.document.getElementById('leDiv');
	appendText(leDiv,'Olé.');
}

if(isPage('MH_Play/Play_menu')
	|| false) {
	//zalert();
}

/*window.alert(
	'ON! sur page:\n'+window.location
);*/

/*if(isPage('MH_Play/PlayStart')) {
	var date = DateToString(new Date());
	MZ_setValue('temp',date);
}
else if(isPage('MH_Play/TurnStart')) {
	window.alert('Heure lancement MH:\n'+MZ_getValue('temp'));
}*/

if(isPage('MH_Missions/Mission_Liste.php')) {
	avertissement(
		JSON.stringify(
			JSON.parse(MZ_getValue(numTroll+'.MISSIONS')),
			null,
			'\t'
		).
			replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;').
			replace(/\n/g,'<br />').
			replace(/\\\"/g,'"'),
		10000
	);
}

