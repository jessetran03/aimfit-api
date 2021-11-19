const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL, NODE_ENV } = require("./config");

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
  ssl: NODE_ENV === "production" ? true : false,
});

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
