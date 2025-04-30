/* ---------------------------
   COSTANTI: URL API
--------------------------- */
const API_BASE        = "https://backend-ls-creation.onrender.com";
const URL_CATEGORIE   = `${API_BASE}/categorie`;
const URL_PRODOTTI    = `${API_BASE}/prodotti`;
const URL_PROD_BY_CAT = slug => `${URL_PRODOTTI}?categoria=${slug}`;

/* ---------------------------
   RIFERIMENTI DOM
--------------------------- */
const btnCatalogoNav  = document.getElementById("btnCatalogoNav");
const main            = document.getElementById("main");
const spinner         = document.getElementById("spinner");
const footer          = document.getElementById("footer");
const iconaMenuLaterale = document.getElementById("iconaMenuLaterale");
const menuLaterale    = document.getElementById("menuLaterale");
const body            = document.getElementById("body");
const inpCerca        = document.getElementById("inpCerca");

/* ---------------------------
   MENU LATERALE
--------------------------- */
iconaMenuLaterale.addEventListener("click", () => {
  menuLaterale.classList.toggle("menu-aperto");
  main.classList.toggle("blur");
  footer.classList.toggle("blur");
});
document.addEventListener("click", e => {
  if (
    menuLaterale.classList.contains("menu-aperto") &&
    !menuLaterale.contains(e.target) &&
    !iconaMenuLaterale.contains(e.target)
  ) {
    menuLaterale.classList.remove("menu-aperto");
    main.classList.remove("blur");
    footer.classList.remove("blur");
  }
});

/* ---------------------------
   CATALOGO
--------------------------- */
btnCatalogoNav.addEventListener("click", renderCatalogo);

// Collega la voce del menu laterale alla funzione renderCatalogo
const voceCatalogoMenu = document.getElementById("catalogoMenu");
voceCatalogoMenu.addEventListener("click", () => {
  renderCatalogo();
  // Chiude il menu e rimuove il blur
  menuLaterale.classList.remove("menu-aperto");
  main.classList.remove("blur");
  footer.classList.remove("blur");
});


function renderCatalogo() {
  main.innerHTML = "";
  const sezioneCatalogo = document.createElement("section");
  sezioneCatalogo.classList.add("sezione-catalogo");
  main.appendChild(sezioneCatalogo);

  spinner.classList.remove("hidden");

  fetch(URL_CATEGORIE)
    .then(res => res.json())
    .then(data => renderCategorie(data, sezioneCatalogo))
    .catch(err => console.error("Errore:", err))
    .finally(() => spinner.classList.add("hidden"));
}

function renderCategorie(data, container) {
  container.innerHTML = `
    <div class="contenitore-info-catalogo">
      <h2>Catalogo</h2>
      <h3>
        Esplora la nostra esclusiva selezione di prodotti artigianali; pezzi unici,
        creati con passione e impegno. Ogni pezzo è realizzato con materiali di
        alta qualità per garantire durabilità e bellezza. Potrai trovare creazioni
        personalizzate adatte a qualsiasi occasione, sia che tu stia cercando regali
        importanti o semplici pensierini. Lasciati ispirare!
      </h3>
    </div>`;
  const contenitoreCard = document.createElement("div");
  contenitoreCard.classList.add("contenitore-card");

  data.forEach(categoria => {
    const cardCategoria = document.createElement("div");
    cardCategoria.classList.add("card-catalogo");
    cardCategoria.innerHTML = `
      <img src="${categoria.immagine}" alt="${categoria.nome}" class="img-card-catalogo">
      <p class="testo-card-catalogo">${categoria.nome}</p>`;
    cardCategoria.addEventListener("click", () => renderProdotti(categoria));
    contenitoreCard.appendChild(cardCategoria);
  });
  container.appendChild(contenitoreCard);
}

