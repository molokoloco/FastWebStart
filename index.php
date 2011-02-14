<?
session_start();
header('Content-Type: text/html; charset=utf-8');

$local = (strpos($_SERVER['SERVER_ADDR'], '127.0.0.1') !== FALSE ? TRUE : FALSE);
$WWW = ( $local ? 'http://localhost/www.b2bweb.fr/home/' : 'http://home.b2bweb.fr/' );

// Some stuff ///////////////////////////////////////////////////

// Ajax sites user edit
$action = $_REQUEST['action'];
if ($action == 'update') { // Call by Ajax -> ./js/jquery.edit.js
	if (empty($_POST['SITES'])) die('0');
	require_once('fonctions.php');
	$_SESSION['user']['SITES'] = sanitize($_POST['SITES']); // Session backup, cf. ./js/sitesDatas.js.php
	if ($_SESSION['user']['fb_userid'] > 0) {
		$fp = @fopen('./js/usersdatas/sitesDatas_'.$_SESSION['user']['fb_userid'].'.js', 'w+b');
		if ($fp) { rewind($fp); fwrite($fp, $_SESSION['user']['SITES']); fclose($fp); die('1'); } // A little more security please o_O
	}
	die('ok');
}

/*
	// EDITED - NOT activated because FB is so heavy ! ///////////////////////
	// FaceDeBouc Connect ///////////////////////////////////////////////////
	
	### $_SESSION['user']['fb_userid'] = 'YOUR-ID';
	### $_SESSION['user']['SITES'] = null;
	global $api_key, $secret, $fb, $fb_user;
	include_once('fbconnect/footprints/config.php');
	include_once('fbconnect/php/facebook.php');
	$fb = new Facebook($api_key, $secret);
	//$fb_user = $fb->get_loggedin_user();
	function populateAccount() {
		global $fb, $fb_user;
		if (!$fb_user) return;
		$user_details = $fb->api_client->users_getInfo($fb_user,
			array('name', 'last_name', 'first_name', 'proxied_email') // , 'status'
		);
		if (count($user_details[0]) < 1) return;
		if ($_SESSION['user']['id'] > 0) { // Already exist here...
			$userId = $_SESSION['user']['id'];
			$R = new Q();
		  $R->update('userprofile', array(
				'fb_userid' 		=> $fb_user,
				'fb_proxy_email' 	=> $user_details[0]['proxied_email'],
				'firstName' 		=> $user_details[0]['first_name'],
				'lastName' 			=> $user_details[0]['last_name'],
			), " id='$userId' LIMIT 1 ");
		}
		else { // Create account here with facebook one
			$R = new Q();
		  $R->insert('userprofile', array(
				'fb_userid' 		=> $fb_user,
				'fb_proxy_email' 	=> $user_details[0]['proxied_email'],
				'name' 				=> $user_details[0]['name'],
				'firstName' 		=> $user_details[0]['first_name'],
				'lastName' 			=> $user_details[0]['last_name'],
				'created_ts' 		=> date("Y-m-d H:i:s")
			));
		}
		$R = new Q("SELECT * FROM userprofile WHERE fb_userid='$fb_user' LIMIT 1");
		$_SESSION['user'] = $R->V[0];
	}
		  // Connect
			if (isset($_POST['action']) && $_POST['action'] == 'login') {
				$user = clean($_POST['username']);
				$passw = clean($_POST['password']);
				$passw = md5($passw);
				if ($user && $passw) {
					$R = new Q("SELECT * FROM userprofile WHERE login_name='$user' AND password_hash='$passw' LIMIT 1");
					if ($R->V[0]['id'] < 1) $_SESSION['user_connect_error'] = 'Invalid login'; 
					else {
						$_SESSION['user'] = $R->V[0];
						if ($fb_user && $_SESSION['user']['fb_userid'] < 1) populateAccount();
					}
				}
			}
			// Create (Todo)
	
	if ($_SESSION['user']['fb_userid'] > 0 && !$fb_user) $_SESSION['user'] = NULL; // Logout ?
	elseif ($_SESSION['user']['fb_userid'] < 1 && $fb_user) {
		if (!$_SESSION['user']) {
			$R = new Q("SELECT * FROM userprofile WHERE fb_userid='$fb_user' LIMIT 1");
			if ($R->V[0]['id'] > 0) $_SESSION['user'] = $R->V[0]; // OK Deja Connu et Link&eacute;
		}	
		if ($_SESSION['user']['fb_userid'] < 1) populateAccount();
	}*/
	
	/* in HTML...
	
		if ($_SESSION['user']['fb_userid'] > 0) { 
			?><fb:name uid="loggedinuser" useyou="false" linked="true"></fb:name><?
		}
		else {
			?><!--//<a href="javascript:void(0);" onclick="suscribe();" title="Créer un compte utilisateur">S'inscrire</a> | //--><fb:login-button v="2" size="small" onlogin="window.location.reload(true);">Connect</fb:login-button><?
		}
	*/
	/*
	if ($thank) { ?>
		<meta http-equiv="refresh" content="5;url=index.php?action=goLoggin" />
		<div id="info" onclick="$('#info').fadeOut();">Thank you <a href="index.php?action=goLoggin">Hang on</a>...</div>
	<? }

*/

