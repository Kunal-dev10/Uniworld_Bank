/* const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const bankRoutes = require("./routes/bank");
app.use("/api", bankRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const bankRoutes = require("./routes/bank");
const userRoutes = require("./routes/user"); // ✅ Import your user.js route

// Use routes
app.use("/api", bankRoutes);
app.use("/api/user", userRoutes); // ✅ All user APIs will start with /api/user

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
