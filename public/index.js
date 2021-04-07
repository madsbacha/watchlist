function getWatch(finished = undefined) {
  let url = '/api/watchlist'
  if (finished !== undefined) {
    url += '?finished=' + (finished ? 'true' : 'false')
  }
  return fetch(url)
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

function generateNumberColEl(text, number, onChange) {
  const container = document.createElement("p")
  container.classList.add("item-number")

  const addBtn = document.createElement("button")
  addBtn.innerText = "+"
  addBtn.addEventListener('click', () => onChange(1))
  const removeBtn = document.createElement("button")
  removeBtn.innerText = "-"
  removeBtn.addEventListener('click', () => onChange(-1))


  const textEl = document.createElement("label")
  textEl.classList.add("number-label")
  textEl.innerText = text
  container.append(textEl)

  const numberContainer = document.createElement("div")
  numberContainer.classList.add("number-container")
  const numberEl = document.createElement("label")
  numberEl.innerText = number
  numberContainer.append(removeBtn, numberEl, addBtn)
  container.append(numberContainer)
  
  return container
}

function addItemToList(el, payload) {
  const itemContainer = document.createElement("div")
  itemContainer.classList.add("watchlist-item")

  const title = document.createElement("h3")
  title.innerText = payload.title
  itemContainer.append(title)

  const seasonEl = generateNumberColEl("season ", payload.season, (change) => {
    setNumbers(payload.id, payload.season + change, 1).then(() => refresh())
  })
  itemContainer.append(seasonEl)
  const episodeEl = generateNumberColEl("episode ", payload.episode, (change) => {
    setNumbers(payload.id, payload.season, payload.episode + change).then(() => refresh())
  })
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

function handleWatchlistFinished(list) {
  const listEl = document.getElementById("watchlist-finished")
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
  }).then(response => response.json())
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
  }).then(response => response.json())
}

function handleAdd(event) {
  const titleEl = document.getElementById("new-title")
  const title = titleEl.value
  if (title.trim() === "") {
    return;
  }
  titleEl.setAttribute("disabled", 1)
  addEntry(title, 1, 0, false).then(() => {
    titleEl.value = ""
    titleEl.removeAttribute("disabled")
    refresh()
  })
}

function refresh() {
  getWatch(false).then(handleWatchlist);
  getWatch(true).then(handleWatchlistFinished);
}

(function() {
  if (document.cookie === "") {
    document.cookie = JSON.stringify({ darktheme: false })
  }
  const cookieData = JSON.parse(document.cookie)
  if (!cookieData.darktheme) {
    document.documentElement.classList.remove("darktheme")
  }
  const addBtn = document.getElementById("add-new-title")
  addBtn.addEventListener('click', handleAdd)
  document.getElementById("theme").addEventListener('click', () => {
    const state = ! document.documentElement.classList.contains("darktheme")
    document.cookie = JSON.stringify({ darktheme: state })
    document.documentElement.classList.toggle("darktheme")
  })
  refresh()
})()
