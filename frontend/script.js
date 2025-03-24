document.getElementById('getHoroscope').addEventListener('click', () => {
  const sign = document.getElementById('zodiacSelect').value;
  if (!sign) {
    alert('Please select a zodiac sign!');
    return;
  }

  fetch(`http://localhost:3000/zodiac/${sign}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('result').innerText = data.horoscope || "No data";
    })
    .catch(err => {
      document.getElementById('result').innerText = "Error fetching horoscope.";
    });
});
