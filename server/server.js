const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Node JS Server is running on local: http://localhost:${port}`)
);
