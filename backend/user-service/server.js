

require("dotenv").config();
const app = require("./app");


const PORT =  4000;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);

});





