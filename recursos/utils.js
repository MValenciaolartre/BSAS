var datepicker_shown = false;
var firstClickEmail=false;
var firstClickPassword=false;
var firstClickResetPassword=false;
var firstClickCuentaExistente=false;
var firstClickCrearMetodoAcceso=false;
var firstClickLoginRecuperarAcceso=false;
var firstClickLoginUpdateBasicData=false;
var firstClickRedSocial=false;
var ac= [];
var validaUsig = [];
var ultimoTextoNormalizado = [];
var direccionesNormalizadasDefault = [];
var savedRedirectURI = undefined;
let dateBirthValid = true;


window.onload = function() {

	firstClickEmail=false;
	firstClickPassword=false;
	firstClickResetPassword=false;
	firstClickCuentaExistente=false;
	firstClickCrearMetodoAcceso=false;
	firstClickLoginRecuperarAcceso=false;
	firstClickLoginUpdateBasicData=false;
	firstClickRedSocial=false;

	changeTipoIdentificacion();	
  
	changeDireccion('container-telOne','telOne');
	changeDireccion('container-telTwo','telTwo');
	changeDireccion('container-telThree','telThree');
  
	changeDireccion('container-dirOne','dirOne');
	changeDireccion('container-dirTwo','dirTwo');
	changeDireccion('container-dirThree','dirThree');
	
	if ($("#fechaNacimiento").length != 0)
		$("#fechaNacimiento").inputmask({"mask": "99/99/9999", "placeholder" : "", "jitMasking": true});

	if ($("#datetimepicker1").length != 0){
		$('#datetimepicker1').datepicker({
			format:'dd/mm/yyyy',
			startDate: '01/01/1900',
			endDate: new Date(),
			autoclose: true,
			language:'es',
			forceParse:false
		});
		
		$('#datetimepicker1').on('changeDate', function(e) {
			datepicker_shown = false;
			clearError(this,'fechaNacimiento');
		});
		$('#datetimepicker1').on('update', function(e) {
			datepicker_shown = false;
		});
		
		$('#datetimepicker1').on('hide', function(e) {
			datepicker_shown = false;
		});
		
		$('#datetimepicker1').on('click', function(e) {
			datepicker_shown = true;
		});
			
		
		$('#toggle').on('click', function(e){ 
			changeDatePicker();
			return false;
		});				
		
	}

	if ($("#div-cancelar-permiso").length != 0 && window.name == "cancelar-permisos"){
		$("#div-cancelar-permiso").modal('show');
		$("#div-cancelar-permiso").modal({backdrop: 'static', keyboard: false});
	}
	
	if (document.getElementById("redirectUri")!= null){
		window.location.href = document.getElementById("redirectUri").href;
	}
	$('[data-toggle="tooltip"]').tooltip()
	
	// COMPLETAR BARRIOS
	var barrios = document.getElementsByName('barrios')[0];
	
	if (barrios) {
		//Creando el Select que irá dentro del Div 
		var localidades = document.getElementsByName('localidades')[0];
		
		var elemento = localidades.cloneNode(true);
		elemento.id = 'localidad';
		elemento.name = 'localidad';	
		elemento.style.display = 'inline';
		barrios.appendChild(elemento);
		
		localidades.style.display = 'none';
	}
	
	var barrios2 = document.getElementsByName('barrios')[1];
	
	if (barrios2) {
		//Creando el Select que irá dentro del Div 
		var localidades = document.getElementsByName('localidades')[1];
		
		var elemento = localidades.cloneNode(true);
		elemento.id = 'localidad';
		elemento.name = 'localidad';	
		elemento.style.display = 'inline';
		barrios2.appendChild(elemento);
		
		localidades.style.display = 'none';
	}
	
	var barrios3 = document.getElementsByName('barrios')[2];
	
	if (barrios3) {
		//Creando el Select que irá dentro del Div 
		var localidades = document.getElementsByName('localidades')[2];
		
		var elemento = localidades.cloneNode(true);
		elemento.id = 'localidad';
		elemento.name = 'localidad';	
		elemento.style.display = 'inline';
		barrios3.appendChild(elemento);
		
		localidades.style.display = 'none';
	}
	
	var tiposDomicilio = document.getElementsByName('direccionTipo');	

	document.addEventListener('scroll', function(event) {
		for (var i=0;  i<3; i++){
			if (document.getElementById("usig_acv_usig" + i)!=undefined){
				document.getElementById("usig_acv_usig" + i).style.display = "none";
			}
		}
	});

	this.loadAutocompletarEdicion();
	
	/*Deshabilitar copy paste en un campo*/
	 const emailConfirm = document.getElementById('email-confirm');
	 if(emailConfirm) emailConfirm.onpaste = e => e.preventDefault();
};

function loadAutocompletarEdicion(){
	var direccionesEditar = document.getElementsByName('domicilioCalle');
	for (var index=0; direccionesEditar!=null && index<direccionesEditar.length; index++){
		if (direccionesEditar[index].value!="")
			loadAutocompletarEdicionDireccion(index);
	}
}
function loadAutocompletarEdicionDireccion(index){
	var provSelected = document.getElementsByName('provincia')[index];
	var parseProv = provSelected.value.split(";");
	var usig = parseProv[1];
	changeAutocomplete(usig, index, 1);	
}

function selectLocalidad(index , barrioUsig){
	var comboProvincia = document.getElementsByName('provincia')[index];
	var provSelected = comboProvincia.options[comboProvincia.selectedIndex].value.split(";")[0];
	var comboLocalidad = document.getElementsByName('localidad')[index];
	var locSelected = comboLocalidad.selectedIndex;
	var barrios = comboLocalidad.options;
	
	var indexLocalidadUsig = 0;

	for (var i=0; i< barrios.length; i++){
		if (barrios[i].value.split(";")[1] == provSelected){
			var barrioFormatoMiBa = barrios[i].text;
			var barrioSinMayusculasNiAcentos = barrioFormatoMiBa.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
			if (barrioSinMayusculasNiAcentos === barrioUsig){
				indexLocalidadUsig=i;
				break;
			}
		}		
	}
	if (indexLocalidadUsig== 0){//No se encontro la opcion deseada
		comboLocalidad[locSelected].selected = false;
		comboLocalidad.removeAttribute("disabled");
	}else{
		comboLocalidad[indexLocalidadUsig].selected = true;
		comboLocalidad.setAttribute("disabled", "disabled");
	}
	
}

function checkDobleClickRedSocial(p){
	if(!firstClickRedSocial){
		sessionStorage.setItem("urlBack", encodeURIComponent(window.location.href));
		var formulario = document.getElementById("kc-form-login");		
		firstClickRedSocial=true;
		window.location.href= p;
		return true;
	}
	else
		return false;
}

function checkSubmitLoginRecuperarAcceso(){
	if(!firstClickLoginRecuperarAcceso){
		var formulario = document.getElementById("kc-form-login-mail");		
		firstClickLoginRecuperarAcceso=true;
		formulario.submit();
		return true;
	}
	else
		return false;
}

function checkSubmitCrearMetodoAcceso(){
	if(!firstClickCrearMetodoAcceso){
		var formulario = document.getElementById("kc-register-form");		
		firstClickCrearMetodoAcceso=true;
		formulario.submit();
		return true;
	}
	else
		return false;
}
function checkSubmitCuentaExistenteMail(){
	if(!firstClickCuentaExistente){
		var formulario = document.getElementById("kc-register-form");		
		firstClickCuentaExistente=true;
		formulario.submit();
		return true;
	}
	else
		return false;
}

function checkSubmitFormResetPasswords(){
 
 if(!firstClickResetPassword){
		var formulario = document.getElementById("kc-reset-password-form");		
		firstClickResetPassword=true;
		formulario.submit();
		return true;
	}
	else
		return false;
}
function checkSubmitFormPasswords(){
	if(!firstClickPassword){
		var formulario = document.getElementById("kc-form-login-mail");		
		firstClickPassword=true;
		formulario.submit();
		return true;
	}
	else
		return false;
}

function changeDatePicker(){
	
	if (datepicker_shown) {
		$('#datetimepicker1').datepicker('hide');
		datepicker_shown = false;

	} else {
		$('#datetimepicker1').datepicker('show');
		datepicker_shown = true;
	}	
	$('.datepicker').addClass("notranslate");
	return false;
}
  
  
  function changeTipoIdentificacion() {
	  var tipoIdentificador = document.getElementById("tipoIdentificacion");
	  if (tipoIdentificador != null){
		  
		   var tooltip = document.getElementById("white-tooltip");
		   var tipoIdentificadorValue = tipoIdentificador.value;
		   $('#white-tooltip').removeAttr('data-original-title');
			if (tipoIdentificadorValue.includes("1"))
				 $("#white-tooltip").attr('data-original-title', 'Ingresá tu CUIL sin guiones ni espacios Ejemplo: 20201234567');				
			else	
			if (tipoIdentificadorValue.includes("2"))
			 $("#white-tooltip").attr('data-original-title', 'Ingresá tu PASAPORTE EXTRANJERO sin guiones ni espacios Ejemplo: 32533435466635');			
			else	
			if (tipoIdentificadorValue.includes("3"))				
			 $("#white-tooltip").attr('data-original-title', 'Ingresá tu DOCUMENTO EXTRANJERO sin guiones ni espacios Ejemplo: 432322422424');					
			else				
			 $("#white-tooltip").attr('data-original-title', 'Ingresá tu RESIDENCIA PROVISORIA sin guiones ni espacios Ejemplo: RFP1234506');
			
			
		  
		  
		  var parse = document.getElementById("tipoIdentificacion").value.split(";");					  
		  if (parse[1] == 'CUIL') {
			if (document.getElementById("numeroIdentificacion").value!= undefined && document.getElementById("numeroIdentificacion").value.length>13)
				document.getElementById("numeroIdentificacion").value = document.getElementById("numeroIdentificacion").value.substring(0,11);
		
			$("#numeroIdentificacion").attr('maxlength', 13);
			$("#numeroIdentificacion").inputmask({"placeholder" : "", "mask": "99-99999999-9", "jitMasking": true});
		  } else {	
				$("#numeroIdentificacion").inputmask({"mask": ""});
				if (parse[1] == 'DE' || parse[1] == 'PAS'){
					$("#numeroIdentificacion").attr('maxlength', 20);
					$("#numeroIdentificacion").inputmask({"regex": "[\\w\\s]*"});	

				}		
				if (parse[1] == 'CRP') {
					$("#numeroIdentificacion").attr('maxlength', 10);
					$("#numeroIdentificacion").inputmask({"regex": "^[a-zA-Z0-9\\s]*$"});	
				}		
				
		  }
		  		  
		  if ((parse[1] == 'CUIL') || (parse[1] == 'CRP')){
			  document.getElementById("paisDocumento").setAttribute("disabled", "disabled");
			  setSelect("paisDocumento","ARG");
		  } else {
			disabledArg();
			document.getElementById("paisDocumento").removeAttribute("disabled");
			var countryCode = document.getElementById("countryCode").value;

			if (countryCode!= undefined && countryCode == 'ARG')
				document.getElementById("paisDocumento")[0].selected = true;
			else if (countryCode != undefined)
				setSelect("paisDocumento",countryCode);
		  }
	  }	
  }
  
  
	function changeProvincia(provSelected) {		
		$('select[name="provincia"]').each(function(index, current) {
			if (current == provSelected)
				changeProvinciaGeneral(index, "provincia", "localidades");				
		});
	}
	
	function changeProvinciaGeneral(index, nameProvincia, nameLocalidad) {
		
			// COMPLETAR BARRIOS
			var bloque = document.getElementsByName('barrios')[index];
			var localidades = document.getElementsByName('localidad')[index];
			bloque.removeChild(localidades);		
			
			var provSelect = document.getElementsByName(nameProvincia)[index];
			var localidad = document.getElementsByName(nameLocalidad)[index];
			if (localidad != null){
				var options = document.getElementsByName(nameLocalidad)[index].options;
				if (options != null){
					document.getElementsByName(nameLocalidad)[index][0].selected = true;
				}
				
				//Creando el Select que irá dentro del Div 
				var elemento = document.createElement('select');
				elemento.setAttribute("class", "form-control chosen-select" );
				var parseProv = provSelect.value.split(";");
				var idProvincia = parseProv[0];
				var usig = parseProv[1];
				//Cargamos el autocomplete dependiendo de la validacion de usig de esa region/provincia
				changeAutocomplete(usig, index);
				for (var indice=0; indice<options.length; indice++){
					if (document.getElementsByName(nameLocalidad)[index][indice].value != ""){
						var parse = document.getElementsByName(nameLocalidad)[index][indice].value.split(";");
						if (parse.length > 0){
							if (parse[1] == idProvincia) {
								var loc = document.getElementsByName(nameLocalidad)[index][indice].cloneNode(true);
								elemento.appendChild(loc);
							}
						}
					}
				}
				
				elemento.id = 'localidad'+index;
				elemento.name = 'localidad';		
				bloque.appendChild(elemento);
				
			}
	}

  
  function clearTelOne(){
	  document.getElementsByName('telefonoTipo')[0].selectedIndex = 0;
	  changeDireccion('container-telOne','telOne');
  }
  
  function clearTelTwo(){
	  document.getElementsByName('telefonoTipo')[1].selectedIndex = 0;
	  changeDireccion('container-telTwo','telTwo');
  }
  
  function clearTelThree(){
	  document.getElementsByName('telefonoTipo')[2].selectedIndex = 0;
	  changeDireccion('container-telThree','telThree');
  }
  
  function changeDireccion(container,element){
	  var elementDiv = document.getElementById(container);
	  var elementForm = document.getElementById(element);
	  if (elementForm != null){
		  if (elementForm.value != '')
			  elementDiv.style.display = 'inline';
		  else
			  elementDiv.style.display = 'none';
	  }	
  }
  function clearDirOne(){
	  document.getElementsByName('telefonoTipo')[0].selectedIndex = 0;
	  changeTelOne();
  }

