<?

header("Content-type: application/json; charset=utf-8");
//header('Content-Type: text/html; charset=utf-8');

// ---------------------- Fonctions Google Suggest ---------------------- //
function nothing($kw='') {
	die("{query:'".$kw."', suggestions:'', data:''}");
}

if (!isset($_GET['query']) || empty($_GET['query'])) nothing();
$kw = strip_tags(urldecode($_GET['query']));

if (empty($kw)) nothing();

$cachePath = './temp/'.urlencode($kw);
if (file_exists($cachePath)) {
	echo file_get_contents($cachePath);
}
else { // Let's Go
	$url = 'http://www.veryrelated.com/related-api-v1.php?key=home.b2bweb.fr&base='.urlencode($kw);
	//$url = 'http://boss.yahooapis.com/ysearch/web/v1/'.urlencode($kw).'?format=json&callback=mycallback
	// &count=50&view=keywords&appid=ZSnk.fXV34Ei.mZMaSNAa5bYx6lTe0VAkCGdTGqBrksrJNGBzs5O2ePoOwbJ4QM.2Q--';
	
	if (function_exists('curl_init')) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Accept: text/xml,application/xml,application/xhtml+xml,
			text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
			'Accept-Language: fr-fr,fr;q=0.7,en-us;q=0.5,en;q=0.3',
			'Accept-Charset: utf-8;q=0.7,*;q=0.7',
			'Keep-Alive: 800'));
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_REFERER, 'http://www.google.com/');
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)' );
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_VERBOSE, false);	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 7);
		curl_setopt($ch, CURLOPT_TIMEOUT, 8);
		curl_setopt($ch, CURLOPT_DNS_CACHE_TIMEOUT, 480); 
		$result = curl_exec ($ch);
		curl_close ($ch);
	}
	else $result = file_get_contents($url);
	
	if (!$result) nothing($kw);
	
	//preg_match_all('/\["(.*?)",/si', $result, $kwgoogle, PREG_SET_ORDER);
	$kwgoogle = explode('<Result><Text>', utf8_decode($result));
	
	if (count($kwgoogle) < 1)  return nothing($kw);
	
	$s = $c = array();
	foreach($kwgoogle as $i=>$v){
		if ($i == 0) continue;
		$v = explode('</Text>', $v);
		$k = explode('<Popularity>', $v[1]);
		$k = explode('</Popularity>', $k[1]);
		if ($v[0]) {
			$s[] = addslashes(strip_tags($v[0])).' '.$kw;
			$c[] = addslashes(strip_tags($k[0])).' r&eacute;sultats';
		}
	}
	
	if (count($s) < 2) nothing($kw);
	else {
	
	$val = "{
	query:'".$kw."',
	suggestions:['".utf8_encode(implode("','", $s))."'],
	data:['".utf8_encode(implode("','", $c))."']
}";
		$fp = @fopen($cachePath, 'w+b');
		if ($fp) {
			@rewind($fp);
			@fwrite($fp, trim($val));
		}
		die($val);
	}
}