module.exports = {
  development: {
    // client: process.env.DB_CLIENT,
    // connection: {
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   database: process.env.DB_NAME,
    // },
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "suarakita",
    },
    debug: true,
  },
};
