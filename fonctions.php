<?
 
// VARIABLES   ---------------------------------------------------------------------------------------------------------- //
//$dbase = 'yours';
//$dbhost = 'localhost';
//$dblogin = 'login';
//$dbmotdepasse = 'm2p';

$debug = 0; // Affiche toutes les requetes ?
$JS = '<script type="text/javascript">'.chr(13).chr(10).'// <![CDATA['.chr(13).chr(10);
$JSE = chr(13).chr(10).'// ]]>'.chr(13).chr(10).'</script>';

// FUNCTIONS  ---------------------------------------------------------------------------------------------------------- //
function generateId($prefix='obj_') {
	static $idObjects = 0;
	if ($prefix != 'obj_') $prefix = cleanName($prefix);	
	return $prefix.$idObjects++;
}
function pad($number,$decimal=2,$pad=0) {
	$Tnumber = explode('.',floatval($number));
	$number = str_pad(intval($Tnumber[0]),$pad,'0',STR_PAD_LEFT);
	if ($decimal > 0) $number .= '.'.str_pad(substr($Tnumber[1],0,$decimal),$decimal,'0');
	return $number;
}
function js($script, $echo=TRUE) {
	global $JS,$JSE;
	$js = $JS.chr(13).chr(10).$script.chr(13).chr(10).$JSE;
	if ($echo) echo $js;
	else return $js;
}
function db($var='') {
	$args = func_get_args();
	if (count($args) > 1) {
		foreach ($args as $arg) db($arg);
		return;
	}
	$t_id = generateId('db_');
	echo '<textarea id="'.$t_id.'" style="width:100%;height:250px;font:11px courier;color:#FFFFFF;background:#FF66CC;text-align:left;white-space:pre;padding:4px" rows="3" cols="7">';
	if (is_bool($var)) echo ($var ? 'TRUE' : 'FALSE');
	elseif (!empty($var)) var_export($var);
	elseif ($var != '' || $var === '0' || $var === 0) echo $var;
	else echo '*** No Value ***';
	echo '</textarea><br />';
	
	js("var lignes = document.getElementById('".$t_id."').value.split('\\n');
	document.getElementById('".$t_id."').style.height = (lignes.length*18+30)+'px';");
}
function d($var='<< PHP says that you killing him softly >>') {
	db($var);
	die();
}
function getDb($var='', $name='') {
	ob_start();
	db($var, $name);
	$db = ob_get_contents();
	ob_end_clean();
	return $db;
}
function jsDb($var) {
	$js = '';
	if (is_array($var)) foreach($var as $key=>$value) $js .= $key.' > '.$var."\n";
	else $js = $var;
	js("db('".$js."');");
}
/*class Q { // SQL QUERY MANAGER
	var $_c = 0;
	var $_db = 0;
	var $query;
	var $id;
	var $affected;
	var $V = array();
	function __construct($query='') {
		global $debug;
		$this->debug = $debug;
		if (!$this->_c) $this->C();
		$this->QUERY($query);
	}
		
	// PHP4
	function Q($query='') {
		$this->__construct($query);
	}
	
	// OPEN SQL QUERY MAKER
	function QUERY($query) {
		$this->requete = trim($query);
		if (empty($this->requete)) return;
		$result = mysql_query($this->requete, $this->_c) or die(db($this, 'Erreur mySQL : '.htmlspecialchars(mysql_error($this->_c))));
		
		$this->V = array();
		if (is_resource($result) && preg_match('/^SELECT /', $this->requete)) {
			$this->id = 0;
			$this->affected = 0;
			while ($arrRow = @mysql_fetch_array($result, MYSQL_ASSOC))
				$this->V[] = $arrRow;
		}
		else {
			$this->id = @mysql_insert_id();
			$this->affected = @mysql_affected_rows();
		}
		if ($result) @mysql_free_result($result);
		if ($this->debug) db($this);
	}
	// CONNEXION
	function C() {
		global $dbhost, $dbase, $dblogin, $dbmotdepasse;
		$this->_c = @mysql_connect($dbhost, $dblogin, $dbmotdepasse) or die(db(utf8_encode('Desole, connexion impossible sur le host ['.$dbhost.'] &gt; '.htmlspecialchars(mysql_error()))));
		$this->_db = @mysql_select_db($dbase, $this->_c) or die(db(utf8_encode('Desole, connexion impossible a la base ['.$dbase.'] &gt; '.htmlspecialchars(mysql_error($this->_c)))));
		if (!is_resource($this->_c) || !$this->_db)  die(db(utf8_encode('Pb inconnu ['.$dbase.'] - ['.$dbhost.'] &gt; '.htmlspecialchars(mysql_error($this->_c)))));
	}
	
	// UPDATE
	function update($table, $fields, $where='') {
    	$query = 'UPDATE `'.$table.'` SET ';
    	$i=0;
		foreach ((array)$fields as $name=>$value) {
    		if ($i == 0) $i = 1;
			else $query .= ', ';
			$query .= '`'.$name.'`=';
			if (empty($value)) $query .= "''";
    		else if ($this->NoClean || preg_match('/^(NOW|CURDATE|CURTIME|UNIX_TIMESTAMP|RAND|USER|LAST_INSERT_ID)/', $value)) $query .= $value;
    		else $query .= "'".clean($value)."'";
    	}
    	if (!empty($where)) $query .= ' WHERE '.$where;
    	$this->QUERY($query);
    }
	
	// INSERT
    function insert($table, $fields) {
    	$query = 'INSERT INTO `'.$table.'` (';
		$query .= '`'.implode('`, `', array_keys($fields)).'`';
    	$query .= ') VALUES (';
    	$i=0;
    	foreach ((array)$fields as $tmp=>$value) {
    		if ($i == 0) $i = 1;
			else $query .= ', ';
    		if ($this->NoClean || preg_match('/^(NOW|CURDATE|CURTIME|UNIX_TIMESTAMP|RAND|USER|LAST_INSERT_ID)/', $value)) $query .= $value;
    		else $query .= "'".clean($value)."'";
    	}
    	$query .= ')';
    	$this->QUERY($query);
    }
	
	// DELETE
    function delete($table, $where='') {
    	$query = "DELETE FROM `$table`";
    	if (!empty($where)) $query .= ' WHERE '.$where;
    	$this->QUERY($query);
    }
}
function q($query) {
	$Q =& new Q($query);
	return (count($Q->V) > 1 ? $Q->V : $Q->V[0]);
}*/
function sanitize($string) {
	if ($string === 0 || $string === '0') return 0;
	elseif (is_numeric($string)) return $string;
	elseif (empty($string)) return $string;
	$bad = array('|</?\s*SCRIPT.*?>|si', '|</?\s*OBJECT.*?>|si', '|</?\s*META.*?>|si', '|</?\s*APPLET.*?>|si', '|</?\s*LINK.*?>|si', '|</?\s*FRAME.*?>|si', '|</?\s*IFRAME.*?>|si', '|</?\s*JAVASCRIPT.*?>|si', '|JAVASCRIPT:|si', '|</?\s*FORM.*?>|si', '|</?\s*INPUT.*?>|si', '|CHAR\(|si', '|INTO OUTFILE|si', '|LOAD DATA|si');
	$string = preg_replace($bad, array(''), ' '.$string.' ');
	if (class_exists('Q')) {
		$initConnexion =& new Q(); 
		$string  = mysql_real_escape_string($string);
	}
	else $string = addslashes($string);
	$string = str_replace("\\n","\n",$string);
	$string = str_replace("\\r","\r",$string);
	return trim($string);
}
function clean($string, $br='') { // ShortCut
	if (is_array($string)) array_map('stripslashes_array', $string);
	else return sanitize($string);
}
function cleanName($string) {
	if (empty($string)) return;
	elseif (is_numeric($string)) return $string;
	$string = strtolower($string);
	$special = array('&', 'O', 'Z', '-', 'o', 'z', 'Y', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', '.', ' ', '+', '\'');
	$normal = array('et', 'o', 'z', '-', 'o', 'z', 'y', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'd', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', '_', '_', '-', '-');
	$string = str_replace($special,$normal,$string);
	$string = preg_replace('/[^a-z0-9_\-]/','',' '.$string.' ');
	$string = preg_replace('/[\-]{2,}/','-',$string);
	$string = preg_replace('/[\_]{2,}/','_',$string);
	return trim($string);
}
function stripTags($data, $keepBr=FALSE) {
	$data = unhtmlentities($data);
	$string = str_replace(chr(13).chr(10), ' ', $string);
	$data = preg_replace('/<br(.*?)>/si', chr(13).chr(10), $data);
	$data = preg_replace('/<\/(pre|ul|li|p|table|tr)>/si', chr(13).chr(10), $data);
	$data = preg_replace('/<(.*?)>/si', '', $data);
	$data = preg_replace('/['.chr(13).chr(10).']{2,}/', chr(13).chr(10), $data);
	if ($keepBr) $data = str_replace(chr(13).chr(10), '<br />', $data);
	return $data;
}
function aff($string, $br=1, $tag=1) { // Clean AND HTMLilise
	if (empty($string)) return $string;
	elseif (is_numeric($string)) return $string;
	elseif (is_array($string)) {
		array_map('aff', $string, $br, $tag);
		return $string;
	}
	$string = trim(str_replace('"','&quot;',stripslashes($string)));
	if ($br == 2) $string = str_replace(chr(13).chr(10), '<br />', $string);
	elseif ($br == 3) $string = str_replace(chr(13).chr(10), ' ', $string);
	elseif ($br == 0) {
		$string = str_replace('<br />', chr(13).chr(10), $string);
		$string = str_replace(chr(13).chr(10).' ',chr(13).chr(10), $string);
	}
	if ($tag == 0) $string = stripTags($string);
	return $string;
}
function html($string) { // html(aff($V['titre']))
	if (empty($string)) return $string;
	if (is_array($string)) {
		array_map('html', $string);
		return $string;
	}
	$string = str_replace('&quot;', '"', $string);
	$string = htmlentities(make_iso($string), ENT_QUOTES);
	$string = makeEncoding($string);
	return $string;
}
function html_array($array) {
	return is_array($array) ? array_map('html_array',$array) : html($array);
}
function htmlButTags($string) {
	if (empty($string)) return $string;
	$string = str_replace('&quot;', '"', $string);
	$caracteres = get_html_translation_table(HTML_ENTITIES);
	$remover = get_html_translation_table(HTML_SPECIALCHARS);
	$caracteres = array_diff($caracteres, $remover);
	$string = strtr($string, $caracteres);
	$string = makeEncoding($string);
	return $string;
}
function unhtmlentities($string) {
	//global $encoding;
	$string = make_iso($string);
	if (function_exists('html_entity_decode')) {
		$string = html_entity_decode($string, ENT_COMPAT, 'ISO-8859-15'); // NOTE: UTF-8 does not work!
    }
    else {
		$trans_tbl = get_html_translation_table(HTML_ENTITIES, ENT_COMPAT);
	$trans_tbl = array_flip($trans_tbl);
		$string = strtr($string, $trans_tbl);
    }
    $string = preg_replace('/&#(\d+);/me',"chr(\\1)", $string); #decimal notation
    $string = preg_replace('/&#x([a-f0-9]+);/mei',"chr(0x\\1)", $string);  #hex notation
	return $string;
}
function getTimeFromDate($date) {
	if (empty($date)) return 0;
	list($datestring, $timestring) = explode(' ', $date);
	list($y, $m, $d) = explode('-', $datestring);
	list($h, $i, $s) = explode(':', $timestring);
	return mktime($h, $i, $s, $m, $d, $y);
}
?>