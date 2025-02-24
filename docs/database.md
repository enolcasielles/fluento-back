# Modelo de Base de Datos de Fluento

## Resumen
El modelo de base de datos de Fluento está diseñado para gestionar usuarios, listas de frases, unidades de práctica y resultados de sesiones. Utiliza PostgreSQL como sistema de gestión de bases de datos y Prisma como ORM para facilitar la interacción con la base de datos.

## Entidades Principales

### 1. **User**
| Atributo   | Tipo     | Descripción                                      |
|------------|----------|--------------------------------------------------|
| id         | String   | Identificador único del usuario                  |
| email      | String   | Correo electrónico del usuario (único)          |
| name       | String   | Nombre del usuario                                |
| createdAt  | DateTime | Fecha de creación de la cuenta                   |
| updatedAt  | DateTime | Fecha de la última actualización de la cuenta    |

**Relaciones:**
- `lists`: Listas creadas por el usuario.
- `savedLists`: Listas guardadas por el usuario.
- `sessions`: Sesiones de práctica del usuario.
- `results`: Resultados de las sesiones del usuario.

### 2. **Category**
| Atributo   | Tipo     | Descripción                                      |
|------------|----------|--------------------------------------------------|
| id         | String   | Identificador único de la categoría               |
| name       | String   | Nombre de la categoría                            |
| createdAt  | DateTime | Fecha de creación de la categoría                 |
| updatedAt  | DateTime | Fecha de la última actualización de la categoría  |

**Relaciones:**
- `lists`: Listas asociadas a la categoría.

### 3. **List**
| Atributo          | Tipo     | Descripción                                      |
|-------------------|----------|--------------------------------------------------|
| id                | String   | Identificador único de la lista                   |
| name              | String   | Nombre de la lista                                |
| description       | String?  | Descripción de la lista (opcional)               |
| imageUrl          | String?  | URL de la imagen de la lista (opcional)         |
| difficulty        | Difficulty | Nivel de dificultad de la lista                  |
| topic             | String?  | Temática de la lista (opcional)                  |
| grammarStructures | String?  | Estructuras gramaticales de la lista (opcional) |
| totalUnits        | Int      | Número total de unidades en la lista              |
| creationStatus    | CreationStatus | Estado de creación de la lista                |
| isPublic          | Boolean  | Indica si la lista es pública                     |
| createdAt         | DateTime | Fecha de creación de la lista                     |
| updatedAt         | DateTime | Fecha de la última actualización de la lista      |

**Relaciones:**
- `category`: Categoría a la que pertenece la lista.
- `creator`: Usuario que creó la lista.
- `savedBy`: Usuarios que han guardado la lista.
- `units`: Unidades asociadas a la lista.
- `sessions`: Sesiones asociadas a la lista.

### 4. **Unit**
| Atributo        | Tipo     | Descripción                                      |
|------------------|----------|--------------------------------------------------|
| id               | String   | Identificador único de la unidad                  |
| questionText     | String   | Texto de la pregunta                              |
| questionAudio    | String   | URL del audio de la pregunta                      |
| answerText       | String   | Texto de la respuesta                             |
| answerAudio      | String   | URL del audio de la respuesta                     |
| responseTime     | Int      | Tiempo de respuesta permitido (en milisegundos)  |
| createdAt        | DateTime | Fecha de creación de la unidad                    |
| updatedAt        | DateTime | Fecha de la última actualización de la unidad     |

**Relaciones:**
- `list`: Lista a la que pertenece la unidad.
- `results`: Resultados asociados a la unidad.

### 5. **Session**
| Atributo        | Tipo     | Descripción                                      |
|------------------|----------|--------------------------------------------------|
| id               | String   | Identificador único de la sesión                  |
| createdAt        | DateTime | Fecha de creación de la sesión                    |
| updatedAt        | DateTime | Fecha de la última actualización de la sesión     |

**Relaciones:**
- `user`: Usuario que realizó la sesión.
- `list`: Lista asociada a la sesión.
- `results`: Resultados de la sesión.

### 6. **Result**
| Atributo        | Tipo     | Descripción                                      |
|------------------|----------|--------------------------------------------------|
| id               | String   | Identificador único del resultado                 |
| score            | Int      | Puntuación obtenida (1-3)                        |
| createdAt        | DateTime | Fecha de creación del resultado                   |

**Relaciones:**
- `session`: Sesión a la que pertenece el resultado.
- `unit`: Unidad asociada al resultado.
- `user`: Usuario que obtuvo el resultado.

## Enumeraciones

### Difficulty
| Valor         |
|---------------|
| ANY           |
| BEGINNER      |
| INTERMEDIATE  |
| ADVANCED      |

### CreationStatus
| Valor         |
|---------------|
| IN_PROGRESS   |
| COMPLETED     |
| FAILED        |

## Conclusión
Este modelo de base de datos está diseñado para proporcionar una estructura sólida y flexible que permita a los usuarios interactuar con la aplicación de manera efectiva, facilitando el aprendizaje del inglés a través de la práctica y la evaluación continua.
