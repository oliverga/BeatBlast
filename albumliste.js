console.log("Test af Konsol");

// Definering af konstanter samt variabler til senere brug
const tempURL = "/temp.json";
const localData = JSON.parse(localStorage.getItem("albumData"));
const knapAlle = document.querySelector("#all_albums");

let cardNr = 0;
let artikler


// link samt apikey til Restdb database
const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

// Vi henter data fra Restdb som JSON, yderligere
async function fetchData() {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    // if data is different from localData then update localData
    if (!localData || JSON.stringify(localData) !== JSON.stringify(data)) {
      localStorage.setItem("albumData", JSON.stringify(data));
      console.log("Data updated in local storage");
    }
    return data;
  }
  
  
  
  async function checkLocalStorage() {
    // check if data is in local storage
    if (localData) {
      console.log("Data retrieved from local storage");
      // if so, add data to DOM
        vis(localData);
        addGenreButtons(localData);
        filterGenre(localData);
        topAlbum(localData);
    }
    else {
      // if not, fetch data from API
      const latestData = await fetchData();
      console.log("Data retrieved from API");
      // update local storage with new data
      localStorage.setItem("albumData", JSON.stringify(latestData));
      console.log("Data updated in local storage");
      // add data to DOM
        vis(latestData);
        addGenreButtons(latestData);
        filterGenre(latestData);
        topAlbum(latestData);
    }
  }


function vis(data) {
    console.log("Vis localData");

    const beholder = document.querySelector(".album_liste");
    const skabelon = document.querySelector("#skabelon").content;

    data.forEach(album => {
        const klon = skabelon.cloneNode(true);
        
        klon.querySelector("a").href = "albumside.html?id=" + album._id;
        klon.querySelector(".album_img").src = "tempimgs/" + album.billede;
        klon.querySelector("h3").textContent = album.album;
        klon.querySelector(".album_artist").textContent = album.artist;
        klon.querySelector(".album_genre").textContent = album.genre;
        let date = album.dato.split("T")[0];
        klon.querySelector(".album_date").textContent = date
        

        beholder.appendChild(klon);

        artikler = document.querySelectorAll("article");
    });
}


function filterGenre(data) {
    console.log("Filter Genre");

    document.querySelectorAll(".lyt").forEach(knap => {
        knap.addEventListener("click", () => {
            const knapper = document.querySelectorAll("button");
            knapper.forEach(knap =>{
                knap.classList.remove("knap_active");
            })
            knap.classList.add("knap_active");

            let genre = knap.textContent;

            const beholder = document.querySelector(".album_liste");
            const skabelon = document.querySelector("#skabelon").content;


            artikler = document.querySelectorAll("article");
            artikler.forEach(artikel => artikel.remove());

            data.forEach(album => {
                if (album.genre == genre) {
                    
                    
                    const klon = skabelon.cloneNode(true);

                    klon.querySelector("a").href = "albumside.html?id=" + album._id;
                    klon.querySelector(".album_img").src = "tempimgs/" + album.billede;
                    klon.querySelector("h3").textContent = album.album;
                    klon.querySelector(".album_artist").textContent = album.artist;
                    klon.querySelector(".album_genre").textContent = album.genre;
                    let date = album.dato.split("T")[0];
                    klon.querySelector(".album_date").textContent = date
        

                    beholder.appendChild(klon);
                    
                }

            });
        })
    })
}

function addGenreButtons(data) { 
     
    //create array to hold genres 
    let genres = [];  
    //loop through data 
    data.forEach(album => {  
        //if genre is not in genres array, add it 
        if (!genres.includes(album.genre)) { 
            genres.push(album.genre); } })  
            //loop through genres 
    genres.forEach(genre => {  
                //clone template and add to .genre-buttons 
        const template = document.querySelector(".genre_button").content; 
        const clone = template.cloneNode(true); 
        clone.querySelector("button").textContent = genre;
        clone.querySelector("button").classList.add("lyt");
        document.querySelector(".filter_genre").appendChild(clone); })

}


function klikAlle(data) {
    console.log("klik alle");

    location.reload();
}

function topAlbum(data) {
    console.log("Top Album");

    const beholder = document.querySelector(".anbefalinger_cards");
    console.log(beholder);
    const skabelon = document.querySelector("#skabelon2").content;

    data.forEach(album => {
        if (album.topAlbum == true) {
            console.log(album);
            
            const klon = skabelon.cloneNode(true);

            cardNr ++;

            klon.querySelector(".card_number").textContent = "#" + cardNr;
            klon.querySelector("a").href = "albumside.html?id=" + album._id;
            klon.querySelector(".anbefaling_img").src = "tempimgs/" + album.billede;
            klon.querySelector("h3").textContent = album.album;
            klon.querySelector(".card_artist").textContent = album.artist;


            beholder.appendChild(klon);

        }

    });
}

checkLocalStorage();
knapAlle.addEventListener("click", klikAlle);
setInterval(fetchData, 60 * 60 * 1000);
    