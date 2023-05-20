require('dotenv').config();
const hapi = require("@hapi/hapi");
const userRoutes = require('./user/routes/user.routes')

const init = async () => {
  const server = hapi.server({
    port: 8090,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(userRoutes)

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
