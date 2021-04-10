# watchlist

Start postgres docker container
```
docker run --name watchlist-postgres -e POSTGRES_PASSWORD=secret -p 54321:5432 -d postgres
```

Run server
```
PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=secret \
PGDATABASE=postgres \
PGPORT=54321 \
node server.js
```
