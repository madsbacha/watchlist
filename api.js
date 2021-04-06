const { Router } = require('express')
const { getWatchList, getWatch, addWatch, setFinished, setWatched } = require('./database')
const router = new Router()

router.get("/watchlist", async (req, res) => {
  const finished = req.query.finished !== undefined ? (req.query.finished !== "false" ? true : false) : undefined
  const list = await getWatchList(finished)
  res.json(list)
})

router.post("/watchlist", async (req, res) => {
  const { title, season, episode, finished } = req.body
  const watch = await addWatch(title, season, episode, finished)
  res.json(watch)
})

router.put("/watchlist/:id", async (req, res) => {
  const id = req.params.id
  let { season, episode, finished } = req.body
  if (finished !== undefined) {
    await setFinished(id, finished)
  }
  if (season === undefined || episode === undefined) {
    const oldWatch = await getWatch(id)
    if (season === undefined) {
      season = oldWatch.season
    }
    if (episode === undefined) {
      episode = oldWatch.episode
    }
  }
  const watch = await setWatched(id, season, episode)
  res.json(watch)
})

module.exports = router
