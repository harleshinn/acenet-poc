export default function decorate(block) {
  const profileInfo = document.createElement('div');
  profileInfo.id = 'profile-info';
  profileInfo.innerHTML = `
    <div class="hidden" id="gated-content">
    <p>
      You're seeing this content because you're currently
      <strong>logged in</strong>.
    </p>
    <label>
      Access token:
      <pre id="ipt-access-token"></pre>
    </label>
    <label>
      User profile:
      <pre id="ipt-user-profile"></pre>
    </label>
  </div>
  `; 

  block.appendChild(profileInfo);
}
