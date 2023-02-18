console.log("Test af Konsol");

const tempURL = "/temp.json";

async function getData() {
    const resultat = await fetch(tempURL);
    const liste = await resultat.json();

    vis(liste);
}

function vis(liste) {
    console.log("Vis Liste");
    console.log(liste)

    const beholder = document.querySelector(".album_liste");
    const skabelon = document.querySelector("#skabelon").content;

    liste.forEach(album => {
        const klon = skabelon.cloneNode(true);
        console.log(klon);
        
        klon.querySelector("a").href = "albumside.html?id=" + album._id;
        klon.querySelector(".album_img").src = "tempimgs/" + album.billede.split(".")[0] + ".jpg";
        klon.querySelector("h3").textContent = album.album;
        klon.querySelector(".album_artist").textContent = album.artist;
        klon.querySelector(".album_genre").textContent = album.genre;
        klon.querySelector(".album_date").textContent = album.dato
        

        beholder.appendChild(klon);
    });
}

window.addEventListener("load", go);

function go() {
    console.log("go");
    getData();
}