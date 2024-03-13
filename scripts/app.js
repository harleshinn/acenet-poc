let auth0Client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });
};

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });
};

const logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();

    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;

    // add logic to show/hide gated content after authentication
    if (isAuthenticated) {
        document.getElementById("profile-user").innerHTML = `
            <img src="${userProfile.picture}" />
            <p>${userProfile.name}</p>
          `;

        document.getElementById("gated-content").classList.remove("hidden");

        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0Client.getTokenSilently();

        document.getElementById("ipt-user-profile").textContent = JSON.stringify(
            await auth0Client.getUser()
        );

    } else {
        document.getElementById("gated-content").classList.add("hidden");
    }
};

window.onload = async () => {
    await configureClient();

    // check if buttons are rendered
    const waitForElements = setInterval(() => {
        const logoutButton = document.getElementById("btn-logout");
        const loginButton = document.getElementById("btn-login");
        if (logoutButton && loginButton) {
            clearInterval(waitForElements);
            // update the UI state
            updateUI();
        }
    }, 10);

    const isAuthenticated = await auth0Client.isAuthenticated();
    const loginRequiredPages = ["/profile", "/page1", "/page2"];

    // If the user is not authenticated and the current page is in the list of pages where login is required, display the login screen
    if (!isAuthenticated && loginRequiredPages.includes(window.location.pathname)) {
        await login();
        return;
    }

    // Select all <a> elements and add a click event listener to each
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', async (event) => {
            // Check if the link is not pointing to the current page and not a hash link
            if (link.href !== window.location.href && !link.href.startsWith("#")) {
                event.preventDefault();

                if (isAuthenticated) {
                    // Redirect to the link's destination if the user is authenticated
                    window.location.href = link.href;
                } else {
                    // If the user is not authenticated, prompt to log in
                    await login();
                }
            }
        });
    });

    // check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0Client.handleRedirectCallback();

        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
};



