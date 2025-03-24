document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token); // Token saklanıyor
        document.getElementById('message').innerText = 'Login successful!';
        setTimeout(() => {
          window.location.href = 'profile.html'; // yönlendirme
        }, 1000);
      } else {
        document.getElementById('message').innerText = data.error;
      }
    });
});
