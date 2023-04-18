// variables globales (c'est laid)
let canevasTGV;
let listeDestination=[];
let fixToolTip=false;
let destinationCourante = {"x":0,"y":0,"n":0};
let maxXY = 110;
let multiplicateur = 3;

function isPage(url) {
        return 0 <= window.location.href.indexOf(url);
}

function recupListeTGV(destination = destinationCourante){
// récupération de  liste des gares dans le tableau 
	let trList = document.getElementById("portail").getElementsByTagName("tbody")[0].getElementsByTagName('tr');
	for (let tr of trList) {
		var objDestination = {};
		objDestination.nom = tr.childNodes[1].textContent;
		objDestination.x = tr.childNodes[3].textContent;
		objDestination.y = tr.childNodes[5].textContent;
		objDestination.n = tr.childNodes[7].textContent;
		objDestination.prix = tr.childNodes[9].textContent;
		//objDestination.distance = Math.max(Math.abs(objDestination.x - destination.x), Math.abs(objDestination.y - destination.y),Math.abs(objDestination.n - destination.n)) + Math.abs(objDestination.n - destination.n);
		objDestination.urlEmbarquer = tr.childNodes[13].innerHTML;
		listeDestination.push(objDestination);
	}
	return listeDestination;
}

function updateDestinationEvent(e){
	updateDestination(true);
}

function updateDestination(refreshLimites=false){
	let destinationString = document.getElementById("destination").value;
	if(destinationString.length > 0) {
		let destinationArray = destinationString.match(/-?\d+/g);

	       	destinationCourante.x = destinationArray[0];
	       	destinationCourante.y = destinationArray[1];
	       	destinationCourante.n = destinationArray[2];
		canevasTGV.getContext('2d').clearRect(multiplicateur * (parseInt(maxXY)+1+parseInt(destinationCourante.x)), multiplicateur * (parseInt(maxXY) + 1 - parseInt(destinationCourante.y)), multiplicateur, multiplicateur);
		for (let gare of listeDestination) {
			gare.distance = Math.max(Math.abs(gare.x - destinationCourante.x), Math.abs(gare.y - destinationCourante.y),(Math.abs(gare.n - destinationCourante.n))) + Math.abs(gare.n - destinationCourante.n);
		}
	        addGare(destinationCourante, "green", "Triangle", false);
	        addGare(origine, "red", "Cercle", true);
	}
        if(refreshLimites) {
		updateLimites();
	}
	
}

function updateLimitesEvent(e){
	updateLimites(true);
}
function updateLimites(refreshDestination=false) {
	canevasTGV.getContext('2d').clearRect( 0 ,0 ,multiplicateur * (maxXY * 2 + 1),multiplicateur * (maxXY * 2 + 1));
	let destinationString = document.getElementById("destination").value;
       	for (let gare of listeDestination) {
       	        if((destinationString.length <=0 || parseInt(gare.distance,10) <= parseInt(document.getElementById("limitePA").value)) && parseInt(gare.prix)  <= parseInt(document.getElementById("limiteGG").value)) {
			addGare(gare, "blue", "Rectangle", false);
		}
		else {
			addGare(gare, "black", "Rectangle", true);
		}
       	}
	addGare(origine, "red", "Cercle", true);
        addGare(destinationCourante, "green", "Triangle", false);
	if(refreshDestination) {
		updateDestination();
	}
	majDivListeDestinationOK();
}

function majDivListeDestinationOK() {
	let divCible = document.getElementById("destinationCriteresOK");
	let destinationString = document.getElementById("destination").value;
	let cibleTexte = "";

	cibleTexte = '<table border="5px solid" bordercolor="green">';
	for (let gare of listeDestination) {
		if((destinationString.length <=0 || parseInt(gare.distance,10) <= parseInt(document.getElementById("limitePA").value)) && parseInt(gare.prix)  <= parseInt(document.getElementById("limiteGG").value)) {
			cibleTexte += '<tr class="mh_tdpage"><td style="column-span:3">' + gare.nom + '</td><td>' + gare.urlEmbarquer + '</td></tr>';
			cibleTexte += '<tr class="mh_tdpage">';
			cibleTexte += '<td>X = ' + gare.x + ' | Y = ' + gare.y + ' | N = ' + gare.n;
			if(gare.hasOwnProperty('distance')) { cibleTexte += ' (dist : ' + gare.distance + ' pa)</td>'};
			cibleTexte += '<td>Prix = ' + gare.prix + '</td>';
			cibleTexte += '</tr>';
		}
	}
	cibleTexte += "</table>";
	divCible.innerHTML = cibleTexte;
}

function compareGG (gare1, gare2) {
	if (parseInt(gare1.prix) < parseInt(gare2.prix)) {return -1;}
	if (parseInt(gare1.prix) > parseInt(gare2.prix)) {return 1;}
	return 0;
}

function comparePA (gare1, gare2) {
	if (parseInt(gare1.distance) < parseInt(gare2.distance)) {return -1;}
	if (parseInt(gare1.distance) > parseInt(gare2.distance)) {return 1;}
	return 0;
}