/**
 * Navega a la URL de registración, pidiendo los datos básicos obligatorios o no.
 */
 
function getRealm(url) {
	if (url.includes('realms')) {
		var realm = "";
		var substr = url.match(/realms\/(.*?)\//).toString().substring(7);;
		for (var i=0; i<substr.length && substr[i] != '\/'; i++) { 
			realm = realm.concat(substr[i]);    
		}		
		return realm;
	}
	return null;
}

function register() {	
	const urlParams = new URLSearchParams(window.location.search);
	var client_id = urlParams.get("client_id");
	var urlBase = window.location.protocol + '//' + window.location.host;
	window.location.href = urlBase + "/ui/registracion?client_id=" +client_id;
}

function backToLogin() {
	
	const urlParams = new URLSearchParams(window.location.search);
	var client_id = urlParams.get("client_id");
	var tab_id = urlParams.get("tab_id");
	var urlBase = window.location.protocol + '//' + window.location.host;
	var realm = getRealm(window.location.pathname);
	if (realm != null) {
		window.location.href = urlBase + "/auth/realms/" + realm + "/login-actions/authenticate?client_id=" +client_id + "&tab_id=" + tab_id ;
	} else {
		window.location.href = urlBase + "/auth/realms/miba/login-actions/authenticate?client_id=" +client_id + "&tab_id=" + tab_id ;
	}
}

function parseQueryParam(uri, paramName){
	var results = new RegExp('[\?&]' + paramName + '=([^&#]*)')
					  .exec(uri);
	return (results !== null) ? results[1] || 0 : false;
}

function goRedirectUri(redirect_uri){

	var name= 'redirect_uri';
	var param  = parseQueryParam(redirect_uri, name);
	var decodedURI = decodeURIComponent(param);
	if ( decodedURI.includes("/login-redirect"))
		decodedURI = decodedURI.split("/login-redirect")[0];
	else{
		var back = document.referrer;
		if (sessionStorage.getItem("urlBack")!= undefined && sessionStorage.getItem("urlBack")!= ""){
			window.location.href = decodeURIComponent(sessionStorage.getItem("urlBack"));
			return;
		}

		var tab  = parseQueryParam(back, "tab_id");
		var client  = parseQueryParam(back, "client_id");
		var realm = getRealm(window.location.href);
		var urlBase = window.location.protocol + '//' + window.location.host;
		if (tab == false && client == false && back != "")
			decodedURI = back;
		else if (back == ""){
			tab  = parseQueryParam(window.location.href, "tab_id");
			client  = "account";
			realm = "miba";
			decodedURI = urlBase + '/auth/realms/'+ realm + '/login-actions/restart?client_id=' + client + '&tab_id=' + tab ;
		}else{
			tab  = parseQueryParam(window.location.href, "tab_id");
			client  = parseQueryParam(window.location.href, "client_id");

			decodedURI = urlBase + '/auth/realms/'+ realm + '/login-actions/restart?client_id=' + client + '&tab_id=' + tab ;
		}		
	}
	window.location.href = decodeURIComponent(decodedURI);
}

/**
 * Navega a la URL de olvide contraseña.
 */
function olvideContraseña() {
	var urlForgot = document.getElementById("urlForgotPassword");
	var tab_id=null;
	if (urlForgot != null){
		const urlParamsForgot= new URLSearchParams(urlForgot.href);
		tab_id = urlParamsForgot.get("tab_id");
	}	
	const urlParams = new URLSearchParams(window.location.search);
	var client_id = urlParams.get("client_id");
	var urlBase = window.location.protocol + '//' + window.location.host;
	var realm = getRealm(window.location.pathname);
	if (realm != null) {
		window.location.href = urlBase + "/auth/realms/" + realm + "/login-actions/reset-credentials?client_id=" +client_id + "&tab_id=" + tab_id ;
	} else {
		window.location.href = urlBase + "/auth/realms/miba/login-actions/reset-credentials?client_id=" +client_id + "&tab_id=" + tab_id ;
	}
}

/**
 * Navega a la URL de recuperacion de cuenta.
 */
function recuperar(redirect) {
	if(!redirect) {
		redirect = window.location.href;
	}
	var redirect_uri = new URL(redirect, window.location);
	var urlForgot = document.getElementById("urlForgotPassword");
	var tab_id=null;
	if (urlForgot != null){
		const urlParamsForgot= new URLSearchParams(urlForgot.href);
		tab_id = urlParamsForgot.get("tab_id");
	}
	const urlParams = new URLSearchParams(redirect_uri.search);
	var client_id = urlParams.get("client_id");

	const newLocation = new URL(`/ui/recuperacion`, window.location);
	newLocation.searchParams.append("client_id", client_id);
	newLocation.searchParams.append("tab_id", tab_id);
	newLocation.searchParams.append("redirect", redirect_uri.href);
	window.location.href = newLocation.href;
}
/**
 * En caso de que coindida el shortName, setea el elemento del combo
 */
function setSelect(element,shortName){
	var component = document.getElementById(element);
	if (component != null){
		var options = document.getElementById(element).options;
		if (options != null){
			document.getElementById(element)[0].selected = true;
		}
		for (var indice=0;indice<options.length;indice++){
			if (document.getElementById(element)[indice].value != ""){
				var parse = document.getElementById(element)[indice].value.split(";");
				if (parse.length > 0){
					if (parse[1] == shortName){						
						document.getElementById(element)[indice].selected = true;
						var paisIdentificacion = document.getElementsByName(element);
						if (paisIdentificacion != null){
							// El segundo element con name pais es el hidden.
							document.getElementsByName(element)[1].value= parse[0];
						}					
						return;
					}				
				}
			}
		}	
	}
}

/**----------------------------------------
 * Validaciones sobre DATOS BÁSICOS.
 * ---------------------------------------- */

 function mostrarMensajeError(element,errorMsg,name){
	document.getElementById('error-' + name).textContent = errorMsg;		
	document.getElementById('div-error-'+name).style.display = "flex";
	element.classList.add("input-error");
 }
 
 function validarDatosBasicos() {

	var tipoIdentificacion = document.getElementById("tipoIdentificacion");
	var paisDocumento = document.getElementById("paisDocumento");
	var numeroIdentificacion = document.getElementById("numeroIdentificacion");
	var fechaNacimiento = document.getElementById("fechaNacimiento");
	var terminos = document.getElementById("terminos")
	var errorEncontrado= false;


	var errorMsg = "";	

	if (paisDocumento.value == null || paisDocumento.value.trim()==""){
		errorMsg = "Debe seleccionar un país de emisión";
		errorEncontrado = true;
		mostrarMensajeError(paisDocumento,errorMsg,'paisDocumento');

	}
	
	if ((numeroIdentificacion.value == null || numeroIdentificacion.value.trim()=="")){
		errorMsg = "Debe ingresar un número de identificación";
		errorEncontrado = true;
		mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
	}
	
	if(!terminos.checked){
		errorMsg = "Para crear tu cuenta es necesario que aceptes los Términos y Condiciones y Políticas de Privacidad";
		errorEncontrado = true;
		mostrarMensajeError(terminos, errorMsg, 'terminos');
		/*if ($("#div-term-required").length != 0){
			$("#div-term-required").modal('show');
			$("#div-term-required").modal({backdrop: 'static', keyboard: false});
		}*/
	}

	if ((fechaNacimiento.value == null || fechaNacimiento.value.trim()=="")){
		errorMsg = "Este dato es obligatorio";
		errorEncontrado = true;
		mostrarMensajeError(fechaNacimiento,errorMsg,'fechaNacimiento');
		document.getElementById("icon-calendar").className +=' input-group-addon_calendario_red'; 
	}	
	
	if(!dateBirthValid) {
		errorEncontrado = true;
	}

	if (errorMsg == "" && tipoIdentificacion && numeroIdentificacion && numeroIdentificacion.value != ""){
		var parse = tipoIdentificacion.value.split(";");
	    var identificacion = numeroIdentificacion.value;
		var regexp = "";
		if (parse[1] == 'CUIL') {
			regexp = /\b(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]/;			  
			if (!regexp.test(identificacion)) {
				errorMsg = "Ingresá tu CUIL únicamente con números, sin guiones, ni espacios";
				errorEncontrado = true;
				mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
			}
		} else if (parse[1] == 'PAS') {
			regexp = /[a-zA-Z0-9\s]+/;
			if (!regexp.test(identificacion)) {
				errorMsg = "Tu pasaporte sólo debe tener números o carácteres alfabéticos.";
				errorEncontrado = true;
				mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
			}
		} else if (parse[1] == 'DE') {
			regexp = /[a-zA-Z0-9\s]+/;
			if (!regexp.test(identificacion)) {
				errorMsg = "Tu documento sólo debe tener números o carácteres alfabéticos.";
				errorEncontrado = true;
				mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
			}		  
		} else if (parse[1] == 'CRP') {
			regexp = /[a-zA-Z0-9\s]+/;
			if (identificacion.length < 7) {
				errorMsg = "Recordá que tu precaria debe tener solo letras o números y entre 7 y 10 carácteres.";	
				errorEncontrado = true;
				mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');

			} else if (identificacion.length > 10) {
				errorMsg = "Recordá que tu precaria debe tener solo letras o números y entre 7 y 10 carácteres.";	
				errorEncontrado = true;
				mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
			}		   
			else{
				regexp =/^[a-zA-Z\s]+$/;
				if (regexp.test(identificacion)) {
					errorMsg = "El certificado de residencia Precaria no puede contener sólo letras";
					errorEncontrado = true;
					mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');
				}
				else{
					regexp = /^[a-zA-Z0-9\s]+$/;
					if (!regexp.test(identificacion)) {
						errorMsg = "Certificado no válido";
						errorEncontrado = true;
						mostrarMensajeError(numeroIdentificacion,errorMsg,'numeroIdentificacion');

					}	
				}
			}			  
		} 
	} 
	if(!firstClickLoginUpdateBasicData){
	if (errorMsg != "" || errorEncontrado) {
		
	} else {
		document.getElementById('div-error-basic-data').style.display = "none";
			firstClickLoginUpdateBasicData=true;
		document.getElementById('kc-update-basic-data-form').submit();
		return true;
		}
	}
	else
		return false;
 }
 
 
 /**----------------------------------------
 * Validaciones sobre DATOS ADICIONALES.
 * ---------------------------------------- */
 
function isValidEmail(email,invalidInputsEmail) {
	if (/^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
	   if (invalidInputsEmail != null && invalidInputsEmail.length > 0) {
		   var invalidRegExp = invalidInputsEmail.split(", ");
		   for (i = 0; i < invalidRegExp.length; i++) {			   
			  try {
				var pattern = new RegExp(invalidRegExp[i]);
				if (pattern.test(email)) {
				  return false;
				}
			  } catch (err) {
				console.log(err);
		      }		  
		   }	   
	   }
	   return true;
	}
	return false;
}

function isValidCuil(email,invalidInputsEmail) {
	if (/^\d{11}$/.test(email)){
	   if (invalidInputsEmail != null && invalidInputsEmail.length > 0) {
		   var invalidRegExp = invalidInputsEmail.split(", ");
		   for (i = 0; i < invalidRegExp.length; i++) {			   
			  try {
				var pattern = new RegExp(invalidRegExp[i]);
				if (pattern.test(email)) {
				  return false;
				}
			  } catch (err) {
				console.log(err);
		      }		  
		   }	   
	   }
	   return true;
	}
	return false;
}

function validarEmail(emailId, errorDivId, errorMsg, formId, invalidInputsEmail) {	
	var email = document.getElementById(emailId).value;
	if (isValidEmail(email, invalidInputsEmail)) {
		document.getElementsByName('idGenero')[2].value = document.getElementById('genero').value;
		document.getElementsByName('idNacionalidad')[2].value = document.getElementById('nacionalidad').value;
		document.getElementById(errorDivId).style.display = "none";
		document.getElementById(formId).submit();
	} else {
		document.getElementById(errorMsg).textContent = "Formato de email no válido";
		document.getElementById(errorDivId).style.display = "inline";
	}
}

// Valida correo electrónico de la primer pantalla de login
function validarCorreoElectronico(emailId, errorDivId, errorMsg, formId, invalidInputsEmail, cancelSubmit) {
	if(!firstClickEmail){ 
		const emailElem = document.getElementById(emailId);
		var email = emailElem.value;
		emailElem.classList.remove("valid");
		emailElem.classList.remove("invalid");
		if(!email || !email.length || email.length <= 0) {
			document.getElementById(errorMsg).textContent = "Este dato es obligatorio.";
			document.getElementById(errorDivId).style.display = "flex";
			emailElem.classList.add("invalid");
		} else if(!/^\d+$/.test(email)) {
			if (isValidEmail(email, invalidInputsEmail)) {
				document.getElementById(errorDivId).style.display = "none";
				emailElem.classList.add("valid");
				if(!cancelSubmit)
					document.getElementById(formId).submit();
			} else {
				document.getElementById(errorMsg).textContent = "El formato de email ingresado es incorrecto. Por favor, revisalo";
				document.getElementById(errorDivId).style.display = "flex";
				emailElem.classList.add("invalid");
			}
		} else {
			if (isValidCuil(email, invalidInputsEmail)) {
				document.getElementById(errorDivId).style.display = "none";
				emailElem.classList.add("valid");
				if(!cancelSubmit)
					document.getElementById(formId).submit();
			} else {
				document.getElementById(errorMsg).textContent = "El formato de CUIL ingresado es incorrecto. Por favor, revisalo";
				document.getElementById(errorDivId).style.display = "flex";
				emailElem.classList.add("invalid");
			}
		}
	}
}

function validarConfirmacionEmail(emailId, errorDivId, errorMsg, formId, invalidInputsEmail, emailConfirmacionId) {
	const emailElem = document.getElementById(emailId);
	const confirmElem = document.getElementById(emailConfirmacionId);
	emailElem.classList.remove("valid");
	emailElem.classList.remove("invalid");
	if(emailElem.value == confirmElem.value) {
		validarCorreoElectronico(emailId, errorDivId, errorMsg, formId, invalidInputsEmail, true);
	} else {
		if(emailElem.value) {
			document.getElementById(errorMsg).textContent = "Los correos electrónicos no coinciden";
		} else {
			document.getElementById(errorMsg).textContent = "Este dato es obligatorio";
		}
		document.getElementById(errorDivId).style.display = "flex";
		emailElem.classList.add("invalid");
	}
	//confirmElem.onchange = () => validarConfirmacionEmail(emailId, errorDivId, errorMsg, formId, invalidInputsEmail, emailConfirmacionId);
}

function validarCorreos(invalidEmails, event) {
	const emailInput = document.getElementById('email');
	const confirmInput = document.getElementById('email-confirm');
	const divErrorEmail = document.getElementById('div-error-email');
	const divErrorConfirm = document.getElementById('div-error-email-confirm');
	const errorEmail = document.getElementById('error-email');
	const errorConfirm = document.getElementById('error-email-confirm');
	divErrorEmail.style.display = "none";
	divErrorConfirm.style.display = "none";
	emailInput.classList.remove("invalid");
	confirmInput.classList.remove("invalid");

	if(!emailInput.value && !confirmInput.value) {
		emailInput.classList.add("invalid");
		confirmInput.classList.add("invalid");
		errorConfirm.textContent = "Estos datos son obligatorios";
		divErrorConfirm.style.display = "flex";
		divErrorEmail.style.display = "none";
		return;
	}
	
	if(event.target == emailInput) {
		if(emailInput.value) {
			validarCorreoElectronico('email', 'div-error-email', 'error-email', 'kc-reset-password-form', invalidEmails, true);
			if(confirmInput.value) {
				validarConfirmacionEmail('email-confirm', 'div-error-email-confirm', 'error-email-confirm', 'kc-reset-password-form', invalidEmails, 'email')
			}
		} else {
			errorEmail.textContent = "Este dato es obligatorio";
			divErrorEmail.style.display = "flex";
			emailInput.classList.add("invalid");
		}
	} else if (event.target == confirmInput) {
		if(!emailInput.value) {
			errorEmail.textContent = "Este dato es obligatorio";
			divErrorEmail.style.display = "flex";
			emailInput.classList.add("invalid");
		} else {
			validarConfirmacionEmail('email-confirm', 'div-error-email-confirm', 'error-email-confirm', 'kc-reset-password-form', invalidEmails, 'email')
		}
	} else {
		if(!emailInput.value) {
			errorEmail.textContent = "Este dato es obligatorio";
			divErrorEmail.style.display = "flex";
			emailInput.classList.add("invalid");
		}
		if(!confirmInput.value) {
			errorConfirm.textContent = "Este dato es obligatorio";
			divErrorConfirm.style.display = "flex";
			confirmInput.classList.add("invalid");
		}
		if(emailInput.value && confirmInput.value) {
			validarConfirmacionEmail('email-confirm', 'div-error-email-confirm', 'error-email-confirm', 'kc-reset-password-form', invalidEmails, 'email')
		}
	}
}

function validarFormulario(formId, element) {
	const formElem = document.getElementById(formId);
	for( const elem of formElem.elements ) {
		if(elem.classList.contains("invalid") || !elem.checkValidity()) {
			element.disabled = false;
			return;
		}
	}
	formElem.submit();
}

function ingresarConEmail(emailId, errorDivId, errorMsg, formId, invalidInputsEmail) {
	if(!firstClickEmail){ 
		var urlBase = document.getElementById("loginUrl").href;
		firstClickEmail=true;	   
		sessionStorage.setItem("urlBack", encodeURIComponent(window.location.href));
		window.location.href = urlBase;
	}
}

// Valida correo electrónico de la primer pantalla de login
function validarCorreoByEnter(event, emailId, errorDivId, errorMsg, formId, invalidInputsEmail) {
	if (event.keyCode == 13) {
		event.preventDefault();
		validarCorreoElectronico(emailId, errorDivId, errorMsg, formId, invalidInputsEmail);
	}
}

function validarTelefono() {		
	var errorMsg = "";
	var codigoArea = document.getElementById('telefonoCodigoArea').value;
	var telefono = document.getElementById('telefonoNumero').value;
	if (codigoArea && codigoArea.value != "") {
		if (codigoArea.length < 2) {
			errorMsg = "Código de área demasiado corto";
		} 
	} else {
		errorMsg = "Debe ingresar el código de área";		
	}
	
	if (telefono && telefono.value != "") {
		if (telefono.length < 6) {
			errorMsg = "Teléfono demasiado corto";
		} 
	} else {
		errorMsg = "Debe ingresar el teléfono";		
	}
	
	if (errorMsg != "") {
		document.getElementById('error-tel').textContent = errorMsg;		
		document.getElementById('div-error-tel').style.display = "inline";
	} else {
		document.getElementsByName('idGenero')[0].value = document.getElementById('genero').value;
		document.getElementsByName('idNacionalidad')[0].value = document.getElementById('nacionalidad').value;
		document.getElementById('div-error-tel').style.display = "none";
		document.getElementById("kc-form-telefono").submit();
	}
}

function validarDireccion() {
	var provincia = document.getElementById('provincia').value;
	var localidad = document.getElementById('localidad').value;
	var calle = document.getElementById('domicilioCalle').value;
	var piso = document.getElementById('domicilioPiso').value;
	var departamento = document.getElementById('domicilioDepto').value;
	var codigoPostal = document.getElementById('domicilioCodigoPostal').value;
	
	var errorMsg = "";
	
	if (provincia == "") {
		errorMsg = "Debe seleccionar una provincia";
	}
	
	if (localidad == "" && errorMsg == "") {
		errorMsg = "Debe seleccionar una localidad";
	}	
	
	if (calle && errorMsg == "") {
		if (!/[a-zA-Z0-9\s]+/.test(calle)) {
		    errorMsg = "Formato de calle incorrecto";
		}
	} 
	
	
	if (piso && errorMsg == "") {
		if (!/[a-zA-Z0-9]+/.test(piso)) {
		    errorMsg = "Piso no válido";
		}
	}
	
	if (departamento && errorMsg == "") {
		if (!/[a-zA-Z0-9\s]+/.test(departamento)) {
		    errorMsg = "Departamento no válido";
		}
	} 
	
	if (codigoPostal && errorMsg == "") {
		if (!/[a-zA-Z0-9]+/.test(codigoPostal)) {
		    errorMsg = "Codigo postal no válido";
		}
	} 
	
	if (errorMsg != "") {
		document.getElementById('error-dir').textContent = errorMsg;		
		document.getElementById('div-error-dir').style.display = "inline";
		return false;
	} else {		
		document.getElementById('div-error-dir').style.display = "none";
		document.getElementById('kc-form-direccion').submit();
	}
	
}

/* Form datos adicionales */

function validarTelefonoAdicional() {		
	var listOfObjects = [];
	console.debug(document.getElementsByName("telefonoNumero"));
	var status = true;
	var errorMsg="";
	var errorEncontrado= false;
	$('input[name="telefonoCodigoArea"]').each(function(index, codArea) {
		errorMsg ="";
		var numTel = document.getElementsByName("telefonoNumero")[index];
		if (numTel.value != "" || codArea.value != "" && status){
			if (codArea.value == "" ||  codArea.value.length < 2){
				if (codArea.value == ""){
					errorEncontrado = true;
					document.getElementsByName('error-tel-cod')[index].textContent = "Debe ingresar el código de área";		
					document.getElementsByName('div-error-tel-cod')[index].style.display = "inline";
					codArea.className += " input-error";
				}else{
					errorEncontrado = true;
					document.getElementsByName('error-tel-cod')[index].textContent = "Código de área demasiado corto";		
					document.getElementsByName('div-error-tel-cod')[index].style.display = "inline";	
					codArea.className += " input-error";			
				}		
				status = false;
			}
			var regexSoloNumeros = /\D/;
			if (!errorEncontrado && regexSoloNumeros.test(codArea.value)) {
				errorEncontrado = true;
				document.getElementsByName('error-tel-cod')[index].textContent = "Los caracteres ingresados no corresponden a un código de área";		
				document.getElementsByName('div-error-tel-cod')[index].style.display = "inline";
				codArea.className += " input-error";	
				status=false;
			} 
			
			if (numTel.value == "" ||  numTel.value.length < 6){
				if (numTel.value == ""){
					errorEncontrado = true;
					document.getElementsByName('error-tel-num')[index].textContent = "Debe ingresar el teléfono";		
					document.getElementsByName('div-error-tel-num')[index].style.display = "inline";
					numTel.className += " input-error";						
				}else{
					errorEncontrado = true;
					document.getElementsByName('error-tel-num')[index].textContent = "Teléfono demasiado corto";		
					document.getElementsByName('div-error-tel-num')[index].style.display = "inline";	
					numTel.className += " input-error";
				}				
				status =  false;
			}
			
			if (!errorEncontrado &&  regexSoloNumeros.test(numTel.value)) {
				errorEncontrado = true;
				document.getElementsByName('error-tel-num')[index].textContent = "Los caracteres ingresados no corresponden a un número de teléfono";		
				document.getElementsByName('div-error-tel-num')[index].style.display = "inline";	
				numTel.className += " input-error";
				status=false;
			}
			var auxNum = codArea.value + numTel.value ; 

			if (!listOfObjects.includes(auxNum)){
				listOfObjects[index]=auxNum; 
			}else{
				errorMsg = "Hay algún número telefónico repetido";		
				document.getElementsByName("error-tel")[index].textContent = errorMsg;		
				document.getElementsByName('div-error-tel')[index].style.display = "inline";
				errorEncontrado=true;
				status =  false;
			}

			if (errorMsg== ""){
				document.getElementsByName("error-tel")[index].textContent = "";
				document.getElementsByName('div-error-tel')[index].style.display = "none";			
			}
			if (errorEncontrado){
				var isExpandedPhone = $(collapseone).attr("aria-expanded");
					if (isExpandedPhone==undefined || isExpandedPhone!='true'){
						document.getElementById('toogleColapseOne').click();
					}	
			}							
		}else if (numTel.value == "" && codArea.value == ""){
			status = status && true;
		}else{
			status = false;
		}				
	 });
	return status;
}

function validarDireccionAdicional() {		
	var listOfObjects = [];

	var errorMsg = "";
	var status = true;
	$('input[name="domicilioCalle"]').each(function(index, el) {
		if ((index == 0 && document.getElementById('divAddressA').style.display != "none") || (index > 0 && document.getElementsByName('divAddressB')[index-1].style.display != "none")) {
			var errorEncontrado=false;
			var validacionUsig=0;
			var errorCalle="";
			errorMsg ="";
			var calle = el;
			var campousig = document.getElementsByName('usigField')[index].value;
			var elemUsig = document.getElementsByName('usigField')[index];

			if (campousig!=null){
				campousig = campousig.trim();
			}
			
			var formatoUsigValidoSinAutocompletar;
			if(document.getElementById('DIV_usig0').style.display != "none"){
				formatoUsigValidoSinAutocompletar = formatoValidoUsigSinAutocompletar(campousig);					
			}
			
			var tipo = document.getElementsByName('direccionTipo')[index];
			var altura = document.getElementsByName('domicilioAltura')[index];
			var provincia = document.getElementsByName('provincia')[index];
			var localidad = document.getElementsByName('localidad')[index];
			var piso = document.getElementsByName('domicilioPiso')[index];
			var departamento = document.getElementsByName('domicilioDepto')[index];
			var codigoPostal = document.getElementsByName('domicilioCodigoPostal')[index];
			var zonaVulnerable = document.getElementsByName('zonaVulnerable')[index].value;
			if (status && (tipo.value != "" || provincia.value != "" || localidad.value != "" || calle.value != "" || altura.value != "")){
				if (tipo.value == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-tipo')[index].textContent = "Seleccioná un tipo de domicilio";		
					document.getElementsByName('div-error-dir-tipo')[index].style.display = "block";
					tipo.className += " input-error";	
				}			
				if (provincia.value == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-pcia')[index].textContent =  "Seleccioná una provincia";		
					document.getElementsByName('div-error-dir-pcia')[index].style.display = "inline";
					provincia.className += " input-error";
				}else{
					validacionUsig = provincia.value.split(";")[1];
				}
				if (localidad.value == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-loc')[index].textContent = "Seleccioná una localidad";		
					document.getElementsByName('div-error-dir-loc')[index].style.display = "inline";
					localidad.className += " input-error";
				}	
				if (document.getElementById('DIV_usig0').style.display != "none" && !formatoUsigValidoSinAutocompletar){
					errorEncontrado = true;	
					errorCalle = "Ingresá una calle y una altura. Ej. Callao Av. 231";
					document.getElementsByName('error-dir-calle-usig')[index].textContent = errorCalle;		
					document.getElementsByName('div-error-dir-calle-usig')[index].style.display = "inline";
					elemUsig.className += " input-error";
				}	
				if (calle.value == "" &&  validacionUsig==0 ) {
					errorEncontrado = true;
					errorCalle = "Ingresá una calle";
					document.getElementsByName('error-dir-calle')[index].textContent =  errorCalle;		
					document.getElementsByName('div-error-dir-calle')[index].style.display = "inline";
					calle.className += " input-error";
				}
				if ( (altura.value==null || altura.value == "") && validacionUsig==0 ) {
					errorEncontrado = true;
					errorCalle = "Ingresá una altura";	
					document.getElementsByName('error-dir-altura')[index].textContent = errorCalle;	
					document.getElementsByName('div-error-dir-altura')[index].style.display = "inline";
					altura.className += " input-error";
				}
				
				if (calle.value && errorCalle == "") {
					if (!/[a-zA-Z0-9\s]+/.test(calle.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-calle')[index].textContent = "Formato de calle incorrecto";
						document.getElementsByName('div-error-dir-calle')[index].style.display = "inline";
						calle.className += " input-error";
					}
				} 			
				
				if (piso.value) {
					if (!/^[a-zA-Z0-9]+$/.test(piso.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-piso')[index].textContent = "Piso no válido";		
						document.getElementsByName('div-error-dir-piso')[index].style.display = "inline";
						piso.className += " input-error";
					}
				}
				
				if (departamento.value) {
					if (!/^[a-zA-Z0-9\s]+$/.test(departamento.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-depto')[index].textContent = "Departamento no válido";
						document.getElementsByName('div-error-dir-depto')[index].style.display = "inline";
						departamento.className += " input-error";
					}
				} 
				
				if (codigoPostal.value) {
					if (!/^[a-zA-Z0-9]+$/.test(codigoPostal.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-postalcode')[index].textContent = "El código postal no válido";		
						document.getElementsByName('div-error-dir-postalcode')[index].style.display = "inline";
						codigoPostal.className += " input-error";
					}
				} else {
					errorEncontrado = true;
					document.getElementsByName('error-dir-postalcode')[index].textContent = "Ingresá un código postal";		
					document.getElementsByName('div-error-dir-postalcode')[index].style.display = "inline";
					codigoPostal.className += " input-error";
				}

				if (!errorEncontrado) {
					var auxDir = tipo.value + ";" + calle.value + ";" + altura.value + ";"  +provincia.value + ";"  +localidad.value + ";" +codigoPostal.value + ";" +piso.value+ ";" +departamento.value;
					if (calle.value == ""){
						var calleUsig = campousig.substr(0, campousig.lastIndexOf(' '));
						var alturaUsig = campousig.substr(campousig.lastIndexOf(' ')+1, campousig.length);
						auxDir = tipo.value + ";" + calleUsig.trim() + ";" + alturaUsig.trim() + ";"  +provincia.value + ";"  +localidad.value + ";" +codigoPostal.value+ ";" +piso.value+ ";" +departamento.value;
					}
					auxDir= auxDir.toLowerCase();
					if (!listOfObjects.includes(auxDir)){
						listOfObjects[index]=auxDir; 
					}else{
						errorMsg = "La dirección ya fue ingresada";	
						document.getElementsByName('error-dir')[index].textContent = errorMsg;		
						document.getElementsByName('div-error-dir')[index].style.display = "inline";	
						errorEncontrado=true;
						status =  false;
					}
				}
				if (errorEncontrado) {
					status = false;	
					return;				
				} else {		
					document.getElementsByName('div-error-dir')[index].style.display = "none";
				}
				
			}
		}		
	 });
	return status;
}
function reposicionarAutocompletarUsig(campousig){
	var idUsigField=campousig.id;
	
	var idDivAutocompletar = 'usig_acv_' + idUsigField;
	var sugerencias = document.getElementsByClassName('usig_acv');
	for (var i=0; i< sugerencias.length; i++){
		if (sugerencias[i]!=null && sugerencias[i].id == idDivAutocompletar){
			sugerencias[i].style.top = Number(campousig.getBoundingClientRect().bottom) +window.pageYOffset + "px";
			sugerencias[i].style.left = Number(campousig.getBoundingClientRect().left) +window.pageXOffset + "px";
		}
	}
	
}

function eliminarAcvUsig(index){
	var divUsigAcv = document.getElementById('usig_acv_usig'+index);
	if (divUsigAcv != null){
		divUsigAcv.parentNode.removeChild(divUsigAcv);
	}
}


function validarEmailsAdicional(invalidInputsEmail) {	
	var status = true;
	var listOfObjects = [];
	var errorMsg="";
	var errorEncontrado= false;
	$('input[name="emailAlternativo"]').each(function(index, el) {
		if (!listOfObjects.includes(el.value.toLowerCase())){
			if(el.value!="")
				listOfObjects[index]=el.value.toLowerCase(); 
		}else{
			errorMsg = "La dirección de correo ya fue ingresada";	
			document.getElementsByName('error-email-mail-emailAlternativo')[index].textContent = errorMsg;
			document.getElementsByName('div-error-email-mail-emailAlternativo')[index].style.display = "inline";
			el.className += " input-error";			
			errorEncontrado=true;		
			status =  false;
		}
		if (errorMsg == "" &&  (el.value != "" && !isValidEmail(el.value, invalidInputsEmail))){
			errorMsg = "El formato del email es incorrecto.";
			document.getElementsByName('error-email-mail-emailAlternativo')[index].textContent = errorMsg;		
			document.getElementsByName('div-error-email-mail-emailAlternativo')[index].style.display = "inline";
			el.className += " input-error";	
			errorEncontrado=true;
			status =  false;
		}

		if (errorMsg== ""){
			document.getElementsByName("error-email")[index].textContent = "";
			document.getElementsByName("div-error-email")[index].style.display = "none";	
		}		
		if (errorEncontrado){
			var isExpandedEmails = $(collapseThree).attr("aria-expanded");
					if (isExpandedEmails==undefined || isExpandedEmails!='true'){
						document.getElementById('toogleCollapseThree').click();
					}	
			status = false;
		}
	 });
	 
	 
	 return status;
}

function validarDatosAdicionales(invalidInputsEmail){	
	var validoEmail = true;
	var validoTelefono = true;
	var validoDireccion=true;
	var isExpandedPhone = $(collapseone).attr("aria-expanded");
	var isExpandedAddress = $(collapsetwo).attr("aria-expanded");
	var isExpandedEmail = $(collapseThree).attr("aria-expanded");

	validoTelefono = validarTelefonoAdicional();
	
	validoDireccion = validarDireccionAdicional();

	validoEmail = validarEmailsAdicional(invalidInputsEmail);	

	if (validoEmail && validoTelefono && validoDireccion){
		var combosLocalidad = document.getElementsByName('localidad');
		for (var i =0 ; i<combosLocalidad.length; i++)
			combosLocalidad[i].removeAttribute("disabled");
		var inputsCodigoPostal = document.getElementsByName('domicilioCodigoPostal');
		for (var j =0 ; j<inputsCodigoPostal.length; j++)
			inputsCodigoPostal[j].removeAttribute("disabled");
		
		document.getElementById('kc-form-login-datos-adicionales').submit();
	}
	
	if (!validoTelefono && document.getElementById('toogleColapseOne').getAttribute("aria-expanded") == "false")
		document.getElementById('toogleColapseOne').click();
	
	if (!validoDireccion && document.getElementById('toogleColapseTwo').getAttribute("aria-expanded") == "false")
		document.getElementById('toogleColapseTwo').click();
		
	if (!validoEmail && document.getElementById('toogleCollapseThree').getAttribute("aria-expanded") == "false")
		document.getElementById('toogleCollapseThree').click();

}

function validarDireccionesAdicionales(index){	
	var validoDireccion=true;
	var isExpandedAddress = $(collapsetwo).attr("aria-expanded");
	/*Solo valido los datos de los expandidos */	
	validoDireccion = validarDireccionAdicional();
	if (validoDireccion){
		if (index==-99)
			mostrarDivAdrresA();
		else
			showDiv(index,true,'divAddressB');
	}else
		return false;
}
function validarEmailAdicionales(index, invalidInputsEmail){	
	var validoEmail=true;
	/*Solo valido los datos de los expandidos */	
	validoEmail = validarEmailsAdicional(invalidInputsEmail);	
	var vaciosVisibles = emailsVacios();
	if (validoEmail && !vaciosVisibles){
		if (index == -99)
			mostrarDivEmailA();
		else
			showDiv(index,true,'divEmailB');
	}else
		return false;
}
function validarPhoneAdicionales(index){	
	var validoTelefono=true;
	validoTelefono = validarTelefonoAdicional();
	var vaciosVisibles= telefonosVacios();
	if (validoTelefono && !vaciosVisibles){
		if (index ==  -99)
			mostrarDivPhoneA();
		else
			showDiv(index,true,'phoneB');
	}else
		return false;
}

function telefonosVacios(){
	for (var index =0; index <3; index++){
		if ((index==0 && document.getElementById('divPhoneA').style.display!='none') ||
			(index>0 && document.getElementsByName('phoneB')[index-1].style.display!= 'none')){
			var codigo = document.getElementsByName('telefonoCodigoArea')[index].value;
			var numero = document.getElementsByName('telefonoNumero')[index].value;
			if (codigo=="" && numero ==""){
				document.getElementsByName("error-tel")[index].textContent = "Debe completar este número para agregar otro";		
				document.getElementsByName('div-error-tel')[index].style.display = "inline";
				return true;
			}
		}
	}
	return false;
}
function emailsVacios(){
	for (var index =0; index <3; index++){
		if ((index==0 && document.getElementById('divEmailA').style.display!='none') ||
			(index>0 && document.getElementsByName('divEmailB')[index-1].style.display!= 'none')){
			var email = document.getElementsByName('emailAlternativo')[index].value;
			if (email==""){
				document.getElementsByName("error-email")[index].textContent = "Debe completar esta dirección para agregar otra";		
				document.getElementsByName('div-error-email')[index].style.display = "inline";
				return true;
			}
		}
	}
	return false;
}


function changeAutocomplete(tipo, index, loadInicial){
	if (loadInicial==1){
		var calle = document.getElementById('domicilioCalle'+index).value;
		var altura = document.getElementById('domicilioAltura'+index).value;
		var normalized = document.getElementById('normalized'+index).value;
		var zonaVulnerable = document.getElementById('zonaVulnerable'+index).value;
		if (tipo!=2){
			var direccionNormalizada =  calle + " " + altura;
			direccionesNormalizadasDefault[index] = direccionNormalizada;
			document.getElementById('usig'+index).value=direccionNormalizada;
			ultimoTextoNormalizado[index] = direccionNormalizada;
			if (normalized==1){
				if (zonaVulnerable!=null && (zonaVulnerable== '0' || zonaVulnerable== '1'))
					document.getElementsByName('localidad')[index].setAttribute("disabled", "disabled");
				if (zonaVulnerable!=null && zonaVulnerable== '0')
					document.getElementById('domicilioCodigoPostal'+index).setAttribute("disabled", "disabled");
			}
		}else{
			//Para GBA hay que concatenar el nombre del barrio
			var comboLocalidad =document.getElementsByName('localidad')[index];
			var barrio = comboLocalidad.options[comboLocalidad.selectedIndex].text;
			var direccionNormalizada = calle + " " + altura +", "+barrio
			direccionesNormalizadasDefault[index] = direccionNormalizada;
			ultimoTextoNormalizado[index] = direccionNormalizada;
			document.getElementById('usig'+index).value= direccionNormalizada ;
			if (normalized==1){
				comboLocalidad.setAttribute("disabled", "disabled");
			}
		}
	}else{
		blanquearCamposNormalized(index, 1);//Con 1 boora tambien los de domicilio
		document.getElementById('usig'+index).value= '';
	}

	if (ac[index]!= undefined)
		ac[index].unbind();
	validaUsig[index]= tipo;
	var suggestersCiudad = [{suggester: "Direcciones",options: {inputPause: 10,minTextLength: 3}},
				{suggester:'ZonasVulnerables',options: { inputPause: 100, minTextLength: 5, showError: false }}];
	var suggestersGCBA = [{suggester:'DireccionesAMBA',options: { inputPause: 10, minTextLength: 3, showError: true }}];
	var sugestersResto = [];
	if (tipo == 0){//No valida usig
		document.getElementById('DIV_usig'+index).style.display = "none";
		document.getElementById('DIV_domicilioCalle'+index).style.display = "inline";		
		document.getElementById('DIV_domicilioAltura'+index).style.display = "inline";				
		ac[index] = new usig.AutoCompleter('usig'+index, {
			debug: true,
			//rootUrl: '../',
			skin: 'bootstrap',
			suggesters: sugestersResto,
			onReady: function() {  
			},
			afterSelection: function(option) {
			},
			afterGeoCoding: function(pt){
			}
		});
		ac[index].removeSuggester("Lugares");
		ac[index].removeSuggester("Direcciones");
		ac[index].removeSuggester("DireccionesAMBA");
		ac[index].removeSuggester("ZonasVulnerables");
	}else if (tipo == 1){ //valida usig ciudad de buenos aires
		document.getElementById('DIV_usig'+index).style.display = "block";
		document.getElementById('DIV_domicilioCalle'+index).style.display = "none";		
		document.getElementById('DIV_domicilioAltura'+index).style.display = "none";
		ac[index] = new usig.AutoCompleter('usig'+index, {
			debug: true,
//			rootUrl: '../',
			suggesters: suggestersCiudad,
			onReady: function() {   			
			},
			onInputChange: function(){
                reposicionarAutocompletarUsig(document.getElementById('usig'+index));
            },
			afterSelection: function(option) {
				var campoAutocompletar = document.getElementById('usig'+index).value;
				var campoAutocompletar2 = normalizarCampoUsig(campoAutocompletar);
				document.getElementById('usig'+index).value = campoAutocompletar2;
				ultimoTextoNormalizado[index] = campoAutocompletar2;

				$('#normalized'+index).val('0');
				$('#zonaVulnerable'+index).val('0');
				$('#domicilioCalle'+index).val('');
				$('#domicilioAltura'+index).val('');
				document.getElementById("domicilioCodigoPostal"+index).removeAttribute("disabled");
				var optionJson = option.toJson()
				if (optionJson.id_zona_vulnerable==null){
					if (optionJson.calle!=null)
						$('#domicilioCalle'+index).val(normalizarCampoUsig(optionJson.calle.nombre));
					else
						$('#domicilioCalle'+index).val(normalizarCampoUsig(optionJson.nombre));
					if (optionJson.altura!=null)
						$('#domicilioAltura'+index).val(optionJson.altura);
					else{
						$('#domicilioAltura'+index).val('');
						//Debo ver si se olvidaron de ingresar altura o  es una calle sin Numero
						if (option.getTramos()!=null && option.getTramos().length == 0){ 
							//Calle certificada por usig que no tiene numero
							$('#zonaVulnerable'+index).val('2');
							$('#normalized'+index).val('1');
						}
					}
				}else{
					$('#domicilioCalle'+index).val(normalizarCampoUsig(optionJson.nombre));
					$('#domicilioAltura'+index).val('');
					$('#normalized'+index).val('1');
					$('#zonaVulnerable'+index).val('1');
				}
			},
			afterGeoCoding: function(pt){
				ultimoTextoNormalizado[index] = document.getElementById("usig"+index).value;
				if (pt instanceof usig.Punto){
					$('#latitud'+index).val(normalizarCoordenadaUsig(pt.getY()));
					$('#longitud'+index).val(normalizarCoordenadaUsig(pt.getX()));
					var calle = document.getElementById("domicilioCalle"+index).value;	
					var altura = document.getElementById("domicilioAltura"+index).value;
					var custom =  new usig.DatosUtiles();
					custom.getCoordLonlat(pt.getX(), pt.getY(), function(data){
						if (data.resultado!=null){
							$('#latitud'+index).val(normalizarCoordenadaUsig(data.resultado.y));
							$('#longitud'+index).val(normalizarCoordenadaUsig(data.resultado.x));
						}
					});
					if (altura!=null && altura!=""){
						custom.getDatosUtiles(
							calle,
							altura,
							function(data){
								if (data.codigo_postal!=null){
									var inputCodigoPostal = document.getElementById("domicilioCodigoPostal"+index);
									inputCodigoPostal.value= data.codigo_postal;
									inputCodigoPostal.setAttribute("disabled","disabled");
									$('#normalized'+index).val('1');
								}
								if (data.barrio != null){
									var barrioUsig = data.barrio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
									selectLocalidad(index, barrioUsig);								
								}
								if (data.comuna!=null)
									$('#comuna'+index).val(data.comuna.split(" ")[1]);
							},
							function(data){
								console.log("no se pudieron acceder a datos utiles");
								console.log(data);
							}
						);
					}else{
						custom.getDatosUtilesCoordenadas(
							pt.getX(),
							pt.getY(),
							function(data){
								if (data.codigo_postal!=null){
									var inputCodigoPostal = document.getElementById("domicilioCodigoPostal"+index);
									inputCodigoPostal.value= data.codigo_postal;
									inputCodigoPostal.setAttribute("disabled","disabled");
									$('#normalized'+index).val('1');
								}
								if (data.barrio != null){
									var barrioUsig = data.barrio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
									selectLocalidad(index, barrioUsig);								
								}
								if (data.comuna!=null)
									$('#comuna'+index).val(data.comuna.split(" ")[1]);
							},
							function(data){
								console.log("no se pudieron acceder a datos utiles");
								console.log(data);
							}
						);
					}					
				}else{
					$('#latitud'+index).val('');
					$('#longitud'+index).val('');
				}
			}
		});
	}else if (tipo == 2){ //valida usig gran buenos aires
		document.getElementById('DIV_usig'+index).style.display = "block";
		document.getElementById('DIV_domicilioCalle'+index).style.display = "none";		
		document.getElementById('DIV_domicilioAltura'+index).style.display = "none";	
		ac[index] = new usig.AutoCompleter('usig'+index, {
			debug: true,
			suggesters: suggestersGCBA,
			onReady: function() {        			
			},
			onInputChange: function(){
                reposicionarAutocompletarUsig(document.getElementById('usig'+index));
            },
			afterSelection: function(option) {
				$('#normalized'+index).val('0');
				$('#zonaVulnerable'+index).val('0');
				$('#domicilioCalle'+index).val('');
				$('#domicilioAltura'+index).val('');
				var optionJson = option.toJson();
				
				var campoAutocompletar2 = document.getElementById('usig'+index).value;
				var campoAutocompletar = normalizarCampoUsig(campoAutocompletar2);
				document.getElementById('usig'+index).value = campoAutocompletar;
				ultimoTextoNormalizado[index] = campoAutocompletar;
				var optionJson = option.toJson();
				
				if (optionJson.calle!=null)
					$('#domicilioCalle'+index).val(normalizarCampoUsig(optionJson.calle.nombre));
				else
					$('#domicilioCalle'+index).val(normalizarCampoUsig(optionJson.nombre));
				if (optionJson.altura!=null)
					$('#domicilioAltura'+index).val(optionJson.altura);
				else{
					$('#domicilioAltura'+index).val('');
				}
				
				if (campoAutocompletar!= null){
					var splitAC = campoAutocompletar.split(",")
					if (splitAC!=null){
						var barrioUsig = splitAC[splitAC.length-1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
						selectLocalidad(index, barrioUsig);
					}	
				}
			},
			afterGeoCoding: function(pt){
				if (pt instanceof usig.Punto){
					$('#latitud'+index).val(normalizarCoordenadaUsig(pt.getY()));
					$('#longitud'+index).val(normalizarCoordenadaUsig(pt.getX()));
					$('#normalized'+index).val('1');
					var custom =  new usig.DatosUtiles();
					custom.getCoordLonlat(pt.getX(), pt.getY(), function(data){
						if (data.resultado!=null){
							$('#latitud'+index).val(normalizarCoordenadaUsig(data.resultado.y));
							$('#longitud'+index).val(normalizarCoordenadaUsig(data.resultado.x));
						}
					});
				}else{
					$('#latitud'+index).val('');
					$('#longitud'+index).val('');
				}
			}
		});
	}
}
function normalizarCampoUsig(campo){
	return campo.replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ,.\s]/g, "");
}

function showDiv(index,status,name){
	if (index == -1){
		if (name == "phoneB") {
			document.getElementsByName("telefonoCodigoArea")[0].value="";
			document.getElementsByName("telefonoNumero")[0].value="";
			
		} else if (name == "divAddressB") {		
			clearAllRadios(index);			
			document.getElementsByName("localidad")[0].selectedIndex = 0;	
			document.getElementsByName("provincia")[0].selectedIndex= 0;	
			document.getElementsByName("domicilioCalle")[0].value="";
			document.getElementsByName("domicilioAltura")[0].value="";
			document.getElementsByName("domicilioPiso")[0].value="";
			document.getElementsByName("domicilioDepto")[0].value="";
			document.getElementsByName("domicilioCodigoPostal")[0].value="";
			document.getElementsByName("domicilioObservacion")[0].value="";
		}
		return;
	}
	
	if (!status) {
		if (name == "phoneB") {
			document.getElementsByName("telefonoCodigoArea")[index+1].value="";
			document.getElementsByName("telefonoNumero")[index+1].value="";
		} else if (name == "divEmailB") {
			document.getElementsByName("emailAlternativo")[index+1].value="";
		} else if (name == "divAddressB") {
			clearAllRadios(index);			
			document.getElementsByName("localidad")[index+1].value="";
			document.getElementsByName("provincia")[index+1].value="";
			document.getElementsByName("domicilioCalle")[index+1].value="";
			document.getElementsByName("domicilioAltura")[index+1].value="";
			document.getElementsByName("domicilioPiso")[index+1].value="";
			document.getElementsByName("domicilioDepto")[index+1].value="";
			document.getElementsByName("domicilioCodigoPostal")[index+1].value="";
			document.getElementsByName("domicilioObservacion")[index+1].value="";
		}
	}	
	document.getElementsByName('add'+name)[index].style.display = status?"none":"inline";		
	document.getElementsByName(name)[index].style.display = status?"inline":"none";	
	cerrarCollapseTwoSiNoHayDirecciones();
	cerrarCollapseOneSiNoHayTelefonos();
	cerrarCollapseThreeSiNoHayEmails();

}

function clearAllRadios(index) {
    var valor=0;
	if (index==-1)
		valor=-1;
	else
	if (index==0)
		valor=2;
	else
	if (index==1)
		valor=5;
	for (var i = 1; i <= 3; i++) {
		document.getElementsByName("labelTipoRadio")[valor+i].className = "btn btn-default radioDir btn_tu_direccion";
	}
  }

function clonarDivEmail(){
	var count = document.getElementsByName("emailAlternativo").length;
	$(document).ready(function(){  
		if (count < 3){
			$("#divEmailA").clone().appendTo("#divEmailB");	  
			//Inicializar los campos		
			document.getElementsByName("emailAlternativo")[count].value = "";	
			document.getElementsByName("emailAlternativo")[count].disabled=false;		
		}			
	});
}

function clonarDivAddress(){
	var count = document.getElementsByName("domicilioObservacion").length;
	$(document).ready(function(){  
		if (count < 3){
			$("#divAddressA").clone().appendTo("#divAddressB");	  		
			//Inicializar los campos
			document.getElementsByName('domicilioCalle')[count].value="";
			document.getElementsByName('domicilioAltura')[count].value="";
			document.getElementsByName('domicilioPiso')[count].value="";
			document.getElementsByName('domicilioDepto')[count].value="";
			document.getElementsByName('domicilioCodigoPostal')[count].value="";
			document.getElementsByName('domicilioObservacion')[count].value="";
			changeProvinciaGeneral(count, "provincia", "localidades");				
		}			
	});
}

function deleteDiv(element,collapseId,idElement){
	var count = document.getElementsByName(idElement).length;
	if (count == 1){
		$("#"+collapseId).collapse("hide")
	}else{
		var x = element.parentElement;
		var y = x.parentElement;
		var z = y.parentElement;
		if (z != null)
			z.remove(); 
	}
}

function setTipoDireccion(current, index){
	var div = current.closest('div');
	var input = document.getElementsByName('direccionTipo')[index];
	input.value = current.value;
}

function disabledArg() {
	$("#paisDocumento > option").each(function() {
		if (this.value.split(";")[1]== 'ARG'){
			this.disabled = true;
			return;
		}
	});
}


function cancelarModal(value) {
	$(function () {
		$('#' + value).modal('toggle');
	 });
}

function validarFecha(fechaNacimiento) {
	if (fechaNacimiento.value.length == 10) {
		if (!isValidDate(fechaNacimiento.value)) {
			fechaNacimiento.value = "";
			return false;
		} else {
			return true;
		}
	} else {
		fechaNacimiento.value = "";
		return false;
	}
}

function isDateBirthValid(fechaNacimiento) {
	let valid = true;

	let f = fechaNacimiento.value;
	let arr = f.split("/");

	let fecha = arr[2] + "-" + arr[1] + "-" + arr[0];

	let documentElement = document.getElementById("numeroIdentificacion");
	let documentNumber = documentElement.value.replace("-","").replace("-","");

	let params = {
		'dateBirth': fecha,
		'document': documentNumber
	};

	let url = window.location.protocol + "//" + window.location.host;
	url = "/miba-login2-api/api/citizen/isDateBirthValid?params=" + encodeURI(JSON.stringify(params));

	fetch(url)
		.then(response => {
			response.json().then(
				data => {
					if (data.dateBirthValid) {
						document.getElementById("div-error-fechaNacimiento-cuil").style.display = "none";
						valid = false;
						dateBirthValid = true;
					} else {
						document.getElementById("div-error-fechaNacimiento-cuil").style.display = "block";
						dateBirthValid = false;
					}
					return valid;
				}
			)
		})
		.catch(error => { console.log(error) })
}

function isValidDate(dateString) {
    // First check for the pattern
    const str = dateString.split('/');
    var day = str[0];
    var month = str[1];
    var year = str[2];
    var fechaSelected = new Date(year,month-1,day);
    var fechaActual = new Date();
   
    if (year < 1900 || month > 12 || fechaSelected > fechaActual ) {
      return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
 }
 
function format(email) {
    let emailDiv = email.split('@');
    let username = emailDiv[0];
    let provider = emailDiv[1];
    let len = username.length;
    let result = "";

    switch (len) {
      case 2 : 
          result = "**" ;
          break;
      case 3 :
          result = "**" + email.charAt(2);
          break;
      default :
        for (var i=0; i<len ; i++) {
          if (i < 10 && i%2 == 0) {
              result = result.concat(email.charAt(i));
          } else {
              result = result.concat('*');
          }
        }
        break;      
    }

    result = result.concat('@');

    for (var i=1; i<provider.length && provider[i] != '.' ; i++) {
      provider = this.replaceAt(provider, i, '*');
    }

    result = result.concat(provider);
    return result;
 }

function  formatoValidoUsigSinAutocompletar(campousig){
	//Tiene que tener mas de una componente y la ultima deben ser solo numeros (la altura)
	const str = campousig.trim().split(" ");
	
	if (str != null && str.length>1){
		var altura = str[str.length-1];
		var regexp = /\D/;			  
		if (altura!='' && altura.length<=6 && !regexp.test(altura)) {
			return true;
		}	
	}
	console.log("formato no valido");
	return false;
  }
function blanquearCamposNormalized(index, todos){
	if (todos == 1){
		document.getElementById('domicilioCalle'+index).value = "";
		document.getElementById('domicilioAltura'+index).value = "";
		document.getElementById('domicilioCodigoPostal'+index).value= '';
	}
	document.getElementById('longitud'+index).value= '';
	document.getElementById('latitud'+index).value= '';
	document.getElementById('normalized'+index).value= '0';
	document.getElementById('zonaVulnerable'+index).value= '0';
	document.getElementById('comuna'+index).value= '';
	document.getElementById('domicilioCodigoPostal'+index).removeAttribute("disabled");
	if (document.getElementsByName('localidad')[index]!=null)
		document.getElementsByName('localidad')[index].removeAttribute("disabled");	
}
function cambioUsigField(index){
	var ultimo = ultimoTextoNormalizado[index];
	var usigField = document.getElementById('usig'+index).value;
	if (usigField == ultimo){
		return;
	}else 
		blanquearCamposNormalized(index, 1);
}

function ocultarErrorInline(index, field){
	if (field!=null)
		document.getElementsByName('div-error-dir-'+field)[index].style.display ='none';
	else{
		document.getElementsByName('div-error-dir-pcia')[index].style.display ='none';
		document.getElementsByName('div-error-dir-loc')[index].style.display ='none';
		document.getElementsByName('div-error-dir-calle')[index].style.display ='none';
		document.getElementsByName('div-error-dir-calle-usig')[index].style.display ='none';
		document.getElementsByName('div-error-dir-altura')[index].style.display ='none';
		document.getElementsByName('div-error-dir-depto')[index].style.display ='none';
		document.getElementsByName('div-error-dir-piso')[index].style.display ='none';
		document.getElementsByName('div-error-dir-postalcode')[index].style.display ='none';
	}
}
function ocultarMensajeErrorTel(index,field,element){
	if (field!=null)
		document.getElementsByName('div-error-tel-'+field)[index].style.display ='none';
	if (element != null)
		element.className = element.className.replace(' input-error','');

}

function normalizarCoordenadaUsig(coord){
	return coord.toString().replace(".", ",");
}

function validarUpdateProfile(invalidInputsEmail){	
	var validoEmail = true;
	var validoTelefono = true;
	var validoDireccion=true;
	var validoNacionalidad = true;
	var validoGenero=true;
	
	var validoEmailAlternativo = true;
	
	var telefonoTipo = document.getElementsByName("telefonoTipo");
	if (telefonoTipo!= undefined && telefonoTipo.length > 0)
		validoTelefono = validarTelefonoUpdateProfile();
	var direccionTipo = document.getElementsByName("direccionTipo");
	if (direccionTipo!= undefined && direccionTipo.length > 0)
		validoDireccion = validarDireccionUpdateProfile();
	
	var nacionalidad = document.getElementById("nacionalidad");
	if (nacionalidad != undefined && nacionalidad.value == "") {
		var errnac = document.getElementById('error-dir-nacionalidad').textContent = "Seleccioná una nacionalidad";	
		document.getElementById('div-error-dir-nacionalidad').style.display = "inline";
		validoNacionalidad = false;
	}
	
	var genero=document.getElementById("genero");
	if (genero != undefined && genero.value == "") {
		var errorGen = document.getElementById('error-dir-genero').textContent = "Seleccioná un genero";	
		document.getElementById('div-error-dir-genero').style.display = "inline";
		validoGenero = false;
	}
	
	var emailAlternativo = document.getElementById("emailAlternativo");
	if (emailAlternativo != undefined && emailAlternativo.value == "") {
		var errmail = document.getElementById('error-email-mail-emailAlternativo').textContent = "Agregá un email";	
		document.getElementById('div-error-email-mail-emailAlternativo').style.display = "inline";
		validoEmailAlternativo = false;
	}
	
	if (emailAlternativo != undefined && !isValidEmail(emailAlternativo.value, invalidInputsEmail)) {
		var errmail = document.getElementById('error-email-mail-emailAlternativo').textContent = "El formato del email es incorrecto.";	
		document.getElementById('div-error-email-mail-emailAlternativo').style.display = "inline";
		validoEmailAlternativo = false;
	}
	
	if (validoEmail && validoTelefono && validoDireccion && validoNacionalidad && validoEmailAlternativo && validoGenero) {
		var combosLocalidad = document.getElementsByName('localidad');
		for (var i =0 ; i<combosLocalidad.length; i++)
			combosLocalidad[i].removeAttribute("disabled");
		var inputsCodigoPostal = document.getElementsByName('domicilioCodigoPostal');
		for (var j =0 ; j<inputsCodigoPostal.length; j++)
			inputsCodigoPostal[j].removeAttribute("disabled");
		document.getElementById('kc-update-profile-form').submit();
	}
		
}

function validarTelefonoUpdateProfile() {		
	var listOfObjects = [];
	console.debug(document.getElementsByName("telefonoNumero"));
	var status = true;
	var errorMsg="";
	var errorEncontrado= false;
	$('input[name="telefonoCodigoArea"]').each(function(index, codArea) {
		errorMsg ="";
		var numTel = document.getElementsByName("telefonoNumero")[index];
		if (codArea.value == "" ||  codArea.value.length < 2){
			if (codArea.value == ""){
				errorEncontrado = true;
				document.getElementsByName('error-tel-cod')[index].textContent = "Ingresá el código de área";		
				document.getElementsByName('div-error-tel-cod')[index].style.display = "inline";
				codArea.className += " input-error";
			}else{
				errorEncontrado = true;
				document.getElementsByName('error-tel-cod')[index].textContent = "Código de área demasiado corto";		
				document.getElementsByName('div-error-tel-cod')[index].style.display = "inline";
				codArea.className += " input-error";				
			}
			status = false;
		}
		
		if (numTel.value == "" ||  numTel.value.length < 6){
			if (numTel.value == ""){
				errorEncontrado = true;
				document.getElementsByName('error-tel-num')[index].textContent = "Ingresá el teléfono";		
				document.getElementsByName('div-error-tel-num')[index].style.display = "inline";	
				numTel.className += " input-error";					
			}else{
				errorEncontrado = true;
				document.getElementsByName('error-tel-num')[index].textContent = "Teléfono demasiado corto";		
				document.getElementsByName('div-error-tel-num')[index].style.display = "inline";	
				numTel.className += " input-error";
			}				
			status =  false;
		}
		
		var auxNum = codArea.value + numTel.value ;

		if (!listOfObjects.includes(auxNum)){
			listOfObjects[index]=auxNum; 
		}else{
			errorMsg = "Hay algún número telefónico repetido";	
			document.getElementsByName("error-tel")[index].textContent = errorMsg;		
			document.getElementsByName('div-error-tel')[index].style.display = "inline";				
			status =  false;
		}

		if (errorMsg==""){
			document.getElementsByName("error-tel")[index].textContent = "";
			document.getElementsByName('div-error-tel')[index].style.display = "none";						
		}		
	 });
	return status;
}


function validarDireccionUpdateProfile() {	
	var listOfObjects = [];

	var errorMsg = "";
	var status = true;
	$('input[name="domicilioCalle"]').each(function(index, el) {
		
		if (index == 0 || (index > 0 && document.getElementsByName('divAddressB')[index-1].style.display != "none")) {
			var errorEncontrado=false;
			var validacionUsig = document.getElementsByName('div-usig-ba')[0].style.display != "none";
			var errorCalle="";
			errorMsg ="";
			var calle = el;
			var campousig = document.getElementsByName('usigField')[index].value;
			var elCampoUsig = document.getElementsByName('usigField')[index];

			if (campousig != null)
				campousig = campousig.trim();

			var formatoUsigValidoSinAutocompletar;

			if(validacionUsig){
				formatoUsigValidoSinAutocompletar = formatoValidoUsigSinAutocompletar(campousig);					
			}

			var tipo = document.getElementsByName('direccionTipo')[index];
			var altura = document.getElementsByName('domicilioAltura')[index];
			var provincia = document.getElementsByName('provincia')[index];
			var localidad = document.getElementsByName('localidad')[index];
			var piso = document.getElementsByName('domicilioPiso')[index];
			var departamento = document.getElementsByName('domicilioDepto')[index];
			var codigoPostal = document.getElementsByName('domicilioCodigoPostal')[index];
			var zonaVulnerable = document.getElementsByName('zonaVulnerable')[index].value;

			if (status){
				if (tipo == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-tipo')[index].textContent = "Seleccioná un tipo de domicilio";		
					document.getElementsByName('div-error-dir-tipo')[index].style.display = "inline";
				}			
				if (provincia.value == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-pcia')[index].textContent =  "Seleccioná una provincia";		
					document.getElementsByName('div-error-dir-pcia')[index].style.display = "inline";
					provincia.className += " input-error";
				}else{
					provincia = provincia.value.split(";")[1];
				}
				if (localidad.value == "") {
					errorEncontrado = true;
					document.getElementsByName('error-dir-loc')[index].textContent = "Seleccioná una localidad";		
					document.getElementsByName('div-error-dir-loc')[index].style.display = "inline";
					localidad.className += " input-error";
				}	

				if(validacionUsig && !formatoUsigValidoSinAutocompletar){
					errorEncontrado = true;	
					errorCalle = "Ingresá una calle y una altura. Ej. Callao Av. 231";
					document.getElementsByName('error-dir-calle-usig')[index].textContent = errorCalle;		
					document.getElementsByName('div-error-dir-calle-usig')[index].style.display = "inline";
					elCampoUsig.className += " input-error";
				}

				if ((calle.value == null || calle.value == "") &&  !validacionUsig ) {
					errorEncontrado = true;
					errorCalle = "Ingresá una calle";
					document.getElementsByName('error-dir-calle')[index].textContent =  errorCalle;		
					document.getElementsByName('div-error-dir-calle')[index].style.display = "inline";
					calle.className += " input-error";
				}
				if ( (altura.value==null || altura.value == "") && !validacionUsig ) {
					errorEncontrado = true;
					errorCalle = "Ingresá una altura";	
					document.getElementsByName('error-dir-altura')[index].textContent = errorCalle;	
					document.getElementsByName('div-error-dir-altura')[index].style.display = "inline";
					altura.className += " input-error";
				}
				
				if (calle.value && errorCalle == "") {
					if (!/[a-zA-Z0-9\s]+/.test(calle)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-calle')[index].textContent = "Formato de calle incorrecto";
						document.getElementsByName('div-error-dir-calle')[index].style.display = "inline";
						calle.className += " input-error";
					}
				} 			
				
				if (piso.value) {
					if (!/^[a-zA-Z0-9]+$/.test(piso.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-piso')[index].textContent = "Piso no válido";		
						document.getElementsByName('div-error-dir-piso')[index].style.display = "inline";
						piso.className += " input-error";
					}
				}
				
				if(departamento.value) {
					if (!/^[a-zA-Z0-9\s]+$/.test(departamento.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-depto')[index].textContent = "Departamento no válido";
						document.getElementsByName('div-error-dir-depto')[index].style.display = "inline";
						departamento.className += " input-error";
					}
				} 

				if(codigoPostal.value) {
					if (!/^[a-zA-Z0-9]+$/.test(codigoPostal.value)) {
						errorEncontrado = true;
						document.getElementsByName('error-dir-postalcode')[index].textContent = "El código postal no es válido";		
						document.getElementsByName('div-error-dir-postalcode')[index].style.display = "inline";
						codigoPostal.className += " input-error";
					}
				} else {
					errorEncontrado = true;
					document.getElementsByName('error-dir-postalcode')[index].textContent = "Ingresá un código postal";		
					document.getElementsByName('div-error-dir-postalcode')[index].style.display = "inline";
					codigoPostal.className += " input-error";
				} 


				if (!errorEncontrado) {
					var auxDir = tipo.value + ";" + calle.value + ";" + altura.value + ";"  +provincia.value + ";"  +localidad.value + ";" 
									+codigoPostal.value + ";" +piso.value+ ";" +departamento.value;

					if (validacionUsig!=0 && calle.value == "" ){
						var calleUsig = campousig.substr(0, campousig.lastIndexOf(' '));
																		   
						var alturaUsig = campousig.substr(campousig.lastIndexOf(' ')+1, campousig.length);
						auxDir = tipo.value + ";" + calleUsig.trim() + ";" + alturaUsig.trim() + ";"  +provincia.value + ";"  +localidad.value + ";" +codigoPostal.value+ ";" +piso.value+ ";" +departamento.value;
					}
					auxDir= auxDir.toLowerCase();

					if (!listOfObjects.includes(auxDir)){
						listOfObjects[index]=auxDir; 
					}else{
						errorMsg = "La dirección ya fue ingresada";	
						document.getElementsByName('error-dir')[index].textContent = errorMsg;		
						document.getElementsByName('div-error-dir')[index].style.display = "inline";				
						errorEncontrado=true;
						status =  false;
					}
				}

				if (errorEncontrado) {
					status = false;
					return status;		
				} else {		
					document.getElementsByName('div-error-dir')[index].style.display = "none";
				}
			}
		}		
	 });
	return status;
}



function sendEmail(url){
	window.location.href=url;
}

function openCollapseTwo(){
	var addressAbiertas = false;
	var direccionesB = document.getElementsByName('divAddressB');
	for(var i=0; i< direccionesB.length ; i++){
		if (direccionesB[i].style.display != "none")
			addressAbiertas = true;
	}
	if (!addressAbiertas){
		mostrarDivAdrresA();
	}
}

function openCollapseOne(){
	var telefonosAbiertos = false;
	var telefonosB = document.getElementsByName('phoneB');
	for(var i=0; i< telefonosB.length ; i++){
		if (telefonosB[i].style.display != "none")
		telefonosAbiertos = true;
	}
	if (!telefonosAbiertos){
		mostrarDivPhoneA();
	}
}

function openCollapseThree(){
	var emailsAbiertos = false;
	var emailsB = document.getElementsByName('divEmailB');
	for(var i=0; i< emailsB.length ; i++){
		if (emailsB[i].style.display != "none")
		emailsAbiertos = true;
	}
	if (!emailsAbiertos){
		mostrarDivEmailA();
	}
}

function ocultarDivAdrresA(){
	document.getElementById('divAddressA').style.display = "none";
	document.getElementById('adddivAddressA').style.display = "block";
	cerrarCollapseTwoSiNoHayDirecciones();
}
function mostrarDivAdrresA(){
	document.getElementById('divAddressA').style.display = "block";
	document.getElementById('adddivAddressA').style.display = "none";
}

function ocultarPhoneA(){
	document.getElementById('divPhoneA').style.display = "none";
	document.getElementById('addPhoneA').style.display = "block";
	cerrarCollapseOneSiNoHayTelefonos();
}
function mostrarDivPhoneA(){
	document.getElementById('divPhoneA').style.display = "block";
	document.getElementById('addPhoneA').style.display = "none";
}

function ocultarEmailA(){
	document.getElementById('divEmailA').style.display = "none";
	document.getElementById('addEmailA').style.display = "block";
	cerrarCollapseThreeSiNoHayEmails();
}
function mostrarDivEmailA(){
	document.getElementById('divEmailA').style.display = "block";
	document.getElementById('addEmailA').style.display = "none";
}



function cerrarCollapseTwoSiNoHayDirecciones(){
	if (document.getElementById('divAddressA').style.display != "none")
		return;
	var direccionesB = document.getElementsByName('divAddressB');
	for(var i=0; i< direccionesB.length ; i++){
		if (direccionesB[i].style.display != "none")
			return;
	}
	$("#collapsetwo").collapse("hide");	
}

function cerrarCollapseOneSiNoHayTelefonos(){
	if (document.getElementById('divPhoneA').style.display != "none")
		return;
	var telefonosB = document.getElementsByName('phoneB');
	for(var i=0; i< telefonosB.length ; i++){
		if (telefonosB[i].style.display != "none")
			return;
	}
	$("#collapseone").collapse("hide");	
}

function cerrarCollapseThreeSiNoHayEmails(){
	if (document.getElementById('divEmailA').style.display != "none")
		return;
	var emailsB = document.getElementsByName('divEmailB');
	for(var i=0; i< emailsB.length ; i++){
		if (emailsB[i].style.display != "none")
			return;
	}
	$("#collapseThree").collapse("hide");	
}

function clickOjo(inputId){
	let inputPassword = document.getElementById(inputId);
	inputPassword.type = 'text';
	let spanPassword = document.getElementById("span-"+inputId);
	spanPassword.setAttribute("onclick",  "ocultarPassword(\'"+inputId+"\')" );
	spanPassword.className = "password-eye glyphicon glyphicon-eye-close icon-align";
	setTimeout(()=>{
		ocultarPassword(inputId);
	},1000);
}

function ocultarPassword(inputId){
	let inputPassword = document.getElementById(inputId);
	inputPassword.type = 'password';
	let spanPassword = document.getElementById("span-"+inputId);
	spanPassword.setAttribute("onclick", "clickOjo(\'"+inputId+"\')");
	spanPassword.className = "password-eye glyphicon glyphicon-eye-open icon-align";
}	
function ocultarMensajeErrorEmailInput(index){
	document.getElementsByName('div-error-email-mail-emailAlternativo')[index].style.display='none';
}

function clearError(element,field){
	element.className = element.className.replace(' input-error','');
	if (field !=null){
		document.getElementById('error-' + field).textContent = "";		
		document.getElementById('div-error-' + field).style.display = "none";
	}
	
	if (field =='fechaNacimiento')
		document.getElementById("icon-calendar").className =document.getElementById("icon-calendar").className.replace(' input-group-addon_calendario_red',''); 	
}

function changeNacionalidad() {		
	document.getElementById('div-error-dir-nacionalidad').style.display = "none";	
}

function changeGenero() {		
	document.getElementById('div-error-dir-genero').style.display = "none";	
}

function validarLoginMailPassword() {
	var email = document.getElementById("email");
	var password = document.getElementById("password-text-field");
	var errorMsg = "";	

	if ((email.value == null || email.value.trim()=="")){
		errorMsg = "Este dato es obligatorio.";
		errorEncontrado = true;
		mostrarMensajeError(email,errorMsg,'email');
	}

	if ((password.value == null || password.value.trim()=="")){
		errorMsg = "Este dato es obligatorio.";
		errorEncontrado = true;
		mostrarMensajeError(password,errorMsg,'password');
	}

	if (errorMsg != "") {
		return false;	
	} else {
		document.getElementById('kc-form-login-mail').submit();
		document.getElementById("login").disabled = true;
		return false;
	}
}

function validarPasswordConfirm(passwordId, confirmId, errorTextIdPassword, errorTextIdConfirm) {
	let passwordInput = document.getElementById(passwordId);
	let confirmInput = document.getElementById(confirmId);
	let passwordError = document.getElementById(errorTextIdPassword);
	let confirmError = document.getElementById(errorTextIdConfirm);
	let isPasswordValid = true;
	let isConfirmValid = true;
	passwordError.parentElement.style.display = 'none';
	confirmError.parentElement.style.display = 'none';
	
	if(!passwordInput.value || passwordInput.value.length <= 0) {
		passwordError.textContent = 'Por favor, escribí tu nueva contraseña.';
		isPasswordValid = false;
		passwordError.parentElement.style.display = 'flex';
	}
	if(!confirmInput.value || confirmInput.value.length <= 0) {
		confirmError.textContent = 'Por favor, volvé a escribir tu contraseña.';
		isConfirmValid = false;
		confirmError.parentElement.style.display = 'flex';
	}
	if(isConfirmValid && isPasswordValid && passwordInput.value != confirmInput.value) {
		confirmError.textContent = 'Las contraseñas no coinciden.';
		isConfirmValid = false;
		confirmError.parentElement.style.display = 'flex';
	}

	if(isPasswordValid && isConfirmValid) {
		passwordInput.form.submit();
	}
}

function deshabilitarButton(element) {
	element.setAttribute('disabled', 'disabled');

    setTimeout(function() {
      element.removeAttribute('disabled');
    }, 2000);
}
