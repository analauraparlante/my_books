var app = angular.module('miApp', [
  'ngRoute',
  'mobile-angular-ui',
  'ngInput',
  'angularUUID2'
  ]);

app.config(function($routeProvider) {
  $routeProvider.when('/',   
	{templateUrl: 'views/home.html', reloadOnSearch: false, controller: 'micontroller'});


 $routeProvider.when('/leidos',  
	{templateUrl: 'views/leidos.html', controller: 'mostrar', reloadOnSearch: false,
	});

  $routeProvider.when('/leyendo',  
	{templateUrl: 'views/leyendo.html', controller: 'mostrar', reloadOnSearch: false,
	});

  $routeProvider.when('/pendiente',  
	{templateUrl: 'views/pendiente.html', controller: 'mostrar', reloadOnSearch: false,
	});

  $routeProvider.when('/info',  
	{templateUrl: 'views/info.html', reloadOnSearch: false,
	});

$routeProvider.when('/editar/:id/:titulo/:autor/:estado/:comentario/:creado/:uniqueid',
	{templateUrl : "views/editar.html",  reloadOnSearch: false, controller:'editar'
	});


 	$routeProvider.otherwise({
			redirectTo: '/'
		});
});

app.controller("micontroller", function ($scope, $location, $rootScope, $http, $filter, uuid2) {

//datos borrados
	if(localStorage.datos_borrados){
		$scope.enviarid = JSON.parse(localStorage.datos_borrados) 
	$http({
		method: "POST",
		//url:"phps/eliminar.php", 
		url:"http://analauraparlante.hol.es/mybooks/eliminar.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data : $scope.enviarid			
	}).then(
		function exito(response){
			localStorage.removeItem("datos_borrados");
	}, function fracaso (response){
			console.log("Error al enviar")
})
}

//datos agregados
	if(localStorage.misdatos ){
		console.log (localStorage.misdatos);
		$rootScope.arraygeneral = JSON.parse(localStorage.misdatos ) 
	$http({
		method: 'POST',
		//url: "phps/guardar.php",
		url:"http://analauraparlante.hol.es/mybooks/guardar.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $rootScope.arraygeneral
		}).then(
                function exito(response) {
                    localStorage.setItem( "misdatos" , JSON.stringify(response.data)); 
				}, function fracaso(response) {		
					
            });
			
	}else{console.log("sin datos nuevos")
		$scope.misdatos = []; 
			localStorage.setItem("misdatos", JSON.stringify($scope.misdatos))
		}


$scope.getId = function(){ 
		$scope.id = uuid2.newuuid(); 
		return $scope.id;
	}


//guardar
$scope.guardar = function(datos){ 
	$scope.fecha = $filter('date')(new Date(), 'yyyy-MM-dd  HH:mm:ss'); 
		$scope.aguardar={
			titulo:datos.titulo,
			autor: datos.autor,
			estado: datos.estado,
			comentario: datos.comentario,
			ultimoUpdate : false,
			creado : $scope.fecha, 
			uniqueid: $scope.getId()
		}
	if(!localStorage.getItem("misdatos")){
		$scope.arraygeneral=[];	
	}else{
		$scope.arraygeneral = JSON.parse(localStorage.getItem('misdatos'));
	}
$scope.arraygeneral.push($scope.aguardar);
$rootScope.arraygeneral = $scope.arraygeneral;
							
var envio= [{titulo: datos.titulo, autor: datos.autor, estado: datos.estado, comentario: datos.comentario, ultimoUpdate: $scope.aguardar.ultimoUpdate, creado : $scope.aguardar.creado, uniqueid : $scope.aguardar.uniqueid}]
	
$http({
	method: 'POST',
	//url: "phps/guardar.php",
	url:"http://analauraparlante.hol.es/mybooks/guardar.php",
	headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: envio
        }).then(
            function successCallback(response) {
                 $scope.respuesta = response.data
				localStorage.setItem( "misdatos" , JSON.stringify(response.data));
            }, function errorCallback(response) {
				localStorage.setItem( "misdatos" , JSON.stringify($rootScope.arraygeneral));
               });

//modal
var contenedor=document.getElementById('contenedor');
var modal=document.createElement('div');
var divpimg=document.createElement('div');
divpimg.className="divpimg";
var img_modal=document.createElement('img');
img_modal.src="img/books_ok.png";
img_modal.alt="books";
modal.className="modal_ok";
var ventana=document.createElement('p');
ventana.innerHTML="Libro guardado con éxito";

contenedor.appendChild(modal);
modal.appendChild(divpimg);
divpimg.appendChild(img_modal);
divpimg.appendChild(ventana);

function desaparecer(){
		 contenedor.removeChild(modal);
		 }

	    setTimeout(desaparecer,2500);

//fin modal

} //fin guardar
		
});


