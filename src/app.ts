import express from "express";
import loaders from "./loaders";

export const app = express();

export async function initializeApp() {
  await loaders({ expressApp: app });
}
