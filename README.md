# watchlist

Start postgres docker container
```
docker run --name watchlist-postgres -e POSTGRES_PASSWORD=watchlist7589324079 -p 54321:5432 -d postgres
```

Run server
```
PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=watchlist7589324079 \
PGDATABASE=postgres \
PGPORT=54321 \
node server.js
```
