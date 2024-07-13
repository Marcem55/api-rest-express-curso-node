const logger = (req, res, next) => {
  console.log("Logging...");
  next();
  console.log("Logging post next...");
};

const auth = (req, res, next) => {
  console.log("Autenticando...");
  next();
  console.log("Autenticado...");
};

export { logger, auth };
