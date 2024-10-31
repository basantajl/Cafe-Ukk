//import
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;

const app = express();
app.use(cors());

const user = require("./routes/user");
const auth = require("./routes/auth");
const meja = require("./routes/meja");
const menu = require("./routes/menu");
const transaksi = require("./routes/transaksi");

app.use("/user", user);
app.use("/auth", auth);
app.use("/meja", meja);
app.use("/menu", menu);
app.use("/transaksi", transaksi);

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
