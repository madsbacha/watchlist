function getWatch() {
  return fetch('/api/watchlist')
    .then(response => response.json());
}

function addEntry(title, season, episode, finished = false) {
  const data = {
    title,
    season,
    episode,
    finished
  }
  return fetch('/api/watchlist', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    }
  })
    .then(response => response.json());
}

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function generateNumberColEl(text, number) {
  const container = document.createElement("p")
  container.classList.add("item-number")

  const textEl = document.createElement("label")
  textEl.innerText = text
  container.append(textEl)

  const numberEl = document.createElement("label")
  numberEl.innerText = number
  container.append(numberEl)
  
  return container
}

function addItemToList(el, payload) {
  const itemContainer = document.createElement("div")
  itemContainer.classList.add("watchlist-item")

  const title = document.createElement("h3")
  title.innerText = payload.title
  itemContainer.append(title)

  const seasonEl = generateNumberColEl("season: ", payload.season)
  itemContainer.append(seasonEl)
  const episodeEl = generateNumberColEl("episode: ", payload.episode)
  itemContainer.append(episodeEl)

  const finishedBtn = document.createElement("button")
  finishedBtn.innerText = payload.finished ? "Not finished" : "Finished"
  finishedBtn.addEventListener('click', (e) => {
    setFinished(payload.id, payload.title, payload.finished)
      .then(() => {
        refresh()
      })
  })
  itemContainer.append(finishedBtn)

  el.append(itemContainer)
}

function handleWatchlist(list) {
  const listEl = document.getElementById("watchlist")
  clearElement(listEl)
  for (const item of list) {
    addItemToList(listEl, item)
  }
}

function setNumbers(id, season, episode) {
  return fetch(`/api/watchlist/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ season, episode }),
    headers: {
        'Content-Type': 'application/json'
    }
  })
}

function setFinished(id, title, finished) {
  const confirmation = confirm(`Are you ${finished ? "not " : ""}finished with ${title}?`)
  if (!confirmation) return;

  return fetch(`/api/watchlist/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ 'finished': !finished }),
    headers: {
        'Content-Type': 'application/json'
    }
  })
}

function refresh() {
  getWatch().then(handleWatchlist);
}

(function() {
  refresh()
})()
