// Extrae ID de YouTube de URL estándar o share
function extraerYouTubeID(url) {
	const re = /(?:youtube\.com\/.*v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
	const m = url.match(re);
	return m ? m[1] : null;
}

function initVideos() {
	document.querySelectorAll('.video-wrapper').forEach(w => {
		const type = w.dataset.videoType;
		const src  = w.dataset.videoSrc;
		if (type === 'local') {
			const vid = document.createElement('video');
			vid.src      = src;
			vid.controls = true;
			vid.autoplay = true;
			vid.loop     = true;
			vid.muted    = true;
			vid.setAttribute('playsinline','');
			vid.setAttribute('preload','auto');
			//vid.setAttribute('poster','assets/img/placeholder.jpg');
			//vid.setAttribute('type','video/mp4');
			w.appendChild(vid);

		} else if (type === 'youtube') {
			const id = extraerYouTubeID(src);
			if (!id) return console.warn('YouTube ID no válido:', src);
			const iframe = document.createElement('iframe');
			iframe.src = `https://www.youtube.com/embed/${id}`;
			iframe.setAttribute('frameborder','0');
			iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
			iframe.allowFullscreen = true;
			w.appendChild(iframe);

		} else if (type === 'external') {
			const iframe = document.createElement('iframe');
			iframe.src = src;
			iframe.setAttribute('frameborder','0');
			iframe.allowFullscreen = true;
			w.appendChild(iframe);

		} else {
			console.warn('Tipo de vídeo desconocido:', type);
		}
	});
}



// <!-- Ejemplo de vídeo local -->
//  <div class="video-wrapper"
//       data-video-type="local"
//       data-video-src="videos/miVideo.mp4">
//  </div>

//  <!-- Ejemplo de enlace genérico (Vimeo, etc.) -->
//  <div class="video-wrapper"
//       data-video-type="external"
//       data-video-src="https://player.vimeo.com/video/123456789">
//  </div>

//  <!-- Ejemplo de YouTube -->
//  <div class="video-wrapper"
//       data-video-type="youtube"
//       data-video-src="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
//  </div>