/*////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Code mixing by Molokoloco ..... 2011 ......... [EVER IN PROGRESS (it's not done yet)] /////////////
////  Sources : https://github.com/molokoloco/FastWebStart/                                /////////////
//////////////////////////////////////////////////////////////////////////////////////////////////// */

// ------------------------------------ jQuery extends ------------------------------------ //

(function($){
 	$.extend(jQuery.easing, {
		easeInOutCirc: function (x, t, b, c, d) { if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; },
		easeInQuad: function (x, t, b, c, d) { return c*(t/=d)*t + b; }
	});
	$.fn.extend({	
		selectRange: function(start, end) { // $('#myInput').selectRange(searchVal.indexOf('{'), (searchVal.indexOf('}')+1))
			var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/
			if (!e) return;
			else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */ 
			else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
			else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
		},	
		center: function () { // I have added the (expanded) source here : http://plugins.jquery.com/project/autocenter
			return this.each(function() {
				var top = ($(window).height() - $(this).outerHeight()) / 2;
				var left = ($(window).width() - $(this).outerWidth()) / 2;
				$(this).css({position:'absolute', margin:0, top: (top > 20 ? top : 20)+'px', left: (left > 0 ? left : 0)+'px'});
			 });
		},
        styleSwitch: function (stylePath) { // I have added the (expanded) source here : http://plugins.jquery.com/project/AddOrSwitchStylesheet
            var exist = false, disabled = [];
            $('link[@rel*=style][id]').each(function () {
                if (stylePath == $(this).attr('href')) { $(this).removeAttr('disabled'); exist = true; }
                else disabled.push(this);
            });
            if (exist === false) $('head').append('<link rel="stylesheet" type="text/css" href="'+stylePath+'" id="theme'+Math.random()+'"/>');
            setTimeout(function () { $(disabled).each(function () { $(this).attr('disabled', 'disabled'); }); }, 900);
            if ($.cookie) $.cookie('css', stylePath, {expires: 365, path: '/'});
        },
        styleInit: function () {
            if ($.cookie && $.cookie('css')) {
                var isSet = false;
                $('link[rel*=style][id]').each(function () { if ($.cookie('css') == $(this).attr('href')) isSet = true; });
                if (isSet === false) $.fn.styleSwitch($.cookie('css'));
            }
            return $(this).click(function (event) {
                event.preventDefault();
                $.fn.styleSwitch($(this).attr('rel'));
                $(this).blur();
            });
        }
	});
})(jQuery);

// ------------------------------------ Some little functions... ------------------------------------ //

