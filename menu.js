// menu.js

const iconaMenuLaterale = document.getElementById("iconaMenuLaterale");
const menuLaterale = document.getElementById("menuLaterale");
const main = document.getElementById("main"); // serve per aggiungere/rimuovere la classe "blur"
const body = document.getElementById("body");
const footer = document.getElementById("footer")

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
