const contacts = require("./contacts.json");

const first2000 = contacts.slice(0, 2000);

const fs = require("fs");
fs.writeFileSync("./head.json", JSON.stringify(first2000, null, 2), {
  encoding: "utf-8",
});
