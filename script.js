const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No profile with this username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}

function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
        <div class="card">
          <a href="${user.html_url}" target="_blank" class="user-link"><i class="fab fa-github"></i></a>
          <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
          </div>
          <div class="user-info">
            <h2>${userID}</h2>
            ${userBio}
            <ul>
              <li><strong>${user.followers}</strong> Seguidores</li>
              <li><strong>${user.following}</strong> Siguiendo</li>
              <li><strong>${user.public_repos}</strong> Repos</li>
            </ul>
            <div id="repos"></div>
            <span class="close-btn" onclick="closeCard()"><i class="fas fa-times"></i>
</span>
          </div>
        </div>
      `;
  main.innerHTML = cardHTML;
  search.style.display = "none";
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
          <h1>${msg}</h1>
        </div>
      `;
  main.innerHTML = cardHTML;
  search.style.display = "none";
}

function closeCard() {
  main.innerHTML = "";
  search.style.display = "block";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});
