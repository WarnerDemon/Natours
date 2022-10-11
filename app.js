const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const bookingRouter = require("./routes/bookingRouter");
const bookingController = require("./controllers/bookingController");
const viewRouter = require("./routes/viewRoutes");

// Start express app
const app = express();

app.enable("trust-proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Access-Control-Allow-Origin
app.use(cors());

app.options("*", cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP Headers
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", "data:", "blob:", "https://js.stripe.com/"],
      imgSrc: ["'self'", "https: data: blob:"],
      scriptSrc: [
        "'self'",
        "https://*.cloudflare.com",
        "https://js.stripe.com/v3/",
      ],
      // connectSrc: ["'self'", "blob:"],
    },
  })
);

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again after one hour!",
});

app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webHookCheckout
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
