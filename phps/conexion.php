<?php
	header("Access-Control-Allow-Origin: *");
	ini_set( 'display_errors' , 1 );
	error_reporting( E_ALL );
	date_default_timezone_set( "America/Argentina/Buenos_Aires" );
	$cnx = @mysqli_connect('mysql.hostinger.com.ar', 'u261561844_anap', 'anap4860961', 'u261561844_books' )or die("UPS! Ha sucedido un error en la conexion a la base de datos");
	


//<?php header("Access-Control-Allow-Origin: *");
//$cnx = mysqli_connect('mysql.hostinger.com.ar', 'u261561844_anap', 'anap4860961', 'u261561844_books' );
//$cnx = mysqli_connect('localhost', 'root', '', 'MY_BOOKS' );
//die( mysqli_error($cnx));

function eliminar_item( $id ){ 
	global $cnx;
	$consulta = "DELETE FROM libros WHERE id in ($id) "; 
	mysqli_query($cnx, $consulta);
	
	return get_listado();
}

function guardar($titulo, $autor, $estado, $comentario, $creado, $ultimoUpdate, $uniqueid ){
	global $cnx;	
    $consulta = "INSERT INTO libros VALUES ( null, '$titulo','$autor', '$estado','$comentario','$creado','$ultimoUpdate', '$uniqueid') on duplicate key update titulo = '$titulo', autor = '$autor', estado = '$estado', comentario = '$comentario' ,ultimoUpdate = '$ultimoUpdate'";
   
   $retorno = mysqli_query($cnx, $consulta);
   echo mysqli_error($cnx);
   
	return get_listado();
}


function get_listado($cantidad = null ){ 
	global $cnx;
	$consulta = "SELECT * FROM libros";
	if($cantidad != null){ 
		$consulta.=" limit $cantidad";
	}
	$f = mysqli_query($cnx, $consulta);
	$retorno = array( );
	
	while($a = mysqli_fetch_assoc($f)){
		$retorno[] = $a; 
	}

	
	return json_encode($retorno);
	
}



?>