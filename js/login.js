// Muestra el panel para visuliazar el detalle de una pregunta frecuente
function mostrarPanelDetPreguntaFrec(pregunta,respuesta) {
	respuesta=replaceAll(respuesta,"°", "\"");
	 respuesta=replaceAll(respuesta,"¬","'");
	 respuesta=replaceAll(respuesta,"px| ","px; ");
	 respuesta=replaceAll(respuesta,"|","");
	 var codigoRespuesta=document.getElementById("respuestaHtml");
	 codigoRespuesta.innerHTML = respuesta;
	 var titulo = "Preguntas Frecuentes - " + pregunta;
	 mostrarPopupPregFrecuentes('#formDetallePreguntafrec', titulo, "auto", "auto");
	return false;
}

//OACD - 16/09/2014
//Funcion encargada de habilitar o inhabiitar el vinculo reestablecer contraseña
function habilitarRestContrasena(obj)
{
	//if(obj != null){
		//if(obj.value.trim().length>0){
			$("#res").html("<a href='#' onClick='restablecePw();' class='txt_form1' style='text-decoration: underline;' >Reestablecer Contraseña</a>");
			return;
		//}
	//}
	//$("#res").html("Reestablecer Contraseña");
}

//OACD - 18/09/2014
//Funcion encargada de mostrar mensaje de error de acceso
function mensajeErrorAcceso()
{
	var obj = document.getElementById('errLog');
	var errl = obj.value;
	if(errl != null)
	{
		mostrarMensaje(errl);	
	}
}

//OACD - 24/09/2014
//Funcion encargada de mostrar mensajes de restablecer contraseña
function mensajeRestablecer()
{
	var obj = document.getElementById('msjRestablecer');
	var errl = obj.value;
	if(errl != null)
	{
		if(errl.trim().length > 0)
		{
			mostrarMensaje(errl);
		}
	}
}

//OACD - 24/09/2014
//Funcion encargada de realizar las acciones de validación del formulario
function validar() {
	$("#form").validate({
		rules: {
			j_username: "required",
			j_password: "required",
			defaultReal: "required"
		},
		messages: {
			j_username:{
				required: "El usuario es obligatorio"
			},
			j_password:{
				required: "La contraseña es obligatoria"
			},
			defaultReal: {
				required: "Ingrese los caracteres de la imagen"
			}
		}
	});
}

function restablecePw()
{
//	var user;
//	user = $("#j_username").val();
//	window.location.href="./restablecerPw?user="+user;
	
	if(document.getElementById("j_username") != null){
		if(document.getElementById("j_username").value.trim().length>0){
			var user;
			user = $("#j_username").val();
			window.location.href="./restablecerPw?user="+user;
		} 
		else {
			mostrarMensaje('Debe ingresar un -Usuario- para Reestablecer Contraseña');
			return;
		}
	}
	else {
		mostrarMensaje('Debe ingresar un -Usuario- para Reestablecer Contraseña');
		return;
	}
}

function replaceAll( text, busca, reemplaza ){
	
	  while (text.toString().indexOf(busca) != -1)	
	      text = text.toString().replace(busca,reemplaza);
	
	  return text;
	
	}

function cerrarModal(){
	cerrarPopup('#formDetallePreguntafrec');
}

function validarResolucionPantalla(minWidth, minHeight, mensajeResolucion) {
	var KEY_RESOLUTION = 'warning_resolution';
	var validateWarningResolution = getSessionStorage(KEY_RESOLUTION); 
//	console.debug("resolucion: " + validateWarningResolution);
	
	if (validateWarningResolution == null) {
		var width = $(window).width();
		var height = $(window).height();
//		console.debug("width: " + width + ", minWidth: " + minWidth);
//		console.debug("height: " + height + ", minHeight: " + minHeight);
		if (width < minWidth ) {
			//console.debug("No cumple");
			adicionarMensajeWarningTopPantalla({
				//text: "Se recomienda navegar la aplicación con una resolución mínima de ${minWidth} x ${minHeight}, la visualización de formularios podría distorsionarse.",
				text: mensajeResolucion,
				onClose: function() {
					//console.debug("onClose");
					setSessionStorage(KEY_RESOLUTION, "false");
				}
			});
		}
	}
}


$(document).ready(function() {
//	document.getElementById("content").style.overflow = "hidden";
	habilitarRestContrasena(document.getElementById("j_username"));
	validar();
	
	 $("input[type=submit],input[type=button],button").button();
	 
	 $("#Acceder").button("destroy");
});