?><!-- 
// Guess what ? that a Work In Progress ! Amazing W0oT ? By molokoloco 2011
// Code on GitHub : https://github.com/molokoloco/FastWebStart/ 
-->
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>GoogleBot (Fast Web Start)</title>
	<meta http-equiv="Autor" content="^Work In Progress^ By molokoloco 2010"/>
	<meta name="viewport" content="initial-scale=1.0;"/>
	<link rel="icon" href="<?=$WWW;?>images/favicon.ico"/>
	<link rel="shortcut icon" type="image/icon" href="<?=$WWW;?>favicon.ico"/>
	<link rel="image_src" href="<?=$WWW;?>images/preview.png"/>
	<link rel="apple-touch-icon" href="<?=$WWW;?>images/apple-touch-icon.png" />
	<link rel="stylesheet" type="text/css" media="all" href="<?=$WWW;?>css/styles.css" id="themeDefault"/>
</head>
<body>
<div id="info" style="display:none;">
	<h3>Welcome :)</h3>
	<p>Bienvenue sur GoogleBot !<br />
	Le portail synth&eacute;tis&eacute; des services Google et des sites chouettes, utiles, et ceux qu'on oublie (à tord)...</p>
	<ul>
		<li><strong>Suggestion am&eacute;lior&eacute;e</strong> pendant votre recherche : <strong>Google</strong> pour compl&eacute;ter et<strong> Very Related</strong> pour assembler</li>
		<li>D'un <strong>clic</strong> court-circuitez Google, en <strong>recherchant sur un autre site</strong></li>
		<li>Acc&eacute;dez simplement aux <strong>termes de recherche avanc&eacute;e</strong> Google</li>
		<li>Un design sympa ? <strong>Choisissez</strong> :) </li>
		<li>Un site manquant ? <strong>Ajoutez</strong> le ! En faite, tout est personnalisable...</li>
		<li>C'est aussi une page de d&eacute;marrage qui s'affiche instantan&eacute;ment</li>
		<li><strong>Aucune donn&eacute;es personnelles sur le serveur</strong> (Stockage dans vos cookies)</li>
	</ul>
	<h3>Astuces...</h3>
	<ul>
		<li>Le <strong>menu d&eacute;roulant</strong> (devant le champ de recherche) permet d'acc&eacute;der aux <strong>fonctions de recherche avanc&eacute;e</strong> Google</li>
		<li>Op&eacute;rateurs &quot;<strong>, + - AND</strong>&quot; pour relancer les suggestions Google</li>
		<li>Si vous saisissez une recherche, cliquer sur un lien emm&egrave;ne directement vers le r&eacute;sultat sur le site</li>
		<li><strong>Touche clavier</strong> pour trouver les sites commen&ccedil;ants par cette lettre (Au besoin cliquez le fond de page pour donner le focus)</li>
		<li>Le<strong> mode &eacute;dition</strong> ne sauvegarde vos modifications sur les sites que si vous êtes connect&eacute; (Pour le moment via Facebook)</li>
		<li>La <strong>personnalisation du th&egrave;me</strong> de couleur reste simplement stock&eacute; dans un cookie</li>
		<li>Le code source est <a href="view-source:<?=$WWW;?>index.php" target="_blank" title="Let's go to the code ^^"><strong>ici</strong></a> ;)<br />
			<br />
		</li>
		<li>Une Question, un commentaire, une id&eacute;e... <a href="http://b2bweb.uservoice.com/forums/35888" target="_blank" title="Laisser un commentaire, une idée... c'est par ici"><strong>c'est par ici !</strong></a></li>
	</ul>
	<p>Bon surf !</p>
	<p class="right"><a href="javascript:void(0);" onclick="$('div#info').fadeOut();">Fermer</a></p>
