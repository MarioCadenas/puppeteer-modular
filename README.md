# Advertising Monitor

## Requisitos

* Node Package Manager v3.10.10 o superior (`npm`)

> **Nota**: Se recomienda usar [*Node Version Manager*](https://github.com/creationix/nvm) (`nvm`).

## Instalación

```
$ git clone git@this-repo-url.git
$ cd this-repo-folder
$ npm install
```

### Configuración

En la carpeta /server/modules se pueden crear modulos que ejecuten el código deseado.

Cada módulo debe llevar un archivo de configuración en la carpeta /server/modules/config

Un nuevo módulo debe seguir la estructura del `exampleModule.js`.

Se puede pasar como parámetro el nombre del módulo o módulos que queremos ejecutar.

### Arrancar

```
$ npm start
```

O si queremos elegir módulos

```
$ npm start -- --modules=myModule,mySecondModule
```

Si queremos abrir la interfaz del navegador

```
$ npm start -- --headless=false
```

### Análisis

Una vez termine la ejecución, se creará un archivo en la carpeta server/results con el archivo `response.json` que contendrá el resultado de la ejecución de los módulos ejecutados.
