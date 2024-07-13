import Joi from "joi";

const users = [
  {
    id: 1,
    nombre: "Marcem55",
  },
  {
    id: 2,
    nombre: "zorrocuatro",
  },
  {
    id: 3,
    nombre: "juli245",
  },
];

const findUserById = (id) => {
  return users.find((user) => user.id.toString() === id);
};

const findUserByName = (nombre) => {
  return users.find((user) => user.nombre === nombre);
};

const validateUser = (nombre) => {
  const userSchema = Joi.object({
    nombre: Joi.string().min(3).max(20).required(),
  });

  return userSchema.validate({ nombre });
};

export { users, findUserById, findUserByName, validateUser };
