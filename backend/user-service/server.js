

require("dotenv").config();
const app = require("./app");
const eurekaClient = require("./config/eureka-client");

const PORT =  4000;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);

   //Register service with Eureka
  eurekaClient.start((error) => {
    if (error) {
      console.error(" Eureka registration failed:", error);
    } else {
      console.log("User Service registered with Eureka");
    }
  });


});

// Graceful shutdown (important for microservices)
process.on("SIGINT", () => {
  console.log("Shutting down User Service...");
  eurekaClient.stop(() => {
    console.log("Eureka client stopped");
    process.exit();
  });
});



