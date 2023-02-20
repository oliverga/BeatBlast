console.log("Test af Konsol");

const tempURL = "/temp.json";
const localData = JSON.parse(localStorage.getItem("albumData"));

let artikler


const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

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
    }
  }


function vis(data) {
    console.log("Vis localData");
    console.log(localData)

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
        console.log(artikler);
    });
}


function filterGenre(data) {
    console.log("Filter Genre");

    document.querySelectorAll("button").forEach(knap => {
        knap.addEventListener("click", () => {
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
        document.querySelector(".filter_genre").appendChild(clone); })

}

checkLocalStorage();

    
