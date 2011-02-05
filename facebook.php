<?
session_start();

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>Facebook Button Connect</title>
	<link rel="stylesheet" type="text/css" media="all" href="http://home.b2bweb.fr/css/styles.css" id="themeDefault"/>
	<style type="text/css">
	* { margin:0; padding:0; }
	</style>
	<script type="text/javascript" src="http://static.ak.connect.facebook.com/connect.php"></script>
	<script type="text/javascript">
	setTimeout(function() {
		FB.init('YOUR_API_KEY', 'xd_receiver.htm', {reloadIfSessionStateChanged:true});
	}, 2000);
	</script>
</head>
<body style="background:transparent;">
	<div id="header">
	<div style=""><?
	if ($_SESSION['user']['fb_userid'] > 0) { ?><fb:name uid="loggedinuser" useyou="false" linked="true"></fb:name><? }
	else {
	/* <a href="javascript:void(0);" onclick="suscribe();" title="Créer un compte utilisateur">S'inscrire</a> | */ ?><fb:login-button v="2" size="small" onlogin="window.location.reload(true);">Connect</fb:login-button><?
	}
	?>
	</div></div>
</body>
</html>