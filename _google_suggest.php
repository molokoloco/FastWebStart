<?

header("Content-type: application/json; charset=utf-8");
//header('Content-Type: text/html; charset=utf-8');

/*die("{query:'lov',
	suggestions:['love actually','love test','lovely bones','love','love calculator','love123love.com','love123','lovenox','love quotes','love actually streaming'],
	data:['84 400 000 résultats','264 000 000 résultats','30 600 000 résultats','1 280 000 000 résultats','40 900 000 résultats','59 500 résultats','80 700 résultats','372 000 résultats','45 100 000 résultats','23 900 000 résultats']
}");*/


// ---------------------- Fonctions Google Suggest ---------------------- //
// First Script Google Suggest by http://www.seoblackout.com // ReSampled by Molokoloco

function nothing($kw='') {
	die("{query:'".$kw."', suggestions:'', data:''}");
}


if (!isset($_GET['query']) || empty($_GET['query'])) nothing();
$kw = strip_tags(urldecode($_GET['query']));

if (empty($kw)) nothing();

$url = 'http://www.google.com/complete/search?hl=fr&js=true&qu='.urlencode($kw);
if (function_exists('curl_init')) {
	$header = array(
		'Accept: text/xml,application/xml,application/xhtml+xml,
		text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
		'Accept-Language: fr-fr,fr;q=0.7,en-us;q=0.5,en;q=0.3',
		'Accept-Charset: utf-8;q=0.7,*;q=0.7',
		'Keep-Alive: 300');
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_VERBOSE, false);	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_REFERER, 'http://www.google.com/');
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)' );
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header );
	curl_setopt($ch, CURLOPT_URL, $url);
	$result = curl_exec ($ch);
	curl_close ($ch);
}
else $result = file_get_contents($url);

if (!$result) return nothing($kw);

//preg_match_all('/\["(.*?)",/si', $result, $kwgoogle, PREG_SET_ORDER);
$kwgoogle = explode(',[[', utf8_decode($result));
$kwgoogle = explode('],[', $kwgoogle[1]);

if (!$kwgoogle)  return nothing($kw);

$s = array();
$d = array();
foreach($kwgoogle as $v){
	$v = explode('","', substr($v, 1, -1));
	$s[] = addslashes(strip_tags($v[0]));
	$d[] = addslashes(strip_tags($v[1]));
}

if (count($s) < 2) nothing($kw);
else die("{query:'".$kw."',
suggestions:['".utf8_encode(implode("','", $s))."'],
data:['".utf8_encode(implode("','", $d))."']
}");

?>