function trierListe(e){
	let destinationString = document.getElementById("destination").value;
	if(e.target.id == "triPA" && destinationString.length <= 0) { return;}
	if(e.target.id == "triPA") {listeDestination.sort(comparePA);}
	else if (e.target.id == "triGG") {listeDestination.sort(compareGG);}
	majDivListeDestinationOK();
}

function insertionTableau(){
// insertion des différents hamps utilisés 
// point d'insertion (juste avant le tableau)
	let insertPoint =  document.getElementById("portail");

// insertion des champs X / Y / N de destination + du bouton MAJ
	let tableDestination = document.createElement("table");
	trDestination = tableDestination.insertRow();
	trDestination.class = "mh_tdpage";
	tdDestinationLabel = trDestination.insertCell();
	tdDestinationLabel.appendChild(document.createTextNode("Destination : "));

	tdDestination = trDestination.insertCell();
	inputDestination = document.createElement("input");
	inputDestination.type="text";
	inputDestination.id="destination";
	inputDestination.size=30;
	inputDestination.value="";
	tdDestination.appendChild(inputDestination);

// insertion des champs max du voyage (GG/PA)

        tdLimitesLabel = trDestination.insertCell();
        tdLimitesLabel.appendChild(document.createTextNode("Valeurs Max : "));
	tdlimitePA = trDestination.insertCell();
	tdlimitePA.appendChild(document.createTextNode("PA Max : "));
	inputPA = document.createElement("input");
        inputPA.type="text";
        inputPA.id="limitePA";
        inputPA.size=5;
        inputPA.value=25;
        tdlimitePA.appendChild(inputPA);

	tdlimitePA.appendChild(document.createTextNode(" GG Pax : "));
	inputGG = document.createElement("input");
        inputGG.type="text";
        inputGG.id="limiteGG";
        inputGG.size=5;
        inputGG.value=500;
        tdlimitePA.appendChild(inputGG);

	tdDestinationValid = trDestination.insertCell();
	submitDestinationInput = document.createElement("button");
	submitDestinationInput.id="submitDestination";
	submitDestinationInput.innerHTML="Valider";
	submitDestinationInput.onclick=updateDestination;
	tdDestinationValid.appendChild(submitDestinationInput);

	tableDestination = insertPoint.parentNode.insertBefore(tableDestination,insertPoint);

// critères de tris

	tdBoutonsTris = trDestination.insertCell();

        let triGG = document.createElement("button");
        triGG.id="triGG";
        triGG.innerHTML="Trier par co&ucirc;t";
        triGG.onclick=trierListe;
        tdBoutonsTris.appendChild(triGG);

        let triPA = document.createElement("button");
        triPA.id="triPA";
        triPA.innerHTML="Trier par PA";
        triPA.onclick=trierListe;
        tdBoutonsTris.appendChild(triPA);

// insertion du div globale
	let scriptDiv = document.createElement("div");
	scriptDiv.id="scriptDiv";
	scriptDiv = insertPoint.parentNode.insertBefore(scriptDiv,insertPoint);

// insertion de la zone d'affichage des infos des gares
	let infoDiv = document.createElement("div");
        infoDiv.id="infoDiv";
	infoDiv.style.display = "inline-block";
        infoDiv.style.float="left";
        infoDiv.style.overflow="visible";
        infoDiv.style.margin="20px";
        infoDiv = scriptDiv.insertBefore(infoDiv,scriptDiv.firstChild);

// insertion du div pour les gares correspondant aux critères

        let destinationCriteres = document.createElement("div");
	destinationCriteres.id="destinationCriteresOK";
	destinationCriteres.style.overflow="visible";
        destinationCriteres = infoDiv.insertBefore(destinationCriteres,infoDiv.firstChild);

// les tooltips

        let toolTip = document.createElement("div");
	toolTip.id="gareToolTip";
	toolTip.style.overflow="visible";
        toolTip = infoDiv.insertBefore(toolTip,destinationCriteres);

// affichage du canevas avec la carte du hall
	let canevasDiv = document.createElement("div");
	canevasDiv.id = "canevasDiv";
	canevasDiv.style.display = "inline-block";
	canevasDiv.style.float = "left";
	canevasDiv = scriptDiv.insertBefore(canevasDiv,scriptDiv.firstChild);

	canevasTGV = document.createElement("canvas");
	canevasTGV.id = "canevasTGV";
	canevasTGV.width = multiplicateur * (maxXY * 2 + 1);
	canevasTGV.height = multiplicateur * (maxXY * 2 + 1);
	canevasTGV.style.border = "1px solid #000";
	canevasTGV.style.display = "inline-block";
	canevasTGV.style.margin = "20px";
	canevasTGV = canevasDiv.insertBefore(canevasTGV,canevasDiv.firstChild);
	canevasTGV.addEventListener("mousemove", gererToolTip);
	canevasTGV.addEventListener("click", gererToolTip);
}

