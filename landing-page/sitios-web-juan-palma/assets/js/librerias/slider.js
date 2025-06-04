/*  l/slider.js  */
define([], function () {
	"use strict";

  /* =======================================================================
     CONSTRUCTOR
  ======================================================================= */
function Slider($el, data, defaultDelay) {
	this.$el         = $el;
	this.data        = data;
	this.current     = 0;            // índice real
	this.track       = null;
	this.dots        = $el.querySelector(".dots");
	this.w           = 0;
	this.isBusy      = false;

	this.defaultDelay = defaultDelay || window.sliderDefaultDelay || 5000;
	this.timer        = null;        // auto-play

	this.build();
	this.bind();
	this.resizeFix();
	this.startAuto();                // ⬅️ auto-play arranca aquí
}

  /* =======================================================================
     DOM dinámico
  ======================================================================= */
	Slider.prototype.build = function () {
		this.track = document.createElement("div");
		this.track.className = "slidesWrapper";
		this.$el.insertBefore(this.track, this.$el.firstChild);

		console.log(this.data.length);

		// clones extremos
		this.track.appendChild(this.slide(this.data.at(-1), true));
		this.data.forEach(s => this.track.appendChild(this.slide(s)));
		this.track.appendChild(this.slide(this.data[0], true));

		// bullets
		this.data.forEach((_, i) => {
			const li = document.createElement("li");
			li.dataset.index = i;
			this.dots.appendChild(li);
		});

		this.w = this.$el.clientWidth;
		this.goto(0, false);             // posición inicial sin animar
	};

  /* ----------  Crea un <article> slide  ---------- */
	Slider.prototype.slide = function (info, clone) {
		const art = document.createElement("article");
			art.className = "slide" + (info.class ? " " + info.class : "") + (clone ? " slide--clone" : "");
			if(!clone){
				art.id = (info.id ? info.id : "");
		}

		const fig = document.createElement("figure");
		fig.className = "slide__content";

		const pic = document.createElement("picture");
		pic.innerHTML = `
			<img src="${info.img}"
				alt="${info.alt || info.title || ""}"
				loading="lazy">
		`;

		const cap = document.createElement("figcaption");
		if (info.title) cap.insertAdjacentHTML("beforeend", `<h2>${info.title}</h2>`);
		if (info.text ) cap.insertAdjacentHTML("beforeend", `<p>${info.text}</p>`);
		if (info.link)
			cap.insertAdjacentHTML(
			"beforeend",
			`<a class="btn" href="${info.link}">${info.btnLabel || "Ir"}</a>`
			);
		if (info.foto) {
			cap.insertAdjacentHTML(
			"beforeend",
			`<div class="testUser">
				<img src="${info.foto}" alt="${info.alt || info.title || ""}" loading="lazy">
				<p>
					<span class="nombre">${info.nombre}</span>
					<span class="puesto">${info.puesto}</span>
				</p>
			</div>`
			);
		}

		if(info.img && info.img !== ""){
			fig.appendChild(pic);
		}
		fig.appendChild(cap);
		art.appendChild(fig);
		return art;
	};

  /* =======================================================================
     Eventos
  ======================================================================= */
	Slider.prototype.bind = function () {
		if(this.data.length >= 2){
				this.$el.querySelector(".nav--next")
						.addEventListener("click", this.next.bind(this));
				this.$el.querySelector(".nav--prev")
						.addEventListener("click", this.prev.bind(this));

				this.dots.addEventListener("click", e => {
					if (e.target.tagName === "LI") this.jump(+e.target.dataset.index);
				});

				this.track.addEventListener("transitionend", this.fixLoop.bind(this));
		} else {
			this.$el.querySelector(".nav--next").style.display = "none";
			this.$el.querySelector(".nav--prev").style.display = "none";
			this.dots.style.display = "none";
		}
	};

  /* =======================================================================
     Navegación
  ======================================================================= */
	Slider.prototype.next = function () {
		if (this.isBusy) return;
		this.goto(this.current + 1);
	};

	Slider.prototype.prev = function () {
		if (this.isBusy) return;
		this.goto(this.current - 1);
	};

  /* ----------  Salto con un solo fotograma visible  ---------- */
	Slider.prototype.jump = function (targetIndex) {
		if (targetIndex === this.current) return;

		const dir      = targetIndex > this.current ? 1 : -1;
		const neighbor = targetIndex - dir;      // slide contiguo

		this.goto(neighbor, false);              // sin transición
		requestAnimationFrame(() => {
		dir === 1 ? this.next() : this.prev(); // anima un paso
		});
	};

  /* =======================================================================
     Desplazamiento centralizado
  ======================================================================= */
	Slider.prototype.goto = function (idx, animate = true) {
		// Reinicia auto-play solo si estamos en un índice REAL
		if (animate && idx >= 0 && idx < this.data.length) this.resetAuto();

		this.isBusy  = animate;
		this.current = idx;

		this.track.style.transition = animate ? "transform .6s ease" : "none";
		const offset = -(idx + 1) * this.w;      // +1 = compensa clon inicial
		this.track.style.transform = "translateX(" + offset + "px)";
		this.updateDots();
	};

  /* ----------  Ajuste de clones al terminar la transición ---------- */
	Slider.prototype.fixLoop = function () {
		if (this.current === -1) {
		this.track.style.transition = "none";
		this.current = this.data.length - 1;
		} else if (this.current === this.data.length) {
		this.track.style.transition = "none";
		this.current = 0;
		}

		// reposición instantánea
		const offset = -(this.current + 1) * this.w;
		this.track.style.transform = "translateX(" + offset + "px)";
		this.updateDots();

		this.isBusy = false;
		this.resetAuto();                        // ⬅️ usa delay del slide REAL
	};

  /* =======================================================================
     Auto-play
  ======================================================================= */
	Slider.prototype.startAuto = function () {
		if(this.data.length > 1){
			const delay = this.data[this.current].delay ?? this.defaultDelay;
			this.timer  = setTimeout(() => this.next(), delay);
		}
	};

	Slider.prototype.resetAuto = function () {
		clearTimeout(this.timer);
		this.startAuto();
	};

  /* =======================================================================
     Bullets activos
  ======================================================================= */
	Slider.prototype.updateDots = function () {
		Array.prototype.forEach.call(this.dots.children, (dot, i) =>
		dot.classList.toggle(
			"active",
			i === ((this.current % this.data.length + this.data.length) % this.data.length)
		)
		);
	};

  /* =======================================================================
     Responsive
  ======================================================================= */
	Slider.prototype.resizeFix = function () {
		window.addEventListener("resize", () => {
		this.w = this.$el.clientWidth;
		this.goto(this.current, false);        // reajusta sin animar
		});
	};

  /* =======================================================================
     FUNCIÓN-PROMESA EXPORTADA
  ======================================================================= */
	function createHeroSlider(selector, data, options) {
		options = options || {};
		const defaultDelay = options.defaultDelay ||
							window.sliderDefaultDelay ||
							5000;

		return new Promise(resolve => {
		const $c = document.querySelector(selector);
		if (!$c) return resolve();

		// Precarga primera imagen (evita flash)
		const img = new Image();
		img.onload = img.onerror = () => {
			new Slider($c, data, defaultDelay);
			resolve();
		};
		img.src = data[0].img;
		});
	}

	/*  ▸ Disponible vía RequireJS y como global  */
	window.createHeroSlider = createHeroSlider;
	return createHeroSlider;
});
