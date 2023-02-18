const template = document.querySelector("#collection-template");
const container = document.querySelector(".collection-container");
let collection = JSON.parse(localStorage.getItem("collection"));
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
    displayCollection(data);
}

async function checkLocalStorage() {
    // check if data is in local storage
    if (localData) {
      console.log("Data retrieved from local storage");
      // if so, add data to DOM
      displayCollection(localData);
    }
    else {
      // if not, fetch data from API
      const latestData = await fetchData();
      console.log("Data retrieved from API");
      // update local storage with new data
      localStorage.setItem("albumData", JSON.stringify(latestData));
      console.log("Data updated in local storage");
      // add data to DOM
      displayCollection(latestData);
    }
  }

// display collection from local storage on page load
function displayCollection(data) {
  if (!collection || collection.length == 0) {
    console.log("Collection is empty");
    return;
  }
  else {
    data.forEach(album => {
        if(collection.includes(album._id)) {
            const clone = template.content.cloneNode(true);
            clone.querySelector("img").src = "tempimgs/" + album.billede;
            clone.querySelector("a").href = "albumside.html?id=" + album._id;
            container.appendChild(clone);
        }
    })
  }
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
}

// on load display collection
checkLocalStorage();
