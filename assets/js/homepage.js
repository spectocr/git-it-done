var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


var getUserRepos = function(user) {   //where is this "user" coming from, how'd it get populated from which line of code?
    //format the github api url
   var apiUrl = "https://api.github.com/users/" + user + "/repos";
  // make a request to the url

  fetch(apiUrl).then(function(response) {
      if (response.ok) {
    response.json().then(function(data) {
        displayRepos(data, user); // ???? where is data coming from here, what about user? so confusing.
    });
} else {
    alert("Error: GitHub user Not Found");
}
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
};
// ????? how is the "event" being handled here? i don't get the concept, how does it work / know which event to track? what is multiple events?
var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
    console.log(event);
}

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return; //???? what is this return doing?
    }
    //clear old content
    repoContainerEl.textContent = '';
    repoSearchTerm.textContent = searchTerm;

// loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to container
        repoEl.appendChild(titleEl);

        // create stats element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
              "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
          } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
          }

          // append to container
          repoEl.appendChild(statusEl);
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
  }

    //console.log(repos); // so somehow this looks like repos is getting pulled from the api call object? json?
    //console.log(searchTerm);
}

userFormEl.addEventListener("submit", formSubmitHandler);