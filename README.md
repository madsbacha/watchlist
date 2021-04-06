# watchlist

Start postgres docker container
```
docker run --name watchlist-postgres -e POSTGRES_PASSWORD=watchlist7589324079 -d postgres
```

Run server
```
PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=watchlist7589324079 \
PGDATABASE=postgres \
PGPORT=5432 \
node server.js
```
