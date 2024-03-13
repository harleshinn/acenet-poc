export default function decorate(block) {
  const loginButton = document.createElement('button');
  loginButton.id = 'btn-login';
  loginButton.disabled = true;
  loginButton.textContent = 'Log in';
  loginButton.addEventListener('click', function () {
    login();
  });

  const logoutButton = document.createElement('button');
  logoutButton.id = 'btn-logout';
  logoutButton.disabled = true;
  logoutButton.textContent = 'Log out';
  logoutButton.addEventListener('click', function () {
    logout();
  });

  const profileUser = document.createElement('div');
  profileUser.id = 'profile-user';
  
  const profileLink = document.createElement('a');
  profileLink.href = '/profile';
  profileLink.textContent = 'Profile';

  block.appendChild(loginButton);
  block.appendChild(logoutButton);
  block.appendChild(profileUser);
  block.appendChild(profileLink);
}
