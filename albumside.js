// declare rest api url and api key
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

const colorThief = new ColorThief();



async function getData() {
    // fetch data from restdb
    const response = await fetch(tempUrl);
    const data = await response.json();
    console.log(data)
    // call function to add data to DOM
    addToDom(data);
}

async function getGenreAlbums() {
  // fetch data from restdb
  const response = await fetch(tempUrl);
  const data = await response.json();
  console.log(data)
  // call function to add data to DOM
  addGenreAlbums(data);
}

function addGenreAlbums(data) {
  // loop through data
  data.forEach(album => {
    // if album.genre == albumGenre && album._id != id then show album on page

    if (album.genre == albumGenre && album._id != id) {
      console.log(album.genre)
      // split album.billede into just filename and add to coverurl
      let genreCoverUrl = "tempimgs/" + album.billede.split(".")[0] + ".jpg";
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
  // loop through data //timeout is temporary in order to simulate loading time
  setTimeout(() => {
    data.forEach(album => {
      // if _id == id then show album on page
      if (album._id == id) {
        albumGenre = album.genre;
        // split album.billede into just filename and add to coverurl
        coverurl = "tempimgs/" + album.billede.split(".")[0] + ".jpg";

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

        // after a bit set album container div opacity to 1 and rotate album-container smoothly wauw
        setTimeout(() => {
          document.querySelector(".loader").classList.add("hide");
          document.querySelector(".add-to-collection").classList.remove("hide");
          document.querySelector(".vinyl-record").classList.remove("hide");
          document.querySelector(".album-container").style.opacity = "1";
          document.querySelector(".spotify-section").style.opacity = "1";
          document.querySelector(".album-info").style.opacity = "1";
          document.querySelector(".album-info").style.transform = "translate(0px)";

          document.querySelector(".genre-albums-section").style.opacity = "1";
          
          // 3dtransform album-container to rotate and scale a bit
          document.querySelector(".albumcover-container").style.transform = "rotate3d(0, 1, 0, 6deg)";
          document.querySelector(".albumcover-container").style.scale = "1.07";
          document.querySelector(".vinyl-record").style.transform = "translate(0px)"; 
        }, 800);
        // call function to get similar albums with genre and id as parameters
        getGenreAlbums();
      }
    })
  }, 900);
  // call function to get similar albums

}


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
  document.querySelector(".vinyl-center").style.background = `radial-gradient(circle at 50% 50%, var(--color2) 0%, var(--color3) 100%)`;

};

window.onload = (event) => {
  getData();
}