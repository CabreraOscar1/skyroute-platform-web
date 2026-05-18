# Decisiones de desarrollo frontend - SkyRoute

Documento de apoyo para explicar las decisiones tecnicas del frontend durante una entrevista.

## Resumen ejecutivo

El frontend se construyo como una SPA en Angular, manteniendo una arquitectura simple y explicable. La decision principal fue separar el codigo por responsabilidades: `core` para comunicacion con la API y modelos compartidos, `features` para funcionalidades de negocio, y `app` como shell de routing.

El objetivo no fue agregar capas por formalidad, sino dejar una base facil de leer, testear y extender. Para el alcance del challenge, Angular standalone components, Reactive Forms, Signals y un servicio HTTP centralizado son suficientes.

## Estructura elegida

La estructura actual es:

```text
src/app/
  core/
    api/
    config/
  features/
    flight-search/
      pages/
      components/
    booking/
      components/
  shared/
```

La carpeta `core` contiene piezas transversales de la aplicacion. En este caso, el servicio `SkyrouteApiService`, los modelos TypeScript de request/response y la configuracion de la URL base del backend.

La carpeta `features` agrupa codigo por funcionalidad de negocio. `flight-search` contiene la pantalla de busqueda, el formulario y el listado de ofertas. `booking` contiene el panel de confirmacion de reserva.

La carpeta `shared` queda reservada para componentes, pipes o utilidades realmente reutilizables. No se lleno por adelantado para evitar abstracciones innecesarias.

## Relacion con Clean Architecture

En frontend no se replica Clean Architecture de backend de forma literal, pero si se aplican sus ideas principales: separacion de responsabilidades, bajo acoplamiento y dependencia hacia contratos claros.

La capa de presentacion esta compuesta por componentes visuales pequenos, como `FlightSearchForm`, `FlightResultsList`, `FlightOfferCard` y `BookingPanel`.

La coordinacion del caso de uso ocurre en `FlightSearchPage`, que actua como contenedor de la pantalla. Este componente maneja estado local, coordina llamadas al backend y conecta los componentes hijos.

La comunicacion externa queda aislada en `SkyrouteApiService`. Los componentes no construyen URLs ni conocen detalles de endpoints. Esto permite cambiar la API sin tocar toda la UI.

## Separacion de capas

La division practica queda asi:

- `app`: inicializacion de la aplicacion, routing y shell general.
- `core/api`: integracion HTTP y modelos compartidos.
- `core/config`: configuracion tecnica, como `API_BASE_URL`.
- `features/flight-search`: flujo de busqueda de vuelos.
- `features/booking`: flujo de confirmacion de reserva.
- `shared`: piezas reutilizables futuras.

Esta separacion hace que el proyecto sea facil de recorrer. Si alguien quiere entender la busqueda, entra a `features/flight-search`. Si quiere ver los contratos con backend, entra a `core/api`.

## Aplicacion de SOLID

SRP, Single Responsibility Principle: cada componente tiene una responsabilidad concreta. El formulario captura criterios de busqueda, la lista muestra resultados, la card muestra una oferta y el panel de booking confirma la reserva.

OCP, Open Closed Principle: se puede agregar una nueva funcionalidad, como filtros o sorting, agregando componentes o servicios del feature sin modificar el servicio HTTP base ni el shell de la app.

DIP, Dependency Inversion Principle: la pagina no instancia directamente `HttpClient`. Depende de `SkyrouteApiService`, que se inyecta mediante Angular DI. Esto facilita testear y reemplazar la integracion si cambia la API.

ISP, Interface Segregation Principle: los componentes reciben solo los datos que necesitan mediante `input()` y comunican acciones concretas mediante `output()`. No dependen de objetos globales grandes.

## Estado y manejo de datos

Se eligieron Angular Signals para manejar estado local de la pantalla: aeropuertos, ofertas, oferta seleccionada, reserva, errores y flags de carga.

Esta decision mantiene el codigo directo y moderno. Para el alcance actual no se necesita NgRx ni un store global, porque el flujo es lineal y vive en una pantalla principal.

Si el producto creciera, el siguiente paso razonable seria mover la orquestacion a un servicio de estado propio del feature, por ejemplo `FlightSearchStore` o `FlightSearchFacade`. No se agrego ahora porque seria complejidad prematura.

## Formularios y validacion

Se eligio Reactive Forms porque permite formularios tipados, validaciones declarativas y tests mas simples.

El frontend valida lo basico para mejorar la experiencia de usuario: campos requeridos, cantidad de pasajeros, email, documento y que origen/destino no sean iguales.

El backend sigue siendo la fuente de verdad. La validacion del frontend no reemplaza las reglas del servidor; solo evita errores obvios antes de enviar la request.

## Comunicacion con la API

Todas las llamadas HTTP pasan por `SkyrouteApiService`.

