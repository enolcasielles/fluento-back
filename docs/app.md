## Pantallas App

### Onboarding

#### Descripción
Muestra un Slider con varios Slides explicando como funciona la App. Se muestra la primera vez que entras a la App y nunca más. Cada Slide contiene una imagen, un texto y un botón de ir a la siguiente.

#### Posibles acciones
- Navegar entre slides usando los botones de siguiente
- En el último slide, pulsar el botón para ir a la pantalla de Registro

### Login

#### Descripción
Permite al usuario identificarse en la aplicación. Muestra un formulario en el que se le pide email y contraseña. Los campos contendrán validaciones de que el formato es correcto, mostrando un estado de error en caso contrario. Cuando se dispare la acción, se utilizará la librería de Supabase para realizar el inicio de sesión contra el Auth de Supabase, gestionando los potenciales errores correctamente.

#### Posibles acciones
- Iniciar sesión (botón solo activo cuando los campos tienen valor)
- Ir a pantalla de Registro mediante link
- Ir a pantalla de Recuperar contraseña mediante link

### Registro

#### Descripción
Permite al usuario crear una cuenta en la plataforma. Contará con un formulario con los siguientes campos:
- Nombre
- Email
- Contraseña
- Repite contraseña
- Acepta los términos y condiciones

Los campos contendrán validaciones, mostrando un estado de error en caso contrario. Estas validaciones se iniciarán cuando se pulse el botón de "Crear Cuenta".

#### Posibles acciones
- Crear cuenta (botón solo activo cuando todos los campos están informados)
- Ir a pantalla de Login mediante link

### Recuperar contraseña

#### Descripción
Contendrá un formulario con un único campo email. Se realizará validaciones de que el campo contiene un formato correcto. Cuando se dispare la acción, se usará el Auth de Supabase para ejecutar un reseteo de contraseña en dicho usuario.

#### Posibles acciones
- Resetear contraseña (botón solo activo cuando el campo tiene valor)
- Confirmar recepción del email de reset mediante modal

### Explora

#### Descripción
Esta sección mostrará las listas creadas por la plataforma, separadas en categorías. Al cargar la pantalla, se deberá hacer una llamada al endpoint "Get Explore", que devolverá las diferentes categorías y las listas en cada una de ellas.

#### Posibles acciones
- Pulsar sobre una lista para ir a su pantalla de detalle

### Listas Guardadas

#### Descripción
Esta sección mostrará las listas que el usuario ha guardado. Al cargar la pantalla, se hará una llamada al endpoint "Get Saved Lists", que devolverá dicho listado de Listas. Debe contemplar un estado de No Listas, cuando obtenga un array vacío, mostrando un texto indicativo y un botón para ir a Explora.

#### Posibles acciones
- Pulsar sobre una lista para ir a su pantalla de detalle
- Pulsar sobre el botón Volver a Explora cuando no hay listas

### Mis listas

#### Condiciones de acceso
Solo será accesible para usuarios Premium. Si entra un usuario Free en esta pantalla, se le mostrará un modal indicando que necesita ser Premium.

#### Descripción
Esta sección mostrará las listas creadas por el usuario. Al cargar la pantalla, se hará una llamada al endpoint "Get My Lists". Cada Lista debe ser un elemento clicable que lleve a "Detalle de Lista". Cada elemento mostrará su estado de creación (IN_PROGRESS, COMPLETED o FAILED) con los iconos correspondientes.

#### Posibles acciones
- Pulsar sobre una lista para ir a su pantalla de detalle
- Pulsar sobre el botón de "Crear nueva lista" para ir a la pantalla de creación




### Detalle Lista

#### Descripción
Esta sección mostrará la información más detallada de una lista dada. Al cargar la pantalla se hará una llamada al endpoint “Get List Detail”, el cual devolverá toda la información que se debe renderizar en pantalla. EL objetivo de esta pantalla es renderizar dicha información en una forma clara e intuitiva para el usuario. Además de los detalles específicos de la lista, el endpoint también devolverá si es una lista que el usuario tiene guardada o no y si es una lista que el usuario ya ha practicado en ella o no. 

