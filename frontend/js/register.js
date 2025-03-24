document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          document.getElementById('message').innerText = data.message;
  
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 1000);
        } else {
          document.getElementById('message').innerText = data.error || "Registration failed.";
        }
      })
      .catch(() => {
        document.getElementById('message').innerText = "Error contacting server.";
      });
  });
  