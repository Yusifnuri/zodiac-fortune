document.getElementById('getHoroscope').addEventListener('click', () => {
  const sign = document.getElementById('zodiacSelect').value;

  if (!sign) {
    alert("Please select your zodiac sign!");
    return;
  }

  fetch(`http://localhost:3000/zodiac/${sign}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('horoscopeText').innerText = data.horoscope || "No horoscope found.";
    })
    .catch(err => {
      console.error(err);
      document.getElementById('horoscopeText').innerText = "Error fetching horoscope.";
    });
});