Esta pantalla debe mostrar la siguiente información de una forma clara e intuitiva:
- Nombre de la lista
- Imágen de la lista
- Estado de creación de la lista (IN_PROGRESS, COMPLETED, FAILED)
- Si el estado de creación es FAILED, se debe mostrar un botón que dispare un modal en el que se le pida disculpas al usuario y se le habiliten 2 acciones: intentar la creación de nuevo y/o contactar con el soporte. Reintentar la creación debe llamar al endpoint “Retry Create List”. Contactar con soporte debe abrir un email con el asunto "Error al crear lista" y el cuerpo del email debe contener toda la información de la lista.
- Descripción de la lista
- Dificultad de la lista
- Temática de la lista
- Estructuras gramaticales de la lista
- Número de unidades que contiene la lista
- Resultados del usuario en la lista (solo visible si el usuario tiene una sesión de práctica en la lista). Esta sección debe mostrar:
  - Total de unidades de la lista
  - Unidades practicadas al menos una vez
  - Unidades superadas
  - Puntuación media obtenida
  
#### Posibles acciones
- Guardar y practicar esa lista. Si era una lista que el usuario no tiene guardada, mostramos un botón principal inferior "Guardar y practicar", que primero disparará el endpoint “Save List” para guardar esa lista en el usuario y luego redirigirá a la pantalla de Practica Lista. 
- Practicar esa lista. Si era una lista que el usuario ya tenía guardada, el botón será "Practicar", que redirigirá a la pantalla de Practica Lista.
- Guardar lista. Si el usuario no tiene la lista guardada, en la parte superior derecha, un botón para guardar la lista. Disparará el endpoint “Save List” para guardar esa lista en el usuario.
- Eliminar lista. Si el usuario tiene la lista guardada, en la parte superior derecha, un botón para eliminar la lista. Disparará el endpoint “Delete Saved List” para eliminar la lista del usuario.

### Crear nueva lista

#### Descripción
Esta sección permitirá al usuario crear una nueva lista. Para ello, se le mostrará un formulario con los siguientes campos:

- Nombre (obligatorio)
- Temática (opcional)
- Nivel de dificultad (cualquiera, principiante, intermedio, avanzado)
- Estructuras gramaticales (opcional)

El formulario contendrá validaciones de que los campos obligatorios están informados. El usuario debe introducir los datos en el formulario y, al pulsar el botón de “Crear lista”, se debe hacer una llamada al endpoint “Create List”, que creará la lista y la devolverá. En caso de éxito, redirigimos al usuario a la pantalla “Mis Listas” donde podrá ver la lista creada. En caso de error, mostramos un modal con el mensaje de error.

#### Posibles acciones
- Crear lista (botón solo activo cuando todos los campos están informados)


### Practica Lista

#### Descripción
Esta sección será en la que el usuario practicará una lista específica. Cuando se cargue la pantalla, se hará una llamada al endpoint “Get List Session”, que nos devolverá la información necesaria para arrancar esta pantalla. EL objetivo aquí es que el usuario itere sobre las unidades de la lista. La llamada al "Get List Session", además de información específica de la lista que debemos mostrar, nos devolverá `nextUnit`, un objeto con la primera unidad sobre la que debemos de iterar. La iteración consistirá en pasar por una serie de estados en dicha unidad.

1. Estado QUESTION: Primero mostraremos en pantalla la frase en español (campo `question.text`). Y, paralelamente, reproduciremos el audio contenido en question.audio, como un fichero remoto en mp3. Debemos detectar el fin del audio para pasar al siguiente estado: LISTENING. Haremos este cambio de estado 700ms después de que finalice el audio.

