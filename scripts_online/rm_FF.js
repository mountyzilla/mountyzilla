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

function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
    ((expires) ? "; expires=" + expires.toGMTString() : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}
					    

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return '';
  } else
      begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
      end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

function URLencode(sStr) {
    return escape(sStr).
           replace(/\+/g, '%2B').
           replace(/\"/g,'%22').
           replace(/\'/g, '%27').
           replace(/\//g,'%2F');
}

var expdate = new Date ();
expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000 * 31));

function getMm() {
  var rm=getCookie("RM_TROLL");
  var oki=false;
  if(rm=="")
    return oki;
  var nodes = document.evaluate("//b[contains(preceding::text()[1],'Seuil de Résistance de la Cible') and contains(preceding::b[1],'Piège à Feu')]/text()[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++) {
    var node = nodes.snapshotItem(i);
    var sr=node.nodeValue;
    sr=sr.slice(0,sr.indexOf("%")-1);
    var string="";
    if(sr==5) {
      string="\u2265 "+Math.round((50*rm)/sr); 
    } else if(sr<=50) {
      string=Math.round((50*rm)/sr);
    } else if(sr<95) {
      string=Math.round((100-sr)*rm/50);
    } else {
      string="\u2264 "+Math.round((100-sr)*rm/50);
    }
    if(node.parentNode.parentNode.childNodes.length>5)
    {
      var lastNode=node.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
      lastNode.parentNode.insertBefore(document.createElement('br'),lastNode);
      lastNode.parentNode.insertBefore(document.createTextNode('MM approximative du Poseur.......: '),lastNode);
      var myB=document.createElement('b');
      myB.appendChild(document.createTextNode(string));
      lastNode.parentNode.insertBefore(myB,lastNode);
    }
    else
    {
      node.parentNode.parentNode.appendChild(document.createElement('br'));
      node.parentNode.parentNode.appendChild(document.createTextNode('MM approximative du Poseur.......: '));
      var myB=document.createElement('b');
      myB.appendChild(document.createTextNode(string));
      node.parentNode.parentNode.appendChild(myB);
    }
    oki=true;
  }
  return oki;
}

function getDices()
{
  var dice=getCookie("POISS_"+getCookie("NUM_TROLL"));
  if(dice=="")
    return false;
  var bonus=0;
  var oki=0;
  var comp_seuil=0;
  var chaineDés="";
  var nodes = document.evaluate("//td/text()[contains(.,'Page générée en')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(nodes.snapshotLength>0)
  {
     var node = nodes.snapshotItem(0);
     var temps = node.nodeValue;
     temps=temps.substring(temps.indexOf("générée")+11,temps.indexOf("sec")-1);
     chaineDés+="temps="+temps+"&";
  }
  var nodes = document.evaluate("//b/descendant::text()[position() = 1 and contains(.,'%') and starts-with(.,'bonus')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(nodes.snapshotLength>0)
  {
     var node = nodes.snapshotItem(0);
     bonus = node.nodeValue;
     bonus=bonus.substring(bonus.indexOf("de ")+3,bonus.indexOf("%")-1);
  }
  nodes = document.evaluate("//b/descendant::text()[position() = 1 and contains(.,' %)') and starts-with(.,'(') and contains(.,' sur ')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < /*nodes.snapshotLength*/ 1; i++)
  {
    var node = nodes.snapshotItem(i);
    oki=1;
    diceValue=node.nodeValue;
    seuil=diceValue.substring(diceValue.indexOf('sur')+4,diceValue.indexOf('%')-1);
    diceValue=diceValue.substring(1,diceValue.indexOf(' '));
    chaineDés+="comp[]="+diceValue+"&comp_seuil[]="+seuil+"&";
    comp_seuil=seuil;
  }
  nodes = document.evaluate("//b[descendant::text()[1] = \"Jet d'amélioration\" ]/following::b[1]/descendant::text()[1]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    oki=1;
    var node = nodes.snapshotItem(i);
    diceValue=node.nodeValue;
    chaineDés+="amel[]="+diceValue+"&amel_seuil[]="+(comp_seuil-bonus)+"&";
  }
  var nodes = document.evaluate("//b[contains(preceding::text()[1],'Jet de Résistance.....')]/text()[1]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    oki=1;
    var node = nodes.snapshotItem(i);
    diceValue=node.nodeValue;
    chaineDés+="sr[]="+diceValue+"&";
  }
  var nodes = document.evaluate("//b[contains(preceding::text()[1],'Seuil de Résistance d')]/text()[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++)
  {
    oki=1;
    var node = nodes.snapshotItem(i);
    diceValue=node.nodeValue;
    diceValue=diceValue.substring(0,diceValue.indexOf(' '));
    chaineDés+="sr_seuil[]="+diceValue+"&";
  }
  if(oki==1)
  {
    var url=window.self.location.toString();
    if(url.indexOf('?')==-1)
       url=url.substring(url.indexOf('/Actions')+9);
    else
       url=url.substring(url.indexOf('/Actions')+9,url.indexOf('?'));
    if(url == 'Play_a_SortResult.php')
    {
      url=document.referrer;
      if(url.indexOf('?')==-1)
        url=url.substring(url.indexOf('/Actions')+9);
      else
        url=url.substring(url.indexOf('/Actions')+9,url.indexOf('?'));
      if(url== 'Sorts/Play_a_SortXX.php')
      {
         url=document.referrer;
	 url=url.substring(url.indexOf('&as_NomSort')+12,5000);
	 url=url.substring(0,url.indexOf('&'));
         url='Sorts/Play_a_SortXX.php/'+url;
      }
      else if(url== 'Sorts/Play_a_SortYY.php')
      {
         url=document.referrer;
	 url=url.substring(url.indexOf('&as_NomSort')+12,5000);
	 url=url.substring(0,url.indexOf('&'));
         url='Sorts/Play_a_SortYY.php/'+url;
      }
    }
    var newScript = document.createElement( 'script' );
    newScript.setAttribute( 'language', 'JavaScript' );
    newScript.setAttribute( 'src', "http://www.fur4x-hebergement.net/minitilk/getDice.php?url="+url+"&"+chaineDés+"&id="+getCookie("NUM_TROLL")+"&mdp="+dice);
    document.body.appendChild(newScript);
    return true;
  }
  return false;
}

function getIdt() {
  if(getCookie("SEND_IDT")=="non")
  	return false;
  if(document.referrer.indexOf("Play_a_Sort10.php")==-1)
  	return false;
  var nodes = document.evaluate("//tr/td[contains(text()[1],'identification a donné le résultat suivant : ')]/../../tr[2]/td/b/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(nodes.snapshotLength==0)
  	return false;
  var node = nodes.snapshotItem(0);
  var nomidt = "";
  var caracidt = "";
  if(node.nodeValue.indexOf("Malheureux !")!=-1)
  {
  	nomidt="Mission maudite";
  }
  else
  {
  	nomidt=node.nodeValue.substring(0,node.nodeValue.indexOf("(")-1);
	caracidt=node.nodeValue.substring(node.nodeValue.indexOf("(")+1,node.nodeValue.indexOf(")"));
  }
  var newScript = document.createElement( 'script' );
  newScript.setAttribute( 'language', 'JavaScript' );
  newScript.setAttribute( 'src', "http://mh.byethost5.com/idt_serveur.php?item="+URLencode(nomidt)+"&descr="+URLencode(caracidt));
  document.body.appendChild(newScript);
  return true;

}

function erreur_idt(str)
{
	alert(str);
}

function getRm() {
  var mm=getCookie("MM_TROLL");
  var oki=false;
  var tsr=new Array();
  if(mm=="")
    return oki;
  var nodes = document.evaluate("//b[contains(preceding::text()[1],'Seuil de Résistance')]/text()[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++) {
    var node = nodes.snapshotItem(i);
    var sr=node.nodeValue;
    sr=sr.slice(0,sr.indexOf("%")-1);
    var string="";
    tsr[i]=-1;
    if(sr==10) {
      string="\u2264 "+Math.round((sr*mm)/50);
    } else if(mm<0) {
      string="Inconnue (quelle idée d'avoir une MM négative !)";
    } else if(sr<=50) {
      tsr[i]=Math.round((sr*mm)/50);
      string=Math.round((sr*mm)/50);
    } else if(sr<90) {
      tsr[i]=Math.round(50*mm/(100-sr));
      string=Math.round(50*mm/(100-sr));
    } else {
      string="\u2265 "+Math.round(50*mm/(100-sr)); }
    if(node.parentNode.parentNode.childNodes.length>5)
    {
      var lastNode=node.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
      lastNode.parentNode.insertBefore(document.createElement('br'),lastNode);
      lastNode.parentNode.insertBefore(document.createTextNode('RM approximative de la Cible.......: '),lastNode);
      var myB=document.createElement('b');
      myB.appendChild(document.createTextNode(string));
      lastNode.parentNode.insertBefore(myB,lastNode);
    }
    else
    {
      node.parentNode.parentNode.appendChild(document.createElement('br'));
      node.parentNode.parentNode.appendChild(document.createTextNode('RM approximative de la Cible.......: '));
      var myB=document.createElement('b');
      myB.appendChild(document.createTextNode(string));
      node.parentNode.parentNode.appendChild(myB);
    }
    oki=true;
  }
  var str="";
  var nodes = document.evaluate("//b[following::b[1]/text()='influencé']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < nodes.snapshotLength; i++) 
  {
     var node = nodes.snapshotItem(i);
     //alert(node.childNodes[0].nodeValue);
     if(node.childNodes[0].nodeValue.substring(0,2)=="un" && node.childNodes[0].nodeValue.indexOf("[")!=-1 && node.childNodes[0].nodeValue.indexOf("]")!=-1 && tsr[i]!=-1)
     {
        var nom=node.childNodes[0].nodeValue;
        if(nom.slice(2,3)=="e")
	{
	   nom=nom.slice(4,nom.indexOf("(")-1);
	}
	else
	{
	   nom=nom.slice(3,nom.indexOf("(")-1);
	}
	str+="monstre[]="+escape(nom)+"&rm[]="+tsr[i]+"&";
     }
  }
  if(str!="")
  {
    var espace = document.createTextNode('\t');    
    var myButton = document.createElement('input');
    myButton.setAttribute('type', 'button');    
    myButton.setAttribute('class', 'mh_form_submit');
    myButton.setAttribute('id', 'CdmButton');    
    myButton.setAttribute('value', "Participer au bestiaire");
    myButton.setAttribute('onmouseover', "this.style.cursor='pointer'");    
    myButton.addEventListener("click", function() {setCookie('CDMID',1+(getCookie('CDMID')*1),expdate,'/');window.open('http://mountypedia.free.fr/mz/getRM_FF.php?"+str+"', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); myButton.value='Merci de votre participation'; myButton.disabled = true;},true;);    
    var bouton=document.getElementsByName('as_Action')[0];
    bouton.parentNode.insertBefore(espace,bouton);    
    bouton.parentNode.insertBefore(myButton, espace);
  }
  return oki;
}

var debut = new Date();
var dices=getDices();
var idt=getIdt();
if(getMm() || getRm() || dices || idt)
{
  var totaltab=document.getElementsByTagName( 'table' );
  var fin = new Date();
  totaltab[totaltab.length-1].childNodes[1].childNodes[0].childNodes[1].appendChild( document.createTextNode( " - [Script exécuté en "+(( fin.getTime() - debut.getTime() )/1000)+" sec]"));
}
