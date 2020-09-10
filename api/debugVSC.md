# Configuracion DEBUG BaBel

Este snipet de codigo sirve para poder configurar el modo de debug para el servidor usando babel-node

## Nota: Ejecutar VScode en una ventana separada .

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}\\src\\server.js",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/babel-node",
      "console": "internalConsole",
      "runtimeArgs": ["--nolazy"],
      "sourceMaps": true
    }
  ]
}


```

# Author

- **Alejandro Galaz** - _My work_ - [Github](https://github.com/alejandrogalaz21) , [GitLab](https://gitlab.com/alejandrogalaz21)

See also my live projects on [codesanbox.io](https://codesandbox.io/alejandrogalaz21) and [codepen](https://codepen.io/alejandrogalaz21) who participated in this project.
