/*::::::::::: Juan Palma (2025) :::::::::::*/
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

/*::::::::::::::::::::::::::::::
	Codigo de Juan Palma
::::::::::::::::::::::::::::::*/
export const idagl = { elementos: {} };
const el = idagl.elementos;

/* --- helper debounce idéntico --- */
function debounce(fn, wait = 250, immediate = false) {
  let timeout;
  return function (...args) {
    const later = () => {
      timeout = null;
      if (!immediate) fn.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) fn.apply(this, args);
  };
}












// Funcion de niver superiro debouce.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


async function iniciar() {
	await pantallasShow()
	//activar estilos o efectos para mobile css
	//habilitar funciones para moviles:
	if ((el.mobile = /Mobile/i.test(navigator.userAgent))) {
		if ((el.touch = Modernizr.touchevents)) {
			//if(document.getElementById("pantalla1")){
			//	if(document.getElementById("pantalla1").getElementsByTagName('button').length > 0) {
			//		document.getElementById("pantalla1").getElementsByTagName('button')[0].classList.add("mobileAnimado");
			//	}
			//	document.querySelectorAll(".circuloChico").forEach((b) => b.classList.add("mobileAnimado"));
			//};
		}
	}



	//Comenzar a cargar los videos del sitio
	initVideos();


	// Activar los botones Whatsapp
	 document.querySelectorAll('.btn-whatsapp').forEach(el => {
		el.addEventListener('click', () => {
		const url = el.dataset.url;
		// Abre en ventana/pestaña nueva
		window.open(url, '_blank');
		});
	});



	// animacion de logos de marcas
	let columns = gsap.utils.toArray('#marcas .marca');
	let columnsLength = 4;
	if(columns){
		// for (let i = 0; i < columnsLength; i++) {
		columns.forEach((c, i) => {
			const column = c;
			const logos = column.querySelectorAll("figure");
			const randomOffset = gsap.utils.random(["-200%", "200%"]);
			const isEven = i % 2 === 0;

			const tl = gsap.timeline({
				repeat: -1,
				delay: -columnsLength + i * 0.2,
			});

			logos.forEach((logo) => {
				tl.to(logo, {
					keyframes: [
						{
							y: isEven ? randomOffset : 0,
							x: isEven ? 0 : randomOffset,
							duration: 0.3,
						},
						{
							autoAlpha: 1,
							x: 0,
							y: 0,
							duration: 0.5,
							ease: "power2.out",
						},
						{
							delay: 7,
							y: isEven ? 0 : randomOffset,
							x: isEven ? randomOffset : 0,
							duration: 0.3,
							ease: "power2.in",
						},
					],
				}).set(logo, {
					autoAlpha: 0,
				});
			});
		});
	};






	const gastaMenosResplandor = document.querySelector('#gastaMenos .capsula .boxG .resplandor');
	if(gastaMenosResplandor){
		let gmtTw = gsap.to(gastaMenosResplandor, {
			scale:0.8,
			duration:2.5,
			ease: 'power2.out',
			repeat:-1,
			runBackwards:true,
			yoyo:true
		});
		// function startAnimation() {
		// 	const tl = gsap.timeline({ onComplete: startAnimation });
		  
		// 	tl.to('#gastaMenos .capsula .boxG .resplandor', {
		// 	  duration: 2.5,
		// 	  scale: 0.8,
		// 	  ease: 'power2.in'
		// 	})
		// 	.to('#gastaMenos .capsula .boxG .resplandor', {
		// 	  duration: 2.5,
		// 	  scale: 1,
		// 	  ease: 'power2.out'
		// 	})
		// 	.to({}, { duration: 6 });
		// }
		// startAnimation();
	};
	






	// Efecto botones duda gradiente
	const btnsGradient = gsap.utils.toArray('#dudas .dudasBTN');
	const btnGradientTLs = {};
	
	btnsGradient.forEach((btn, i) => {
		let tl = btnGradientTLs[`btn${i}`];
		tl = gsap.timeline({ paused: true });
		
		
		tl.to(btn, {
			duration: 0.5,
			backgroundImage: 'linear-gradient(37deg, rgba(93,41,255,1) 34%, rgba(0,231,255,1) 90%)',
			ease: 'power2.out'
		});
	
		ScrollTrigger.observe({
			target: btn, 
			type: "pointer",
			onHover: () => tl.play(),
			onHoverEnd: () => tl.reverse()
		});
	});







	//Animacion de gito de tarjeta
	let cards = gsap.utils.toArray('.cardAniG .cardCapsul');
	cards.forEach(c => {
		// let animateCard = gsap.timeline({paused:true});
		// animateCard.to(".cardAniG .cardAni", {
		// 	rotationY:"180deg",
		// 	duration:1,
		// 	ease: "back.out"
		// });

		// ScrollTrigger.observe({
		// 	target: c,
		// 	type: "touch, pointer",
		// 	onClick:() => {
		// 		if (animateCard.reversed()) {
		// 			animateCard.play();
		// 		} else {
		// 			animateCard.reverse();
		// 		}
		// 	  },
		// 	onHover: () => animateCard.play(),
		// 	onHoverEnd: () => animateCard.reverse(),
		// 	// onPress: () => animateCard.play(),
		// 	// onRelease: () => animateCard.reverse()
		// });


		const cardAni = c.querySelector(".cardAni");
		gsap.to(cardAni, {
			scrollTrigger:{
				trigger:cardAni,
				start: "center 75%",
				end: "bottom bottom",
				toggleActions:"restart none reverse none",
				// markers:true
			},
			rotationY:"180deg",
			duration:1,
			ease: "back.out"
		});
	});






	// animacion basica de entrada fade
	let basicAniFade = gsap.utils.toArray('.idaAniFade');
	basicAniFade.forEach((f) => {
		const direccion = f.dataset.direccion && f.dataset.direccion !== "" ? f.dataset.direccion : "izquierda";
		const duracion = f.dataset.duracion && f.dataset.duracion !== "" ? f.dataset.duracion : 0.65;
		const distancia = f.dataset.distancia && f.dataset.distancia !== "" ? f.dataset.distancia : 68;
		const retrasoGrupo = f.dataset.retrasoGrupo && f.dataset.retrasoGrupo !== "" ? f.dataset.retrasoGrupo : 0.15;
		const retraso = f.dataset.retraso && f.dataset.retraso !== "" ? f.dataset.retraso : 0;

		let propiedad, polaridad, efecto = "to", opacidad = 0;
		switch (direccion) {
			case "derecha":
			case "izquierda":
				propiedad = "x";
				polaridad = direccion == "derecha" ? 1 : -1;
			break;

			case "arriba":
			case "abajo":
				propiedad = "y";
				polaridad = direccion == "arriba" ? -1 : 1;
			break;
		}
		let valor = distancia * polaridad;

		let objeto = f;
		if(f.classList.contains("idaAniFadeGrupo")){
			objeto = f.querySelectorAll("." + f.dataset.grupo);
		};

		// if(f.dataset.sentido && f.dataset.sentido == "invertir"){
		// 	efecto = "to";
		// 	opacidad = 1;
		// 	valor = 0;
		// }
		
		gsap.set(objeto, {
			[propiedad]: valor,
			autoAlpha: 0
		});
		// if(!f.dataset.sentido && f.dataset.sentido !== "invertir"){
		// 	gsap.set(objeto, {
		// 		[propiedad]: valor,
		// 		autoAlpha: 0
		// 	});
		// }
		gsap[efecto](objeto, {
			scrollTrigger:{
				trigger:objeto,
				start: "10% 68%",
				end: "center bottom",
				toggleActions:"restart none reverse none",
				invalidateOnRefresh: true,
				fastScrollEnd: true,
			},
			duration:duracion,
			ease: "power3.ease.inOut",
			[propiedad]: 0,
			autoAlpha: 1,
			delay:retraso,
			stagger:retrasoGrupo
		});

	});









	if(document.querySelector("#conviene .fondo")){
		gsap.to('#conviene .fondo figure', {
			yPercent: -50, 
			ease: 'none',
			scrollTrigger: {
				trigger: '#conviene .fondo', 
				start: 'top bottom', 
				end: 'bottom top', 
				scrub: 2, 
				anticipatePin:1,
				invalidateOnRefresh: true,
				fastScrollEnd: true
			}
		});
	};
	





	let lineasAnimadas = gsap.utils.toArray('.linea');
	lineasAnimadas.forEach(l => {
		gsap.from(l, {
			height:0,
			ease:"power.ease.inOut",
			scrollTrigger: {
				trigger: l,
				start: 'center 70%',
				end: 'center 70%',
				toggleActions:"restart none reverse none",
				fastScrollEnd: true
			}
		});
	});
	

}










