document.getElementById('drawCard').addEventListener('click', () => {
  fetch('http://localhost:3000/tarot/draw')
    .then(res => res.json())
    .then(data => {
      document.getElementById('cardName').innerText = data.name;
      document.getElementById('cardMeaning').innerText = data.meaning;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('cardName').innerText = "Error";
      document.getElementById('cardMeaning').innerText = "Could not fetch card.";
    });
});