2. Estado LISTENING. En este estado mostraremos en pantalla un icono animado que indique que se está recogiendo audio, junto con un texto que diga algo como “Es tu turno, traduce la frase”. Además, en este estado activaremos el micrófono para recoger el audio del usuario. Mantendremos este estado durante los milisegundos indicados en el campo `responseTime`. Cuando pase dicho tiempo, cortaremos el micrófono y guardaremos el audio en un fichero temporal. Y pasamos al estado ANSWER.

3. Estado ANSWER. Cuando se adquiera este estado, mostraremos en pantalla la frase en inglés (campo `answer.text`). Haremos una llamada al endpoint “Evaluate Answer”, al que le tendremos que pasar el audio resultado del paso anterior. Mostraremos un elemento en pantalla que indique al usuario que la respuesta está siendo evaluada, que lo mantendremos hasta que finalice dicha llamada y tengamos la evaluación. Paralelamente a todo esto, reproduciremos el audio de la frase en inglés, que estará contenido en un fichero mp3 remoto con url en el campo `answer.audio`. Cuando finalice tanto la evaluación como la reproducción del audio (esta última con un margen de 700ms), pasaremos al estado RESULT.

4. Estado RESULT. En este estado haremos 2 cosas en base a la respuesta de la evaluación obtenida en el paso anterior. Esta respuesta será un objeto con un campo `score`, que puede tener un valor de 1, 2 o 3. Dependiendo del valor haremos 2 cosas. Por un lado, reproducir un audio con un sonido de un fichero local que tendremos y referido al valor de score. Por ejemplo: para el score 2, reproducimos el fichero que está en `assets/audios/result-feedback-2.mp3`. Por otro lado, mostrar un texto en pantalla que indique al usuario el resultado obtenido, también en función de dicho valor. Esperamos 500ms.  Paralelamente, también hacemos una llamada al endpoint “Submit Result”, al que le enviaremos el score obtenido. Esta llamada nos devolverá un nuevo objeto `nextUnit`, que utilizaremos para la siguiente iteración. Cuando tanto esta llamada como la espera de 500ms haya finalizado, nos movemos de nuevo al estado inicial QUESTION, para arrancar de nuevo con la siguiente unidad.

Esta pantalla debe contener en todo momento un botón visible “Salir”, el cual debe mostrar un modal de cofirmación y permitir al usuario volver a la pantalla “Detalle Lista”.

#### Posibles acciones
- Practicar. Iterar por cada unidad como se explica en la descripción.
- Salir. Pulsar sobre el botón "Salir" para volver a la pantalla "Detalle Lista".




## Funcionalidad Extra

### Gestión de errores
Se debe implementar un mecanismo que nos permita fácilmente gestionar los errores en la aplicación. Cuando cualquier pantalla obtenga un error obteniendo datos (o por la razón que sea), debería poder llamar a un hook `showError` pasándole un objeto Error que haga que se muestre en pantalla un modal que muestre el mensaje de error contenido en Error.

### Navegación en pestañas
Las pantallas Explora, Mis Listas Guardadas y Mis Listas tendrán una navegación en pestañas inferiores, Explora a la izquierda, Mis Listas Guardadas en el centro y Mis Listas a la derecha.

### Usuario Free vs Usuario Premium
La aplicación debe funcionar con 2 tipos de usuarios: Free y Premium. La principal diferencia entre ambos es que los usuarios Free no pueden crear listas propias, solo podrán practicar con las listas del Explora. La App al arrancar y haber inicializado un usuario loggeado, deberá realizar una llamada al endpoint que devuelve la suscripción del usuario: "Get Suscription Status". La respuesta de esta llamada nos indicará si el usuario es Free o Premium.

Cuando el usuario intente crear una nueva lista, si es Free, le mostraremos un modal indicando que necesita ser Premium para poder crear listas propias. Este modal contendrá todas las ventajas de ser Premium y un botón para que el usuario se suscriba. La suscripción la manejaremos con el servicio nativo de iOS y Android (App Store o Google Play).


