/*////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Code mixing by Molokoloco ..... 2011 ......... [EVER IN PROGRESS (it's not done yet)] /////////////
////  Sources : https://github.com/molokoloco/FastWebStart/                                /////////////
//////////////////////////////////////////////////////////////////////////////////////////////////// */

var $E = $E || {}; // GLOBAL SHARED OBJ

(function($, $E){
		  
	// VARS //////////////////////////////////////////////
	var title, href, result, tips, allFields, tipsError;
	var editedByUser = false;
	var action = 'edit'; // edit/add
	var edLink = '';
	var edCat = '';
	
	// FORM DIALOG //////////////////////////////////////////////
	var updateTips = function(t) {
		tipsError.text(t).addClass('ui-state-highlight');
		setTimeout(function() { tipsError.removeClass('ui-state-highlight', 1500); }, 500);
	};
	
	var checkLength = function(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass('ui-state-error');
			updateTips('La longueur du ' + n + ' doit &ecirc;tre entre '+min+' et '+max+' charact&egrave;res.');
			return false;
		}
		else return true;
	};
	
	var checkRegexp = function(o, regexp, n) {
		if (!(regexp.test(o.val()))) {
			o.addClass('ui-state-error');
			updateTips(n);
			return false;
		}
		else return true;
	};
	
	var initDial = function() {
		$('div#divEdit').show();
		$('div#divEdit').dialog({
			autoOpen: false,
			height: 360,
			minHeight: 360,
			width: 420,
			minWidth: 420,
			modal: true,
			//buttons: {},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
			}
		});
	};
	
	var createCatEditForm = function() {
		if ($('div#divEdit').length < 1) $('body').append('<div id="divEdit" title=""></div>');
		else $('div#divEdit').dialog('destroy');
		$('div#divEdit').hide();
		var tpl = '<form method="post" action="#" name="formEdit" id="formEdit">';
		tpl += '<fieldset><legend>Les champs avec <em>*</em> sont obligatoires</legend>';
		tpl += '<label for="title" title="Titre du site">Titre de la cat&eacute;gorie<em>*</em> <input type="text" name="title" id="title" value="" class="text ui-widget-content ui-corner-all" maxlength="12"/></label>';
		tpl += '</fieldset></form>';
		$('div#divEdit').html(tpl);
	};
	
	var createLinkEditForm = function() {
		if ($('div#divEdit').length < 1) $('body').append('<div id="divEdit" title=""></div>');
		else $('div#divEdit').dialog('destroy');
		$('div#divEdit').hide();
		var tpl = '<form method="post" action="#" name="formEdit" id="formEdit">';
		tpl += '<fieldset><legend id="legend">Les champs avec <em>*</em> sont obligatoires</legend>';
		tpl += '<label for="title" title="Titre du site">Titre du site<em>*</em> <input type="text" name="title" id="title" value="" class="text ui-widget-content ui-corner-all" maxlength="30"/></label>';
		tpl += '<label for="href" title="Lien http:// du site">Lien<em>*</em> <input type="text" name="href" id="href" value="" class="text ui-widget-content ui-corner-all"/></label>';
		tpl += '<label for="result" title="Faite une recherche sur le site, regardez l\'url et remplacez votre mot-cl&eacute; par {R}">R&eacute;sultat recherche <input type="text" name="result" id="result" value="" class="text ui-widget-content ui-corner-all"/></label>';
		tpl += '<label for="tips" title="En g&eacute;n&eacute;ral, le titre de la page">Description <input type="text" name="tips" id="tips" value="" class="text ui-widget-content ui-corner-all"/></label>';
		tpl += '</fieldset></form>';
		$('div#divEdit').html(tpl);
	};
	
	// FORM VALIDATORS //////////////////////////////////////////////
	
	var catEdit = function(event) {
		event.preventDefault();
		edCat = $(event.currentTarget);
		if (edCat.hasClass('addCat')) action = 'add';
		else action = 'edit';
		createCatEditForm();
		title = $('input#title');
		allFields = $([]).add(title);
		tipsError = $('legend#legend');
		if (action == 'add') { // Fill Form with default link
			$('div#divEdit').attr({title:'Ajouter une cat&eacute;gorie'});
			title.val('');
		}
		else { // Fill Form with current link values
			$('div#divEdit').attr({title:'Edition d\'une cat&eacute;gorie'});
			title.val(edCat.text());
		}
		var formButtons = {};
		$.extend(formButtons, {'Annuler': function() { $(this).dialog('close'); } });
		//if (action != 'add') $.extend(formButtons, {'Supprimer': function() { $(this).dialog('close'); edCat.parent().remove(); } }); // Todo, del CAT
		$.extend(formButtons, {
			'Valider': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(title, 'Titre', 2, 25);
				bValid = bValid && checkRegexp(title, /^([A-Za-z0-9_\- éèëêàùçîôö])+$/i, 'Categorie name may consist of letters and numbers, underscores or dash');
				if (bValid) {
					if (action == 'add') { // Todo, add CAT
						/*var liBefore = edCat.parent().prev();
						var newLink = '<li class="sortLink"><a href="'+href.val()+'" rel="'+(result.val() || '')+'" title="'+(tips.val() || '')+'" class="l" style="cursor:move;">'+title.val()+'</a></li>';
						$(newLink).insertAfter(liBefore);
						$('ul.sortUlLink').sortable('refresh');*/
					}
					else { edCat.html(title.val()); }
					$(this).dialog('close');
					initLinkEvent();
					isEditedByUser();
				}
			}
		});
		initDial();
		$('div#divEdit').dialog('option', 'buttons', formButtons);
		$('div#divEdit').dialog('option', 'height', 200);
		$('div#divEdit').dialog('option', 'minHeight', 200);
		$('div#divEdit').dialog('open');
	};
	
	var linkEdit = function(event) {
		event.preventDefault();
		edLink = $(event.currentTarget);
		if (edLink.hasClass('addLink')) action = 'add';
		else action = 'edit';
		createLinkEditForm();
		title = $('input#title');
		href = $('input#href');
		result = $('input#result');
		tips = $('input#tips');
		allFields = $([]).add(title).add(href).add(result).add(tips);
		tipsError = $('legend#legend');
		if (action == 'add') { // Fill Form with default link
			$('div#divEdit').attr({title:'Ajouter un site'});
			href.val('http://');
			result.val('');
			tips.val('');
			title.val('');
		}
		else { // Fill Form with current link values
			$('div#divEdit').attr({title:'Edition d\'un site'});
			href.val(edLink.attr('href'));
			result.val(edLink.attr('rel'));
			tips.val(edLink.attr('title'));
			title.val(edLink.text());
		}
		var formButtons = {};
		$.extend(formButtons, {'Annuler': function() { $(this).dialog('close'); } });
		if (action != 'add') $.extend(formButtons, {'Supprimer': function() { $(this).dialog('close'); edLink.parent().remove(); } });
		$.extend(formButtons, {
			'Valider': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');
				bValid = bValid && checkLength(title, 'Titre', 2, 25);
				//bValid = bValid && checkRegexp(title, /^([\w\- àáâãäåçèéêëìíîïðòóôõöùúûüýÿ])+$/i, 'Site name may consist of letters and numbers, underscores or dash');
				bValid = bValid && checkLength(href, 'Lien', 12, 250);
				// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				bValid = bValid && checkRegexp(href, /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, 'Ex. : &quot;http://www.site.com&quot;');
				if (bValid) {
					if (action == 'add') {
						var liBefore = edLink.parent().prev();
						var newLink = '<li class="sortLink"><a href="'+addslashes(input2html(href.val()))+'" rel="'+(result.val() ? addslashes(input2html(result.val())) : '')+'" title="'+(tips.val() ? addslashes(input2html(tips.val())) : '')+'" class="l" style="cursor:move;">'+input2html(title.val())+'</a></li>';
						$(newLink).insertAfter(liBefore);
						$('ul.sortUlLink').sortable('refresh');
					}
					else {
						edLink.attr({
							href:addslashes(input2html(href.val())), 
							rel:(result.val() ? addslashes(input2html(result.val())) : ''), 
							title:(tips.val() ? addslashes(input2html(tips.val())) : '')
						});
						edLink.html(input2html(title.val()));
					}	
					$(this).dialog('close');
					initLinkEvent();
					isEditedByUser();
				}
			}
		});
		initDial();
		$('div#divEdit').dialog('option', 'buttons', formButtons);
		$('div#divEdit').dialog('option', 'height', 360);
		$('div#divEdit').dialog('option', 'minHeight', 360);
		$('div#divEdit').dialog('open');
	};
	
	// SITES BUILDER //////////////////////////////////////////////
	
	var serializeLinks = function() { // UL>LI>A to JS object
		var SITEStmp = [];
		var SITESobj = {};
		var SITESobjData = [];
		var countCat = -1;
		$('ul.sortUlLink').each(function() { // UL CAT
			$(this).find('a.l').each(function() { // UL CAT LI
				var theLink = $(this);
				SITESobjData[SITESobjData.length] = {
					href:addslashes(theLink.attr('href')),
					result:addslashes(theLink.attr('rel')),
					tips:addslashes(theLink.attr('title')),
					title:addslashes(theLink.text()) // input2html()
				};	
			});
			$(this).find('h3').each(function() { // UL CAT LI
				SITESobj['title'] = $(this).text();
				countCat++;
			});
			SITESobj['data'] = SITESobjData;
			SITEStmp[countCat] = SITESobj;
			SITESobj = {};
			SITESobjData = [];
		});
		return SITEStmp;
	};
	
	var saveSITES = function() { // JS object to String Data // Cf. ./js/sitesDatas.js
		SITES = serializeLinks();
		var SITESstring = "var SITES = [";
		for (var CAT in SITES) {
			SITESstring += "{title: '"+SITES[CAT]['title']+"', data : [";
			for (var site in SITES[CAT]['data']) {
				var siteObj = SITES[CAT]['data'][site];
				if (siteObj['href'] && siteObj['title'])
					SITESstring += "{href:'"+siteObj['href']+"', result:'"+siteObj['result']+"', tips:'"+siteObj['tips']+"', title:'"+siteObj['title']+"'},"; 
			}
			SITESstring = SITESstring.substring(0, (SITESstring.length-1));
			SITESstring += "]},";
		}
		SITESstring = SITESstring.substring(0, (SITESstring.length-1));
		SITESstring += "];";
		
		$.ajax({ // Let's write that (with PHP) !
			type: 'POST',
			url: 'index.php?action=update',
			cache: false,
			data: {SITES:SITESstring},
			success: function(msg){ 
				$E.quitEditByUser();
				$E.quitEditMode();
				if (msg == '1') alert('Sauvegarde r&eacute;ussie');
				else alert('Vous devez vous connecter (avec Facebook) pour sauvegarder vos modifications');
			}
		});
		return false;
	};
	
	var isEditedByUser = function() { // Fist modif by user
		editedByUser = true;
		$('#infoTexte').hide();
		$('#Sauvegarder').show(); $('#Annuler').show();
		window.onbeforeunload = function() {         
			if (editedByUser) return 'Quitter la page sans enregistrer ?';
			return true;
		};
	};
	
	$E.quitEditByUser = function(){ // After saving modif by user
		editedByUser = false;
		window.onbeforeunload = null;
		$('#infoTexte').show();
		$('#Sauvegarder').hide();
		$('#Annuler').hide();
	};
	
	var prevent = function(event) { event.preventDefault(); };
	
	var removeLinkEvent = function() {
		$('li h3').unbind('dblclick', catEdit);
		$('li a.l').unbind('click', prevent);
		$('li a.l').unbind('dblclick', linkEdit);
		$('li a.addLink').unbind('click', linkEdit);
	};
	
	var initLinkEvent = function() {
		$('li h3').bind('dblclick', catEdit);
		$('li a.l').bind('click', prevent);
		$('li a.l').bind('dblclick', linkEdit);
		$('li a.addLink').bind('click', linkEdit);
	};
	
	$E.quitEditMode = function(){
		if (editedByUser && !confirm('Quitter la page sans enregistrer ?')) return;
		$E.quitEditByUser();
		$('div#divEditInfos').hide();
		removeLinkEvent();
		$('li.liAddLink').remove();
		$('ul.sortUlCat').sortable('destroy');
		$('ul.sortUlLink').sortable('destroy');
		$('li.sortLinkCat h3').css({cursor:''});
		$('a.l').css({cursor:''});	
		$('ul.sortUlCat').removeClass('borderFocus');
		$('ul.sortUlLink').removeClass('borderFocus');
		$H.initSites();
		if (document.location.hash == '#editmode') document.location.hash = '';
	};
	
	$E.startEditMode = function(){
		$E.quitEditByUser();
		// Set helper
		if ($('div#divEditInfos').length == 0) {
			var tpl = '<div id="divEditInfos"><h3 style="display:inline;">Mode &eacute;dition : </h3><span id="infoTexte"><strong>Cliquez</strong> sur les liens ou les cat&eacute;gories pour les d&eacute;placer, <strong>double-cliquez</strong> pour les &eacute;diter</span> <button type="button" id="Sauvegarder" onclick="saveSITES();" title="Enregistrer les liens et le th&egrave;me de cette page (Connexion obligatoire avec Facebook)" style="display:none;">Sauvegarder</button> <button type="button" id="Annuler" onclick="$E.quitEditByUser();$E.quitEditMode();" title="Annuler les modifications" style="display:none;">Annuler</button></div>';
			$('body').append(tpl);
		}
		else $('div#divEditInfos').show();
	
		if ($('li.liAddLink').length < 1) {
			var addTpl = '<li class="liAddLink"><a href="javascript:void(0);" title="Ajouter un lien dans cette cat&eacute;gorie" class="addLink">[+]</a></li>';
			$('ul.sortUlLink').each(function() { var e = $(this).find('li.sortLink:last'); $(addTpl).insertAfter(e); });
		}
		
		$('ul.sortUlCat').addClass('borderFocus');
		$('ul.sortUlLink').addClass('borderFocus');
	
		$('ul.sortUlCat').sortable({handle:'li.sortLinkCat', forcePlaceholderSize:true, placeholder:'placeHolder', change:isEditedByUser});
		$('ul.sortUlLink').sortable({connectWith:'ul.sortUlLink', forcePlaceholderSize:true, placeholder:'placeHolder', items:'li:not(.sortLinkCat, .liAddLink)', change:isEditedByUser}).disableSelection();
		$('li.sortLinkCat h3').css({cursor:'move'});
		$('a.l').css({cursor:'move'});	
		
		$H.setUlCol(false);
		$H.posItem();
		initLinkEvent();
		document.location.hash = 'editmode';
	};
	
})(jQuery, $E);