//Colocacion de correo con cierto nivel de seguridad
function openMailer(event) {
	event.preventDefault();

	var url = encodeURIComponent(destinatario = atob("dmVudGFzQHNjYWRzZXIuY29tLm14"));
	window.location.href = "mailto:" + url;
}






let dbDudas = [];
dbDudas.push({pregunta:"¿Necesito tener redes sociales para me ayuden a aumentar mis ventas?", respuesta:"Sí, ya que forman parte de nuestro sistema comprobado para que vendas más."});
dbDudas.push({pregunta:"Qué redes sociales “ocupo”?", respuesta:"Por lo menos Facebook. Dependiendo del giro de tu negocio, también puedes necesitar Instagram. Tenemos comprobado que la combinación de ambas es una receta segura para lograr ventas."});
dbDudas.push({pregunta:"¿Uds. pueden ayudarme a crear mis redes sociales en caso de no tenerlas?", respuesta:"Por supuesto. Te llevaremos paso a paso en el proceso y te daremos algunos consejos para que de aquí en adelante puedas crear todas las que desees."});
dbDudas.push({pregunta:"¿Las quesadillas deben llevar queso?", respuesta:"Nuestros abogados recomiendan no entrar en esas polémicas, por lo que nuestra respuesta es “sigue tu corazón”."});
dbDudas.push({pregunta:"Tengo redes, pero no tengo página web. ¿Es  necesaria?", respuesta:"No. Podemos incrementar tus ventas sólo con tus redes sociales. Pero considera que contar con un sitio web le da mucha más credibilidad a cualquier negocio."});
dbDudas.push({pregunta:"Me es difícil crear los textos y contenido para mi página de internet. ¿Uds. me ayudan con eso?", respuesta:"Claro!! Te ayudamos con imágenes, íconos y los textos más seductores para tu público."});
dbDudas.push({pregunta:"¿El único afortunado de contar con sus servicios es Jalisco?", respuesta:"Gracias a la tecnología podemos brindar servicios a cualquier parte de la República. Si gustas que vayamos a tomar algo, nuestro equipo se encuentra en CDMX y Guadalajara ;D"});
dbDudas.push({pregunta:"¿Vienen, voy, nos vemos debajo del reloj, o cómo está la cosa?", respuesta:"Nosotros preferimos visitarte para conocer tu negocio y verlo en acción. Mientras más nos empapemos de lo que haces, tendremos más herramientas para desarrollar una mejor estrategia. "});






