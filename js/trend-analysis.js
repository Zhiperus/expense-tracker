const image = document.getElementsByTagName("img")[0];

fetch("http://127.0.0.1:3000/analyze", { method: "GET" }).then((response) => {
  //   response.json().then((data) => (image.src = data.image));
});
