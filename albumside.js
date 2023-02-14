const url = "https://albumliste-d3cb.restdb.io/rest/album";
const options = {
    headers: {
        'x-apikey': '63eb5946478852088da68231'
    }
}

let id = "63eb425862144c690001ca75";
const template = document.querySelector("template");
const container = document.querySelector(".sang-container");


async function getJson() {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data)
    addToDom(data);
}



function addToDom(data) {
    data.forEach(album => {
        // if _id == id then show album

        if (album._id == id) {
            document.querySelector(".album-titel").textContent = album.album;
            console.log(album)
            album.sange.forEach(sang => {
                console.log(sang)
                const clone = template.content.cloneNode(true);
                clone.querySelector(".sang").textContent = sang;
                container.appendChild(clone);
            });
        }
    })
}


getJson();