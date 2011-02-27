<?php
	header('Content-type: application/javascript; charset=utf-8'); 
	session_start();
	### $_SESSION['user'] = NULL;
	
	/*if ($_SESSION['user']['fb_userid'] > 0 && is_file('./usersdatas/sitesDatas_'.$_SESSION['user']['fb_userid'].'.js')) {
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		echo file_get_contents('./usersdatas/sitesDatas_'.$_SESSION['user']['fb_userid'].'.js');
	}
	else*/if (!empty($_SESSION['user']['SITES'])) {
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		echo stripslashes($_SESSION['user']['SITES']);
	}
	else {
		header("Cache-Control: max-age=3600, must-revalidate");
		echo file_get_contents('sitesDatas.js');
	}
?>