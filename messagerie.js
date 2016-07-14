/*
 * Script MZ : Affiche un aperçu lors de l'écriture des MP / Blocs Html
 *             Gère les 'Re :' multiples dans les titres
 * Auteurs : Bandedrubor (93138) / Kassbinette (95429) / disciple (62333) / Accaorrillia (71876)
 */

/* Lancement du script selon la page chargée */
if (isPage("Messagerie/MH_Messagerie.php?cat=3")) {

	// Ajout d'un bouton après le bouton "Envoyer"
	function addButton(caption, clickFunction) {
		var sendButton = document.getElementsByName('bsSend')[0];
		var newButton = document.createElement('input');
		newButton.setAttribute('type', 'button');
		newButton.setAttribute('class', 'mh_form_submit');
		newButton.setAttribute('value', caption);
		newButton.addEventListener('click', clickFunction, true);
		sendButton.parentNode.appendChild(document.createTextNode(' '));
		sendButton.parentNode.appendChild(newButton);
	};

  function wordwrap(str, width, brk, cut) {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
    if(!str)  return str;
    var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
    return str.match(RegExp(regex, 'g')).join(brk);
  }

	// Affichage de l'aperçu
	function display() {
		//tdPreview.innerHTML = messageArea.value.replace(/\r?\n/g, '<br>');
    tdPreview.innerHTML = "<div style='white-space: pre-line;'>" + wordwrap(messageArea.value) + "</div>";
	};

	// Sauvegarde du MP
	function save() {
		if(titleInput.value != '') MZ_setValue('lastMPTitle', titleInput.value);
		if(messageArea.value != '') MZ_setValue('lastMP', messageArea.value);
	};

	// Restauration du MP sauvegardé
	function restore() {
		if(MZ_getValue('lastMPTitle')) titleInput.value = MZ_getValue('lastMPTitle');
		if(MZ_getValue('lastMP')) messageArea.value = MZ_getValue('lastMP');
		display();
	};

	// Restauration du MP sauvegardé
	function reply() {
		if(MZ_getValue('lastReply')) messageArea.value = MZ_getValue('lastReply');
		display();
	};

	//-- Trõlldûctéûr --
	function trollducteur() {
		messageArea.value = messageArea.value
			.replace(/°*y°*/g, '°y°')
			.replace(/a/g, 'à')
			.replace(/e/g, 'é')
			.replace(/i/g, 'ï')
			.replace(/o/g, 'õ')
			.replace(/u/g, 'û')
			.replace(/A/g, 'À')
			.replace(/E/g, 'É')
			.replace(/I/g, 'Ï')
			.replace(/O/g, 'Õ')
			.replace(/U/g, 'Û');
		display();
	};

	//-- ajout string mettant un bloc 'quote' --
	function addQuote()      { addTagToSelectedText("<fieldset><legend></legend>", "</fieldset>"); };
	function addBold()       { addTagToSelectedText("<b>", "</b>"); };
	function addItalic()     { addTagToSelectedText("<i>", "</i>"); };
	function addUnderscore() { addTagToSelectedText("<u>", "</u>"); };

	function addTagToSelectedText(startTag, endTag) {
		var len = messageArea.value.length;
		var start = messageArea.selectionStart;
		var end = messageArea.selectionEnd;
		var sel = messageArea.value.substring(start, end);
		if (sel == "" || sel == null) sel = "copier le texte ici";

		// This is the selected text and alert it
		var replace = startTag + sel + endTag;

		// Here we are replacing the selected text with this one
        	messageArea.value = messageArea.value.substring(0, start)
		                  + replace
		                  + messageArea.value.substring(end, len);
	}

	// Titre du MP - replace many "Re:" or "Re(n):" in message reply by a single 'Re(n):" where n is the number of replies
	var titleInput = document.getElementsByName('Titre')[0];
  if (titleInput && titleInput.value != '') {
    myarray = titleInput.value.match(/(Re\s+:)/g);
    var myarray2 = titleInput.value.match(/Re\(\d+\)\s+:/g); // extract the Re(n) to an array like [Re(n),Re(o),Re(p)...]
    if (myarray2 == null ) {
      titleInput.value = titleInput.value.replace(/^(Re\s+:\s+)*/,"Re(" + myarray.length + ") : ");
    } else {
      var ctr = 0;
      myarray2 = myarray2.join(); // transform the array to a string  in order to be able to use the match function
      myarray2 = myarray2.match(/\d+/g); // extract the numbers only in an array
      for (var i = 0; i < myarray2.length; i++) {ctr = ctr + (myarray2[i] * 1)};  // la multiplication par 1 est pour transformer la string en number
      titleInput.value = titleInput.value.replace(/^Re(.*)\s+:\s+/,"Re(" + (myarray.length + ctr) + ") : ");
    }
  }


	// Case de texte du MP
	var messageArea = document.getElementsByName('Message')[0];

	// Aperçu à la frappe
	messageArea.addEventListener('change', display, true);
	messageArea.addEventListener('keyup', display, true);

	// Ajout de la ligne d'affichage de l'aperçu
	var trPreview = document.createElement('tr');
	trPreview.setAttribute('class', 'mh_tdpage');
	var tdPreview = document.createElement('td');
	tdPreview.setAttribute('colspan', 4);
	trPreview.appendChild(tdPreview);
//	document.getElementsByTagName('form')[0].getElementsByTagName('table')[2].getElementsByTagName('tbody')[0].appendChild(trPreview);
  document.getElementsByName('bsSend')[0].parentNode.parentNode.parentNode.appendChild(trPreview);

	// Enregistrement du message à l'envoi
	document.getElementsByName('bsSend')[0].addEventListener('click', save, true);

	// Ajout du bouton d'aperçu
	addButton('Aperçu', display);

	// Ajout du bouton de sauvegarde
	addButton('Sauvegarder', save);

	// Ajout du bouton de restauration
	addButton('Rappeler le dernier message', restore);

	// Ajout du bouton de citation
	addButton('Citer en réponse', reply);

	// Ajout du bouton du trollducteur
	addButton('Trõlldûctéûr', trollducteur);

	addButton('B', addBold);
	addButton('I', addItalic);
	addButton('S', addUnderscore);
	addButton('Quote', addQuote);
}

else if(isPage("Messagerie/ViewMessage.php?answer=1")) {
	function reply(e) {
		var reply = document.evaluate("//table/tbody/tr[5]/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().innerHTML;
    //reply = wordwrap(reply, 73);
		reply = '> ' + reply.replace(/<br>/gm, '\n> ');
		MZ_setValue('lastReply', reply + '\n\n');
	};

	document.getElementsByName('bAnswer')[0].addEventListener('click', reply, true);
	document.getElementsByName('bAnswerToAll')[0].addEventListener('click', reply, true);
}
