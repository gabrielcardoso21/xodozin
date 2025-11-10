import express from "express";
import { Medusa } from "@medusajs/medusa";
import { configLoader } from "@medusajs/medusa/dist/loaders/config";
import medusaConfig from "../medusa-config";

const start = async () => {
  const app = express();
  const { configModule } = await configLoader(medusaConfig);
  const medusa = await Medusa(configModule);

  await medusa.start();

  app.use("/", medusa.app);

  const port = process.env.PORT || 9000;
  app.listen(port, () => {
    console.log(`Medusa server is running on port ${port}`);
  });
};

start();

