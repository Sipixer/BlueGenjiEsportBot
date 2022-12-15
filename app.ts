import { SetListener, StartClient } from "./client";
import { UpdateCommand } from "./utils/Register";

export const config = require("./config.json");
(async () => {
  //await UpdateCommand();
  console.log("Start Client.");
  StartClient();
  console.log("SetListener");
  SetListener();
})();
