/******************** Control del tiempo en sesión ***********************/
$.fn.contadorTiempoSesion = function(options) {
//	console.dir(options);
	
	var $this = $(this);
	
	var sesionExpirada = function() {
//		alert("Sesión Expirada: " + options.urlExpirarSesion);
//		location.replace(options.urlExpirarSesion);
		window.top.location.href = options.urlExpirarSesion;
	}
	
	var validarAlerta = function(periods) {
		var segundos = $.countdown.periodsToSeconds(periods);
		var tiempoAlerta = options.tiempoAlerta;
//		console.debug("validarAlerta. Faltan: " + segundos + " Tiempo de alerta: " + tiempoAlerta);
		if (segundos <= tiempoAlerta) {
//			var $this = $(this);
			$this.addClass('alarmar');
			var mensaje = null;
			var tiempo = segundos;
			if (tiempoAlerta <= 60) {
				mensaje = options.mensajeAlertaSegundos.replace("%segundos%", segundos);
			} else {
					//Se calcula el tiempo faltante en minutos
				tiempo = (segundos / 60).toFixed(1);
				mensaje = options.mensajeAlertaMinutos.replace("%minutos%", tiempo);
			}
			alertWarning(options.tituloAlerta, mensaje, options.labelBotonAlerta);
			//Se apaga validarAlerta
			$this.countdown('option', {onTick: null});
		}
	}
	
	var getFechaFinSesion = function() {
		var fechaFinSesion = new Date();
		fechaFinSesion.setSeconds(fechaFinSesion.getSeconds() + options.tiempoCierreSesion);
		return fechaFinSesion;
	}
	
	//Configuro el contador
	$this.countdown({
		until: getFechaFinSesion(),
		format: 'HMS',
		compact: true,
		onExpiry: sesionExpirada,
		onTick: validarAlerta
	});
	
	//Resetear el contador cada vez que ocurre una petición
	$(document).ajaxStop(function() {
//		console.debug("ajaxStop");
		var onTick = $this.countdown('option', 'onTick');
//		console.debug("onTick: " + onTick);
		if (onTick === null) {
			onTick = validarAlerta;
		}
		$this.countdown('option', {
				until: getFechaFinSesion(),
				onTick: onTick
			})
			.removeClass('alarmar');
	});
	
	return this;
}
