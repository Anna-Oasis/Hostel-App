
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anna Oasis API",
      version: "1.0.0",
      description: "API documentation for Anna Oasis backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
  },
  apis: [
    "./routes/*.js",
    "./models/*.js",
    "./controllers/*.js",
    "./middleware/*.js",
    "./config/*.js",
    "./utils/*.js",
    "./*.js",
  ],
};


export { swaggerOptions };