var db = function(x) { 'console' in window && console.log.call(console, arguments); },
	trim = function(string) { return string.replace(/^\s+|\s+$/g, ''); },
	escapeURI = function(url) { if (encodeURIComponent) return encodeURIComponent(url); else if (encodeURI) return encodeURI(url); else if (escape) return escape(url); else return url; },
	event2key = {'97':'a', '98':'b', '99':'c', '100':'d', '101':'e', '102':'f', '103':'g', '104':'h', '105':'i', '106':'j', '107':'k', '108':'l', '109':'m', '110':'n', '111':'o', '112':'p', '113':'q', '114':'r', '115':'s', '116':'t', '117':'u', '118':'v', '119':'w', '120':'x', '121':'y', '122':'z'},
	pad = function(n) { return (n < 10 ? '0'+n : n); },
	addslashes = function (str) { return (str+'').replace(/\'/g,'\\\'').replace(/"/g, '&quot;').replace(/\u0000/g, "\\0"); },
	input2html = function(str) { return unescape((str+'')).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
// index.html?name=foo -> 	name = getUrlVars()[name]; 
	_vars = {}, getUrlVars = function() { if (_vars.length > 0) return _vars; var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { _vars[key] = value; }); return _vars; },
// sites['link'].sort($.objSortByTitle);
	objSortByTitle = function (a, b) { var x = a.title.toLowerCase(); var y = b.title.toLowerCase(); return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }, 
// loadJs('http://other.com/other.js'); // For external link
	loadJs = function(jsPath) { var s = document.createElement('script'); s.setAttribute('type', 'text/javascript'); s.setAttribute('src', jsPath); document.getElementsByTagName('head')[0].appendChild(s); },
	loadCss = function(stylePath) { $('head').append('<link rel="stylesheet" type="text/css" href="'+stylePath+'"/>'); },
// getScript('./other.js', function() { ok(); });
	getScript = function(src, callback) { $.ajax({dataType:'script', async:false, cache:true, url:src, success:function(response) { if (callback && typeof callback == 'function') callback(); }}); };
// Google analytics for me, don't use APIKEY
	//yTics = function() { try { var pageTracker = _gat._getTracker('UA-1944677-8'); pageTracker._trackPageview(); } catch(e) {}; },
// Mini forum for me, don't use APIKEY
	//uservoiceOptions = {key:'b2bweb', host:'b2bweb.uservoice.com', forum:'35888', showTab: true, alignment:'right', background_color:'#1395B8', text_color:'white', hover_color:'#41608F', lang:'fr'};

// ------------------------------------ Here the page stuff... ------------------------------------ //

var $H = new Object(); // GLOBAL SHARED OBJ (with edit.js)
$H.WWW = ( /localhost\//.test(document.location) ? 'http://localhost/www.b2bweb.fr/home/' : 'http://home.b2bweb.fr/' ); // Site ROOT url

(function($, $H) {
	
	// ====================== Somes vars =================================================================//

	var W = 800, H = 600, docW = 800, docH = 600, foxAnim = true, toStock = true, startAnime = true, once = false, expressionFilled = false, intr = null, coef = 0, dist = 0, count = 0, o = 0, y = 0, one = 0, target = 'page', isAutocomplete = false, tabIndex = 3, currentLinkEnter = null;
		// Tabindex (for links) == 3 > search input, erase, valid (1,2,3)
	
	// Main elements... (others are badly mixed in code...) this are setted in DOM init...
	var $inputQ = null, // Main input for searches
		$aLinks = null, // Les liens magiques
		$foxy = null; // Le truc qui bouge
	
	// ====================== STOCK SEARCH in cookie =================================================================//
	
	// Display cookie stocked search terms
	var loadStock = function() {
		// 	$.cookie('search', 'love##test', {expires: 365, path: '/'});
		// Also tested with DOM data, but fail in Chrome (Lost when refresh ?) $('body').data('search', {search1:'word1'});
		if ($.cookie('toStock') == 'no') return;
		var terms = null, termsHtml = '';
		if ((terms = $.cookie('search'))) {
			terms = terms.split('##');
			$.each(terms, function(i, v) {
				if (!v) return;
				var vPrint = input2html(v);
				var vLink = addslashes(vPrint);
				termsHtml += '<span id="term_'+(i)+'"><a href="javascript:void(0)" onclick="$(\'input#q\').val(\''+vLink+'\').focus();" class="lien2" title="Ajouter &agrave; la recherche">'+vPrint+'</a><a href="javascript:void(0)" onclick="$H.removeStock(\''+v+'\', \''+i+'\');" title="Effacer">&#10006;</a>, </span>';
			});
		}
		if (termsHtml == '') return;
		$('div#searhTerms').html(termsHtml.substr(0, (termsHtml.length - 9)));
	};
	
	// Add new search term in cookie
	var addStock = function(val) { 
		if (!val || $.cookie('toStock') == 'no') return;
		val = escape(val); // addslashes(escape(val)); // htmlentities(val, 'ENT_QUOTES') // http://phpjs.org/functions/htmlentities
		var terms = null, exist = false;
		if ((terms = $.cookie('search'))) { // Check if already exist
			terms = terms.split('##');
			$.each(terms, function(i, v) { if (v == val) exist = true; });
		}
		if (!exist) $.cookie('search', ((terms) ? val+'##'+$.cookie('search') : val), {expires: 365, path: '/'});
		loadStock();
	};
	
	// Remove it search term in cookie
	$H.removeStock = function(val, k) { 	
		var terms = null;
		if ((terms = $.cookie('search'))) {
			terms = terms.split('##');
			var termsCookie = [];
			$.each(terms, function(i, v) {  if (v && v != val) termsCookie.push(v); });
			$.cookie('search', termsCookie.join('##'), {expires: 365, path: '/'});
		}
		$('span#term_'+k).remove();
	};
	
	// ====================== FRONT LINKS actions =================================================================//
	
	// Edit the links ?
	var editButton = function(bool) {
		if ($.browser.msie) $('span#editmode').html(' D&eacute;sol&eacute;, <strong>Internet Explorer</strong> n\'est pas support&eacute; :-( ! | ');
		else if (bool) $('span#editmode').html('<a href="javascript:void(0);" onclick="$H.editSites();" title="Editer les liens de cette page (Connexion avec Facebook, pour sauvegarder)">Editer</a> | ');
		else $('span#editmode').html('<a href="javascript:void(0);" onclick="$E.quitEditMode();" title="Effacer les modifications sans enregistrer">Quitter mode &eacute;dition</a> | ');
	};
	
	// Stop/Start stocking input
	$H.toggleStock = function() {
		toStock = ($.cookie('toStock') == 'no' ? true : false);
		if (toStock) { loadStock(); $('div#searhTerms').show(); }
		else { $.cookie('search', '', {expires: 365, path: '/'}); $('div#searhTerms').hide(); }
		$.cookie('toStock', (toStock ? 'yes' : 'no'), {expires:365, path:'/'});
		$('a#toggleStock').html((toStock ? 'Effacer' : 'Sauver'));
	};
	
	// Show/hide foxy
	$H.toggleFoxy = function() {
		foxAnim = !foxAnim;
		if (foxAnim) { $foxy.show(); $(document).trigger('mousemove'); }
		else $foxy.hide();
		$.cookie('foxy', (foxAnim ? 'yes' : 'no'), {expires:365, path:'/'});
		$('a#toggleStock').html((foxAnim ? 'Masquer' : 'Afficher'));
	};

	// ====================== FRONT POLISH =================================================================//
	
	// Main nav (top left)
	var highlightMenu = function() {
		var type = document.location.hash || 'home';
		$('div#menu a').removeClass('bold');
		$('div#menu a#'+type).addClass('bold');
	};

	// Fade in intro..
	var overlay = function(delay) {
		delay = delay || 5000;
		$('<div />')
			.attr({id:'overlay'}).css({top:0, left:0, width:docW+'px', height:docH+'px'})
			//.html('<h1>Message...</h1><p>'+message+'</p>')
			.appendTo('body')//.hide().fadeIn(200)
			.delay(delay).fadeOut(400, function(){ $(this).remove(); });
	};
	
	// Timer (for programmer ;)
	var clock = function() { var dt = new Date(); $('span#heure').html(pad(dt.getHours())+':'+pad(dt.getMinutes())+':'+pad(dt.getSeconds())); };
	var timer = function() { setInterval(clock, 1000); };
	
	// Fade in intro..
	/*var createFrame = function(e) {
		$linkFocus = $(e.target);
		var top = (e.pageX > (H / 2) ? 100 : (H / 2) );
		var left = (e.pageW > (W / 2) ? 100 : (W / 2) );
		$('<div />')
			.attr({id:'overlay'}).css({top:e.pageY, left:e.pageX, width:((W/2)-100)+'px', height:((H/2)-100)+'px'})
			//.html('<h1>Message...</h1><p>'+message+'</p>')
			.appendTo('body')//.hide().fadeIn(200)
			.delay(5000).fadeOut(400, function(){ $(this).remove(); });
	};*/
	
	// ====================== EVENTS ACTIONS =================================================================//
	
	// Smart focus input
	var inputFocus = 	function() { $inputQ.toggleClass('classQfocus', true); target = 'input'; },
		inputSetFocus = function() { $inputQ.focus(); },
		inputBlur = 	function() { $inputQ.toggleClass('classQfocus', false); target = 'page'; },
		inputSetBlur = 	function() { if ($inputQ.val() == '') $inputQ.blur(); };
	
	/*var mouseEnterLinkTimer = null;
	var timerLinkOpenFrame = function(e) {
		if (!currentLinkEnter) return;
		createFrame(e);
	};*/
	
	var mouseEnterLink = function(event) {
		inputSetBlur();
		/*$linkFocus = $(event.target);
		currentLinkEnter = $linkFocus.attr('tabIndex');
		if (mouseEnterLinkTimer) clearTimeout(mouseEnterLinkTimer);
		mouseEnterLinkTimer = setTimeout(timerLinkOpenFrame, 1200, event);*/
	};
	
	var mouseLeaveLink = function(event) {
		/*currentLinkEnter = null;*/
	};
	
	// Catch and AutoFill clicked link if we got search value ?
	var autoFill = function(event){
		//$(this).blur();
		if ($inputQ.val() != '' && $(this).attr('rel') && $(this).attr('rel').indexOf('{R}') != -1) {
			var val = $inputQ.val();
			addStock(val);
			val = escapeURI(val);
			return !window.open($(this).attr('rel').replace(/{R}/g, val));
		}
		return true;
	};
	
	// First input#q letter hide sites without search fonction
	var letterHide = function(event) {
		if (!isAutocomplete) initAutocomplete();
		if ($inputQ.val() == '' && once) once = false; 
		if (!once) {
			if ($inputQ.val() != '') { once = true; $aLinks.each(function() { if (!$(this).attr('rel')) $(this).fadeTo('slow', .2); }); }
			else { $aLinks.each(function() { if (!$(this).attr('rel')) $(this).fadeTo('slow', 1); }); }
		}
	};
	
	// Key Events HightLight Sites Names
	var highLight = function(event) {
		var key = event.which || event.keyCode;
		if (key == 27) { // KEY_ESC can came here...
			$('div#info,div#prefs').hide();
			if ($('div#divEdit').is(':visible')) $('div#divEdit').dialog('close');
		}
		if (target == 'input' && $inputQ.val().length >= 1) { // Don't highlight when typing search
			$aLinks.each(function() { $(this).attr('class', 'l'); }); // Reset links
		}
		else {
			if (!event2key[key]) return;
			$aLinks.each(function() {
				if (event2key[key] != '' && $(this).text().charAt(0).toLowerCase() == event2key[key]) // First letter equal key
					$(this).attr('class', 'l hightlight');
				else $(this).attr('class', 'l');
			});
		}
	};
	
	// Catch document clic // Lightest popup systeme... for 2 pops ^^
	var docClick = function(event) {
		if (!$(event.target).is('a#preferences') && !$(this).parents().is('div#prefs')) $('div#prefs').hide();
		if (!$(event.target).is('a#aide') && !$(this).parents().is('div#info')) $('div#info').hide();
	};
	
	// ====================== EVENTS LISTENER =================================================================//

	// Gestion des listeners...
	var initSitesLinksEvents = function() {
		$aLinks.bind('click', autoFill).bind('mouseenter', mouseEnterLink).bind('mouseleave', mouseLeaveLink);
		$inputQ.bind('keyup', letterHide).bind('mouseenter', inputSetFocus).bind('focus', inputFocus).bind('blur', inputBlur);
		$('select#searcher').bind('change', searchBot);
		$(document).bind('keypress', highLight);
		$('div#SearchBot a.l').keynav(); // Initialize jQuery keyboard navigation // http://mike-hostetler.com/jquery-keyboard-navigation-plugin
	};
	
	// Gestion des listeners... garbage colector..
	var removeSitesLinksEvents = function() {
		$aLinks.unbind('click', autoFill).unbind('mouseenter', mouseEnterLink).unbind('mouseleave', mouseLeaveLink);
		$inputQ.unbind('keyup', letterHide).unbind('mouseenter', inputSetFocus).unbind('focus', inputFocus).unbind('blur', inputBlur);
		$('select#searcher').unbind('change', searchBot);
		$(document).unbind('keypress', highLight);
		$().keynavReset(); // Reset jQuery keyboard navigation
	};
	
	// ====================== Enhanced SEARCH INPUT =================================================================//
	
	// Some start fct
	var searchInit = function() {
		var searcher = getUrlVars()['searcher']; // Cas special recherche Wikipedia
			if (searcher && /(home\.b2bweb\.fr)/.test(searcher)) window.document.location.href = 'http://fr.wiktionary.org/wiki/'.escape(getUrlVars()['q']);
		$('select#searcher')[0].selectedIndex = 0; // FF don't keep default menu item
		$inputQ.attr({autocomplete:'off'}); // Not valid for XHTML 1.0
		$('form#f').bind('submit', function(event) {
			var val = $inputQ.val();
			addStock(val);
		});
	};
	
	// SearchBoOoot select
	var searchBot = function(event) { 
		$('form#f').attr('action', 'http://www.google.fr/search'); // Re-Init form action
		var searchVal = $('input#searcher option:selected').val();
		if (searchVal == '') { $inputQ.val(''); return; }
		if (searchVal.indexOf('|') >= 0) { // Expression ?
			var searchValArr = searchVal.split('|');
			$('form#f').attr('action', searchValArr[0]); // url
			searchVal = searchValArr[1];
		}
		if (!expressionFilled && $inputQ.val() != '' && (searchVal == '{mot}' || searchVal == '{tag}')) { // Si requete simple ne pas effacer recherche
			$inputQ.selectRange(0, ($inputQ.val().length+1));
			expressionFilled = false;
		}
		else { // Requetes predefinies avec autoselect
			$inputQ.val(searchVal);
			$inputQ.selectRange(searchVal.indexOf('{'), (searchVal.indexOf('}')+1)); // autoselect word to be edited
			expressionFilled = true;
		} 
	};
	
	// Focus search Input and move Foxy around
	var focusSearch = function(event) {
		if (startAnime) {
			startAnime = false;
			$inputQ.focus();
			if (foxAnim == '1') $foxy.animate({top:0, left:(event.pageX - 120), opacity:1}, 1000, function() {
				intr = setInterval(function() { // Flying Foxy
					coef += 0.06;
					o = 0.4 + Math.abs(Math.cos(coef)*0.6);
					y = -dist + Math.abs(Math.cos(coef)*dist);
					$foxy.css({top:y+'px', opacity:o});
					$('div#footerBg').css({opacity:o});
					if (count >= 222) { // Clear all, enter iddle mode
						clearInterval(intr);
						$foxy.stop(true, true);
						$foxy.animate({top:'-'+$foxy.height()+'px', opacity:0}, function() { startAnime = true; count = 0; });
						$('div#footerBg').css({opacity:.8});
					}
					else if (count % parseInt(Math.random() * 20) == 0) dist = Math.abs(Math.cos(count/100)) * 10;
					count++;
				}, 50);
			});
			else { $foxy.hide(); $foxy.css({top:0}); }
		}
		else if (foxAnim && !$foxy.is(':animated')) {
			var l = (event.pageX || 360) - 120;
			var v = ($(window).width() / 2) - 120;
			if (l < v) { l += v; if (l > $(window).width() - 250) l = $(window).width() - 240; }
			else { l -= v; if (l < 0) l = 0; }
			$foxy.animate({left:l}, {duration:1400, easing:'easeInQuad'});
			count = 0;
		}
	};

	// ====================== LINKS and PAGES structure =================================================================//
	
	// Calculate colones (UL) equal width and make first row (float:left) bottom aligned
	$H.setUlCol = function(boolBottom) {
		// Colonnage
		var W = $('#SearchBot').width(),
			numCat = SITES.length,
			numCatMed = Math.floor(numCat / 2),
			L1w = Math.floor(W / numCatMed),
			L2w = Math.floor(W / (numCat - numCatMed));
		$('ul#L1 ul.sortUlLink').css({width:L1w+'px'});
		$('ul#L1 ul.sortUlLink li').css({width:L1w+'px'});
		$('ul#L2 ul.sortUlLink').css({width:L2w+'px'});
		$('ul#L2 ul.sortUlLink li').css({width:L2w+'px'});
		// Fix Bottom align for first li in top div
		var L1height = $('ul#L1').height();
		$('ul#L1 li ul.sortUlLink').each(function(){ 
			if (boolBottom) {
				var h = L1height - $(this).height();
				$(this).find('li:first').css({margin:h+'px 0 0 0'});
			}
			else $(this).find('li:first').css({margin:'0'});
		});
	};
	
	// Dyn Centered layout
	$H.posItem = function() {
		H = $(window).height();
		W = $(window).width();
		var h = $('div#SearchBot').height(),
			w = $('div#SearchBot').width();
		$('body').css({overflow:(H < h || W < w ? 'auto' : 'hidden')});
		$('div#SearchBot').center();
		$('div#prefs').center();
		$('div#info').center();
	};
	
	// ====================== Outsided JS to edit LINKS and SITES =================================================================//
	
	// Rock & Roll double autocomplete...
	var initAutocomplete = function() { 
		isAutocomplete = true;
		$inputQ.autocomplete({
			suggestUrl:		$H.WWW+'_google_suggest.php',
			seedsUrl:		$H.WWW+'_veryrelated.php',
			minChars:		1,
			delimiter:		/(,|\+|-|AND)\s*/,
			autoSubmit:		false,
			maxHeight:		600,
			deferRequestBy:	0
		});
	};
	
	// FRONT // load JS and Enter Edit Mode
	$H.editSites = function(event){
		if (event) event.preventDefault();
		editButton(false);
		removeSitesLinksEvents();
		if (typeof($E) == 'undefined') {
			loadCss($H.WWW+'css/start/jquery-ui-1.8.custom.css');
			getScript($H.WWW+'js/jquery-ui-1.8.sortableDialog.min.js');
			getScript($H.WWW+'js/jquery.edit.js', function() { $E.startEditMode(); }); //.min
		}
		else $E.startEditMode();
		return false;
	};
	
	var createAccount = function(e) {}; // TODO, simple user account, without FB !!!
	
	// ====================== Playing with DATAZ and making this beautifull page =================================================================//
	
	// FRONT // Overwrite SITES datas var with new one...
	$H.setDatas = function(type) { 
		removeSitesLinksEvents(); // When rebuilding data, delete previous listenners
		var jsSrc = 'js/sitesDatas.js.php';
		switch(type) {
			case 'code' : jsSrc = 'js/sitesDatas-code.js'; break;
			case 'twitter' : jsSrc = 'js/sitesDatas-twitter.js'; break;
		}
		getScript($H.WWW+jsSrc, function() { buildSites(); $H.initSites(); } );
		document.location.hash = type || '';
		highlightMenu();
		return false;
	};
	
	// Parse JS data for all sites and build a list
	var buildSites = function() {
		// Parse Sites
		var numCat = SITES.length, numCatMed = Math.floor(numCat / 2);
		var tplTable = ''; var tplTdCat = ''; var tplTdSites = ''; var tplTdSitesSite = '';
		for (var CAT in SITES) {
			tplTdCat = '<li class="sortLinkCat"><h3>'+SITES[CAT]['title']+'</h3></li>'; // TITRES
			tplTdSitesSite = '';
			for (var site in SITES[CAT]['data']) {
				var siteObj = SITES[CAT]['data'][site];
				if (siteObj['href'] && siteObj['title'])
					tplTdSitesSite += '<li class="sortLink"><a href="'+siteObj['href']+'" rel="'+(siteObj['result'] || '')+'" title="'+(siteObj['tips'] || '')+'" class="l" tabindex="'+(tabIndex++)+'">'+siteObj['title']+'</a></li>'; // LINKS
			}
			if ((parseInt(CAT)+1) <= numCatMed) tplTdSites += '<li><ul class="sortUlLink">'+tplTdSitesSite+tplTdCat+'</ul></li>';
			else tplTdSites += '<li><ul class="sortUlLink">'+tplTdCat+tplTdSitesSite+'</ul></li>';
			if ((parseInt(CAT)+1) == numCatMed) { // FIRST table
				$('#D1').html('<ul id="L1" class="sortUlCat">'+tplTdSites+'</ul>');
				tplTable = ''; tplTdCat = ''; tplTdSites = '';
			}
			else if ((parseInt(CAT)+1) == numCat) { // End, fill SECOND table
				$('#D2').html('<ul id="L2" class="sortUlCat">'+tplTdSites+'</ul>');
			}
		}
		$aLinks = $('a.l');
	};
	
	// Select a random link - click this, I know you want ;p
	var rdmSites = function() {
		var randomLink = Math.round((Math.random() * $aLinks.length));
		$aLinks.eq(randomLink).addClass('hightlight2'); 
	};
	
	// Init Sites list builder 
	$H.initSites = function() {
		editButton(true);
		$H.setUlCol(true);
		$H.posItem();
		rdmSites();
		initSitesLinksEvents();
	};
	
	// ====================== Ok, let's go ! =================================================================//
	
	$(document).ready(function() {
		// Main elements... (others are badly mixed in code...)
		$inputQ = $('input#q'); // Main input for searches
		$aLinks = $('a.l'); // Les liens magiques
		$foxy = $('div#foxy'); // Le truc qui bouge
		
		W = $(window).width(); H = $(window).height(); docW = $(document).width(); docH = $(document).height();	
		overlay(500);
		$('div#SearchBot').show();
		$('a.css').styleInit(); // Load cookie CSS and manage switch
		highlightMenu(); // Set menu bar items
		searchInit(); // Search Form scripting
		if ($.cookie('foxy')) foxAnim = ($.cookie('foxy') == 'yes' ? true : false);
		$(document).mousemove(focusSearch);
		$(document).bind('click', docClick);
		$(window).bind('resize', $H.posItem);
		switch(document.location.hash) { // Load sites DATAS
			case '#code': $H.setDatas('code'); break;
			case '#twitter': $H.setDatas('twitter'); break;
			default:
				buildSites();
				if (document.location.hash == '#editmode') $H.editSites();
				else $H.initSites();
		}
		timer(); // Clock
		loadStock(); // Cookie stocked user searchs ?
	});
	
	// That the end... having time for third party ! [Edited : NOT HAVING TIME !]
	/*
		$(window).bind('load', function(){ 
			loadJs('http://static.ak.connect.facebook.com/connect.php');
			setTimeout("FB.init('<?=$api_key;?>', 'xd_receiver.htm', {reloadIfSessionStateChanged:true});", 700);
			loadJs('http://www.google-analytics.com/ga.js');
			setTimeout('yTics();', 800);
			loadJs($H.WWW+'js/uservoice.tab.js');
			setTimeout(function() { // didWeHaveADoodleToday ?
				$.ajax({url:'doodle.php', success:function(divDoodle) { if (divDoodle) $('body').append(divDoodle); } });
			}, 30000);
		});
	*/
})(jQuery, $H);