/* ---------------------------
   PRODOTTI DI UNA CATEGORIA
--------------------------- */
function renderProdotti(categoria) {
  main.innerHTML = "";

  const btnBack = document.createElement("div");
  btnBack.classList.add("btn-back");
  btnBack.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon><p>Torna indietro</p>`;
  btnBack.addEventListener("click", renderCatalogo);
  main.appendChild(btnBack);

  const sezioneProdotti = document.createElement("section");
  sezioneProdotti.classList.add("sezione-catalogo");
  main.appendChild(sezioneProdotti);

  const headerCategoria = document.createElement("div");
  headerCategoria.classList.add("contenitore-info-catalogo");
  headerCategoria.innerHTML = `
    <h2>${categoria.nome}</h2>
    <h3>${categoria.descrizione || ""}</h3>`;
  sezioneProdotti.appendChild(headerCategoria);

  spinner.classList.remove("hidden");

  fetch(URL_PROD_BY_CAT(categoria.slug))
    .then(res => res.json())
    .then(data => {
      const contenitoreProdotti = document.createElement("div");
      contenitoreProdotti.classList.add("contenitore-card");
      data.forEach(prodotto => {
        const card = document.createElement("div");
        card.classList.add("card-catalogo");
        card.innerHTML = `
          <img src="${prodotto.immagine}" alt="${prodotto.nome}" class="img-card-catalogo">
          <p class="testo-card-catalogo">${prodotto.nome}</p>`;
        card.addEventListener("click", () => renderVarianti(prodotto, categoria));
        contenitoreProdotti.appendChild(card);
      });
      sezioneProdotti.appendChild(contenitoreProdotti);
    })
    .catch(err => console.error("Errore:", err))
    .finally(() => spinner.classList.add("hidden"));
}

/* ---------------------------
   VARIANTI DI UN PRODOTTO
--------------------------- */
function renderVarianti(prodotto, categoria) {
  main.innerHTML = "";

  const btnBack = document.createElement("button");
  btnBack.classList.add("btn-back");
  btnBack.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon><p>Torna ai prodotti</p>`;
  btnBack.addEventListener("click", () => renderProdotti(categoria));
  main.appendChild(btnBack);

  const header = document.createElement("div");
  header.classList.add("contenitore-info-catalogo");
  header.innerHTML = `<h2>${categoria.nome}</h2><h3>${categoria.descrizione || ""}</h3>`;
  main.appendChild(header);

  const variantSection = document.createElement("section");
  variantSection.classList.add("sezione-catalogo");
  main.appendChild(variantSection);

  spinner.classList.remove("hidden");

  if (prodotto.varianti?.length) {
    const cont = document.createElement("div");
    cont.classList.add("contenitore-card");
    prodotto.varianti.forEach(v => {
      const card = document.createElement("div");
      card.classList.add("card-catalogo");
      card.innerHTML = `
        <img src="${v.immagine}" alt="${v.nome}" class="img-card-catalogo">
        <p class="testo-card-catalogo">${v.nome}</p>`;
      cont.appendChild(card);
    });
    variantSection.appendChild(cont);
  } else {
    variantSection.innerHTML = `<p>Nessuna variante disponibile per questo prodotto.</p>`;
  }
  spinner.classList.add("hidden");
}

/* ---------------------------
   RICERCA
--------------------------- */
inpCerca.addEventListener("input", e => {
  const q = e.target.value.trim();
  q ? renderSearchResults(q) : renderCatalogo();
});

function renderSearchResults(query) {
  main.innerHTML = "";

  const btnBack = document.createElement("div");
  btnBack.classList.add("btn-back");
  btnBack.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon><p>Torna indietro</p>`;
  btnBack.addEventListener("click", renderCatalogo);
  main.appendChild(btnBack);

  const section = document.createElement("section");
  section.classList.add("sezione-catalogo");
  main.appendChild(section);

  section.innerHTML = `
    <div class="contenitore-info-catalogo">
      <h2>Risultati della ricerca per "${query}"</h2>
    </div>`;

  spinner.classList.remove("hidden");

  fetch(URL_PRODOTTI)
    .then(r => r.json())
    .then(products => {
      const resCont = document.createElement("div");
      resCont.classList.add("contenitore-card");

      const qLower = query.toLowerCase();
      const results = [];

      products.forEach(p => {
        const prodMatch = p.nome.toLowerCase().includes(qLower) ||
                          (p.tags?.some(t => t.toLowerCase().includes(qLower)));
        if (prodMatch) results.push({ type: "product", product: p });

        p.varianti?.forEach(v => {
          const varMatch = v.nome.toLowerCase().includes(qLower) ||
                           (v.tags?.some(t => t.toLowerCase().includes(qLower)));
          if (varMatch) results.push({ type: "variant", product: p, variant: v });
        });
      });

      if (!results.length) {
        resCont.innerHTML = `<p>Nessun risultato trovato per "${query}".</p>`;
      } else {
        results.forEach(item => {
          const card = document.createElement("div");
          card.classList.add("card-catalogo");

          if (item.type === "product") {
            card.innerHTML = `
              <img src="${item.product.immagine}" alt="${item.product.nome}" class="img-card-catalogo">
              <p class="testo-card-catalogo">${item.product.nome}</p>`;
            card.onclick = () => renderVarianti(item.product, { nome: "Risultati ricerca", descrizione: "" });
          } else {
            card.innerHTML = `
              <img src="${item.variant.immagine}" alt="${item.variant.nome}" class="img-card-catalogo">
              <p class="testo-card-catalogo">${item.variant.nome}</p>`;
            card.onclick = () => renderVarianti(item.product, { nome: "Risultati ricerca", descrizione: "" });
          }
          resCont.appendChild(card);
        });
      }
      section.appendChild(resCont);
    })
    .catch(err => console.error("Errore nella ricerca:", err))
    .finally(() => spinner.classList.add("hidden"));
}

/* ---------------------------
   AVVIO
--------------------------- */
/* renderCatalogo(); */ // mostra il catalogo di default
