import express from "express";
import "dotenv/config";
// import { logger, auth } from "./middlewares.mjs";
import morgan from "morgan";
import config from "config";
import debug from "debug";
import { usersRoutes } from "./routes/users.mjs";
const initDebug = debug("app:inicio");

const app = express();
//* Middleware para parsear el body
app.use(express.json());

//* Middleware para url querystrings
app.use(express.urlencoded({ extended: true }));

//* Middleware para accceder a archivos estáticos como .txt, .pdf., imagenes
app.use(express.static("public"));

//* Usar la ruta usuarios cuando recibo la url de users
app.use("/api/users", usersRoutes);

//* Middlewares propios (podemos crear los middlewares con las funcionalidades que queramos)
// app.use(logger);

// app.use(auth);

//* Uso de middleware de terceros: Morgan (npm) - Morgan registra las peticiones que hacemos y las loggea.
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  // console.log("Morgan habilitado");
  initDebug("Morgan está habilitado");
}

//* Configuración de entorno - Instalación del paquete 'config' de npm
console.log("Aplicación: " + config.get("nombre"));
console.log("BD server: " + config.get("configDB.host"));

// export NODE_ENV=production - export NODE_ENV=development
// Esto es el comando en consola para tomar la configuración deseada, ya sea lo configurado para producción o para desarrollo.

app.get("/", (req, res) => {
  res.send("Hola mundo desde Express");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listen on port ${port}...`);
});
