// We're going to use the Web API to get the user's profile data.

// HTML:

// <!DOCTYPE html>
// <html lang="en">
//     <head>
//         <meta charset="utf-8">
//         <title>My Spotify Profile</title>
//         <script src="src/script.js" type="module"></script>
//     </head>
//     <body>
//         <h1>Display your Spotify profile data</h1>

//         <section id="profile">
//             <h2>Logged in as <span id="displayName"></span></h2>
//             <span id="avatar"></span>
//             <ul>
//                 <li>User ID: <span id="id"></span></li>
//                 <li>Email: <span id="email"></span></li>
//                 <li>Spotify URI: <a id="uri" href="#"></a></li>
//                 <li>Link: <a id="url" href="#"></a></li>
//              <li>Profile Image: <span id="imgUrl"></span></li>
//             </ul>
//         </section>
//     </body>
// </html>

// We'll use the authorization code flow with PKCE to get an access token, and then use that token to call the API.

const clientId = "your-client-id-here"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

// When the page loads, we'll check if there is a code in the callback query string

// If we don't have a code, we'll redirect the user to the Spotify authorization page:
if (!code) {
  redirectToAuthCodeFlow(clientId);
  // Once the user authorizes the application, Spotify will redirect the user back to our application, and we'll read the code from the query string.
} else {
  const accessToken = await getAccessToken(clientId, code); // We will use the code to request an access token from the Spotify token API
  const profile = await fetchProfile(accessToken); // We'll use the access token to call the Web API to get the user's profile data.
  populateUI(profile); // We'll populate the user interface with the user's profile data.
}

export async function redirectToAuthCodeFlow(clientId) {
  // TODO: Redirect to Spotify authorization page

  // On the first line there is a clientId variable - you'll need to set this variable to the client_id of the Spotify app you created earlier.
  // The code now needs to be updated to redirect the user to the Spotify authorization page.
  // To do this, let's write the redirectToAuthCodeFlow function:

  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// In the upper function, a new URLSearchParams object is created, and we add the client_id, response_type, redirect_uri and scope parameters to it.
// The scope parameter is a list of permissions that we're requesting from the user.
// In this case, we're requesting the user-read-private and user-read-email scopes - these are the scopes that allow us to fetch the user's profile data.

// The redirect_uri parameter is the URL that Spotify will redirect the user back to after they've authorized the application.
// In this case, we're using a URL that points to our local Vite dev server.

// You need to make sure this URL is listed in the Redirect URIs section of your Spotify Application Settings in your Developer Dashboard.

// You will also notice that we are generating PKCE verifier and challenge data, we're using this to verify that our request is authentic.
// We're using local storage to store the verifier data, which works like a password for the token exchange process.
// To prevent the user from being stuck in a redirect loop when they authenticate, we need to check if the callback contains a code parameter.
// To do this, the first three lines of code in the file are modified like this:

// const clientId = "your-client-id-here"; // Replace with your client ID
// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

// In order to make sure that the token exchange works, we need to write the getAccessToken function:

export async function getAccessToken(clientId, code) {
  // TODO: Get access token for code

  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

// In this function, we load the verifier from local storage and using both the code returned from the callback and the verifier to perform a POST to the Spotify token API.
// The API uses these two values to verify our request and it returns an access token.

// Now, if we run npm run dev, and navigate to http://localhost:5173 in a browser, we'll be redirected to the Spotify authorization page.
// If we authorize the application, we'll be redirected back to our application, but no data will be fetched and displayed.

// To fix this, we need to update the fetchProfile function to call the Web API and get the profile data. Update the fetchProfile function:

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}
// In this function, a call is made to https://api.spotify.com/v1/me using the browser's Fetch API to get the profile data.
// The Authorization header is set to Bearer ${token}, where token is the access token that we got from the https://accounts.spotify.com/api/token endpoint.

// If we add a console.log statement to the calling code we can see the profile data that is returned from the API in the browser's console:

// } else {
//     const profile = await fetchProfile(token);
//     console.log(profile); // Profile data logs to console

// }

// Finally, we need to update the populateUI function to display the profile data in the UI.
// To do this, we'll use the DOM to find our HTML elements and update them with the profile data:

function populateUI(profile) {
  // TODO: Update UI with profile data

  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
    document.getElementById("imgUrl").innerText = profile.images[0].url;
  }
  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document
    .getElementById("uri")
    .setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
}

// You can now run your code by running npm run dev in the terminal and navigating to http://localhost:5173 in your browser.
