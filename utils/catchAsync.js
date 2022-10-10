// const catchAsync = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch(next);
//   };
// };

const catchAsync = (func) => (req, res, next) =>
  func(req, res, next).catch(next);

module.exports = catchAsync;
