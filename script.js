const btnCatalogoNav = document.getElementById("btnCatalogoNav");
const main = document.getElementById("main");
const spinner = document.getElementById("spinner");
const footer = document.getElementById("footer")

const API_BASE        = "https://backend-ls-creation.onrender.com";
const URL_CATEGORIE   = `${API_BASE}/categorie`;
const URL_PRODOTTI    = `${API_BASE}/prodotti`;
const URL_PROD_BY_CAT = slug => `${URL_PRODOTTI}?categoria=${slug}`;

// MENU LATERALE - MENU LATERALE
const iconaMenuLaterale = document.getElementById("iconaMenuLaterale");
const menuLaterale = document.getElementById("menuLaterale");
const body = document.getElementById("body")

iconaMenuLaterale.addEventListener("click", () => {
    menuLaterale.classList.toggle("menu-aperto");
    main.classList.toggle("blur");
    footer.classList.toggle("blur");
});

document.addEventListener("click", function(e) {
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


btnCatalogoNav.addEventListener("click", renderCatalogo);

function renderCatalogo() {
    // Svuota il contenuto principale
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
    // Aggiunge la sezione informativa del catalogo
    container.innerHTML = `
    <div class="contenitore-info-catalogo">
      <h2>Catalogo</h2>
      <h3>
        Esplora la nostra esclusiva selezione di prodotti artigianali;
pezzi unici, creati con passione e impegno.

Ogni pezzo è realizzato con materiali di alta qualità per garantire durabilità e bellezza.

Potrai trovare creazioni personalizzate adatte a qualsiasi occasione,
sia che tu stia cercando regali importanti o semplici pensierini,
pezzi unici per la tua casa o per i tuoi amici.

Lasciati ispirare dai tantissimi articoli realizzati negli anni.
      </h3>
    </div>
  `;

    const contenitoreCard = document.createElement("div");
    contenitoreCard.classList.add("contenitore-card");

    data.forEach(categoria => {
        const cardCategoria = document.createElement("div");
        cardCategoria.classList.add("card-catalogo");
        cardCategoria.innerHTML = `
      <img src="${categoria.immagine}" alt="${categoria.nome}" class="img-card-catalogo">
      <p class="testo-card-catalogo">${categoria.nome}</p>
    `;

        // Al click della card, carica la pagina dei prodotti relativi
        cardCategoria.addEventListener("click", () => {
            renderProdotti(categoria);
        });

        contenitoreCard.appendChild(cardCategoria);
    });

    container.appendChild(contenitoreCard);
}

function renderProdotti(categoria) {
    // Pulisce la pagina
    main.innerHTML = "";

    // Crea un tasto "Torna indietro" per tornare al catalogo
    const btnBack = document.createElement("div");
    btnBack.innerHTML = `
      <ion-icon name="arrow-back-outline"></ion-icon>
      <p>Torna indietro</p>
    `;
    btnBack.classList.add("btn-back");
    // Al click, richiama la funzione che renderizza il catalogo
    btnBack.addEventListener("click", renderCatalogo);
    main.appendChild(btnBack);

    // Crea il contenitore per i prodotti
    const sezioneProdotti = document.createElement("section");
    sezioneProdotti.classList.add("sezione-catalogo");
    main.appendChild(sezioneProdotti);

    // Crea un header con il nome e la descrizione della categoria
    const headerCategoria = document.createElement("div");
    headerCategoria.classList.add("contenitore-info-catalogo");
    headerCategoria.innerHTML = `
         <h2>${categoria.nome}</h2>
         <h3>${categoria.descrizione ? categoria.descrizione : ''}</h3>
    `;
    sezioneProdotti.appendChild(headerCategoria);

    spinner.classList.remove("hidden");

    fetch(URL_PRODOTTI)
        .then(res => res.json())
        .then(data => {
            const contenitoreProdotti = document.createElement("div");
            contenitoreProdotti.classList.add("contenitore-card");

            // Per ogni prodotto, crea una card, aggiungi l'event listener e appendi al contenitore
            data.forEach(prodotto => {
                const card = document.createElement("div");
                card.classList.add("card-catalogo");
                card.innerHTML = `
                    <img src="${prodotto.immagine}" alt="${prodotto.nome}" class="img-card-catalogo">
                    <p class="testo-card-catalogo">${prodotto.nome}</p>
                `;
                // Al click della card, visualizza le varianti del prodotto
                card.addEventListener("click", () => renderVarianti(prodotto, categoria));
                contenitoreProdotti.appendChild(card);
            });
            sezioneProdotti.appendChild(contenitoreProdotti);
        })
        .catch(err => console.error("Errore:", err))
        .finally(() => spinner.classList.add("hidden"));
}

function renderVarianti(prodotto, categoria) {
    // Pulisce la pagina
    main.innerHTML = "";

    // Crea un tasto "Torna ai prodotti"
    const btnBack = document.createElement("div");
    btnBack.innerHTML = `
      <ion-icon name="arrow-back-outline"></ion-icon>
      <p>Torna ai prodotti</p>
    `;
    btnBack.classList.add("btn-back");
    // Al click, torna alla visualizzazione dei prodotti per la categoria
    btnBack.addEventListener("click", () => renderProdotti(categoria));
    main.appendChild(btnBack);

    // Aggiunge un header con il nome e l'immagine del prodotto (opzionale)
    const productHeader = document.createElement("div");
    productHeader.classList.add("contenitore-info-catalogo");
    productHeader.innerHTML = `
      <h2>${categoria.nome}</h2>
        <h3>${categoria.descrizione ? categoria.descrizione : ''}</h3>
    `;
    main.appendChild(productHeader);

    // Crea un contenitore per le varianti
    const variantSection = document.createElement("section");
    variantSection.classList.add("sezione-catalogo");
    main.appendChild(variantSection);

    spinner.classList.remove("hidden");
    // Verifica se il prodotto ha varianti e le visualizza
    if (prodotto.varianti && prodotto.varianti.length > 0) {
        const variantContainer = document.createElement("div");
        variantContainer.classList.add("contenitore-card");
        prodotto.varianti.forEach(varianti => {
            const card = document.createElement("div");
            card.classList.add("card-catalogo");
            card.innerHTML = `
              <img src="${varianti.immagine}" alt="${varianti.nome}" class="img-card-catalogo">
              <p class="testo-card-catalogo">${varianti.nome}</p>
            `;
            variantContainer.appendChild(card);
        });
        variantSection.appendChild(variantContainer);
    } else {
        variantSection.innerHTML = `<p>Nessuna variante disponibile per questo prodotto.</p>`;
    }
    spinner.classList.add("hidden");
}

// Selettore per il campo di ricerca
const inpCerca = document.getElementById("inpCerca");

// Ascolta l'evento "Enter" nella ricerca
// Nuovo evento su input: la ricerca viene eseguita ogni volta che il campo cambia
inpCerca.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        renderSearchResults(query);
    } else {
        // Se l'input è vuoto, puoi decidere di ripristinare il catalogo oppure lasciare la pagina vuota
        renderCatalogo();
    }
});


