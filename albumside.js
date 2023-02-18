// declare variables
const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}
const tempUrl = "/temp.json";
const openUrl = new URL(window.location.href);
let id = openUrl.searchParams.get("id");
let coverurl;
let spotifyId;
let albumGenre;
const template = document.querySelector("#genre-album-template");
const localData = JSON.parse(localStorage.getItem("albumData"));
let collection = [];

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
    addToDom(localData);
  }
  else {
    // if not, fetch data from API
    const latestData = await fetchData();
    console.log("Data retrieved from API");
    // update local storage with new data
    localStorage.setItem("albumData", JSON.stringify(latestData));
    console.log("Data updated in local storage");
    // add data to DOM
    addToDom(latestData);
  }
}

function addGenreAlbums(data) {
  // loop through data
  data.forEach(album => {
    // if album.genre == albumGenre && album._id != id then show album on page
    if (album.genre == albumGenre && album._id != id) {
      // split album.billede into just filename
      let genreCoverUrl = "tempimgs/" + album.billede;
      // clone template and add to .similar-albums
      const clone = template.content.cloneNode(true);
      clone.querySelector("img").src = genreCoverUrl;
      clone.querySelector("a").href = "albumside.html?id=" + album._id;
      document.querySelector(".genre-albums-list").appendChild(clone);
      return;
    }
  })
}

function addToDom(data) {
  // loop through data // timeout is temporary until animations are done
  setTimeout(() => {
    data.forEach(album => {
      // if _id == id then show album on page
      if (album._id == id) {
        document.title = album.album;
        albumGenre = album.genre;
        // split album.billede into just filename and add to coverurl
        coverurl = "tempimgs/" + album.billede;

        // set coverImg src to coverurl for colorThief
        coverImg.src = coverurl;

        // set album data to DOM
        document.querySelector(".album-cover").src = coverurl;
        document.querySelector(".album-titel").textContent = album.album;
        document.querySelector(".album-artist").textContent = album.artist;

        // split album.spotifylink into just spotifyId and add to iframe src
        spotifyId = album.spotifylink.split("album/")[1];
        document.querySelector(".spotify-embed").src = "https://open.spotify.com/embed/album/" + spotifyId + "?utm_source=generator&theme=0";
        document.querySelector(".spotify-link").href = "https://open.spotify.com/album/" + spotifyId + "?utm_source=generator&theme=0";

        // clone template and add to .album-info
        const infoClone = document.querySelector("#info-template").content.cloneNode(true);
        let date = album.dato.split("T")[0];
        infoClone.querySelector(".info-dato").textContent = date;
        infoClone.querySelector(".info-label").textContent = album.label;
        infoClone.querySelector(".info-genre").textContent = album.genre;
        infoClone.querySelector(".info-sprog").textContent = album.sprog;
        // append
        document.querySelector(".album-info").appendChild(infoClone);
        displayAnimation();
        checkCollection();
        // return data so it can be used in other functions
        addGenreAlbums(data);
      }
    })
  }, 000);
}

function displayAnimation() {
  document.querySelector(".loader").classList.add("hide");
    if (window.innerWidth > 800) {
    document.querySelector(".vinyl-record").animate(
      [
        {transform: "translatex(-50px)"},
        {transform: "translatex(0px)"}
      ],
      {
        duration: 2600,
        easing: "ease-out",
        fill: "forwards"
      }
    )
  }
  else if (window.innerWidth < 800) {
    document.querySelector(".vinyl-record").animate(
      [
        {transform: "translatey(50px)"},
        {transform: "translatey(0px)"}
      ],
      {
        duration: 2600,
        easing: "ease-out",
        fill: "forwards"
      }
    )
  }
  document.querySelector(".albumcover-container").animate(
    [
      {transform: "scale(0.90)"},
      {transform: "scale(1)"}
    ],
    {
      duration: 2000,
      easing: "ease-out",
      fill: "forwards"
    }
  )
  setTimeout(() => {
    document.querySelector("main").animate(
      [
        {opacity: "0"},
        {opacity: "1"}
      ],
      {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards"
      }
    )
  }, 100);

}

