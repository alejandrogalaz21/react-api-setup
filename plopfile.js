module.exports = function (plop) {
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
  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'dir',
        message: 'what dir please ?'
      },
      {
        type: 'input',
        name: 'name',
        message: 'controller name please'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'api/app/{{dir}}/{{camelCase name}}.controller.js',
        templateFile: 'plop/plop-templates/controller.hbs',
        skipIfExists: true
      }
    ]
  })
  // model
  plop.setGenerator('model', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'dir',
        message: 'what dir please ?'
      },
      {
        type: 'input',
        name: 'name',
        message: 'model name please'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'api/app/{{dir}}/{{camelCase name}}.js',
        templateFile: 'plop/plop-templates/model.hbs',
        skipIfExists: true
      }
    ]
  })
}
