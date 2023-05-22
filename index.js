require('dotenv').config();
const hapi = require("@hapi/hapi");
const userRoutes = require('./user/routes/user.routes')

const routes1 = [
  {
    method: "GET",
    path: "/",
    handler: (req, h) => {
      return "<h1>Welcome to Suara Kita API</h1>";
    },
  },
  {
    method: "*",
    path: "/{any*}",
    handler: (request, h) => {
      return "Halaman tidak ditemukan";
    },
  },
];

const init = async () => {
  const server = hapi.server({
    port: 8090,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(userRoutes)
  server.route(routes1);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
