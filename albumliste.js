console.log("Test af Konsol");

const tempURL = "/temp.json";

let artikler





async function getData() {
    const resultat = await fetch(tempURL);
    const liste = await resultat.json();

    vis(liste);
    addGenreButtons(liste);
    filterGenre(liste);
    
}

function vis(liste) {
    console.log("Vis Liste");
    console.log(liste)

    const beholder = document.querySelector(".album_liste");
    const skabelon = document.querySelector("#skabelon").content;

    liste.forEach(album => {
        const klon = skabelon.cloneNode(true);
        
        klon.querySelector("a").href = "albumside.html?id=" + album._id;
        klon.querySelector(".album_img").src = "tempimgs/" + album.billede.split(".")[0] + ".jpg";
        klon.querySelector("h3").textContent = album.album;
        klon.querySelector(".album_artist").textContent = album.artist;
        klon.querySelector(".album_genre").textContent = album.genre;
        klon.querySelector(".album_date").textContent = album.dato
        

        beholder.appendChild(klon);

        artikler = document.querySelectorAll("article");
        console.log(artikler);
    });
}

window.addEventListener("load", go);

function go() {
    console.log("go");
    getData();

}







function filterGenre(liste) {
    console.log("Filter Genre");

    document.querySelectorAll("button").forEach(knap => {
        knap.addEventListener("click", () => {
            let genre = knap.textContent;

            const beholder = document.querySelector(".album_liste");
            const skabelon = document.querySelector("#skabelon").content;

            artikler = document.querySelectorAll("article");
            artikler.forEach(artikel => artikel.remove());

            liste.forEach(album => {
                if (album.genre == genre) {
                    
                    
                    const klon = skabelon.cloneNode(true);

                    klon.querySelector("a").href = "albumside.html?id=" + album._id;
                    klon.querySelector(".album_img").src = "tempimgs/" + album.billede.split(".")[0] + ".jpg";
                    klon.querySelector("h3").textContent = album.album;
                    klon.querySelector(".album_artist").textContent = album.artist;
                    klon.querySelector(".album_genre").textContent = album.genre;
                    klon.querySelector(".album_date").textContent = album.dato
        

                    beholder.appendChild(klon);
                }

            });
        })
    })
}

function addGenreButtons(liste) {  
    //create array to hold genres 
    let genres = [];  
    //loop through data 
    liste.forEach(album => {  
        //if genre is not in genres array, add it 
        if (!genres.includes(album.genre)) { 
            genres.push(album.genre); } })  
            //loop through genres 
    genres.forEach(genre => {  
                //clone template and add to .genre-buttons 
        const template = document.querySelector(".genre_button").content; 
        const clone = template.cloneNode(true); 
        clone.querySelector("button").textContent = genre; 
        document.querySelector(".filter_genre").appendChild(clone); })

}

    
