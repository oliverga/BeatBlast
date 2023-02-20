const urlParams = new URLSearchParams(window.location.search);
const genre = urlParams.get("genre");


const template = document.querySelector("#genre-template");
const container = document.querySelector(".genre-container");

const localData = JSON.parse(localStorage.getItem("albumData"));

const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

async function fetchData() {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    return data;
}

async function checkLocalStorage() {
    // check if data is in local storage
    if (localData) {
      console.log("Data retrieved from local storage");
      // if so, add data to DOM
      displayGenre(localData);
    }
    else {
      // if not, fetch data from API
      const latestData = await fetchData();
      console.log("Data retrieved from API");
      // update local storage with new data
      localStorage.setItem("albumData", JSON.stringify(latestData));
      console.log("Data updated in local storage");
      // add data to DOM
      displayGenre(latestData);
    }
}

function displayGenre(data) {
    data.forEach(album => {
        if(album.genre == genre) {
            document.querySelector("h1").textContent = album.genre;
            const clone = template.content.cloneNode(true);
            clone.querySelector("img").src = "tempimgs/" + album.billede;
            clone.querySelector("a").href = "albumside.html?id=" + album._id;
            container.appendChild(clone);
        }
    })
    setTimeout(() => {
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
    )
    }, 100);

  const albums = document.querySelectorAll(".album");
  albums.forEach(album => {
    album.addEventListener("mouseover", () => {
      const img = album.querySelector("img");
      const palette = new ColorThief().getPalette(img, 5);
      // make palette available to css
      
      // update the background property with the dominant color
      document.querySelector(".bg").style.backgroundColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
      document.querySelector(".bg").style.transition = "background-color 1s ease-in-out";

    });
    album.addEventListener("mouseleave", () => {
      // update the background property with the default color
      document.querySelector(".bg").style.backgroundColor = "#3B1F44";
    });
  });
}


  checkLocalStorage();

  // get parameter from url
