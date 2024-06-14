import {Elysia} from "elysia";
import "reflect-metadata";
import {cors} from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import errorMiddleware from "./middleware/errorMiddleware";
import responseMiddleware from "./middleware/responseMiddleware";
import {binancePlugin} from "./module";

const app = new Elysia();
//open cors
app.use(cors());
//setup swagger
app.use(swagger({
  path: '/api/docs',
  documentation: {
    info: {
      title: 'ElysiaJS',
      description: 'ElysiaJS API Documentation',
      version: '1.0.0',
    },
  },

  swaggerOptions: {
    persistAuthorization: true
  }
}));
//hello endpoint
app.get('/', () => {
  return {
    message: "Bun web server with ElysiaJS"
  }
});

app
  .onAfterHandle(responseMiddleware)
  .onError(errorMiddleware)
  .group("/api", (group) =>
        group
            .use(binancePlugin)
        //add more plugins here
  )

// @ts-ignore
app.listen(Bun.env.PORT || 3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
