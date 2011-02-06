/*////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Code mixing by Molokoloco ..... 2011 ......... [EVER IN PROGRESS (it's not done yet)] /////////////
////  Sources : https://github.com/molokoloco/FastWebStart/                                /////////////
//////////////////////////////////////////////////////////////////////////////////////////////////// */

// ------------------------------------ Some little functions... ------------------------------------ //
var db = function(x) { 'console' in window && console.log.call(console, arguments); };
var die = function(mess) { throw(( mess ? mess : "Oh my god moonWalker is down...")); };
var trim = function(string) { return string.replace(/^\s+|\s+$/g, ''); };
var escapeURI = function(url) { if (encodeURIComponent) return encodeURIComponent(url); else if (encodeURI) return encodeURI(url); else if (escape) return escape(url); else return url; };
var event2key = {'97':'a', '98':'b', '99':'c', '100':'d', '101':'e', '102':'f', '103':'g', '104':'h', '105':'i', '106':'j', '107':'k', '108':'l', '109':'m', '110':'n', '111':'o', '112':'p', '113':'q', '114':'r', '115':'s', '116':'t', '117':'u', '118':'v', '119':'w', '120':'x', '121':'y', '122':'z'};
var pad = function(n) { return (n < 10 ? '0'+n : n); };
var addslashes = function (str) { return (str+'').replace(/\'/g,'\\\'').replace(/"/g, '&quot;').replace(/\u0000/g, "\\0"); };
var input2html = function(str) { return unescape((str+'')).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
// index.html?name=foo -> var name = getUrlVars()[name]; 
var getUrlVars = function() { var vars = {}; var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { vars[key] = value; }); return vars; };
// sites['link'].sort($.objSortByTitle);
var objSortByTitle = function (a, b) { var x = a.title.toLowerCase(); var y = b.title.toLowerCase(); return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }; 
// loadJs('http://other.com/other.js'); // For external link
var loadJs = function(jsPath) { var s = document.createElement('script'); s.setAttribute('type', 'text/javascript'); s.setAttribute('src', jsPath); document.getElementsByTagName('head')[0].appendChild(s); };
var loadCss = function(stylePath) { $('head').append('<link rel="stylesheet" type="text/css" href="'+stylePath+'"/>'); };
// getScript('./other.js', function() { ok(); });
var getScript = function(src, callback) { $.ajax({dataType:'script', async:false, cache:true, url:src, success:function(response) { if (callback && typeof callback == 'function') callback(); }}); };
// Google analytics for me, don't use APIKEY
var yTics = function() { try { var pageTracker = _gat._getTracker('UA-1944677-8'); pageTracker._trackPageview(); } catch(e) {}; };
// Mini forum for me, don't use APIKEY
var uservoiceOptions = {key:'b2bweb', host:'b2bweb.uservoice.com', forum:'35888', showTab: true, alignment:'right', background_color:'#1395B8', text_color:'white', hover_color:'#41608F', lang:'fr'};

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
            if (exist == false) $('head').append('<link rel="stylesheet" type="text/css" href="' + stylePath + '" id="theme' + Math.random() + '"/>');
            setTimeout(function () { $(disabled).each(function () { $(this).attr('disabled', 'disabled'); }); }, 900);
            $.cookie('css', stylePath, {expires: 365, path: '/'});
        },
        styleInit: function () {
            if ($.cookie('css')) {
                var isSet = false;
                $('link[rel*=style][id]').each(function () { if ($.cookie('css') == $(this).attr('href')) isSet = true; });
                if (isSet == false) $.fn.styleSwitch($.cookie('css'));
            }
            return $(this).click(function (event) {
                event.preventDefault();
                $.fn.styleSwitch($(this).attr('rel'));
                $(this).blur();
            });
        }
	});
})(jQuery);

