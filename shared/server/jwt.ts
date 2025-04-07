import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const sign = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const verify = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (e) {
    return null;
  }
};
