const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LINK.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB..."));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("\nUNHANDLED REJECTION! Shutting down...\n");
  console.log(err.name, err.message, "\n");
  server.close(() => {
    process.exit(1);
  });
});