Metodos actuales:

- `getAirports()`
- `searchFlights(request)`
- `confirmBooking(request)`

Esta decision reduce duplicacion, centraliza los endpoints y deja los componentes enfocados en UI y flujo de usuario.

Los modelos TypeScript estan en `skyroute-api.models.ts`. Esto mejora la estabilidad porque el contrato entre frontend y backend queda explicito.

## Versioning de API

Actualmente el backend expone rutas como `/api/airports`, `/api/flights/search` y `/api/bookings`.

El frontend ya esta preparado para absorber un cambio futuro a versionado, por ejemplo `/api/v1/flights/search`, porque las URLs estan centralizadas en un solo servicio y la base URL esta aislada en `api.config.ts`.

Si el proyecto creciera, una mejora natural seria mover `API_BASE_URL` a environments de Angular o a configuracion por ambiente.

## Idempotencia

En el frontend se evita el doble submit deshabilitando botones durante estados de carga. Esto reduce el riesgo de confirmar dos reservas por accidente.

La reserva es una operacion no idempotente desde el punto de vista de negocio, porque crear una booking puede tener efectos reales. Por eso el frontend bloquea reenvios mientras espera respuesta.

Si el challenge exigiera idempotencia completa, el siguiente paso seria enviar un `Idempotency-Key` por cada intento de booking y hacer que el backend lo procese.

## Pagination, filtering y sorting

Para el alcance actual, el backend devuelve una cantidad pequena de ofertas. Por eso no se implemento paginacion todavia.

La recomendacion para evolucionar seria:

- Sorting local cuando se ordenan los resultados ya obtenidos.
- Filtering local para filtros simples sobre la busqueda actual.
- Pagination server side si el volumen de resultados crece.

Esto evita llamadas innecesarias al backend y mantiene una experiencia rapida.

## Testabilidad

La estructura facilita tests porque las piezas estan separadas.

Se puede testear `FlightSearchForm` sin backend, validando el formulario y el evento `search`.

Se puede testear `BookingPanel` verificando que emita `confirmed` solo cuando el formulario es valido y existe una oferta seleccionada.

Se puede testear `FlightSearchPage` mockeando `SkyrouteApiService`, sin hacer llamadas HTTP reales.

La app ya compila y los tests base pasan con `npm run build` y `npm test -- --watch=false`.

## Reuso sin sobreingenieria

El reuso se aplico donde aporta valor:

- `FlightOfferCard` encapsula la visualizacion de una oferta.
- `FlightResultsList` encapsula la lista y estados vacios/carga.
- `BookingPanel` encapsula el formulario y resumen de booking.
- `SkyrouteApiService` encapsula el acceso HTTP.

No se creo una libreria compartida ni componentes genericos antes de necesitarlos. Esa decision mantiene el codigo mas simple de explicar.

## Estabilidad

El frontend queda estable por varias decisiones:

- Tipado estricto con interfaces TypeScript.
- Formularios reactivos con validaciones.
- Manejo explicito de loading, error, empty y success states.
- Servicio API centralizado.
- Componentes pequenos y faciles de probar.
- Build de produccion validado.

## Decisiones que se pueden defender en entrevista

Se puede explicar asi:

> Use una estructura por features porque el dominio se entiende mejor desde los flujos de negocio: busqueda de vuelos y reserva. `core` queda para infraestructura compartida, especialmente API y configuracion. Evite agregar un store global porque el estado actual es local y lineal. Si el flujo crece, la arquitectura permite mover esa logica a un servicio de estado del feature sin reescribir la UI.

Tambien:

> La UI no llama directamente a `HttpClient`; lo hace a traves de `SkyrouteApiService`. Esto mejora testabilidad, reduce acoplamiento y concentra los cambios si el contrato del backend evoluciona.

Y:

> Use Reactive Forms para validaciones porque el flujo depende de datos de usuario y conviene tener reglas claras, testeables y faciles de extender.

## Posibles mejoras futuras

- Agregar sorting local por precio, duracion y horario de salida.
- Mover `API_BASE_URL` a environments.
- Agregar interceptor para errores HTTP comunes.
- Agregar interceptor para headers futuros, como version o idempotency key.
- Agregar tests unitarios de formularios y pagina principal.
- Separar modelos API y view models si el contrato del backend deja de coincidir con lo que necesita la UI.
- Agregar una pagina de confirmacion dedicada si booking crece.

## Respuesta corta para entrevista

La decision principal fue priorizar claridad y escalabilidad progresiva. El frontend esta separado por features, usa `core` para integraciones compartidas, mantiene componentes chicos y usa un servicio central para hablar con la API. No agregue estado global porque no habia necesidad real; preferi Signals y estado local para mantener el flujo facil de leer. Si el producto crece, la estructura permite sumar servicios de estado, interceptors, environments y mas features sin romper lo existente.
