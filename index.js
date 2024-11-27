require("dotenv").config();
const app = require('./app');
const db_connection = require("./configs/db");
const port  = process.env.PORT || 3000;


// db connection
db_connection(process.env.MONGO_URI)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});