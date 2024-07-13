import express from "express";
import {
  users,
  findUserById,
  findUserByName,
  validateUser,
} from "../helpers.mjs";

const usersRoutes = express.Router();

// * -----------------GET-------------------

usersRoutes.get("/", (req, res) => {
  res.send(users);
});

// usersRoutes.get("/api/users/:year/:month", (req, res) => {
//   res.send(req.params);
// });

usersRoutes.get("/:year/:month", (req, res) => {
  res.send(req.query);
});

usersRoutes.get("/:id", (req, res) => {
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

usersRoutes.post("/", (req, res) => {
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

usersRoutes.put("/:id", (req, res) => {
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

usersRoutes.delete("/:id", (req, res) => {
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

export { usersRoutes };
