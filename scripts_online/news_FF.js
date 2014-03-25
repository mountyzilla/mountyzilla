/*********************************************************************************
*  This file is part of Mountyzilla (http://mountyzilla.tilk.info/)              *
*  Mountyzilla is free software; provided under the GNU General Public License   *
*********************************************************************************/

const annivURL = 'http://mountyzilla.tilk.info/scripts/anniv.php';
const rssURL = 'http://mountyzilla.tilk.info/news/rss.php';
const nbitems = 10;
const maxchardescription = 300;

function epureDescription(texte)
{
	return texte.replace(/\\(.)/g,"$1");
}

MZ_xmlhttpRequest({
		    method: 'GET',
		    url: annivURL,
		    headers: {
		        'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
		        'Accept': 'application/xml,text/xml',
		    },
		    onload: function(responseDetails) {
				try
				{
					
					var listetrolls = responseDetails.responseText.split("\n");
					if(listetrolls.length==0)
						return;
					var string = '<table border="0" class="mh_tdborder" cellspacing="1" cellpadding="1" STYLE="max-width:98%"><tr CLASS="mh_tdtitre"><td align="center"><b><span class="Echo_texte" title="Envoyez leur un message ou un cadeau !">Les Trõlls qui fêtent leur anniversaire aujourd\'hui</span></b></td></tr><tr CLASS="mh_tdpage"><td align="center"><small>';
					var first = true;
					for(var i=0;i<listetrolls.length;i++)
					{
						var infos = listetrolls[i].split(";");
						if(infos.length!=3 || 1*infos[2]==0)
							continue;
						var an = "ans";
						if(first)
							first=false;
						else
							string += ", ";
						if(1*infos[2]==1)
							an = "an";
						string += '<a href="javascript:EPV('+infos[0]+')"><span class="Echo_texte">'+infos[1]+'</span></a> ('+infos[2]+' '+an+')'
					}
					string += '</small></td></tr></table>';
					var thisP = document.evaluate("//p/a/text()[contains(.,'messagerie')]/../..",
												document, null, 9, null).singleNodeValue;
					var newP = document.createElement('p');
					newP.setAttribute('align','center');
					if(thisP!=null)
					{
						thisP.parentNode.insertBefore(newP,thisP);
						newP.innerHTML=string;
					}
				}
				catch(e)
				{
					window.alert(e);
				}
			}
		});

MZ_xmlhttpRequest({
		    method: 'GET',
		    url: rssURL,
		    headers: {
		        'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
		        'Accept': 'application/xml,text/xml',
		    },
		    onload: function(responseDetails) {
				try
				{
					responseDetails.responseXML = new DOMParser().parseFromString(responseDetails.responseText,'text/xml');
					var title = responseDetails.responseXML.evaluate("//channel/title/text()",	responseDetails.responseXML, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					//var link = responseDetails.responseXML.evaluate("//channel/link/text()",	responseDetails.responseXML, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					var description = responseDetails.responseXML.evaluate("//channel/description/text()",	responseDetails.responseXML, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					if(title && description)
					{
						var string = '<table border="0" class="mh_tdborder" cellspacing="1" cellpadding="1" STYLE="max-width:98%"><tr CLASS="mh_tdtitre"><td align="center" colspan="2"><p class="Style1"><span class="Echo_texte" title="'+epureDescription(description.nodeValue)+'">&nbsp;'+title.nodeValue+'&nbsp;</span></p></td></tr>';
						var items = responseDetails.responseXML.evaluate("//channel/item", responseDetails.responseXML, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						if(items.snapshotLength==0)
							return;
						for(var i=0;i<Math.min(items.snapshotLength,nbitems);i++)
						{
							var item = items.snapshotItem(i);
							var titleI = responseDetails.responseXML.evaluate("title/text()", item, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							var descriptionI = responseDetails.responseXML.evaluate("description/text()", item, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							if(titleI && descriptionI)
							{
								string += '<tr CLASS="mh_tdpage"><td align="center" valign="center"><b><span class="Echo_texte">'+titleI.nodeValue+'</span></b></td><td valign="center">'+epureDescription(descriptionI.nodeValue).substring(0,maxchardescription)+'</td></tr>'
							}
						}
						string += '</table>';
						var thisP=document.getElementById('footer2');
						var newP=document.createElement('p');
						newP.setAttribute('align','center');
						thisP.parentNode.insertBefore(newP,thisP);
						newP.innerHTML=string;
					}

				}
				catch(e)
				{
					window.alert(e);
				}
			}
		});