// ------------------------------------ Here the page stuff... ------------------------------------ //
// Public
var WWW = ( /localhost\//.test(document.location) ? 'http://localhost/www.b2bweb.fr/home/' : 'http://home.b2bweb.fr/' );
// Private
var foxAnim = true, toStock = true, startAnime = true, once = false, expressionFilled = false, intr = null, coef = 0, dist = 0, count = 0, o = 0, y = 0, one = 0, target = 'input', isAutocomplete = false;

// Init Sites list builder 
var initSites = function() {
	editButton(true);
	setUlCol(true);
	posItem();
	rdmSites();
	initSitesLinkDefaultEvent();
};

// load JS and Enter Edit Mode
var editSites = function(event){
	if (event) event.preventDefault();
	editButton(false);
	removeSitesLinkDefaultEvent();
	if (typeof startEditMode != 'function') {
		loadCss('css/start/jquery-ui-1.8.custom.css');
		getScript(WWW+'js/jquery-ui-1.8.sortableDialog.min.js');
		getScript(WWW+'js/jquery.edit.min.js', function() { startEditMode(); });
	}
	else startEditMode();
	return false;
};

// Overwrite SITES datas var with new one...
var setDatas = function(type) { 
	var jsSrc = 'js/sitesDatas.js.php';
	switch(type) {
		case 'code' : jsSrc = 'js/sitesDatas-code.js'; break;
		case 'twitter' : jsSrc = 'js/sitesDatas-twitter.js'; break;
	}
	getScript(WWW+jsSrc, function() { buildSites(); initSites();} );
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
				tplTdSitesSite += '<li class="sortLink"><a href="'+siteObj['href']+'" rel="'+(siteObj['result'] || '')+'" title="'+(siteObj['tips'] || '')+'" class="l">'+siteObj['title']+'</a></li>'; // LINKS
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
};

var highlightMenu = function() {
	var type = document.location.hash || 'home';
	$('div#menu a').removeClass('bold');
	$('div#menu a#'+type).addClass('bold');
};

// Calculate colones (UL) equal width and make first row (float:left) bottom aligned
var setUlCol = function(boolBottom) {
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
var posItem = function() {
	var H = $(window).height(),
		W = $(window).width(),
		h = $('div#SearchBot').height(),
		w = $('div#SearchBot').width();
	if (H < h || W < w) $('body').css({overflow:'auto'});
	else $('body').css({overflow:'hidden'});
	$('div#SearchBot').center();
	$('div#prefs').center();
	$('div#info').center();
};

// Some start fct
var searchInit = function() {
	var searcher = getUrlVars()['searcher']; // Cas special recherche Wikipedia
	if (searcher && /(home\.b2bweb\.fr)/.test(searcher)) window.document.location.href = 'http://fr.wiktionary.org/wiki/'.escape(getUrlVars()['q']);
	$('select#searcher')[0].selectedIndex = 0; // FF don't keep default menu item
	$('input#q').attr({autocomplete:'off'}); // Not valid for XHTML 1.0
	$('input#q').focus(function() { $(this).css({'background-color':'#FFFFFF'}); }).blur(function() { $(this).css({'background-color':'#D6ECFC'}); });
	$('form#f').bind('submit', function(e) {
		var val = $('input#q').val();
		addStock(val);
	});
};

// Random link, click this, I know you want ;p
var rdmSites = function() {
	var randomLink = Math.round((Math.random() * $('a.l').length));
	$('a.l').eq(randomLink).addClass('hightlight2'); 
};

var editButton = function(bool) {
	if ($.browser.msie) $('span#editmode').html('Nous avons détecté que vous utilisez Internet Explorer :-( | ');
	else if (bool) $('span#editmode').html('<a href="javascript:void(0);" onclick="editSites();" title="Editer les liens de cette page (Connexion avec Facebook, pour sauvegarder)">Editer</a> | ');
	else $('span#editmode').html('<a href="javascript:void(0);" onclick="quitEditMode();" title="Effacer les modifications sans enregistrer">Quitter mode &eacute;dition</a> | ');
};

var removeSitesLinkDefaultEvent = function() {
	$('a.l').unbind('click', autoFill);
	$('input#q').unbind('keyup', letterHide);
	$('select#searcher').unbind('change', searchBot);
	$(document).unbind('keypress', highLight);
};

var initSitesLinkDefaultEvent = function() {
	$('a.l').live('click', autoFill);
	$('input#q').bind('keyup', letterHide);
	$('select#searcher').bind('change', searchBot);
	$(document).bind('keypress', highLight);
};

// Focus search Input and move Foxy around
var focusSearch = function(event) {
	if (startAnime) {
		startAnime = false;
		$('input#q').focus();
		if (foxAnim == '1') $('div#foxy').animate({top:0, left:(event.pageX - 120), opacity:1}, 1000, function() {
			intr = setInterval(function() { // Flying Foxy
				coef += 0.06;
				o = 0.4 + Math.abs(Math.cos(coef)*0.6);
				y = -dist + Math.abs(Math.cos(coef)*dist);
				$('div#foxy').css({top:y+'px', opacity:o});
				$('div#footerBg').css({opacity:o});
				if (count >= 222) { // Clear all, enter iddle mode
					clearInterval(intr);
					$('div#foxy').stop(true, true);
					$('div#foxy').animate({top:'-'+$('div#foxy').height()+'px', opacity:0}, function() { startAnime = true; count = 0; });
					$('div#footerBg').css({opacity:.8});
				}
				else if (count % parseInt(Math.random() * 20) == 0) dist = Math.abs(Math.cos(count/100)) * 10;
				count++;
			}, 50);
		});
		else { $('div#foxy').hide(); $('div#foxy').css({top:0}); }
	}
	else if (foxAnim && !$('div#foxy').is(':animated')) {
		var l = (event.pageX || 360) - 120;
		var v = ($(window).width() / 2) - 120;
		if (l < v) { l += v; if (l > $(window).width() - 250) l = $(window).width() - 240; }
		else { l -= v; if (l < 0) l = 0; }
		$('div#foxy').animate({left:l}, {duration:1400, easing:'easeInQuad'});
		count = 0;
	}
};

// Show/hide foxy
var toggleFoxy = function() {
	foxAnim = ($.cookie('foxy') == 'no' ? true : false);
	if (foxAnim) { $('div#foxy').show(); $(document).trigger('mousemove'); }
	else $('div#foxy').hide();
	$.cookie('foxy', (foxAnim ? 'yes' : 'no'), {expires:365, path:'/'});
	$('a#toggleFoxy').html((foxAnim ? 'Masquer' : 'Afficher'));
};

// Key Events HightLight Sites Names
var highLight = function(e) {
	if (target == 'input' && $('input#q').val().length >= 1 && one == 0) { // Stop hightlight ?
		one = 1;
		$('.l').each(function() { $(this).attr('class', 'l'); }); // Reset links
	}
	else if (target == 'input' && $('input#q').val().length < 1 && one == 1) one = 0; // Restart hightlight ?
	if (one == 0) {
		$('.l').each(function() {
			if (event2key[e.which] != '' && $(this).text().charAt(0).toLowerCase() == event2key[e.which])
				$(this).attr('class', 'l hightlight');
			else $(this).attr('class', 'l');
		});
	}
	if (e.keyCode == 27) { // KEY_ESC
		$('div#info,div#prefs').hide();
		if ($('div#divEdit').is(':visible')) $('div#divEdit').dialog('close');
	}
};

// Catch document clic // Lightest popup systeme... for 2 pops ^^
var docClick = function(event) {
	if (!$(event.target).is('a#preferences') && !$(this).parents().is('div#prefs')) $('div#prefs').hide();
	if (!$(event.target).is('a#aide') && !$(this).parents().is('div#info')) $('div#info').hide();
};

// Display cookie stocked search terms
var loadStock = function() {
	// 	$.cookie('search', 'love##test', {expires: 365, path: '/'});
	// Also tested with DOM data, but fail in Chrome (Lost when refresh) $('body').data('search');
	if ($.cookie('toStock') == 'no') return;
	var terms = null, termsHtml = '';
	if ((terms = $.cookie('search'))) {
		terms = terms.split('##');
		$.each(terms, function(i, v) {
			if (!v) return;
			var vPrint = input2html(v);
			var vLink = addslashes(vPrint);
			termsHtml += '<span id="term_'+(i)+'"><a href="javascript:void(0)" onclick="$(\'input#q\').val(\''+vLink+'\').focus();" class="lien2">'+vPrint+'</a><a href="javascript:void(0)" onclick="removeStock(\''+v+'\', \''+i+'\');" title="Effacer">&#10006;</a>, </span>';
		});
	}
	if (termsHtml == '') return;
	$('div#searhTerms').html(termsHtml);
	var lastSpan = $('div#searhTerms').find('span:last');
	lastSpan.html(lastSpan.html().substr(0, (lastSpan.html().length - 2))); // remove last coma
};

var addStock = function(val) { // Add new search term in cookie
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

var removeStock = function(val, k) { // Remove it	
	var terms = null;
	if ((terms = $.cookie('search'))) {
		terms = terms.split('##');
		var termsCookie = [];
		$.each(terms, function(i, v) {  if (v && v != val) termsCookie.push(v); });
		$.cookie('search', termsCookie.join('##'), {expires: 365, path: '/'});
	}
	$('span#term_'+k).remove();
};

// Stop/Start stocking input
var toggleStock = function() {
	toStock = ($.cookie('toStock') == 'no' ? true : false);
	if (toStock) { loadStock(); $('div#searhTerms').show(); }
	else { $.cookie('search', '', {expires: 365, path: '/'}); $('div#searhTerms').hide(); }
	$.cookie('toStock', (toStock ? 'yes' : 'no'), {expires:365, path:'/'});
	$('a#toggleStock').html((toStock ? 'Oublier' : 'Retenir'));	
};

// Catch and AutoFill link with search value ?
var autoFill = function(event){
	target = 'page';
	one = 0;
	$(this).blur();
	if ($('input#q').val() != '' && $(this).attr('rel') && $(this).attr('rel').indexOf('{R}') != -1) {
		var val = $('input#q').val();
		addStock(val);
		val = escapeURI(val);
		return !window.open($(this).attr('rel').replace(/{R}/g, val));
	}
};

// Double Autocomplete :)
var initAutocomplete = function() { 
	isAutocomplete = true;
	$('input#q').autocomplete({
		suggestUrl:		WWW+'_google_suggest.php',
		seedsUrl:		WWW+'_veryrelated.php',
		minChars:		1,
		delimiter:		/(,|\+|-|AND)\s*/,
		autoSubmit:		false,
		maxHeight:		600,
		deferRequestBy:	0
	});
};

// First input#q letter hide sites without search fonction
var letterHide = function(e) {
	if (!isAutocomplete) initAutocomplete();
	target = 'input';
	if ($('input#q').val() == '' && once) once = false; 
	if (!once) {
		if ($('input#q').val() != '') { once = true; $('.l').each(function() { if (!$(this).attr('rel')) $(this).fadeTo('slow', .2); }); }
		else { $('.l').each(function() { if (!$(this).attr('rel')) $(this).fadeTo('slow', 1); }); }
	}
};

// SearchBoOoot select
var searchBot = function(e) { 
	$('form#f').attr('action', 'http://www.google.fr/search'); // Re-Init form action
	var searchVal = $('input#searcher option:selected').val();
	if (searchVal == '') { $('input#q').val(''); return; }
	if (searchVal.indexOf('|') >= 0) { // Expression ?
		var searchValArr = searchVal.split('|');
		$('form#f').attr('action', searchValArr[0]); // url
		searchVal = searchValArr[1];
	}
	if (!expressionFilled && $('input#q').val() != '' && (searchVal == '{mot}' || searchVal == '{tag}')) { // Si requete simple ne pas effacer recherche
		$('input#q').selectRange(0, ($('input#q').val().length+1));
		expressionFilled = false;
	}
	else { // Requetes predefinies avec autoselect
		$('input#q').val(searchVal);
		$('input#q').selectRange(searchVal.indexOf('{'), (searchVal.indexOf('}')+1)); // autoselect word to be edited
		expressionFilled = true;
	} 
};

var createAccount = function(e) {}; // TODO, simple user account, without FB !!!
	
// Timer (for programmer ;)
var clock = function() { var dt = new Date(); $('span#heure').html(pad(dt.getHours())+':'+pad(dt.getMinutes())+':'+pad(dt.getSeconds())); };
var timer = function() { setInterval(clock, 1000); };

// Ok, let's go !
$(document).ready(function(){
	$('a.css').styleInit(); // Load CSS
	highlightMenu(); // set menu bar items
	searchInit(); // Search Form scripting
	if ($.cookie('foxy')) foxAnim = ($.cookie('foxy') == 'yes' ? true : false);
	$(document).mousemove(focusSearch);
	$(document).bind('click', docClick);
	$(window).bind('resize', posItem);
	switch(document.location.hash) { // Load sites DATAS
		case '#code': setDatas('code'); break;
		case '#twitter': setDatas('twitter'); break;
		default:
			buildSites();
			if (document.location.hash == '#editmode') editSites();
			else initSites();
	}
	timer(); // Clock
	loadStock(); // Cookie stocked user searchs
});

// That the end... having time for third party ! [Edited : NOT HAVING TIME !]
/*
$(window).bind('load', function(){ 
	loadJs('http://static.ak.connect.facebook.com/connect.php');
	setTimeout("FB.init('<?=$api_key;?>', 'xd_receiver.htm', {reloadIfSessionStateChanged:true});", 700);
	loadJs('http://www.google-analytics.com/ga.js');
	setTimeout('yTics();', 800);
	loadJs(WWW+'js/uservoice.tab.js');
	setTimeout(function() { // didWeHaveADoodleToday ?
		$.ajax({url:'doodle.php', success:function(divDoodle) { if (divDoodle) $('body').append(divDoodle); } });
	}, 30000);
});
*/