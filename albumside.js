const url = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

const tempUrl = "/temp.json";

let coverurl;

let id = "1";
const template = document.querySelector("template");
const container = document.querySelector(".sang-container");

async function getJson() {
    const response = await fetch(tempUrl);
    const data = await response.json();
    console.log(data)
    addToDom(data);
    analyzeImageColor();
}

function addToDom(data) {
    data.forEach(album => {
        // if _id == id then show album
        if (album._id == id) {
            document.querySelector(".album-cover").src = "covers/" + album.billede;
            coverurl = "covers/" + album.billede;
            document.querySelector(".album-titel").textContent = album.album;
            document.querySelector(".album-artist").textContent = album.artist;
            document.querySelector(".spotify-link").href = album.spotifylink;
            console.log(album)
            album.sange.forEach(sang => {
                const clone = template.content.cloneNode(true);
                clone.querySelector(".sang").textContent = sang;
                container.appendChild(clone);
            });
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

      console.log(`The most prominent color is ${mostProminentColor}`);
    //   change body color to most prominent color
    document.querySelector("body").style.background = `linear-gradient(to bottom, #202020, ${mostProminentColor})`;
    }
}

getJson();
