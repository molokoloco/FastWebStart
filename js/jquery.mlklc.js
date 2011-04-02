/*////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Code mixing by Molokoloco ..... 2011 ......... [EVER IN PROGRESS (it's not done yet)] /////////////
////  Sources : https://github.com/molokoloco/FastWebStart/                                /////////////
//////////////////////////////////////////////////////////////////////////////////////////////////// */

// ------------------------------------ jQuery extends ------------------------------------ //

$(function(){
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
            if ($.cookie) $.cookie('css', stylePath, cookieOptions);
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
});

// ------------------------------------ Some little functions... ------------------------------------ //

var db = function() { 'console' in window && console.log.call(console, arguments); },
	trim = function(string) { return string.replace(/^\s+|\s+$/g, ''); },
	escapeURI = function(url) { return encodeURIComponent(url) || encodeURI(url) || escape(url) || url; },
	event2key = {'97':'a', '98':'b', '99':'c', '100':'d', '101':'e', '102':'f', '103':'g', '104':'h', '105':'i', '106':'j', '107':'k', '108':'l', '109':'m', '110':'n', '111':'o', '112':'p', '113':'q', '114':'r', '115':'s', '116':'t', '117':'u', '118':'v', '119':'w', '120':'x', '121':'y', '122':'z'},
	pad = function(n) { return (n < 10 ? '0'+n : n); },
	addslashes = function (str) { return (str+'').replace(/\'/g,'\\\'').replace(/"/g, '&quot;').replace(/\u0000/g, "\\0"); },
	html2input = function(str) { return unescape(str+'').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
	input2html = function(str) { return (str+'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'); },
	// index.html?name=foo -> 	name = getUrlVars()[name]; 
	_vars = {}, getUrlVars = function() { if (_vars.length > 0) return _vars; var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { _vars[key] = value; }); return _vars; },
	// sites['link'].sort($.objSortByTitle);
	objSortByTitle = function (a, b) { var x = a.title.toLowerCase(); var y = b.title.toLowerCase(); return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }, 
	// loadJs('http://other.com/other.js'); // For external link
	loadJs = function(jsPath) { var s = document.createElement('script'); s.setAttribute('type', 'text/javascript'); s.setAttribute('src', jsPath); document.getElementsByTagName('head')[0].appendChild(s); },
	loadCss = function(stylePath) { $('head').append('<'+'link rel="stylesheet" type="text/css" href="'+stylePath+'"/>'); },
	// getScript('./other.js', function() { ok(); });
	getScript = function(src, callback) { $.ajax({dataType:'script', async:false, cache:true, url:src, success:function(response) { if (callback && typeof callback == 'function') callback(); }}); };
	// Google analytics
	// yTics = function() { try { var pageTracker = _gat._getTracker('UX-888888-8'); pageTracker._trackPageview(); } catch(e) {}; },
	// Mini forum
	// uservoiceOptions = {key:'b2bweb', host:'b2bweb.uservoice.com', forum:'88888', showTab: true, alignment:'right', background_color:'#1395B8', text_color:'white', hover_color:'#41608F', lang:'fr'};

// ------------------------------------ Here the page stuff... ------------------------------------ //

var $H = new Object(); // GLOBAL SHARED OBJ (with edit.js and index.php)
$H.WWW = ( /localhost\//.test(document.location) ? 'http://localhost/www.b2bweb.fr/home/' : 'http://home.b2bweb.fr/' ); // Site ROOT url

$(function() {
	
	// ====================== "Global" VARS =================================================================//

	// Main elements (Setted in DOM init !)... others are badly mixed in code ^^
	var $inputQ = null, 	// $('input#q'); // Main input for searches
		$aLinks = null, 	// $('a.l'); // Les liens magiques
		$foxy = null, 		// $('div#foxy'); // Le truc qui bouge
		$searchBot = null; 	// $('div#SearchBot'); 
		
	// Public
	var googleSearchUrl = 'http://www.google.fr/search',
		anonymousSearchUrl = 'http://google.b2bweb.fr/search',
		isAnonymous = ($.cookie('isAnonymous') === 'no' ? false : true);
		maxSearchLength = 250, // Max search characters in cookie
		cookieOptions = {expires:360, path:'/'};//, domain:document.domain};
	
	// Privates
	var W = 800, H = 600, docW = 800, docH = 600, // Window viewport
		foxAnim = true, startAnime = true, intr = null, coef = 0, dist = 0, count = 0, o = 0, y = 0,  // Fox Anim !
		toStock = true, once = false, expressionFilled = false, one = 0, focusTarget = 'page',  // Form magic
		searchTermIgnited = false, isAutocomplete = false, tabIndex = 3, currentLinkEnter = null; // Others...
	
	// ====================== STOCK SEARCHs in cookie =================================================================//
	
	// Display cookie stocked search terms
	var cookieLoadTerms = function(init) {
		// $.cookie('search', 'love##test', {expires: 365, path: '/'});
		// Also tested with DOM data, but fail in Chrome (Lost when refresh ?) $('body').data('search', {search1:'word1'});
		if ($.cookie('searchHistory') == 'no') return;
		var terms = null, termsHtml = '', vTerm = '';
		if ((terms = $.cookie('search'))) {
			$.each(terms.split('##'), function(i, v) {
				if (v == '') return;
				vTerm = html2input(v);
				termsHtml += '<span id="term_'+i+'"><a href="javascript:void(0)" onclick="$(\'input#q\').val(\''+addslashes(vTerm)+'\').select();" class="lien2" title="Ajouter">'+vTerm+'</a><a href="javascript:void(0)" onclick="$H.cookieDeleteTerm(\''+v+'\', \''+i+'\');" title="Effacer">&#10006;</a>, </span>';
			});
		}
		if (termsHtml == '') return;
		$('div#searhTerms').html(termsHtml.substr(0, (termsHtml.length - 9)));
		if (init && $inputQ.val() == '' && $.cookie('emptySearch') != 'yes') {
			$inputQ.val(input2html(vTerm)).select(); // When init, re-fill with last search, unless user clear it on his last action
			searchTermIgnited = true;
		}
	};
	
	// Add new search term in cookie // called before leaving the page
	var cookieAddTerm = function(val) {
		if ($.cookie('searchHistory') == 'no') return; // Preferences "pas de stock des recherches"
		if (!val) {
			$.cookie('emptySearch', 'yes', cookieOptions);  // if search is empty, don't re-fill next time
			return; // Nothing to stock...
		}
		$.cookie('emptySearch', 'no', cookieOptions); // re-fill search next time
		var terms = null, exist = false, termsCookie = [], totalLength = val.length;
		val = escape(val); // addslashes(escape(val)); // htmlentities(val, 'ENT_QUOTES') // http://phpjs.org/functions/htmlentities
		if ((terms = $.cookie('search'))) { // Check if already exist
			$.each(terms.split('##'), function(i, v) { 
				if (v == val) exist = true;
				else totalLength += unescape(v).length;
				if (v != '' && totalLength < maxSearchLength) termsCookie.push(v); // Limited size...
			});
		}
		if (exist) return;
		termsCookie.push(val);
		$.cookie('search', termsCookie.join('##'), cookieOptions);
		cookieLoadTerms(); // Display, even if user leave the page
	};
	
	// Remove a search term in cookie
	// $H == Globally accessible...
	$H.cookieDeleteTerm = function(val, k) { 	
		var terms = null, termsCookie = [];
		if ((terms = $.cookie('search'))) {
			$.each(terms.split('##'), function(i, v) { if (v != '' && v != val) termsCookie.push(v); }); // Rebuild
			$.cookie('search', termsCookie.join('##'), cookieOptions);
		}
		$('span#term_'+k).remove(); // window.document.location.reload();
	};
	
	// ====================== FRONT LINKS actions =================================================================//
	
	// Navigational #hash
	var getHash = function() {
			var hash = document.location.hash.replace(/^#/, '');
			return hash || $.cookie('hash') || 'home';
		},
		setHash = function(hash) {
			// window.location.hash = '#'+hash; 
			window.location.replace($H.WWW+'#'+hash); // No index
			$.cookie('hash', hash, cookieOptions);
		};

	// Edit the links ?
	var editButton = function(edit) {
		if ($.browser.msie) $('span#editmode').html(' D&eacute;sol&eacute;, <strong>Internet Explorer</strong> n\'est pas support&eacute; :-( ! | ');
		else if (edit) $('span#editmode').html('<a href="javascript:void(0);" onclick="$H.editSites();" title="Editer les liens de cette page (Connexion avec Facebook, pour sauvegarder)">Editer</a> | ');
		else $('span#editmode').html('<a href="javascript:void(0);" onclick="$E.quitEditMode();" title="Effacer les modifications sans enregistrer">Quitter mode &eacute;dition</a> | ');
	};
	
	// Prefs, Stop/Start stocking input
	$H.toggleCookiesTerms = function() {
		toStock = ($.cookie('searchHistory') == 'no' ? true : false);
		if (toStock) { cookieLoadTerms(); $('div#searhTerms').show(); }
		else { $.cookie('search', '', cookieOptions); $('div#searhTerms').hide(); }
		$.cookie('searchHistory', (toStock ? 'yes' : 'no'), cookieOptions);
		$('a#toggleCookiesTerms').html((toStock ? 'Effacer' : 'Sauver'));
	};
	
	// Prefs, Show/Hide Foxy
	$H.toggleFoxy = function() {
		foxAnim = !foxAnim;
		if (foxAnim) { $foxy.show(); $(document).trigger('mousemove'); }
		else $foxy.hide();
		$.cookie('foxy', (foxAnim ? 'yes' : 'no'), cookieOptions);
		$('a#toggleCookiesTerms').html((foxAnim ? 'Masquer' : 'Afficher'));
	};

	// ====================== FRONT POLISH =================================================================//
	
	// Main nav style
	var menuSelectCurrent = function() {
		var type = getHash();
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
	var timer = function() { var dt = new Date(); $('span#heure').html(pad(dt.getHours())+':'+pad(dt.getMinutes())+':'+pad(dt.getSeconds())); };
	var clock = function() { setInterval(timer, 1000); };
	
	// ====================== EVENTS ACTIONS =================================================================//
	
	// Smart focus input
	var inputFocus = function(event) {
			$inputQ.toggleClass('classQfocus', true);
			focusTarget = 'input';
		},
		inputSetFocus = function() {
			$inputQ.focus();
		},
		inputBlur = function(event) {
			$inputQ.toggleClass('classQfocus', false);
			focusTarget = 'page';
		},
		inputSetBlur = function() {
			if (!$inputQ.val()) $inputQ.blur();
			else if (!searchTermIgnited) {
				var valLen = $inputQ.val().length; 
				$inputQ.selectRange(valLen, valLen);
			}
		};
	
	
	/*	// TODO...
		var mouseEnterLinkTimer = null;
		var timerLinkOpenFrame = function(e) {
			if (!currentLinkEnter) return;
			createFrame(e);
		};
		
		var createFrame = function(e) {
			$linkFocus = $(e.target);
			var top = (e.pageX > (H / 2) ? 100 : (H / 2) );
			var left = (e.pageW > (W / 2) ? 100 : (W / 2) );
			$('<iframe />')
				.attr({id:'frameSet'}).css({top:e.pageY, left:e.pageX, width:((W/2)-100)+'px', height:((H/2)-100)+'px'})
				.appendTo('body')//.hide().fadeIn(200)
				.delay(5000).fadeOut(400, function(){ $(this).remove(); });
		};
	*/
	
	var mouseEnterLink = function(event) {
			inputSetBlur();
			/*$linkFocus = $(event.target);
			currentLinkEnter = $linkFocus.attr('tabIndex');
			if (mouseEnterLinkTimer) clearTimeout(mouseEnterLinkTimer);
			mouseEnterLinkTimer = setTimeout(timerLinkOpenFrame, 1200, event);*/
		},
		mouseLeaveLink = function(event) {
			/*currentLinkEnter = null;*/
		};
	
	// Catch and linkClickSearch clicked link if we got search value ?
	var linkClickSearch = function(event) {
		var val = $inputQ.val(),
			rel = $(this).attr('rel');
		cookieAddTerm(val);
		if (val != '' && rel != '' && rel.indexOf('{R}') != -1) {
			return !window.open($(this).attr('rel').replace(/{R}/g, escapeURI(val)));
		}
		return true; // Open link...
	};
	
	// First input#q letter hide sites without search fonction
	var linksFadeNoSearch = function(event) {
		if (!isAutocomplete) initAutocomplete();
		if (!once && $inputQ.val() != '') { // Hide
			once = true;
			$aLinks.each(function() { if ($(this).attr('rel') == '') $(this).fadeTo('slow', .2); });
		}
		else if (once && $inputQ.val() == '') { // Re-show
			once = false;
			$aLinks.each(function() { if ($(this).attr('rel') == '') $(this).fadeTo('slow', 1); });
		}
		searchTermIgnited = false; // first user action.. auto (de)select terms search input
	};
	
	// Key Events HightLight Sites Names
	var linksHighlight = function(event) {
		var key = event.which || event.keyCode;
		if (key == 27) { // KEY_ESC for tiny popup can came here...
			$('div#info,div#prefs').hide();
			if ($('div#divEdit').is(':visible')) $('div#divEdit').dialog('close');
		}
		if (focusTarget == 'input' && $inputQ.val().length >= 1) { // Don't highlight when typing search
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
	var documentClick = function(event) {
		if (!$(event.target).is('a#preferences') && !$(this).parents().is('div#prefs')) $('div#prefs').hide();
		if (!$(event.target).is('a#aide') && !$(this).parents().is('div#info')) $('div#info').hide();
	};
	
	// Play with mouse, focus search Input and move Foxy around
	var documentMove = function(event) {
		if (startAnime) {
			startAnime = false;
			$inputQ.focus();
			if (foxAnim == '1') $foxy.animate({top:0, left:(event.pageX - 120), opacity:1}, 1000, function() { // Appear... and move
				intr = setInterval(function() { // Flying Foxy
					coef += 0.06;
					o = 0.4 + Math.abs(Math.cos(coef)*0.6);
					y = -dist + Math.abs(Math.cos(coef)*dist);
					$foxy.css({top:y+'px', opacity:o});
					$('div#footerBg').css({opacity:o});
					if (count >= 222) { // Clear all, enter iddle mode
						clearInterval(intr);
						$foxy.stop(true, true).animate({top:'-'+$foxy.height()+'px', opacity:0}, function() { startAnime = true; count = 0; });
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
			var v = (W / 2) - 120; // W == $(window).width()
			if (l < v) { l += v; if (l > W - 250) l = W - 240; }
			else { l -= v; if (l < 0) l = 0; }
			$foxy.animate({left:l}, {duration:1400, easing:'easeInQuad'});
			count = 0;
		}
	};
	
	// ====================== EVENTS LISTENER =================================================================//

	// Gestion des listeners...
	var initElementsEvents = function() {
			$aLinks.bind('click', linkClickSearch).bind('mouseenter', mouseEnterLink).bind('mouseleave', mouseLeaveLink);
			$inputQ.bind('keyup', linksFadeNoSearch).bind('mouseenter', inputSetFocus).bind('focus', inputFocus).bind('blur', inputBlur);
			$('select#searcher').bind('change', searchBotAdvanced);
			$(document).bind('keypress', linksHighlight);
			$('div#SearchBot a.l').keynav(); // Initialize jQuery keyboard navigation // http://mike-hostetler.com/jquery-keyboard-navigation-plugin // Checkup TODO !
		},
		removeElementsEvents = function() { // Gestion des listeners... garbage colector..
			$aLinks.unbind('click', linkClickSearch).unbind('mouseenter', mouseEnterLink).unbind('mouseleave', mouseLeaveLink);
			$inputQ.unbind('keyup', linksFadeNoSearch).unbind('mouseenter', inputSetFocus).unbind('focus', inputFocus).unbind('blur', inputBlur);
			$('select#searcher').unbind('change', searchBotAdvanced);
			$(document).unbind('keypress', linksHighlight);
			$().keynavReset(); // Reset jQuery keyboard navigation
		};
	
	// ====================== SEARCH FORM and INPUT =================================================================//
		
	var searchFormInit = function() {
		$('select#searcher')[0].selectedIndex = 0; // FF don't keep default menu item
		$inputQ.attr({autocomplete:'off'}); // Not valid for XHTML 1.0
		$('form#f').bind('submit', searchFormSubmit);
		$H.setFormAction(!isAnonymous); // Init form action, without toggle
	};
	
	// Form fct
	var searchFormSubmit = function(event) {
		cookieAddTerm($inputQ.val());
		// Cas special recherche Wikipedia
		var formAction = $('form#f').attr('action');
		if (formAction != googleSearchUrl &&  /(home\.b2bweb\.fr)/.test(googleSearchUrl)) {
			event.preventDeafult();
			window.document.location.href = 'http://fr.wiktionary.org/wiki/'.escapeURI($inputQ.val());
		}
	};
	
	$H.setFormAction = function(anonymous) {
		// <a href="http://google.b2bweb.fr/search?hl=fr&amp;q=anonyme" onClick="if ($('input#q').val() != '') return window.open('http://google.b2bweb.fr/search?hl=fr&amp;q='+$('input#q').val());" class="lien2" id="anonyme">Recherche anonyme</a>
		if (typeof(anonymous) !== 'boolean') anonymous = isAnonymous; // Default
		anonymous = !anonymous; // Toggle
		$('form#f').attr('action', (anonymous ? anonymousSearchUrl : googleSearchUrl));
		$('a#anonyme').text(anonymous ? 'Recherche anonyme' : 'Recherche normale');
		$.cookie('isAnonymous', (anonymous ? 'yes' : 'no'), cookieOptions);
		isAnonymous = anonymous;
		return false;
	};
	
	// Search BoOoot <select>
	var searchBotAdvanced = function(event) { 
		$H.setFormAction(!isAnonymous); // Re-Init form action, without toggle
		var searchVal = $('select#searcher option:selected').val(); // Check this to understand next lines
		if (searchVal == '') return;
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

	// ====================== LINKS and PAGES structure =================================================================//
	
	// Calculate columns (UL) equal width and make first row (float:left) bottom aligned
	$H.setUlColSize = function(boolBottom) {
		// Colonnage
		var W = $searchBot.width(),
			numCat = SITES.length,
			numCatMed = Math.floor(numCat / 2),
			L1w = Math.floor(W / numCatMed),
			L2w = Math.floor(W / (numCat - numCatMed));
		// Two mains rows containing all links
		$('ul#L1 ul.sortUlLink,ul#L1 ul.sortUlLink li').css({width:L1w+'px'});
		$('ul#L2 ul.sortUlLink,ul#L2 ul.sortUlLink li').css({width:L2w+'px'});
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
	$H.centerElements = function() {
		H = $(window).height();
		W = $(window).width();
		var h = $searchBot.height(),
			w = $searchBot.width();
		$('body').css({overflow:(H < h || W < w ? 'auto' : 'hidden')});
		$('div#SearchBot,div#prefs,div#info').center();
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
	
	// FRONT // load JS and enter Edit mode
	$H.editSites = function(event){
		if (event) event.preventDefault();
		editButton(false);
		removeElementsEvents();
		if (typeof($E) == 'undefined') {
			loadCss($H.WWW+'css/start/jquery-ui-1.8.custom.css');
			getScript($H.WWW+'js/jquery-ui-1.8.sortableDialog.min.js');
			getScript($H.WWW+'js/jquery.edit.min.js', function() { $E.startEditMode(); }); // .min
		}
		else $E.startEditMode();
		return false;
	};
	
	var createAccount = function(e) {}; // TODO, simple user account, without FB !!!
	
	// ====================== Playing with DATAZ and making this beautifull page ^^ ===============================================//
	
	// FRONT // Overwrite SITES datas var with new one...
	$H.setDatas = function(type) { 
		removeElementsEvents(); // When rebuilding data, delete previous listenners
		var jsSrc = 'js/sitesDatas.js.php'; // Pass through .PHP if user got $_SESSION
		switch (type) {
			case 'code' : jsSrc = 'js/sitesDatas-code.js'; break;
			case 'twitter' : jsSrc = 'js/sitesDatas-twitter.js'; break;
			default : type = 'home';
		}
		getScript($H.WWW+jsSrc, function() { $H.buildSites(); $H.initSites(); } );
		setHash(type);
		menuSelectCurrent();
		return false;
	};
	
	// Parse JS data for all sites and build a list
	$H.buildSites = function() {
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
	var rdmLinkHighlight = function() {
		var randomLink = Math.round((Math.random() * $aLinks.length));
		$aLinks.eq(randomLink).addClass('hightlight2'); 
	};
	
	// Init Sites list builder 
	$H.initSites = function() {
		editButton(true);
		$H.setUlColSize(true);
		$H.centerElements();
		rdmLinkHighlight();
		initElementsEvents();
	};
	
	
	// ====================== Ok, let's go ! =================================================================//
	
	$(document).ready(function() {
		W = $(window).width(), H = $(window).height(), docW = $(document).width(), docH = $(document).height();	
		overlay(500);
		// Main elements... (others are badly mixed in code...)
		$inputQ = $('input#q'); // Main input for searches
		$aLinks = $('a.l'); // Les liens magiques
		$foxy = $('div#foxy'); // Le truc qui bouge
		$searchBot = $('div#SearchBot'); // Main Div container
		// Load logic (as always as discutable as it be)
		$('a.css').styleInit(); // Load cookie CSS and manage switch
		cookieLoadTerms(true); // Cookie stocked user searchs ?
		menuSelectCurrent(); // Set menu items
		searchFormInit(); // Search Form scripting
		$searchBot.fadeIn(300);
		var hash = getHash(); // D'abord dans l'URL puis dans le cookie...
		switch (hash) { // Load sites DATAS
			case 'code': $H.setDatas('code'); break; // Load sitesData-code.js...
			case 'twitter': $H.setDatas('twitter'); break;
			default:
				$H.buildSites(); // Datas already here (faster init)
				if (hash == 'editmode') $H.editSites();
				else $H.initSites();
		}
		if ($.cookie('foxy')) foxAnim = ($.cookie('foxy') == 'yes' ? true : false);
		$(document).bind('mousemove', documentMove).bind('click', documentClick);
		$(window).bind('resize', $H.centerElements);
		clock();
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
});