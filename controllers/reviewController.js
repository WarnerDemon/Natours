const Review = require("../models/reviewModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: { reviews: reviews },
//   });
// });
exports.getAllReviews = factory.getAll(Review);

// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(new AppError("No Review found with given ID", 404));
//   }
//   res.status(200).json({ status: "Success", data: { review } });
// });
exports.getReview = factory.getOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const newReview = await Review.create(req.body);
//   res.status(201).json({ status: "Review Added", data: { review: newReview } });
// });

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);

// exports.updateReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!review) {
//     return next(new AppError("No review found with given ID", 404));
//   }
//   res.status(200).json({ status: "Data Updated", data: { review: review } });
// });
exports.updateReview = factory.updateOne(Review);

// exports.deleteReview = catchAsync(async (req, res, next) => {
//   res.status(204).json({
//     status: "success",
//   });
// });

exports.deleteReview = factory.deleteOne(Review);