//:::: DB sliders ::::
const slidesData = [
	{img: './sliders/slide2.webp', title: '',  text: '<div class="textoPSlide"><span class="blanco">¿NO SABES<br>POR DÓNDE<br>COMENZAR?</span><br><span class="colorP">Comienza</span><br><span class="blanco"><span class="menos">CON</span><br>NOSOTROS</span></div>', "id":"", "class":"gasolineraText"},
	{img: './sliders/slide1.webp', title: '', text: '<div class="textoPSlide">Estamos contigo desde el inicio <br />y durante todo el proceso</div>', "id":"", "class":"slideSCA", delay:10000},
	{img: './sliders/slide3.webp', title: '',  text: '<div class="textoPSlide"><span class="azul">Cumplir es</span><br><span class="blanco">muy fácil</span><br><span class="azul">con el equipo</span><br><span class="blanco">correcto</span><div class="globo globoAzul btn-whatsapp" data-url="https://wa.me/+5215548400059"">Solicita una Auditoria de Cumplimiento Legal <span class="bold">SIN COSTO</span></div></div>', "id":"", "class":"manoAguaSlide"}
];

const testiDataSlide = [
	{
		img:'',
		title:'',
		text:'<div class="textoPSlide">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>',
		foto:"./assets/img/testimonios/foto_testimonio_1.webp",
		nombre:"Nombre de la persona",
		puesto:"Empresa o puesto",
		"id":"",
		"class":"slideSCA",
		delay:8000
	},
	{
		img:'',
		title:'',
		text:'<div class="textoPSlide">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>',
		foto:"./assets/img/testimonios/foto_testimonio_1.webp",
		nombre:"Nombre de la persona",
		puesto:"Empresa o puesto",
		"id":"",
		"class":"slideSCA",
		delay:8000
	}
];