// ColorThief stuff
const coverImg = new Image();
coverImg.onload = function() {
  // Image is fully loaded, now create a ColorThief instance and get the color palette
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(coverImg, 10);

  // for each color in palette, set css variable to that color
  palette.forEach((color, index) => {
    document.documentElement.style.setProperty(`--color${index + 1}`, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
  });

  // add gradient to background and set opacity to 1
  document.querySelector(".bg").style.background = `linear-gradient(135deg, var(--color1) -50%, rgb(0, 0, 0) 120%)`;
  document.querySelector(".bg").style.opacity = "1";
  
  // give .vinyl-center a background radial gradient with 2 of the colors from the palette
  document.querySelector(".vinyl-center").style.background = `radial-gradient(circle at 50% 50%, var(--color4) 0%, var(--color2) 100%)`;

};

// collection stuff
function checkCollection() {
  // check if collection array is in local storage
  if (localStorage.getItem("collection")) {
    // if so, add data to collection array
    collection = JSON.parse(localStorage.getItem("collection"));
    // check if album is in collection array
    if (collection.includes(id)) {
      // if so, change button text and add class "added"
      document.querySelector(".add-to-collection").classList.add("added");
      document.querySelector(".add-to-collection").textContent = "Fjern fra Collection";
      document.querySelector(".add-to-collection").classList.remove("not-added");
    }
    else {
      // if not, add class "not-added" and change button text to "Tilføj til Collection" and remove class "added"
      document.querySelector(".add-to-collection").classList.add("not-added");
      document.querySelector(".add-to-collection").textContent = "Tilføj til Collection";
      document.querySelector(".add-to-collection").classList.remove("added");
    }
  }
  else {
    // if not add collection array to local storage
    console.log("collection array is not in local storage")
    localStorage.setItem("collection", JSON.stringify(collection));
  }
}

// add event listener to button and check if album is in collection array
document.querySelector(".add-to-collection").addEventListener("click", () => {
  // check if album is in collection array
  if (collection.includes(id)) {
    // if so, remove album from collection array
    collection.splice(collection.indexOf(id), 1);
    // change button text and remove class "added"
    document.querySelector(".add-to-collection").classList.remove("added");
    document.querySelector(".add-to-collection").textContent = "Tilføj til Collection";
    document.querySelector(".add-to-collection").classList.add("not-added");
    // update collection array in local storage
    localStorage.setItem("collection", JSON.stringify(collection));
    console.log("Album removed from collection");
        // alert user that album has been removed to collection with a popup
        document.querySelector(".popup").textContent = "Album fjernet fra Collection";
        document.querySelector(".popup").animate(
          [
            {opacity: "0"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "1"},
            {opacity: "0"}
          ],
          {
            duration: 2600,
            easing: "ease-in-out",
            fill: "forwards"
          }
        )
    // animate button
    document.querySelector(".add-to-collection").animate(
      [
        {transform: "scale(0.94)"},
        {transform: "scale(1)"}
      ],
      {
        duration: 200,
        easing: "ease-out",
        fill: "forwards"
      }
    )
  }
  else {
    // if not, add album to collection array
    collection.push(id);
    // change button text and add class "added"
    document.querySelector(".add-to-collection").classList.add("added");
    document.querySelector(".add-to-collection").textContent = "Fjern fra Collection";
    document.querySelector(".add-to-collection").classList.remove("not-added");
    // update collection array in local storage
    localStorage.setItem("collection", JSON.stringify(collection));
    console.log("Album added to collection");
    // alert user that album has been added to collection with a popup
    document.querySelector(".popup").textContent = "Album tilføjet til Collection";
    document.querySelector(".popup").animate(
      [
        {opacity: "0"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "1"},
        {opacity: "0"}
      ],
      {
        duration: 2600,
        easing: "ease-in-out",
        fill: "forwards"
      }
    )
    document.querySelector(".add-to-collection").animate(
      [
        {transform: "scale(0.94)"},
        {transform: "scale(1)"}
      ],
      {
        duration: 200,
        easing: "ease-out",
        fill: "forwards"
      }
    )
  }
  return;
})

// when page is loaded, call checkLocalStorage
window.onload = (event) => {
  checkLocalStorage();
}

setInterval(fetchData, 60 * 60 * 1000); // fetch new data every hour