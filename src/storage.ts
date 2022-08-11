import React from "react";
import localforage from "localforage";

export const storage = localforage.createInstance({
  name: "dallezoom",
});
