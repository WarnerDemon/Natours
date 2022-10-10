const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LINK.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB..."));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "UTF-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "UTF-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "UTF-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data loaded.");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Deleted.");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}

// node .\dev-data\data\import-data.js --delete
// node .\dev-data\data\import-data.js --import
