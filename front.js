const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

const localData = JSON.parse(localStorage.getItem("albumData"));

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
        displayAnimation();
        addGenreButtons(localData);
    }
    else {
        // if not, fetch data from API
        const latestData = await fetchData();
        console.log("Data retrieved from API");
        // update local storage with new data
        localStorage.setItem("albumData", JSON.stringify(latestData));
        console.log("Data updated in local storage");
        // add data to DOM
        displayAnimation();
        addGenreButtons(latestData);
    }
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
        clone.querySelector("a").href = "genre.html?genre=" + genre;
        document.querySelector(".filter_genre").appendChild(clone); })

}

function displayAnimation() {
    document.querySelector("main").animate(
      [
        {opacity: "0"},
        {opacity: "1"}
      ],
      {
        duration: 550,
        easing: "ease-in-out",
        fill: "forwards"
      }
    );
  }

checkLocalStorage();

setInterval(fetchData, 60 * 60 * 1000); // fetch new data every hour