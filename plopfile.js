const config = plop => {
  // module generator
  plop.setGenerator('module', {
    description: 'application module logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'module name please'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'api/app/{{camelCase name}}s/{{camelCase name}}s.controller.js',
        templateFile: 'plop/plop-templates/controller.hbs',
        skipIfExists: true
      },
      {
        type: 'add',
        path: 'api/app/{{camelCase name}}s/{{camelCase name}}.js',
        templateFile: 'plop/plop-templates/model.hbs',
        skipIfExists: true
      },
      // Append api controller
      {
        // Action type 'append' injects a template into an existing file
        type: 'append',
        path: 'api/app/routes.js',
        // Pattern tells plop where in the file to inject the template
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import { {{camelCase name}}s } from './{{camelCase name}}s/{{camelCase name}}s.controller.js'`
      },
      // Append api name controller in to the array
      {
        type: 'append',
        path: 'api/app/routes.js',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{camelCase name}}s,`
      },

      // Add Redux
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{camelCase name}}.redux.js',
        templateFile: 'plop/plop-templates/redux.hbs',
        skipIfExists: true
      },
      // Append Reducer
      {
        // Action type 'append' injects a template into an existing file
        type: 'append',
        path: 'client/src/redux/reducers/index.js',
        // Pattern tells plop where in the file to inject the template
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import { {{camelCase name}}s } from './../../modules/{{pascalCase name}}/{{camelCase name}}.redux'`
      },
      {
        type: 'append',
        path: 'client/src/redux/reducers/index.js',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{camelCase name}}s,`
      },
      // Add Saga
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{camelCase name}}.saga.js',
        templateFile: 'plop/plop-templates/saga.hbs',
        skipIfExists: true
      },
      // Export Saga
      {
        type: 'append',
        path: 'client/src/redux/sagas/index.js',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `export { {{camelCase name}}sSagas } from './../../modules/{{pascalCase name}}/{{camelCase name}}.saga'`
      },
      // Add Component Table
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{pascalCase name}}Table.js',
        templateFile: 'plop/plop-templates/component-table.hbs',
        skipIfExists: true
      },
      // Add Form Component
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{pascalCase name}}Form.js',
        templateFile: 'plop/plop-templates/form-component.hbs',
        skipIfExists: true
      },
      // Add Component
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{pascalCase name}}.js',
        templateFile: 'plop/plop-templates/component.hbs',
        skipIfExists: true
      },
      // Add Component's
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{pascalCase name}}s.js',
        templateFile: 'plop/plop-templates/components.hbs',
        skipIfExists: true
      },
      // Add Component Update
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/{{pascalCase name}}Update.js',
        templateFile: 'plop/plop-templates/components.hbs',
        skipIfExists: true
      },
      // Add Module Component's
      {
        type: 'add',
        path: 'client/src/modules/{{pascalCase name}}/index.js',
        templateFile: 'plop/plop-templates/react-module.hbs',
        skipIfExists: true
      },
      // Append Components Router
      {
        // Action type 'append' injects a template into an existing file
        type: 'append',
        path: 'client/src/router/routes.js',
        // Pattern tells plop where in the file to inject the template
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import { {{pascalCase name}}, {{pascalCase name}}s, {{pascalCase name}}Update } from './modules/{{pascalCase name}}'`
      },
      {
        type: 'append',
        path: 'client/src/modules/Router/routes.js',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{ path: '/{{camelCase name}}s', component: {{pascalCase name}}s },
        \t{ path: '/{{camelCase name}}s/:id', component: {{pascalCase name}} },
        \t{ path: '/{{camelCase name}}s/update/:id', component: {{pascalCase name}}Update },`
      }
    ]
  })
}

module.exports = config
