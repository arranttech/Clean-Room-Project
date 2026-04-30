import dotenv from "dotenv";

const environment = process.env.NODE_ENV;
console.log("Loaded env is",environment);
// Always load base .env first
dotenv.config();

// If specific env is provided, override it
if (environment) {
  dotenv.config({
    path: `.env.${environment}`,
    override: true,
  });
}

console.log("Loaded ENV:", environment || ".env (default)");