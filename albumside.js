// declare rest api url and api key
const url = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

const tempUrl = "/temp.json";


let coverurl;

let id = "3";
const template = document.querySelector("template");
const container = document.querySelector(".sang-container");

let spotifyId;





async function getJson() {
    // fetch data from restdb
    const response = await fetch(tempUrl);
    const data = await response.json();
    console.log(data)
    addToDom(data);
    analyzeImageColor();
}



function addToDom(data) {
    data.forEach(album => {
        // if _id == id then show album on page
        if (album._id == id) {
          coverurl = "tempimgs/" + album.billede;
            document.querySelector(".album-cover").src = coverurl;
            document.querySelector(".album-titel").textContent = album.album;
            document.querySelector(".album-artist").textContent = album.artist;
            // document.querySelector(".spotify-link").href = album.spotifylink;
            console.log(album)

            // split album.spotifylink into just spotifyId
            spotifyId = album.spotifylink.split("album/")[1];
            document.querySelector(".spotify-embed").src = "https://open.spotify.com/embed/album/" + spotifyId + "?utm_source=generator";
            setTimeout(() => {
              document.querySelector(".album-container").style.opacity = "1";
              // 3dtransform album-container to rotate a bit
              document.querySelector(".albumcover-container").style.transform = "rotate3d(0, -1, 0, 12deg)";
              document.querySelector(".albumcover-container").style.scale = "1.07";
              document.querySelector(".vinyl-record").style.transform = "translate(0px)"; 
            }, 200);

            // album.sange.forEach(sang => {
            //     const clone = template.content.cloneNode(true);
            //     clone.querySelector(".sang").textContent = sang;
            //     container.appendChild(clone);
            // });
        }
    })
}

function analyzeImageColor() {
    // Load the image
    const img = new Image();
    img.src = coverurl;

    // Wait for the image to load
    img.onload = () => {
        console.log(coverurl)
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Get the color data from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Create a color histogram
      const colorHistogram = {};
      for (let i = 0; i < imageData.length; i += 4) {
        const color = `rgb(${imageData[i]}, ${imageData[i+1]}, ${imageData[i+2]})`;
        colorHistogram[color] = colorHistogram[color] ? colorHistogram[color] + 1 : 1;
      }

      // Find the color with the highest frequency
      let maxFrequency = 0;
      let mostProminentColor;
      for (const color in colorHistogram) {
        if (colorHistogram[color] > maxFrequency) {
          maxFrequency = colorHistogram[color];
          mostProminentColor = color;
        }
      }
      document.documentElement.style.setProperty('--prominent-color', `${mostProminentColor}`);
      document.querySelector(".bg").style.opacity = "1";
    }
}

getJson();