// Funzione per visualizzare i risultati della ricerca
function renderSearchResults(query) {
    // Pulisce la pagina principale
    main.innerHTML = "";

    // Crea un tasto "Torna indietro" che riporta al catalogo
    const btnBack = document.createElement("div");
    btnBack.innerHTML = `
        <ion-icon name="arrow-back-outline"></ion-icon>
        <p>Torna indietro</p>
    `;
    btnBack.classList.add("btn-back");
    btnBack.addEventListener("click", renderCatalogo);
    main.appendChild(btnBack);

    // Crea una sezione dedicata alla ricerca
    const searchSection = document.createElement("section");
    searchSection.classList.add("sezione-catalogo");
    main.appendChild(searchSection);

    // Header dei risultati
    const headerSearch = document.createElement("div");
    headerSearch.classList.add("contenitore-info-catalogo");
    headerSearch.innerHTML = `<h2>Risultati della ricerca per "${query}"</h2>`;
    searchSection.appendChild(headerSearch);

    spinner.classList.remove("hidden");

    fetch(URL_PRODOTTI)
        .then(res => res.json())
        .then(products => {
            const lowerQuery = query.toLowerCase();
            let results = [];
            
            // Per ogni prodotto, controlla se matcha il prodotto e/o una delle sue varianti
            products.forEach(product => {
                // Verifica il match sul prodotto
                let productMatch = false;
                if (product.nome.toLowerCase().includes(lowerQuery)) {
                    productMatch = true;
                } else if (product.tags && Array.isArray(product.tags) &&
                           product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                    productMatch = true;
                }
                if (productMatch) {
                    results.push({ type: 'product', product: product });
                }
                
                // Verifica il match sulle varianti
                if (product.varianti && Array.isArray(product.varianti)) {
                    product.varianti.forEach(variant => {
                        let variantMatch = false;
                        if (variant.nome.toLowerCase().includes(lowerQuery)) {
                            variantMatch = true;
                        } else if (variant.tags && Array.isArray(variant.tags) &&
                                   variant.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                            variantMatch = true;
                        }
                        if (variantMatch) {
                            results.push({ type: 'variant', product: product, variant: variant });
                        }
                    });
                }
            });

            const resultContainer = document.createElement("div");
            resultContainer.classList.add("contenitore-card");

            if (results.length > 0) {
                results.forEach(item => {
                    const card = document.createElement("div");
                    card.classList.add("card-catalogo");
                    
                    if (item.type === 'product') {
                        // Renderizza la card del prodotto
                        card.innerHTML = `
                            <img src="${item.product.immagine}" alt="${item.product.nome}" class="img-card-catalogo">
                            <p class="testo-card-catalogo">${item.product.nome}</p>
                        `;
                        // Al click si mostrano le varianti del prodotto
                        card.addEventListener("click", () => renderVarianti(item.product, { nome: "Risultati ricerca", descrizione: "" }));
                    } else if (item.type === 'variant') {
                        // Renderizza la card della variante
                        card.innerHTML = `
                            <img src="${item.variant.immagine}" alt="${item.variant.nome}" class="img-card-catalogo">
                            <p class="testo-card-catalogo">${item.variant.nome}</p>
                        `;
                        // Al click puoi, ad esempio, mostrare il prodotto con evidenziata la variante cercata
                        card.addEventListener("click", () => renderVarianti(item.product, { nome: "Risultati ricerca", descrizione: "" }));
                    }
                    resultContainer.appendChild(card);
                });
            } else {
                resultContainer.innerHTML = `<p>Nessun risultato trovato per "${query}".</p>`;
            }
            searchSection.appendChild(resultContainer);
        })
        .catch(err => console.error("Errore nella ricerca:", err))
        .finally(() => spinner.classList.add("hidden"));
}



  