async function precargaRun(){
	return new Promise((r, e) => {
		setTimeout(() => {
			const precarga = new Precarga();
			precarga.userFunc = iniciar;
			precarga.run();
			r('la precarga de imagenes esta en curso...');
		}, retrasoPrecargaImg);
	});
};
//Secciono de funciones:

async function toolsPimeraCarga(){
	//funcion para prevenir el funcionamiento normal del elemento y detener su accion.
	const prevenirAll = document.querySelectorAll('.prevenir');
	if(prevenirAll && prevenirAll.length > 0){
		prevenirAll.forEach(e =>{
			e.addEventListener('click', function(e){ e.preventDefault(); });
		});
	}

	//Funciones para habilitar el menu mobile
	function btnMobileActive(e) {
		this.classList.toggle('activo');
	}
	const btnMobile = document.getElementById('menuBoxMobile');
	if(btnMobile){
		btnMobile.addEventListener('click', btnMobileActive);

		////Animacion y control de submenus
		//const botonMenu = document.getElementById("servicioBtn");
		//let submenus = gsap.utils.toArray(".submenu1Box > li");
		//if(submenus){
		//	const sumN = submenus.length;
		//	let submenuAbierto = false;

		//	submenus.forEach(s => {
		//		const medidas = s.getBoundingClientRect();
		//		s.medidas = medidas;
		//		s.style.display = 'none';
		//	});

		//	const timeline = gsap.timeline({ paused: true });
		//	botonMenu.addEventListener("click", () => {
		//		if (submenuAbierto) {
		//			timeline.reverse();
		//		} else {
		//			submenus.forEach((elemento) => {
		//				gsap.set(elemento, { rotation: 0 }); // Restablece la rotación antes de la animación
		//			});
					
		//			timeline.clear(); // Limpia la línea de tiempo existente
					
		//			timeline.to(submenus, {
		//				y: (index, s) => ((sumN - 1 - index) * (s.medidas.height + 8) + 24),
		//				duration:0.45,
		//				rotation: () => gsap.utils.random(-4, 4),
		//				autoAlpha: 1,
		//				display:"block",
		//				ease: "power4.ease.inOut",
		//				stagger:0.20
		//			});
					
		//			timeline.play();
		//		}
		//		submenuAbierto = !submenuAbierto;
		//	});
		//}
	}

	// Animaicion para los enlaces scrollin to del sitio
	const menuLinksScrollingTo = gsap.utils.toArray(".scrollingTo");
	if(menuLinksScrollingTo){
		menuLinksScrollingTo.forEach(link => {
			link.addEventListener('click', e => {
				e.preventDefault();
				
				let target;
				if (link.tagName === 'BUTTON') {
					target = document.querySelector(link.dataset.href);
				} else if (link.tagName === 'A') {
					target = document.querySelector(link.getAttribute('href'));
				}				
	
				if(target) {
					gsap.to(window, {
						duration: 2,
						scrollTo: { y: target, offsetY: 100 },
						ease: 'power3.inOut'
					});
				}
			});
		});
	}


	function circuloIndicadorAni(e){
		const indicador = document.querySelector("#preguntasBoxG .preguntas .indicador");
		const padre = e.trigger.parentElement;
		const state = Flip.getState([indicador, e.trigger]);

		if(padre.children.length < 2){
			padre.appendChild(indicador);
			Flip.from(state, {
				duration: 0.6,
				// fade: true,
				// absolute: true,
				ease: "power1.inOut"
			});
		}
	};

	const preguntasBoxG = document.querySelector('#preguntasBoxG .preguntas');
	if(preguntasBoxG){
		dbDudas.forEach((p, i) => {
			const box = document.createElement('div');
			box.className = 'preguntaBox';
	
				const pregunta = document.createElement('div');
				pregunta.className = 'pregunta';
	
					const col1 = document.createElement('div');
					col1.className = 'col';
					col1.innerHTML = p.pregunta;
	
					const col2 = document.createElement('div');
					col2.className = 'col';
	
					const circulo = document.createElement('div');
					circulo.className = 'circulo';
	
				pregunta.appendChild(col1);
				pregunta.appendChild(col2);
				col1.appendChild(circulo);
				if(i == 0){
					const indicador = document.createElement('div');
					indicador.className = 'indicador';
					col1.appendChild(indicador);
				}
	
				const respuesta = document.createElement('div');
				respuesta.className = 'respuesta';
	
					const rcol1 = document.createElement('div');
					rcol1.className = 'col';
	
					const rcol2 = document.createElement('div');
					rcol2.className = 'col';
					rcol2.innerHTML = p.respuesta;
				respuesta.appendChild(rcol1);
				respuesta.appendChild(rcol2);
			box.appendChild(pregunta);
			box.appendChild(respuesta);
	
			preguntasBoxG.appendChild(box);
	
			ScrollTrigger.create({
				trigger: circulo,
				start:"bottom 70%",
				end: "bottom 70%",
				invalidateOnRefresh: true,
				fastScrollEnd: true,
				onEnter: circuloIndicadorAni,
				onEnterBack: circuloIndicadorAni
				// markers:true
			});
		});
	};
}


