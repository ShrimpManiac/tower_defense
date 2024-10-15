const getCookie = function (name) {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
};
const cookie = getCookie('authorization');
if (cookie) {
  document.getElementById('playButton').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'block';
} else {
  document.getElementById('registerButton').style.display = 'block';
  document.getElementById('loginButton').style.display = 'block';
}

document.getElementById('registerButton').addEventListener('click', () => {
  window.location.href = 'register.html';
});

document.getElementById('loginButton').addEventListener('click', () => {
  window.location.href = 'login.html';
});

document.getElementById('logoutButton').addEventListener('click', () => {
  document.cookie = 'authorization' + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  sessionStorage.removeItem('uuid');
  location.reload();
});

document.getElementById('playButton').addEventListener('click', async () => {
  const result = await import('../../user.js');
  if (!result.id) {
    return;
  }
  document.querySelector('.button-container').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  import('../../game.js');
});
