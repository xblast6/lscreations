document.addEventListener("DOMContentLoaded", () => {
  // Mappa delle posizioni: le chiavi devono essere identiche ai valori salvati nel DB
  const positionContainers = {
    "sinistraPiccolaSopra": document.getElementById("sinistraPiccolaSopra"),
    "sinistraMediaCentro": document.getElementById("sinistraMediaCentro"),
    "sinistraPiccolaSotto": document.getElementById("sinistraPiccolaSotto"),
    "centroGrande": document.getElementById("centroGrande"),
    "destraMediaSopra": document.getElementById("destraMediaSopra"),
    "destraMediaSotto": document.getElementById("destraMediaSotto")
  };

  const API_BASE = "https://backend-ls-creation.onrender.com";
  const URL_HOME_IMAGES = `${API_BASE}/homeimages`

  // Recupera le immagini della home dal server (assicurati di popolare il campo categoria nel back-end)
  fetch(URL_HOME_IMAGES)
    .then(res => res.json())
    .then(images => {
      images.forEach(img => {
        if (img.position && positionContainers[img.position]) {
          // Crea un container per l'immagine
          const container = document.createElement("div");
          container.innerHTML = `
            <img src="${img.imageUrl}" alt="${img.name}" />
            <div class="bordo-hover">
                <p>${img.name}</p>
            </div>
          `;
          // Se la proprietà "categoria" è presente e popolata (es. ha anche lo slug),
          // aggiunge il click per andare alla categoria
          if (img.categoria && img.categoria.slug) {
            container.style.cursor = "pointer";
            container.addEventListener("click", () => {
              // renderProdotti è definita in script.js (il catalogo) e si aspetta un oggetto categoria
              renderProdotti(img.categoria);
            });
          }
          // Inserisce il container nel rispettivo div
          positionContainers[img.position].innerHTML = "";
          positionContainers[img.position].appendChild(container);
        }
      });
    })
    .catch(err => console.error("Errore nel recupero delle immagini della home:", err));
});