</div>
<div id="header">
	<div class="right"><a href="#info" onclick="$('div#info').fadeIn();" title="Quelques explications sur les fonctionnalit&eacute;s de cette page" id="aide">Bienvenue</a> | <span id="editmode"></span><a href="#prefs" onclick="$('div#prefs').fadeIn();" id="preferences" title="Changer le style de la page">Pr&eacute;f&eacute;rences</a></div><div id="menu">&nbsp;<a href="#home" onclick="return $H.setDatas('home');" title="GoogleBot is Fast Web Start" class="bold" id="home">GoogleBot</a> | <a href="#code" onclick="return $H.setDatas('code');" title="CodeBot is Fast Coding Tools : http://code.b2bweb.fr" id="code">CodeBot</a> | <a href="#twitter" onclick="return $H.setDatas('twitter');" title="TwitterBot is Twitter Web Start : http://twitter.b2bweb.fr" id="twitter">TwitterBot</a><!-- | <a href="http://proxy.b2bweb.fr" title="Surf anonymously... (WorkInProgress)" id="proxy">ProxyBot</a>--></div>
</div>
<div id="footerBg">&nbsp;</div>
<div id="footer"><p>By <a href="http://www.b2bweb.fr" title="Molokoloco @ Work Wild Web 2011">B2bweb.fr</a> | <a href="http://b2bweb.uservoice.com/forums/35888" target="_blank" title="Laisser une question, un commentaire, une idée... (avec uservoice.com)">FAQ</a> | <a href="http://www.google.com" title="Google suggest API">Google</a> &amp; <a href="http://www.veryrelated.com/" title="VeryRelated Mind Maps API">VeryRelated</a> | <a href="http://www.addthis.com/bookmark.php?v=250&amp;username=molokoloco" title="Bookmark and Share with AddThis">Partager</a> | <span id="heure" title="Time is runnnnning...">88:88:88</span></p></div>

<div id="SearchBot">
	<div id="D1"><!-- Here the links data --></div>
	<div class="blockRow" style="margin:0px;"></div>
	<div class="blockRow">
		<a href="http://www.google.com/webhp?hl=en" class="lien2">Google in English</a> | <a href="http://www.google.fr/preferences" class="lien2">Pr&eacute;f&eacute;rences</a> | <a href="http://www.google.com/support" class="lien2">Aide</a> | <a href="http://code.google.com/p/molokoloco-coding-project/wiki/GoogleHack" class="lien2">GoogleHack</a> | <a href="http://www.google.fr/advanced_search" class="lien2">Recherche avanc&eacute;e</a> | <a href="http://google.b2bweb.fr/search?hl=fr&amp;q=anonyme" onclick="if($('input#q').val() != '') { window.open('http://google.b2bweb.fr/search?hl=fr&amp;q='+$('input#q').val()); return false; }" class="lien2">Recherche anonyme</a> | <a href="http://www.google.fr/language_tools" class="lien2">Outils linguistiques</a>
	</div>
	<form action="http://www.google.fr/search" id="f"><div id="searchBox">
		<select name="searcher" id="searcher" title="Chercher &gt;quoi avec quelle {recherche}"><option value="" selected="selected"></option><optgroup label="Recherche multi-m&eacute;dias..."><option value="http://images.google.fr/images|{tag}">Des &gt;images avec un {tag}</option><option value="http://video.google.fr/videosearch|{tag}">Des &gt;videos avec un {tag}</option><option value="filetype:{extension} {tag}">Des &gt;fichiers avec une {extension} et un {tag}</option></optgroup><optgroup label="A propos d'un mot"><option value="<?=$WWW;?>index.php|{mot}">Une &gt;d&eacute;finition pour un {mot} dans Wikip&eacute;dia</option><option value="http://news.google.fr/news|{tag}">Les &gt;articles pour un {tag} dans l'actualit&eacute;</option><option value="http://www.google.fr/codesearch|{code}">Des &gt;scripts avec du {code}</option><option value="inanchor:{tag}">Des &gt;sites dirigeant vers {tag}</option><option value="~{mot}">Les &gt;synonymes d'un {mot}</option><option value="+{mot}">Les &gt;pages comportant exactement un {mot}</option><option value="&quot;{mot autre mot}&quot;">Les &gt;pages comportant exactement une {expression}</option><option value="spell:{mot}">L'&gt;orthographe d'un {mot}</option></optgroup><optgroup label="Divers..."><option value="http://maps.google.fr/maps|{lieu}">Un {lieu} sur la &gt;carte</option><option value="http://maps.google.fr/maps|n&deg; {numero}, rue {rue}, {ville}">Une &gt;adresse n&deg; {num&eacute;ro}, rue {rue}, {ville} sur la &gt;carte</option><option value="http://maps.google.fr/maps&amp;fb=1&amp;gl=fr&amp;hq=image&amp;hnear={lieu}&amp;q={tag}|{tag} {lieu} -TODO-">Une {chose} a proximit&eacute; d'un {lieu} sur la &gt;carte</option><option value="conversion de {x} {unit&eacute;s} en {unit&eacute;}">Une &gt;conversion de {x} {unit&eacute;s} en {unit&eacute;}</option><option value="combien de {unit&eacute;s} dans {x} {unit&eacute;}">&gt;Combien d' {unit&eacute;s} dans {x} {unit&eacute;}</option><option value="stocks:{nom}">&gt;Valeur en bourse d'une valeur {NASDAQ}</option><option value="weather:{ville}">&gt;M&eacute;t&eacute;o d'une {ville}</option><option value="movie:{film}">Les &gt;critiques d'un {film}</option><option value="time:{ville}">L'&gt;heure d'une {ville}</option></optgroup><optgroup label="A propos d'un site..."><option value="site:{site.com} {tag}">Les &gt;pages d'un {site} pour un {tag} en particulier</option><option value="allintitle:{tag}">Les &gt;pages avec un {tag} dans leur titre</option><option value="allinurl:{tag}">Les &gt;pages avec un {tag} dans leur url</option><option value="cache:{site.com}">La &gt;copie en cache d'un {site}</option><option value="related:{site.com}">Les &gt;sites apparent&eacute;s &agrave; un {site}</option><option value="link:{www.google.com}">Les &gt;sites dirigeant vers un {site}</option></optgroup></select><input maxlength="2048" name="q" id="q" size="50" value="" title="&quot;, + - AND&quot; pour relancer les suggestions Google" tabindex="1"/><input name="clear" id="clear" type="reset" value="x" onclick="$('input#q').val('');$('input#q').focus();" title="Effacer la recherche"/><input name="btnG" id="btnG" type="submit" value="goO" onclick="this.checked=1" title="Recherche par d&eacute;faut sur Google.fr (&quot;Entr&eacute;e&quot;)" alt="Rechercher" tabindex="2"/><input name="hl" type="hidden" value="fr" /><input name="source" type="hidden" value="hp" /><input name="num" type="hidden" value="50" />
	</div></form>
	<div class="blockRow" id="searhTerms" title="Vos derni&egrave;res recherches apparaissent ici (Cookie d&eacute;sactivable dans le menu pr&eacute;f&eacute;rences)">&nbsp;</div>
	<div id="D2"><!-- Here the links data too --></div>
	<br />
