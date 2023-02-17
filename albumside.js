// declare rest api url and api key
const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

const openUrl = new URL(window.location.href);
let id = openUrl.searchParams.get("id");

const tempUrl = "/temp.json";
let coverurl;
let spotifyId;
const template = document.querySelector("#similar-album-template");

const colorThief = new ColorThief();

async function getJson() {
    // fetch data from restdb
    const response = await fetch(tempUrl);
    const data = await response.json();
    console.log(data)
    addToDom(data);
}


// add data to DOM
function addToDom(data) {
  // loop through data
  setTimeout(() => {
    data.forEach(album => {
      // if _id == id then show album on page
      if (album._id == id) {
        // split album.billede into just filename and add to coverurl
        coverurl = "tempimgs/" + album.billede.split(".")[0] + ".jpg";

        // set coverImg src to coverurl for colorThief
        coverImg.src = coverurl;

        document.querySelector(".album-cover").src = coverurl;
        document.querySelector(".album-titel").textContent = album.album;
        document.querySelector(".album-artist").textContent = album.artist;

        // split album.spotifylink into just spotifyId and add to iframe src
        spotifyId = album.spotifylink.split("album/")[1];
        document.querySelector(".spotify-embed").src = "https://open.spotify.com/embed/album/" + spotifyId + "?utm_source=generator&theme=0";

        // after 200ms set album container div opacity to 1 and rotate album-container smoothly wauw
        setTimeout(() => {
          // document.querySelector(".vinyl-record").classList.remove("hide");
          document.querySelector(".add-to-collection").classList.remove("hide");
          document.querySelector(".vinyl-record").classList.remove("hide");
          document.querySelector(".loader").classList.add("hide");
          document.querySelector(".album-container").style.opacity = "1";
          document.querySelector(".spotify-embed").style.opacity = "1";
          // 3dtransform album-container to rotate a bit
          document.querySelector(".albumcover-container").style.transform = "rotate3d(0, 1, 0, 6deg)";
          document.querySelector(".albumcover-container").style.scale = "1.07";
          document.querySelector(".vinyl-record").style.transform = "translate(0px)"; 
        }, 800);
      }

      // tilføj logik til at tjekke om album er i samme genre som det album der er åbnet
      else {
        // clone template and add to .similar-albums
        const clone = template.content.cloneNode(true);
        clone.querySelector("img").src = "tempimgs/" + album.billede.split(".")[0] + ".jpg";
        clone.querySelector("a").href = "albumside.html?id=" + album._id;
        document.querySelector(".similar-albums-list").appendChild(clone);
      }
    })
  }, 900);
}

const coverImg = new Image();
coverImg.onload = function() {
  // Image is fully loaded, now create a ColorThief instance and get the color palette
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(coverImg, 5);
  console.log(palette);  

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

getJson();