app.controller("mostrar", function ($scope, $location, $rootScope, $http) { 
	json = localStorage.misdatos == undefined ? '[ ]': localStorage.misdatos ;  

$rootScope.datos_guardados= JSON.parse(json); 
$scope.edit=function(x){ 
		$location.path("/editar/"+x.id+"/"+x.titulo+"/"+x.autor+"/"+x.estado+"/"+x.comentario+"/"+x.creado+"/"+x.uniqueid)
	}

/*'/editar/:id/:titulo/:autor/:puntaje/:estado/:comentario/:uniqueid'*/

$rootScope.datos_guardados = JSON.parse( json ) ;
	$http({
		method: 'POST',
		//url: "phps/guardar.php",
		url:"http://analauraparlante.hol.es/mybooks/guardar.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $scope.datos_guardados
		}).then(
                function exito(response) {
                   		localStorage.setItem("misdatos", JSON.stringify(response.data))
				},function fracaso(response) {		
				console.log ("No se pudo enviar")
            });

//borrar
$scope.borraEsteSolo=function(x){
	localStorage.removeItem("misdatos");
	$rootScope.datos_guardados.splice($rootScope.datos_guardados.indexOf(x), 1);
	$scope.datos_quedan = 	[];
	angular.forEach($rootScope.datos_guardados, function(x) {
		$scope.datos_quedan.push(x);
		localStorage.setItem("misdatos", JSON.stringify($scope.datos_quedan) )
		});
	
	if(!localStorage.datos_borrados){
		$scope.array_borrados =[];
	}else{
		$scope.array_borrados = JSON.parse(localStorage.datos_borrados)
	}
	
	if(x.id != undefined ){ 
	$scope.array_borrados.push(x.id);
	}
	
$http({
	method: "POST",
	//url:"phps/eliminar.php",
	url:"http://analauraparlante.hol.es/mybooks/eliminar.php",
	headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	data : $scope.array_borrados				
}).then(
	function exito(response){
			localStorage.setItem("misdatos", JSON.stringify(response.data))
			localStorage.removeItem("datos_borrados");
}, function fracaso (response){
	localStorage.setItem("datos_borrados", JSON.stringify($scope.array_borrados))
	})

}// fin borrar
});


// editar
app.controller("editar", function($scope,$routeParams,$location, $rootScope, $filter,$http){
	
	$scope.parametros = $routeParams;
	$rootScope.arraygeneral= $scope.arraygeneral;
		
	$scope.update = function(parametros){
		if(!localStorage.misdatos){
			$rootScope.arraygeneral = [];
		}else{
			$rootScope.arraygeneral=JSON.parse(localStorage.misdatos)
		}
	$scope.fecha_actualizada = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss '); 
		$scope.editado={
				id: parametros.id,
				titulo: parametros.titulo,
				autor: parametros.autor,
				estado: parametros.estado,
				comentario: parametros.comentario,
				ultimoUpdate:  $scope.fecha_actualizada,
				creado: parametros.creado,
				uniqueid : parametros.uniqueid,
			}
$rootScope.arraygeneral = JSON.parse(localStorage.getItem("misdatos"));

for(var i=0;i< $rootScope.arraygeneral.length;i++){ 
	  if($scope.editado.creado == $rootScope.arraygeneral[i].creado) {	
		$rootScope.arraygeneral.splice(i, 1);
		}
}
	
$rootScope.arraygeneral.push($scope.editado);
	localStorage.setItem("misdatos", JSON.stringify($rootScope.arraygeneral)) 
	$rootScope.arraygeneral = JSON.parse(localStorage.misdatos);

//modal
var contenedor=document.getElementById('contenedor');
var modal=document.createElement('div');
var divpimg=document.createElement('div');
divpimg.className="divpimg";
var img_modal=document.createElement('img');
img_modal.src="img/books_ok.png";
img_modal.alt="books";
modal.className="modal_ok";
var ventana=document.createElement('p');
ventana.innerHTML="Libro editado con éxito";

contenedor.appendChild(modal);
modal.appendChild(divpimg);
divpimg.appendChild(img_modal);
divpimg.appendChild(ventana);

function desaparecer(){
		 contenedor.removeChild(modal);
		 }

	    setTimeout(desaparecer,2500);

//fin modal

}//fin editar

//actualizar base
if ($rootScope.arraygeneral){
	$http({ 
		method:"POST",
		//url:"phps/guardar.php",
		url:"http://analauraparlante.hol.es/mybooks/guardar.php",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $rootScope.arraygeneral
	}).then(
		function exito(response){
			console.log($rootScope.arraygeneral); 
			$scope.respuesta=response.data;
				
	},function fracaso(response){
		console.log("NO se Actualizo la base")
	});
}// fin actualizar base
})


