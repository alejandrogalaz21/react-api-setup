API :
names :
controllers -> plural
model -> singular

plop -> module -> moduleName = singular

# Docs

### model

the model has to be in singular

### controller

the controller has to be in plural

# middleware

```
  api
    server
      middleware -> middlewares que son parte del servidor globales
  api
    app
      middleware -> middlewares con que interactuan con los modulos
```

## Todos

- [x] mongodb Dockerfile.dev
- [ ] crear carpeta modules
- [ ] Crear gifs para la documentacion
- [ ] checar ttystudio
- [x] export routes like the sagas files / no aplica

## MYSQL

Knex is a SQL query builder, mainly used for Node.js applications with built in model schema creation, table migrations, connection pooling and seeding.

Install Knex and Knex Command Line Tool
Install knex globally on your local computer.

```bash
$ npm install knex -g
```

This will allow us to use knex as a command line tool that helps you create and manage your knex files.

In addition, you will need to also install the knex module locally to use in your project.

```bash
$ npm install knex --save
```

At this point, our project structure should look like this:

```
...
├── knex
│ └── migrations
│ └── seeds
└── knexfile.js
└── package.json
```

Now we can run the below command performing a migration and updating our local database:

```bash
$ knex migrate:latest
```

For more information on migrations and seeds with knex, checkout the knex migrations and seeds guide. [Knex Official Documentation](http://knexjs.org/#Migrations)