async function pantalla1Ani(){
	if(document.querySelector("#pantalla1 .intro")){
		gsap.to("#pantalla1 .intro", {
			duration:0.65,
			ease: "power3.ease.inOut",
			y: 0,
			autoAlpha: 1
		});
		gsap.to("#pantalla1 .graficas .grafica", {
			duration:0.65,
			ease: "power3.ease.inOut",
			x: 0,
			autoAlpha: 1,
			stagger:0.15
		});
		return "Se dispararon las animaciones de pantalla 1";
	} else{
		return "no se encontro #pantalla1 .intro";
	}
}


function updateAnimations() {
	// // Asegúrate de que las animaciones y ScrollTriggers existan antes de intentar eliminarlas
	// if (pantalla3TL) {
	// 	pantalla3TL.kill();
	// }
	// if (pantallasTL) {
	// 	pantallasTL.kill();
	// }
	// ScrollTrigger.getAll().forEach(st => {console.log('señal en el array'); st.kill()});

	// //Reiniciar animaciones
	// pantallasAniFunc();

	// Refrescar ScrollTriggers para asegurarse de que todo esté sincronizado
	ScrollTrigger.sort();
	ScrollTrigger.refresh();
}
async function pantallasAni(){
	if(!document.getElementById("pantallaBox")) return "No se encuentra una estructura html valida para las pantallas";
	
	let pantallasTL = gsap.timeline({});
	pantallasTL.to("#pantalla1", {
		y: () => `+=${document.getElementById("pantalla1").offsetHeight*-1}`,
		ease:"none",
		duration: 2
	});
	
	pantallasTL.to("#pantalla2", {
		// backgroundColor: "#100035",
		ease:"none",
		duration:4
	}, 1.5);

	let pantalla3TL = gsap.timeline({});
		pantalla3TL.to("#pantalla3", {
			x: () => `+=${document.getElementById("pantalla3").offsetWidth*-1}`,
			ease:"none",
			duration: 2
		});
		pantalla3TL.to("#pantalla3 .frase", {
			x: () => `+=${document.getElementById("pantalla3").offsetWidth}`,
			ease:"none",
			duration: 2
		}, "<");

	pantallasTL.add(pantalla3TL, "-=3");

	pantallasTL.to({}, {
		duration: 1
	});


	let pantallaBox = document.getElementById("pantallaBox");
	ScrollTrigger.create({
		animation: pantallasTL,
		trigger: pantallaBox,
		pin:true,
		anticipatePin:1,
		scrub:2,
		start:"top top",
		end: () => document.getElementById("pantallaBox").offsetHeight,
		invalidateOnRefresh: true,
		fastScrollEnd: true
		// markers:true
	});

	
	//window.addEventListener('resize', debounce(updateAnimations, 250));
	window.addEventListener('orientationchange', debounce(updateAnimations, 250));
	//window.addEventListener('resize', debounce(updateAnimations, 250));
	// window.addEventListener('resize', debounce(updatePantallaStyle, 250));

	return "se ejecuto codigo de animacion de pantallas";
}


