INSTALACIÓN

1. clonar el repositorio
2. ejecutar npm i
3. ejecutar comando npm run dev

TESTS

1. ejecutar comando npm run test

Para ejecutar los sets de test de un fichero concreto

1. ejecutar comando npm run test test/<<nombre-fichero>>

CONSIDERACIONES

El presente código está orientado a montar una API REST muy básica en node + express.

Para poder compartir información entre los diferentes ficheros de routes bajo la carpeta /routes, se han creado variables globales en express de forma que se pueda acceder/modificar desde cualquier punto (práctica desaconsejada pero permitida con fines didácticos)

No se ha tenido en cuenta la realización de validaciones de datos así como uso de un sistema de generación de identificadores fiables u otras características que deberían estar presentes en un proyecto real. Esto se ha codificado así para centrar el tiro en la generacion de una API REST con node + express.

Para más información sobre generación de ids/uuids buscar 'uuid npm' (ej. https://www.npmjs.com/package/uuid)

la dependencia slugify permite generar lo que se conocen como 'slugs'. Dado que el identificador viene de la URL y esta debe ser comprensible y recordable por el usuario que la usa, para acceder a recursos que deben ser compartidos se accederá mediante un slug en lugar de su identificador interno. Ver más información aquí: https://www.ondho.com/que-es-slug-como-crearlo/

Los métodos DELETE /orders y PUT /contacts/:id no existen dado que el diseño de la API así lo prohible. Se podría haber creado 2 test en concreto que verificaran que al llamar a esos métodos devuelve sendos errores 404.

Se ha limitado mediante un middleware configurable el acceso a diferentes métodos pero únicamente en aquellos que haga falta. El middleware permite interceptar la petición, comprobar si es necesario que haya un usuario autenticado (reciba un token) y que el perfil que tiene es uno de los permitidos para dicha acción.

El envío de correos se realiza mediante nodemailer usando emails de prueba generados dinámicamente con un servicio externo. Los emails no son enviados realmente pero pueden ser previsualizados en el terminal una vez se ha ejecutado un envío.

TESTS

Los test creados son orientativos y no aseguran fehacientemente que la aplicación cubre todas las posibilidades que se pueden dar. Los test creados son un happy path en toda regla. Los test hay que tomarlos como una referencia, la medida de seguridad que aportan a que no haya errores en el código y que éste hace lo que debe en todo momento dependerá de lo bien o mal diseñados que estén.

Es recomendable pues guiarse únicamente por éstos y realizar pruebas manuales en caso de no poder guiarte por éstos.

IMPORTANTE: deben existir los siguientes usuarios ya credos al levantar la app para que los test de pedidos funcionen adecuadamente:

constraseña encriptada con MD5: test

[{
  id: 1,
  firstname: 'Juan Manuel',
  lastname: 'Castillo',
  email: 'juanma@test.es',
  password: '098f6bcd4621d373cade4e832627b4f6',
  profile: 'admin',
  enabled: true
},
{
  id: 2,
  firstname: 'Alex',
  lastname: 'Martín',
  email: 'alex@test.es',
  password: '098f6bcd4621d373cade4e832627b4f6',
  profile: 'user',
  enabled: true
}]

MUY RECOMENDABLE aunque no se sepan escribir los test que se entienda a grandes rasgos las comprobaciones que se realizan para entender qué espera éste y poder orientar el desarrollo a que éstos pasen a estar en verde.


para probar con nuevos token de usuario / admin se puede modificar en /test/conf/tokens.js
