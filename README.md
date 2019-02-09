# Puppeteer Modular

## Requisitos

* Node Package Manager v3.10.10 o superior (`npm`)
* El proyecto está preparado para correr sobre Node 6, pero se recomienda usar Node 10.

> **Nota**: Se recomienda usar [*Node Version Manager*](https://github.com/creationix/nvm) (`nvm`).

## Instalación

```
$ git clone git@this-repo-url.git
$ cd this-repo-folder
$ npm install
```

* Debemos crear un archivo `.env` en la raíz del proyecto. Dentro definiremos los datos del FTP sobre el que se quieren guardar los resultados (en caso de querer hacerlo). Se proporciona un archivo `.env.dist` con los campos necesarios para definir el archivo.

## Arrancar el monitor

El monitor puede arrancarse utilizando el comando `npm start`, no obstante, tiene varios parámetros de configuración para modificar su comportamiento.
Si necesitas ejecutarlo sobre una versión de node anterior a la 10 utiliza `npm start:node6`.

* **tabs**: Nos permite elegir el número de tabs que queremos que se lancen en el navegador por cada tirada de URLs. El máximo es 9, el número óptimo para no hacer un uso excesivo de la CPU es entre 2 y 4 tabs. Por defecto el valor es 3.
```
npm start -- --tabs=5
```
* **headless**: Nos permite elegir si queremos que se muestre la interfaz gráfica de chromium o no. Por defecto está oculto.
```
npm start -- --headless=false
```
* **modules**: Nos permite definir los módulos que queremos ejecutar, se debe pasar un listado de módulos separados por comas, y sin espacios. Cualquier módulo que pasemos debe existir en la carpeta `./src/modules`, y tener su propia configuración. Se debe utilizar el nombre del módulo para invocarlo.
```
npm start -- --modules=publi,example
```
* **writeModes**: Nos permite definir de que forma queremos que se escriba el fichero, de momento se puede en disco y en FTP. Para definir más de uno se pasa el listado separado por comas y sin espacios. Ejemplo:
```
npm start -- --writeModes=disk,ftp
```
* **enableLogs**: Nos permite activar los logs durante la ejecución. Por defecto están desactivados.
```
npm start -- --enableLogs=true
```

* **help**: Nos muestra los comandos disponibles, y toda la información necesaria de estos.


## Resultados de la ejecución
Una vez termine de ejecutar todo, se escribirá un archivo `latest.json` en la carpeta `./var` o en el ftp que tengamos configurado. La escritura de este fichero depende de como queramos configurarlo.

Este fichero seguirá la siguiente estructura

```
[
  {
    // module name
    "example": [
      {
        "url": "https://www.example.es/",
        "statusCode": 200,
        "statusText": "OK",
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/72.0.3617.0 Safari/537.36",
        "result": {
          // this will be the object defined in module function
        }
      },
      ...
    ],
    ...
  }
]
```
Si ejecutamos más de un módulo, cada uno tendrá sus resultados dentro de su propio array.


## Desarrollo de mi propio módulo

Para crear tu propio módulo debes crear dos archivos, el módulo que se va a ejecutar y su configuración.

##### Módulo

El módulo tiene las siguientes propiedades:

* **name**: El nombre de tu módulo, este nombre será el que encapsule el resultado final.
* **configs**: Importación de la configuración del módulo.
* **dependencies**: Definición de cualquier dato, librería, función, objeto, etc, que puedas necesitar en todas las ejecuciones como una dependencia.
* **onNavigation**: Es la función que se va a ejecutar en el navegador. Una vez se ejecute, debería retornar los datos que hayamos recolectado. En caso de error, deberíamos retornar un objeto con los datos que necesitemos. Si necesitamos usar async/await, debemos declarar el método como `async`.
* **onEnd**: Es la función que se ejecuta sobre el resultado final, es opcional, no hace falta incluirla en el módulo si no se quiere modificar el resultado final. En caso de querer modificar el resultado, se debe retornar el array de respuestas nuevo. Si necesitamos usar async/await, debemos declarar el método como `async`.

Por tanto, la estructura a seguir es la siguiente:

```
module.exports = {
  name: 'example',
  configs: require('./config/example.json'),
  dependencies: {
    key: 'value'
  },
  onNavigation(dependencies, data, device) {
    try {
      // getting dependencie example
      const { key } = dependencies;

      // Your code here

      return {
        // data to return here
      };
    } catch (error) {
      return {
        // error data here
      };
    }
  },
  onEnd(responses) {
    // apply any filter to responses result and return it
  }
};

```

o con async/await

```
module.exports = {
  name: 'example',
  configs: require('./config/example.json'),
  dependencies: {
    key: 'value'
  },
  async onNavigation(dependencies, data, device) {
    try {
      // getting dependencie example
      const { key } = dependencies;

      // Your async code

      return {
        // data to return here
      };
    } catch (error) {
      return {
        // error data here
      };
    }
  },
  async onEnd(responses) {
    // apply any filter to responses result and return it
  }
};

```


##### Configuración del módulo

La configuración debe ser un array de objetos, que sigan la siguiente estructura:

* **url**: La url a la que se va a navegar
* **device**: El tipo de dispositivo que se va a simular (desktop | mobile).
* **data**: Es un objeto que contiene todos los datos que necesites utilizar dentro de la navegación.

El JSON quedaría así

```
[
  {
    "url": "https://www.google.es",
    "device": "desktop",
    "data": {
      example: [1, 2, 3]
    }
  },
  {
    "url": "https://www.google.es",
    "device": "mobile",
    "data": {
      foo: 'bar'
    }
  },
  ...
]
```

Cada objeto corresponde a una navegación diferente.