function addGare(objetGare, couleurPoint, formePoint, rempli){
	contextTGV = canevasTGV.getContext('2d');
	contextTGV.fillStyle = couleurPoint;
	contextTGV.strokeStyle = couleurPoint;
	contextTGV.lineWidth = 1;

	contextTGV.beginPath();
	if(formePoint == "Rectangle" && rempli ){
	        contextTGV.rect(multiplicateur * (parseInt(maxXY)+1+parseInt(objetGare.x)), multiplicateur * (parseInt(maxXY) + 1 - parseInt(objetGare.y)), multiplicateur, multiplicateur);
	}
	else if (formePoint == "Rectangle" && !rempli) {
	        contextTGV.strokeRect(multiplicateur * (parseInt(maxXY)+1+parseInt(objetGare.x)), multiplicateur * (parseInt(maxXY) + 1 - parseInt(objetGare.y)), multiplicateur, multiplicateur);
	}
	else if (formePoint == "Cercle") {
		centreX = multiplicateur * (parseInt(maxXY,10) + 1 + parseInt(objetGare.x,10)) + multiplicateur / 2;
		centreY = multiplicateur * (parseInt(maxXY,10) + 1 - parseInt(objetGare.y,10)) + multiplicateur / 2;
		contextTGV.arc(centreX, centreY, multiplicateur/2, 0, 2 * Math.PI);	
	}
	else if (formePoint == "Triangle") {
                xPoint1 = multiplicateur * (  parseInt(maxXY,10) + parseInt(objetGare.x,10) + 0 ) + 1 ;
                yPoint1 = multiplicateur * (  parseInt(maxXY,10) - parseInt(objetGare.y,10) + 2 ) + 1 ;
                xPoint2 = multiplicateur * (  parseInt(maxXY,10) + parseInt(objetGare.x,10) + 2 ) + 1 ;
                yPoint2 = multiplicateur * (  parseInt(maxXY,10) - parseInt(objetGare.y,10) + 2 ) + 1 ;
                xPoint3 = multiplicateur * (  parseInt(maxXY,10) + parseInt(objetGare.x,10) + 1 ) + 1 ;
                yPoint3 = multiplicateur * (  parseInt(maxXY,10) - parseInt(objetGare.y,10) + 0 ) + 1 ;
                contextTGV.moveTo(xPoint1,yPoint1);
		contextTGV.lineTo(xPoint2,yPoint2);
		contextTGV.lineTo(xPoint3,yPoint3);
		contextTGV.closePath();
	}
	contextTGV.stroke();
	if(rempli) {
		contextTGV.fill();
	}
}

function gererToolTip(e) {
	let toolTip = document.getElementById("gareToolTip");
	let eventType = e.type;

	if(eventType=="click" && toolTip.innerHTML != "" && !fixToolTip) {fixToolTip = true; return;}
	else if (eventType=="click" && toolTip.innerHTML != "" && fixToolTip) {toolTip.innerHTML = "";fixToolTip = false; return;}
	else if(eventType=="mousemove" &&  !fixToolTip ) {
		let coordonnesCanevas = canevasTGV.getBoundingClientRect();
		let coordonneesObjet = {"x" : Math.floor((e.clientX - coordonnesCanevas.left)/multiplicateur - parseInt(maxXY) -1), "y" : Math.floor(-((e.clientY - coordonnesCanevas.top)/multiplicateur - parseInt(maxXY) -2 ))};
		listeGares = recupGareParCoordonneesXY(coordonneesObjet.x,coordonneesObjet.y);
		if(listeGares.length > 0) {
			let tooTipText = "";
			tooTipText = '<table border="5px solid" bordercolor="red">';
			for (let gare of listeGares) {
				tooTipText += '<tr class="mh_tdpage"><td style="column-span:3">' + gare.nom + '</td><td>' + gare.urlEmbarquer + '</td></tr>';
				tooTipText += '<tr class="mh_tdpage">';
				tooTipText += '<td>X = ' + gare.x + ' | Y = ' + gare.y + ' | N = ' + gare.n;
				if(gare.hasOwnProperty('distance')) { tooTipText += ' (dist : ' + gare.distance + ' pa)</td>'};
				tooTipText += '<td>Prix = ' + gare.prix + '</td>';
				tooTipText += '</tr>';
				
			}
			tooTipText += "</table>";
			toolTip.innerHTML = tooTipText;
		}
		else {
        	        toolTip.innerHTML = "";
		}
	}
}
  
function recupGareParCoordonneesXY(x,y){
	let listeGares = [];
	 for (let destination of listeDestination) {
		if (destination.x == x && destination.y == y) listeGares.push(destination);
	}	
	return listeGares;
}

if(isPage("mountyhall/MH_Lieux/Lieu_Portail.php")){
	trollCourant = localStorage.getItem("NUM_TROLL");
	let clePositionX = trollCourant+".position.X";
	let clePositionY = trollCourant+".position.Y";
	origine = {"x":localStorage.getItem(clePositionX), "y":localStorage.getItem(clePositionY), "n" : localStorage.getItem(trollCourant+".position.N")};

	recupListeTGV();
	insertionTableau();
	listeDestination.sort(compareGG);	
	updateDestination(true);
	
}


