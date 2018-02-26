<?php header("Access-Control-Allow-Origin: *"); 
include('conexion.php');


$datos = json_decode(@file_get_contents("php://input"));

if ($datos){
	foreach($datos  as $dato_actual){
	$titulo = $dato_actual->titulo;
	$autor = $dato_actual->autor;
	$estado = $dato_actual->estado;
	$comentario = $dato_actual->comentario;
	$creado = $dato_actual->creado;
	$ultimoUpdate = $dato_actual->ultimoUpdate;
	$uniqueid = $dato_actual->uniqueid;

$ultimos_libros = guardar( $titulo, $autor, $estado, $comentario, $creado ,$ultimoUpdate, $uniqueid );
	}

echo($ultimos_libros);

	
}else{
	echo json_encode( array( ) );
}


?>