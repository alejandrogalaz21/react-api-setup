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
      }
    ]
  })
}

module.exports = config
