"use strict";

// DOM variables
const container = document.querySelector(".searchContainer");
const searchUserInput = document.querySelector(".searchUser");
const profile = document.querySelector(".profile");

class API {
  clientId = "9e184f030bef81d2d1e2";
  clientSecret = "7408dea0478cfcf858f710601802b869d69e9040";

  async getUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(this.clientId + ":" + this.clientSecret)}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async getRepos(userName) {
    const response = await fetch(
      `https://api.github.com/users/${userName}/repos?per_page=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(
            this.clientId + ":" + this.clientSecret
          )}`,
        },
      }
    );
    const reposData = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return reposData;
  }
}

class UI {
  showProfile(user, reposInfo) {
    profile.innerHTML = `
    <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos"> 
            <ul class="list-group">
              <li class="list-group-item">Repository name: ${reposInfo[0].name}; <br/>
              Repository url: ${reposInfo[0].url};<br/>
            Last update: ${reposInfo[0].updated_at}; </li>
            <li class="list-group-item">Repository name: ${reposInfo[1].name}; <br/>
              Repository url: ${reposInfo[1].url};<br/>
            Last update: ${reposInfo[1].updated_at}; </li>
            <li class="list-group-item">Repository name: ${reposInfo[2].name}; <br/>
              Repository url: ${reposInfo[2].url};<br/>
            Last update: ${reposInfo[2].updated_at}; </li>
            <li class="list-group-item">Repository name: ${reposInfo[3].name}; <br/>
              Repository url: ${reposInfo[3].url};<br/>
            Last update: ${reposInfo[3].updated_at}; </li>
            <li class="list-group-item">Repository name: ${reposInfo[4].name}; <br/>
              Repository url: ${reposInfo[4].url};<br/>
            Last update: ${reposInfo[4].updated_at}; </li>
            </ul>
      </div>
    `;
  }

  clearProfile() {
    profile.innerHTML = "";
  }

  showAlert(message, type, timeout = 3000) {
    this.clearAlert();

    const div = document.createElement("div");
    div.className = `alert ${type}`;
    div.appendChild(document.createTextNode(message));

    const search = document.querySelector(".search");
    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, timeout);
  }

  clearAlert() {
    const alertBlock = document.querySelector(".alert");
    if (alertBlock) {
      alertBlock.remove();
    }
  }
}

const handleInput = async (event) => {
  const ui = new UI();
  const userText = event.target.value.trim();

  if (!userText) {
    ui.clearProfile();
    return;
  }

  try {
    const api = new API();
    const user = await api.getUser(userText);
    const repos = await api.getRepos(userText);

    ui.clearAlert();
    ui.showProfile(user, repos);
  } catch (error) {
    ui.showAlert(error.message, "alert-danger");
    ui.clearProfile();
  }
};

const debounce = (func, delay) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Event listeners
searchUserInput.addEventListener("input", debounce(handleInput, 1000));
