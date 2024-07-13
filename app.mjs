import express from "express";
import "dotenv/config";
import {
  users,
  findUserById,
  findUserByName,
  validateUser,
} from "./helpers.mjs";
// import { logger, auth } from "./middlewares.mjs";
import morgan from "morgan";
import config from "config";
import debug from "debug";
const initDebug = debug("app:inicio");

const app = express();
//* Middleware para parsear el body
app.use(express.json());

//* Middleware para url querystrings
app.use(express.urlencoded({ extended: true }));

//* Middleware para accceder a archivos estáticos como .txt, .pdf., imagenes
app.use(express.static("public"));

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

// * -----------------GET-------------------

app.get("/", (req, res) => {
  res.send("Hola mundo desde Express");
});

app.get("/api/users", (req, res) => {
  console.log("Enviando users...");
  res.send(users);
});

// app.get("/api/users/:year/:month", (req, res) => {
//   res.send(req.params);
// });

app.get("/api/users/:year/:month", (req, res) => {
  res.send(req.query);
});

app.get("/api/users/:id", (req, res) => {
  let user = findUserById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res
      .status(404)
      .send("No se encontró ningún usuario con el id " + req.params.id);
  }
});

// * --------------POST-------------

app.post("/api/users", (req, res) => {
  if (typeof req.body.nombre === "undefined") {
    res.status(400).send('Falta el parámetro "nombre"');
    return;
  } else if (typeof req.body.nombre === "object") {
    const newUsers = [];
    const existingUsers = [];
    const failedUsers = [];
    req.body.nombre.forEach((nombre) => {
      const { error, value } = validateUser(nombre);
      //   console.log({ error, value });
      const existingUser = findUserByName(nombre);
      if (existingUser) {
        existingUsers.push(existingUser);
        return;
        // res.status(400).send("Ya existe un usuario con el nombre " + nombre);
        // return;
      }
      if (!error) {
        const user = {
          id: Math.floor(Math.random() * 1000000 + 1),
          nombre: value.nombre,
        };
        newUsers.push(user);
        // users.push(user);
        // res.send({ message: "User created succesfully", user });
      } else {
        failedUsers.push(error);
        return;
        // res.status(400).send(error.details[0].message);
      }
    });
    if (newUsers.length) users.push(...newUsers);
    res.send({
      newUsers,
      existingUsers,
      failedUsers,
    });
  } else {
    const { error, value } = validateUser(req.body.nombre);
    //   console.log({ error, value });
    const existingUser = findUserByName(req.body.nombre);
    if (existingUser) {
      res
        .status(400)
        .send("Ya existe un usuario con el nombre " + req.body.nombre);
      return;
    }
    if (!error) {
      const user = {
        id: users[users.length - 1].id + 1,
        nombre: value.nombre,
      };
      users.push(user);
      res.send({ message: "User created succesfully", user });
    } else {
      res.status(400).send(error.details[0].message);
    }
    // 	if (!req.body.nombre) {
    // 		res.status(400).send('Falta el parámetro "nombre"');
    // 		return;
    // 	}
    // 	const user = {
    // 		id: users.length + 1,
    // 		nombre: req.body.nombre,
    // 	};
    // 	users.push(user);
    // 	res.send(user);
    // };

    // if (!req.body.nombre) {
    //   res.status(400).send('Falta el parámetro "nombre"');
    //   return;
    // }
    // const user = {
    //   id: users.length + 1,
    //   nombre: req.body.nombre,
    // };
    // users.push(user);
    // res.send(user);
  }
});

// * -----------------PUT-------------------

app.put("/api/users/:id", (req, res) => {
  // Encontrar si existe el user con el id recibido
  let user = findUserById(req.params.id);
  if (!user) {
    res
      .status(404)
      .send("No se encontró ningún usuario con el id " + req.params.id);
    return;
  }

  const { error, value } = validateUser(req.body.nombre);
  //   console.log({ error, value });
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let prevUser = { ...user };
  user.nombre = value.nombre;
  res.send({
    message: "User changed succesfully",
    prevUser,
    updatedUser: user,
  });
});

// * -----------------DELETE-------------------

app.delete("/api/users/:id", (req, res) => {
  let user = findUserById(req.params.id);
  if (!user) {
    res
      .status(404)
      .send("No se encontró ningún usuario con el id " + req.params.id);
    return;
  }

  let userIndex = users.indexOf(user);
  users.splice(userIndex, 1);
  res.send({
    message: "User deleted succesfully",
    deletedUser: user,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listen on port ${port}...`);
});
