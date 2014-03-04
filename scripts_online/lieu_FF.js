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
/* 2013-08-19 : correction auto syntaxe alert */

function putB()
{
   var nodes = document.evaluate("//div[@class='titre2']/text()[contains(.,'Gowapier')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   if(nodes.snapshotLength>0)
   {
       var node=nodes.snapshotItem(0);
       var texte=node.nodeValue;
       texte = texte.substring(texte.indexOf(':')+2,5000);
       var doppeur=0;
       var nodes2 = document.evaluate("//a[@href='/mountyhall/MH_Lieux/Lieu_GowapOption.php']", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
       if(nodes2.snapshotLength>0)
       {
           doppeur=1;
       }
       var newp = document.createElement('p');
       var newb = document.createElement('input');
       newb.setAttribute('type','button');
       newb.setAttribute('value','Envoyer les infos du gowapier');
       //newb.setAttribute('onClick','uploader("'+texte+'",'+doppeur+')');
	   newb.setAttribute('onClick',"window.open('http://trolls.ratibus.net/mountyhall/gowapier_record.php?nomGowapier='"+
			URLencode(texte)+"'&dopeur='"+doppeur+", 'popupLieu', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes')");
       newb.setAttribute('class','mh_form_submit');
       newb.setAttribute('onMouseOver','this.style.cursor=\'hand\';');
       newp.appendChild(newb);
       node.parentNode.parentNode.appendChild(newp);
   }
}

function URLencode(sStr) {
  return escape(sStr).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27');
}
var debut = new Date();
putB();
var totaltab=document.getElementsByTagName( 'table' );
var fin = new Date();
totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].appendChild( document.createTextNode( " - [Script exécuté en "+(( fin.getTime() - debut.getTime() )/1000)+" sec]"));