</div>
<div id="prefs" style="display:none;">
	<p>Les pr&eacute;f&eacute;rences sont uniquement stock&eacute;es dans un <strong>cookie</strong> de votre navigateur. Ce site respecte votre vie priv&eacute;e.</p>
	<p>&nbsp;</p>
	<h3>G&eacute;n&eacute;ral :</h3>
	<ul><li><a href="javascript:void(0);" onclick="javascript:return $H.toggleFoxy();" id="toggleFoxy">Afficher/Masquer</a> &quot;Foxy&quot; (la chose qui bouge en haut ;)</li><li><a href="javascript:void(0);" onclick="javascript:return $H.toggleStock();" id="toggleStock">Retenir/Oublier</a> vos recherches (Cookie navigateur)</li></ul>
	<h3>Th&egrave;mes :</h3>
	<ul><li><a href="javascript:void(0);" rel="<?=$WWW;?>css/styles.css" class="css">Original Blues</a></li><li><a href="javascript:void(0);" rel="<?=$WWW;?>css/style_light.css" class="css">Light Room</a></li><li><a href="javascript:void(0);" rel="<?=$WWW;?>css/style_dark.css" class="css"><em>Black monday</em></a> (Todo)</li></ul>
	<h3>Image de fond :</h3>
	<ul><li>&lt;input type="upload" value="TODO" /&gt;</li></ul>
	<p class="right"><a href="javascript:void(0);" onclick="$('div#prefs').fadeOut();">Fermer</a></p>
</div>
<div id="foxy">&nbsp;</div>
<a href="https://github.com/molokoloco/FastWebStart/" title="See source code on GITHUB..." target="_blank" id="git">GIT</a>
<script type="text/javascript" src="<?=$WWW;?>js/jquery.min.plus.js"></script>
<script type="text/javascript" src="<?=$WWW;?>js/sitesDatas.js.php"></script>
<script type="text/javascript" src="<?=$WWW;?>js/jquery.mlklc.min.js"></script>
</body>
</html>