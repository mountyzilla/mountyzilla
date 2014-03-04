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

mh_caracs=new Array();
mh_templates=new Array();

// "Nom","Type","Att_Min","Att_Max","Deg_Min","Deg_Max","Esq_Min","Esq_Max","Arm_Min","Arm_Max","Vue_Min","Vue_Max","Reg_Min","Reg_Max","RM_Min","RM_Max","MM_Min","MM_Max","DLA_Min","DLA_Max","Tps_Min","Tps_Max"
mh_caracs["Armure d'Anneaux"]=new Array("Armure",0,0,0,0,-8,-8,8,8,0,0,0,0,99,180,0,0,0.00,0.00,80.00,80.00);
mh_caracs["Armure de bois"]=new Array("Armure",0,0,0,0,-3,-3,5,5,0,0,0,0,25,50,0,0,0.00,0.00,50.00,50.00);
mh_caracs["Armure de Cuir"]=new Array("Armure",0,0,0,0,0,0,2,2,0,0,0,0,11,30,0,0,0.00,0.00,10.00,20.00);
mh_caracs["Armure de peaux"]=new Array("Armure",0,0,0,0,-2,-2,4,4,0,0,0,0,21,60,0,0,0.00,0.00,40.00,45.00);
mh_caracs["Armure de pierre"]=new Array("Armure",0,0,0,0,-6,-6,12,12,0,0,0,0,60,150,0,0,0.00,0.00,120.00,120.00);
mh_caracs["Armure de Plates"]=new Array("Armure",0,0,0,0,-8,-5,10,10,0,0,0,0,50,100,0,0,0.00,0.00,100.00,100.00);
mh_caracs["Bottes"]=new Array("Bottes",0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Bouclier à Pointes"]=new Array("Bouclier",1,1,1,1,-1,-1,4,4,0,0,0,0,0,0,0,0,0.00,0.00,35.00,35.00);
mh_caracs["Boulet et chaîne"]=new Array("Arme",-3,-3,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,15.00,15.00);
mh_caracs["Bâtons de Parade"]=new Array("Arme",-4,-4,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0.00,0.00,7.50,7.50);
mh_caracs["Cagoule"]=new Array("Casque",0,0,0,0,1,1,0,0,-1,-1,0,0,0,0,6,10,0.00,0.00,2.50,2.50);
mh_caracs["Casque en cuir"]=new Array("Casque",0,0,0,0,0,0,1,1,0,0,0,0,6,10,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Casque en métal"]=new Array("Casque",0,0,0,0,0,0,2,2,-1,-1,0,0,6,10,0,0,0.00,0.00,10.00,10.00);
mh_caracs["Casque à cornes"]=new Array("Casque",0,0,1,1,-1,-1,0,3,-1,-1,0,3,6,10,0,0,0.00,0.00,10.00,10.00);
mh_caracs["Casque à Pointes"]=new Array("Casque",1,1,1,1,0,0,3,3,-1,-1,0,0,0,0,0,0,0.00,0.00,12.50,12.50);
mh_caracs["Chaîne Cloutée"]=new Array("Arme",-2,-2,4,4,1,1,0,0,0,0,0,0,0,0,0,0,0.00,0.00,35.00,35.00);
mh_caracs["Collier de dents"]=new Array("Talisman",0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,5.00,5.00,1.00,1.00);
mh_caracs["Collier de pierre"]=new Array("Talisman",0,0,0,0,0,0,0,0,0,0,0,0,6,10,6,10,0.00,0.00,2.50,2.50);
mh_caracs["Collier à Pointes"]=new Array("Talisman",0,0,1,1,-1,-1,1,1,0,0,0,0,0,0,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Cotte de Mailles"]=new Array("Armure",0,0,0,0,-3,-3,7,7,0,0,0,0,30,80,0,0,0.00,0.00,70.00,70.00);
mh_caracs["Coutelas d'Obsidienne"]=new Array("Arme",2,2,2,2,0,0,0,0,0,0,-2,-2,-10,-6,-30,-16,0.00,0.00,5.00,5.00);
mh_caracs["Coutelas en os"]=new Array("Arme",0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,4.00,4.00);
mh_caracs["Crochet"]=new Array("Arme",-2,-2,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,12.50,12.50);
mh_caracs["Cuir Bouilli"]=new Array("Armure",0,0,0,0,-1,-1,3,3,0,0,0,0,34,40,0,0,0.00,0.00,18.00,18.00);
mh_caracs["Cuirasse d'Ossements"]=new Array("Armure",0,0,0,0,-3,-3,5,5,0,0,0,0,16,30,16,30,0.00,0.00,68.00,68.00);
mh_caracs["Cuirasse d'écailles"]=new Array("Armure",0,0,0,0,-3,-3,6,6,0,0,0,0,30,70,0,0,0.00,0.00,60.00,60.00);
mh_caracs["Culotte en Cuir"]=new Array("Armure",0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Dague"]=new Array("Arme",0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Epée Courte"]=new Array("Arme",0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,10.00,10.00);
mh_caracs["Epée Longue"]=new Array("Arme",-2,-2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,20.00,20.00);
mh_caracs["Espadon"]=new Array("Arme",-6,-6,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,40.00,40.00);
mh_caracs["Fouet"]=new Array("Arme",4,4,-2,-2,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,7.00,7.00);
mh_caracs["Fourrures"]=new Array("Armure",0,0,0,0,0,0,2,2,0,0,0,0,16,30,0,0,0.00,0.00,10.00,15.00);
mh_caracs["Gantelet"]=new Array("Arme",-2,-2,1,1,1,1,0,2,0,0,0,2,0,0,0,0,0.00,0.00,7.50,7.50);
mh_caracs["Gorgeron en cuir"]=new Array("Talisman",0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Gorgeron en métal"]=new Array("Talisman",0,0,0,0,0,0,2,2,0,0,-1,-1,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Gourdin"]=new Array("Arme",-1,-1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,12.50,12.50);
mh_caracs["Gourdin clouté"]=new Array("Arme",-1,-1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,15.00,15.00);
mh_caracs["Gros'Porte"]=new Array("Bouclier",0,0,0,0,-1,-1,5,5,0,0,0,0,11,20,0,0,0.00,0.00,50.00,50.00);
mh_caracs["Grosse Stalagmite"]=new Array("Arme",-20,-20,28,28,-15,-15,0,0,-4,-4,0,0,0,0,0,0,0.00,0.00,125.00,125.00);
mh_caracs["Hache de Bataille"]=new Array("Arme",-4,-4,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,40.00,40.00);
mh_caracs["Hache de guerre en os"]=new Array("Arme",-4,-4,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,25.00,25.00);
mh_caracs["Hache de guerre en pierre"]=new Array("Arme",-10,-10,14,14,0,0,0,0,0,0,0,0,6,10,0,0,0.00,0.00,75.00,75.00);
mh_caracs["Hache à deux mains d'Obsidienne"]=new Array("Arme",-8,-8,16,16,0,0,0,0,0,0,-4,-4,-90,-50,-27,-16,0.00,0.00,75.00,75.00);
mh_caracs["Hallebarde"]=new Array("Arme",-10,-10,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,60.00,60.00);
mh_caracs["Haubert d'écailles"]=new Array("Armure",0,0,0,0,-4,-4,8,8,0,0,0,0,40,80,0,0,0.00,0.00,80.00,80.00);
mh_caracs["Haubert de mailles"]=new Array("Armure",0,0,0,0,-4,-4,9,9,0,0,0,0,40,90,0,0,0.00,0.00,90.00,90.00);
mh_caracs["Heaume"]=new Array("Casque",-1,-1,0,0,0,0,4,4,-2,-2,0,0,11,20,0,0,0.00,0.00,20.00,20.00);
mh_caracs["Jambières en cuir"]=new Array("Bottes",0,0,0,0,0,0,1,1,0,0,0,0,5,10,0,0,0.00,0.00,10.00,10.00);
mh_caracs["Jambières en fourrure"]=new Array("Bottes",0,0,0,0,0,0,1,1,0,0,0,0,6,10,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Jambières en maille"]=new Array("Bottes",0,0,0,0,-1,-1,3,3,0,0,0,0,6,10,0,0,0.00,0.00,20.00,20.00);
mh_caracs["Jambières en métal"]=new Array("Bottes",0,0,0,0,-2,-2,4,4,0,0,0,0,6,10,0,0,0.00,0.00,25.00,25.00);
mh_caracs["Jambières en os"]=new Array("Bottes",0,0,0,0,-1,-1,2,2,0,0,0,0,6,10,0,0,0.00,0.00,10.00,10.00);
mh_caracs["Lame d'Obsidienne"]=new Array("Arme",2,2,6,6,0,0,0,0,0,0,-3,-3,-60,-33,-20,-11,0.00,0.00,20.00,20.00);
mh_caracs["Lame en os"]=new Array("Arme",0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,7.00,7.00);
mh_caracs["Lame en pierre"]=new Array("Arme",-2,-2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,20.00,20.00);
mh_caracs["Lorgnons"]=new Array("Casque",0,0,0,0,-1,-1,0,0,1,1,0,0,0,0,6,10,0.00,0.00,2.50,2.50);
mh_caracs["Machette"]=new Array("Arme",1,1,2,2,-1,-1,0,0,0,0,0,0,0,0,0,0,0.00,0.00,20.00,20.00);
mh_caracs["Masse d'Arme"]=new Array("Arme",-1,-1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,15.00,15.00);
mh_caracs["Pagne de Mailles"]=new Array("Armure",0,0,0,0,2,2,1,1,0,0,0,0,0,0,0,0,0.00,0.00,7.50,7.50);
mh_caracs["Pagne en Cuir"]=new Array("Armure",0,0,0,0,2,2,-1,-1,0,0,0,0,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Rondache en bois"]=new Array("Bouclier",0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0.00,0.00,15.00,15.00);
mh_caracs["Rondache en métal"]=new Array("Bouclier",0,0,0,0,1,1,2,2,0,0,0,0,0,0,0,0,0.00,0.00,30.00,30.00);
mh_caracs["Sandales"]=new Array("Bottes",0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Talisman d'Obsidienne"]=new Array("Talisman",1,1,2,2,0,0,0,0,0,0,-4,-4,22,40,22,40,0.00,0.00,2.50,2.50);
mh_caracs["Talisman de pierre"]=new Array("Talisman",0,0,0,0,0,0,0,0,0,0,-1,-1,11,20,11,20,0.00,0.00,2.50,2.50);
mh_caracs["Targe"]=new Array("Bouclier",0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Torche"]=new Array("Arme",1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0.00,0.00,5.00,5.00);
mh_caracs["Torque de pierre"]=new Array("Talisman",0,0,0,0,0,0,0,0,0,0,-2,-2,22,40,22,40,0.00,0.00,2.50,2.50);
mh_caracs["Tunique"]=new Array("Armure",0,0,0,0,1,1,0,0,0,0,0,0,6,10,6,10,0.00,0.00,2.50,2.50);
mh_caracs["Tunique d'écailles"]=new Array("Armure",0,0,0,0,-1,0,3,3,0,0,0,0,16,30,0,0,0.00,0.00,30.00,30.00);
mh_caracs["Turban"]=new Array("Casque",0,0,0,0,0,0,0,0,0,0,0,0,11,20,0,0,0.00,0.00,2.50,2.50);
mh_caracs["Baton Lesté"]=new Array("Arme",2,2,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0.00,0.00,7.50,7.50);
mh_caracs["Grosse racine"]=new Array("Arme",-1,-1,3,3,0,0,0,0,0,0,0,0,6,10,0,0,0.00,0.00,20.00,20.00);



//"Nom","Att_Min","Att_Max","Deg_Min","Deg_Max","Esq_Min","Esq_Max","Arm_Min","Arm_Max","Vue_Min","Vue_Max","Reg_Min","Reg_Max","RM_Min","RM_Max","MM_Min","MM_Max","DLA_Min","DLA_Max","Tps_Min","Tps_Max"
mh_templates["de Feu"]=new Array(0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de Résistance"]=new Array(0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de l'Aigle"]=new Array(1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0);
mh_templates["de la Salamandre"]=new Array(0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0);
mh_templates["des Cyclopes"]=new Array(1,1,1,1,0,0,0,0,-1,-1,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Enragés"]=new Array(1,1,1,1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["des Tortues"]=new Array(0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,30,30,0,0);
mh_templates["des Vampires"]=new Array(1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0);
mh_templates["du Glacier"]=new Array(1,1,0,0,0,0,1,1,0,0,0,0,5,5,0,0,0,0,0,0);
mh_templates["du Rat"]=new Array(0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["du Roc"]=new Array(0,0,0,0,-1,-1,1,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["du Temps"]=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,-30,0,0);
mh_templates["du Vent"]=new Array(0,0,-1,-1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["en Mithril"]=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

function addarray(Array1,Array2) {
   Arrayresult=new Array();
   if ( Array1.length != Array2.length ) { return -1; }
   else {
      for ( i = 0 ; i < Array1.length ; i++ ) {
         Arrayresult[i] = Array1[i] * 1 + Array2[i] * 1;
      }                  
      return Arrayresult;
   }
}

function gettemplates(tmpitem) {
    var i=1;
    var item=tmpitem;
    var ar=new Array();
    while(i!=0)
    {
    	i=0;
	for ( var cle_templates in mh_templates )
	{
	   if(item.substr(item.length-cle_templates.length,cle_templates.length)==cle_templates)
	   {
	   	item=item.substr(0,item.length-cle_templates.length-1);
		i=1;
		ar.unshift(cle_templates)
		if(item.substr(item.length-3,3)==" et")
		   item=item.substr(0,item.length-3);
	   }
	}
    }
    ar.unshift(item);
    return ar;
}

function gettypeitem(tmpitem) {
    return mh_caracs[tmpitem][0];
}

function addMithril(Arraycaracs, tmptypeitem){
    if ( tmptypeitem == "Arme" ) {
        if ( Arraycaracs[0] < 0 ) { Arraycaracs[0] = Math.ceil(Arraycaracs[0] / 2); }
        if ( Arraycaracs[1] < 0 ) { Arraycaracs[1] = Math.ceil(Arraycaracs[1] / 2); }
    }
    else {                                                    
        if ( Arraycaracs[4] < -1 ) { Arraycaracs[4] = Math.ceil(Arraycaracs[4] / 2); }
        if ( Arraycaracs[5] < 0 ) { Arraycaracs[5] = Math.ceil(Arraycaracs[5] / 2); }
    }                                        
    Arraycaracs[19] = Arraycaracs[19] / 2.0 ;
    Arraycaracs[18] = Arraycaracs[18] / 2.0 ;
    return Arraycaracs;
}

function getcaracs(item) {
    typeitem="";
    Listtemplates=new Array();
    caracfinales=new Array();
 
    Listtemplates=gettemplates(item);
    for (var key=0;key<Listtemplates.length;key++) {
        if ( key == 0 ) {
	    if(!mh_caracs[Listtemplates[key]])
	       return caracfinales;
            typeitem=gettypeitem(Listtemplates[key]);
            caracfinales=mh_caracs[Listtemplates[key]].slice(1,mh_caracs[Listtemplates[key]].length);
        }
        else {
            if ( Listtemplates[key] == "en Mithril" ) { caracfinales = addMithril(caracfinales,typeitem); }
            else { caracfinales = addarray(caracfinales,mh_templates[Listtemplates[key]]); }
        }
    }
    return caracfinales;
}

var nbr=0;
if(getCookie("INFOCARAC")!="false")
{
	var string="";
	var carac=new Array();
	var caracstotales=new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	var nodes = document.evaluate("//td/b[text() = 'Equipement Utilisé']/../../td/img[@src ='../Images/greenball.gif']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var j = 0; j < nodes.snapshotLength; j++)
	{
	   var node = nodes.snapshotItem(j);
	   var nom= node.nextSibling.nodeValue;
	   if(node.nextSibling.nextSibling.childNodes.length == 1)
	      nom+=node.nextSibling.nextSibling.childNodes[0].nodeValue;
	   nom=nom.replace(/^\s*|\s*$/g,"");
	   var c=String.fromCharCode(180);
	   while(nom.indexOf(c)!=-1)
	   	nom=nom.replace(c,"'");
	   var ar=getcaracs(nom);
	   if(ar.length!=0)
	   {
	      nbr++;
	      caracstotales=addarray(caracstotales,ar);
	      var span=document.createElement("span");
	      node.parentNode.insertBefore(span,node.nextSibling);
	      span.appendChild(node.nextSibling.nextSibling);
	      span.appendChild(node.nextSibling.nextSibling);
		  span.setAttribute("infos",getLine(ar));
          span.addEventListener("mouseover", ShowInfos,true);
          span.addEventListener("mouseout", HideInfos,true);
	   }
	}
	if(nbr>0)
	{
	  var nodes = document.evaluate("//td/b[text() = 'Equipement Utilisé']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  var str = getLine(caracstotales);
	  var node = nodes.snapshotItem(0);
	  node.setAttribute("infos",str);
	  node.addEventListener("mouseover", ShowInfos,true);
	  node.addEventListener("mouseout", HideInfos,true);
	}

	if(nodes.snapshotLength==0)
	{
		nodes = document.evaluate("//dd[@class='equipement']/ul/li", document,null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	        for(var j = 0; j < nodes.snapshotLength; j++)
	        {
			var node = nodes.snapshotItem(j);
			var nom= node.childNodes[0].nodeValue;
			if(node.childNodes.length > 1)
		                nom+=node.childNodes[1].childNodes[0].nodeValue;
			nom=nom.replace(/^\s*|\s*$/g,"");
			var c=String.fromCharCode(180);
			while(nom.indexOf(c)!=-1)
				nom=nom.replace(c,"'");
			var ar=getcaracs(nom);
			if(ar.length!=0)
			{
				nbr++;
				caracstotales=addarray(caracstotales,ar);
				var span=node;
				  span.setAttribute("infos",getLine(ar));
				  span.addEventListener("mouseover", ShowInfos,true);
				  span.addEventListener("mouseout", HideInfos,true);
			}			 
		}
		if(nodes.snapshotLength>0)
		{
		  var nodes = document.evaluate("//dt[@class='equipement']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		  var str = getLine(caracstotales);
		  var node = nodes.snapshotItem(0);
		  node.setAttribute("infos",str);
		  node.addEventListener("mouseover", ShowInfos,true);
		  node.addEventListener("mouseout", HideInfos,true);
		}			   
	}
}
function aff(nbr)
{
  if(nbr>=0)
    return "+"+nbr;
  return nbr;
}

//"Att_Min","Att_Max","Deg_Min","Deg_Max","Esq_Min","Esq_Max","Arm_Min","Arm_Max","Vue_Min","Vue_Max","Reg_Min","Reg_Max","RM_Min","RM_Max","MM_Min","MM_Max","DLA_Min","DLA_Max","Tps_Min","Tps_Max"

function getLine(tab)
{
   var str="";
   if(tab[0]!=0 || tab[1]!=0)
   {
      str+="<b>Att : </b>"+aff(tab[0]);
      if(tab[0]!=tab[1])
         str+="/"+aff(tab[1]);
      str+=" ";
   }
   if(tab[4]!=0 || tab[5]!=0)
   {
      str+="<b>Esq : </b>"+aff(tab[4]);
      if(tab[4]!=tab[5])
         str+="/"+aff(tab[5]);
      str+=" ";
   }
   if(tab[2]!=0 || tab[3]!=0)
   {
      str+="<b>Deg : </b>"+aff(tab[2]);
      if(tab[2]!=tab[3])
         str+="/"+aff(tab[3]);
      str+=" ";
   }
   if(tab[10]!=0 || tab[11]!=0)
   {
      str+="<b>Reg : </b>"+aff(tab[10]);
      if(tab[10]!=tab[11])
         str+="/"+aff(tab[11]);
      str+=" ";
   }
   if(tab[8]!=0 || tab[9]!=0)
   {
      str+="<b>Vue : </b>"+aff(tab[8]);
      if(tab[8]!=tab[9])
         str+="/"+aff(tab[9]);
      str+=" ";
   }
   if(tab[6]!=0 || tab[7]!=0)
   {
      str+="<b>Arm : </b>"+aff(tab[6]);
      if(tab[6]!=tab[7])
         str+="/"+aff(tab[7]);
      str+=" ";
   }
   if(tab[12]!=0 || tab[13]!=0)
   {
      str+="<b>RM : </b>"+aff(tab[12])+"%";
      if(tab[12]!=tab[13])
         str+="/"+aff(tab[13])+"%";
      str+=" ";
   }
   if(tab[14]!=0 || tab[15]!=0)
   {
      str+="<b>MM : </b>"+aff(tab[14])+"%";
      if(tab[14]!=tab[15])
         str+="/"+aff(tab[15])+"%";
      str+=" ";
   }
   if(tab[16]!=0 || tab[17]!=0)
   {
      str+="<b>DLA : </b>"+aff(tab[16])+" min";
      if(tab[16]!=tab[17])
         str+="/"+aff(tab[17])+" min";
      str+=" ";
   }
   if(tab[18]!=0 || tab[19]!=0)
   {
      str+="<b>Poids : </b>"+tab[18];
      if(tab[18]!=tab[19])
         str+="/"+tab[19];
      str+=" min";
   }
   return str;
}

/***************
TOOLTIP
***************/
var DivInfosStyle = null;
var CurrentInfos = "";
var ArgsSave = null;
var xcoord = 0;
var ycoord = 0;
var freezed = false;
ToolTipInit();

function ToolTipInit() {
	var divVue = document.createElement('div');
	divVue.setAttribute('id', 'infosVue');
	//divVue.setAttribute('style', 'position: absolute;border: 1px solid #000000;padding: 5px;margin: 0px;text-align: left;visibility: hidden;');
	divVue.setAttribute('class','mh_textbox');
	divVue.setAttribute('style', 'position: absolute;border: 1px solid #000000;visibility: hidden;');
	if(document.getElementsByTagName('table').length==0)
		divVue.setAttribute('style', 'position: absolute;border: 1px solid #000000;background-color: #FFFFFF;padding: 5px;margin: 0px;text-align: left;visibility: hidden;');
	document.getElementsByTagName('body')[0].appendChild(divVue);
	
	SetDivText("");
	if (window.Event) {
		if (document.captureEvents) {
			document.captureEvents(Event.MOUSEMOVE);
			document.captureEvents(Event.CLICK);
		} else {
			window.captureEvents(Event.MOUSEMOVE);
			window.captureEvents(Event.CLICK);
		}
	}
  
	document.addEventListener("mousemove",GetXY,true);
	document.addEventListener("click",changeFreezeStatus,true);
	HideInfos();
}

function GetXY(e) {
	if(!e) {
		if( window.event ) {
 			e = window.event; //DOM
		} else {
			return; //TOTAL FAILURE
		}
	}
  
	if( typeof( e.pageX ) == 'number' ) {
		//NS 4, NS 6+, Mozilla 0.9+
		xcoord = e.pageX;
		ycoord = e.pageY;
	} else {
		if( typeof( e.clientX ) == 'number' ) {
 			//IE, Opera, NS 6+, Mozilla 0.9+
			//except that NS 6+ and Mozilla 0.9+ did pageX ...
			xcoord = e.clientX;
			ycoord = e.clientY;
      
			if( !( ( window.navigator.userAgent.indexOf( 'Opera' ) + 1 ) ||
				( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) ||
				window.navigator.vendor == 'KDE' ) ) {
        			
				if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
					//IE 4, 5 & 6 (in non-standards compliant mode)
					xcoord += document.body.scrollLeft;
					ycoord += document.body.scrollTop;
				} else if( document.documentElement &&
						( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
	          			
					//IE 6 (in standards compliant mode)
					xcoord += document.documentElement.scrollLeft;
					ycoord += document.documentElement.scrollTop;
				}
			}
		} else {
			return; //TOTAL FAILURE
		}
	}
  
	ycoord += 10;
  
	SetDivPos(xcoord,ycoord, false);
}

function SetDivPos(x,y,bForced) {

	if(!DivInfosStyle || freezed) {
		return;
	}
    
	if( DivInfosStyle.visibility == "visible" || bForced ) {
  
		if(typeof(DivInfosStyle.left)=='string') {
			DivInfosStyle.left = x + 'px';
			DivInfosStyle.top = y + 'px';
		} else {
			DivInfosStyle.left = x;
			DivInfosStyle.top = y;
		}
	}
}

function SetDivText(txt) {

	var ElementInfos = null;
  
	if(document.all) {
		ElementInfos = document.all["infosVue"];
	} else if(document.getElementById) {
		ElementInfos = document.getElementById("infosVue");
	}
	if(ElementInfos) {
		ElementInfos.innerHTML = txt;
		DivInfosStyle = ElementInfos.style;
	}
}

function changeFreezeStatus() {
	if(DivInfosStyle.visibility == "visible") {
		freezed = !freezed;
	
		if(!freezed) {
			HideInfos();
		}
	}
}

function ShowInfos() {
	var CurrentInfos = this.getAttribute("infos");
	if(DivInfosStyle && !freezed) {
		DivInfosStyle.display = "inline";
		SetDivPos(xcoord,ycoord,true);
		SetDivText(CurrentInfos);
		DivInfosStyle.zIndex = "99";
		DivInfosStyle.visibility = "visible";
	}
}
 
function HideInfos() {
	if(DivInfosStyle && !freezed) {
		DivInfosStyle.visibility = "hidden";
	}
}
