// declare rest api url and api key
const apiUrl = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

const openUrl = new URL(window.location.href);
const id = openUrl.searchParams.get("id");


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
    // analyzeImageColor();
}



function addToDom(data) {
    data.forEach(album => {
      // if _id == id then show album on page
      if (album._id == id) {
        coverurl = "tempimgs/" + album.billede;
        console.log(coverurl)
        coverImg.src = coverurl;
        document.querySelector(".album-cover").src = coverurl;
        document.querySelector(".album-titel").textContent = album.album;
        document.querySelector(".album-artist").textContent = album.artist;
        // document.querySelector(".spotify-link").href = album.spotifylink;
        console.log(album)
        // split album.spotifylink into just spotifyId
        spotifyId = album.spotifylink.split("album/")[1];
        document.querySelector(".spotify-embed").src = "https://open.spotify.com/embed/album/" + spotifyId + "?utm_source=generator&theme=0";
        setTimeout(() => {
          document.querySelector(".album-container").style.opacity = "1";
          // 3dtransform album-container to rotate a bit
          document.querySelector(".albumcover-container").style.transform = "rotate3d(0, -1, 0, 12deg)";
          document.querySelector(".albumcover-container").style.scale = "1.07";
          document.querySelector(".vinyl-record").style.transform = "translate(0px)"; 
        }, 200);
      }
      else {
        // clone template and add to .similar-albums
        const clone = template.content.cloneNode(true);
        clone.querySelector("img").src = "tempimgs/" + album.billede;
        clone.querySelector("a").href = "albumside.html?id=" + album._id;
        document.querySelector(".similar-albums-list").appendChild(clone);
      }
    })
}

const coverImg = new Image();
coverImg.onload = function() {
  // Image is fully loaded, now create a ColorThief instance and get the color palette
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(coverImg, 5);
  console.log(palette);  


  document.documentElement.style.setProperty('--color1', `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`);
  document.documentElement.style.setProperty('--color2', `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`);
  document.documentElement.style.setProperty('--color3', `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`);
  document.documentElement.style.setProperty('--color4', `rgb(${palette[3][0]}, ${palette[3][1]}, ${palette[3][2]})`);
  document.documentElement.style.setProperty('--color5', `rgb(${palette[4][0]}, ${palette[4][1]}, ${palette[4][2]})`);

  document.querySelector(".bg").style.background = `linear-gradient(135deg, var(--color2) -50%, rgb(0, 0, 0) 120%)`;

  document.querySelector(".bg").style.opacity = "1";
  

};

getJson();