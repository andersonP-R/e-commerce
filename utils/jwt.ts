import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla de JWT - revisar variables de entorno");
  }

  return jwt.sign(
    // payload: donde le devolvemos al front datos del usario en db. NO PONER INFO SENSIBLE (PASSWORDS, TARJETAS DE CREDITO, ETC)
    { _id, email },
    // seed: nuestra variable o firma secreta
    process.env.JWT_SECRET_SEED,
    // opciones: adicionales como por ejemplo, fecha de expiración del token, etc
    { expiresIn: "30d" }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla de JWT - revisar variables de entorno");
  }

  if (token.length <= 10) {
    return Promise.reject("JWT no válido");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) return reject("JWT no válido");

        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject("JWT no válido");
    }
  });
};
