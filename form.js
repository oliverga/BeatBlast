// Get the form element
const form = document.getElementById("myForm");

// Add event listener to form submit
form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission behavior
  
  // Create an overlay with a "Thank You" message and a close button
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = "<h5>Album Sendt</h5><p>Vi glæder os til at lytte med</p>";

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
  });

  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
});
