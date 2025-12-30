"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../utils/db";

const KEY: string = process.env.JWT_KEY || "";

export async function loginAction(username: string, password: string) {
  if (!username || !password) {
    return {
      success: false,
      error: "Request missing username or password",
    };
  }

  const snapshot = await db.collection("users").get();
  const users: { username: string; password: string }[] = [];
  snapshot.forEach((doc) => {
    users.push({
      username: doc.data().username,
      password: doc.data().password,
    });
  });

  const user = users.find((data) => data.username === username);
  if (!user) {
    return { success: false, error: "User Not Found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: "Password incorrect" };
  }

  try {
    const token = jwt.sign({ username: user.username }, KEY, {
      expiresIn: 31556926,
    });
    return { success: true, username: user.username, token: `Bearer ${token}` };
  } catch (error: any) {
    return {
      success: false,
      error: "Error creating token: " + (error?.message || "unknown"),
    };
  }
}