async function pantallasShow(){
	return new Promise((r, e) => {
		const loadingBox = document.getElementById("loadingBox");
		if(loadingBox){
			gsap.to(loadingBox, {
				duration: 0.4,
				autoAlpha: 0,
				display: "none"
			});
			document.body.style.overflow = "auto";
			if(globalSeccion == "politicas"){
				gsap.to(".contenido", {
					duration: 0.8,
					autoAlpha: 1
				});
			} else{
				const lista = new Array(document.querySelector("nav"));
				gsap.to(lista, {
					duration: 0.8,
					autoAlpha: 1,
					onComplete: () => { r("Pantallas animadas"); }
				});
			}
			//r('Las pantallas estan activadas');
		} else{
			e('no se encontro el elemento #loadingBox');
		}
	})
};











/*
Funcion para hacer la carga de los recursos primordiales en la primera etapa de inicio del sitio, cargu aqui lo primero que deba de ver el usuario y las funciones mas primordiales y necesarias del sitio.
*/
async function cargaSecundaria(){
	try {
		await precargaRun();
	} catch (error) {
		console.error('Error ejecutando cargaSecundaria:', error);
	}
	return 'cargaSecundaria terminada.';
}


/*
Funcion para hacer la carga de los recursos primordiales en la primera etapa de inicio del sitio, cargu aqui lo primero que deba de ver el usuario y las funciones mas primordiales y necesarias del sitio.
*/
async function cargaPrimaria(){
	try {
		//let [v1, v2] = await Promise.all([pantallasAni(), pantallasShow()]);
		//await Promise.all([pantalla1Ani(), toolsPimeraCarga()]);
		//await pantallasShow();
		sliderDefaultDelay = 8000;   // 5 s default
		let [v1, v2] = await Promise.all([toolsPimeraCarga(), createHeroSlider('#heroSlider', slidesData), createHeroSlider('#testiSlider', testiDataSlide)]);
	} catch (error) {
		console.error('Error ejecutando cargaPrimaria:', error);
	}

	return 'cargaPrimaria terminada.';
}

/*
Funcion para ir iniciando o ejecutando todas las tareas del sitio mas globales brindando una capa de control centralizado.
*/
async function iniciador(){
	try {
		await cargaPrimaria();
	} catch (error) {
		console.error('Error ejecutando iniciador:', error);
	}

	try {
		await cargaSecundaria();
	} catch (error) {
		console.error('Error ejecutando iniciador:', error);
	}
}


/*
Funcion donde se controla el sitio serb general con  otros eventos de carga o de moitoreo antes de dar inicio a la actiacion de funciones generales del sito.
*/
function controlador(){
	// Registrar plugins de GSAP
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);
	iniciador();
};
const retrasoPrecargaImg = 100;









export {};