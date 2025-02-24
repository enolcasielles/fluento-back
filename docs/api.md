# API Endpoints

1. **Get Explore**
   - Descripción: Obtiene las listas públicas de la plataforma organizadas por categorías. Estas listas son creadas y curadas por la plataforma.
   - Path: `/api/explore`
   - Method: GET
   - Parameters: None
   - Response 200:
     ```json
     {
       "categories": [
         {
           "id": "string",
           "name": "string",
           "lists": [
             {
               "id": "string",
               "name": "string",
               "description": "string",
               "imageUrl": "string",
               "difficulty": "beginner" | "intermediate" | "advanced",
               "totalUnits": "number"
             }
           ]
         }
       ]
     }
     ```

2. **Get My Lists**
   - Descripción: Obtiene las listas creadas por el usuario.
   - Path: `/api/lists`
   - Method: GET
   - Parameters: None
   - Response 200:
     ```json
     {
       "lists": [
         {
           "id": "string",
           "name": "string",
           "description": "string",
           "imageUrl": "string",
           "difficulty": "beginner" | "intermediate" | "advanced",
           "totalUnits": "number",
           "creationStatus": "IN_PROGRESS" | "COMPLETED" | "FAILED",
           "progress": {
             "completedUnits": "number",
             "averageScore": "number"
           }
         }
       ]
     }
     ```

3. **Get List Detail**
   - Descripción: Obtiene información detallada de una lista específica. Si el usuario tiene la lista guardada, incluye también su progreso.
   - Path: `/api/lists/{listId}`
   - Method: GET
   - Parameters: 
     - listId: string (path parameter)
   - Response 200:
     ```json
     {
       "id": "string",
       "name": "string",
       "description": "string",
       "imageUrl": "string",
       "difficulty": "beginner" | "intermediate" | "advanced",
       "topic": "string",
       "grammarStructures": ["string"],
       "totalUnits": "number",
       "isSaved": "boolean",
       "userProgress": {
         "practicedUnits": "number",
         "passedUnits": "number",
         "averageScore": "number"
       }
     }
     ```

4. **Get Saved Lists**
   - Descripción: Obtiene las listas que el usuario ha guardado específicamente
   - Path: `/api/lists/saved`
   - Method: GET
   - Parameters: None
   - Response 200:
     ```json
     {
       "lists": [
         {
           "id": "string",
           "name": "string",
           "description": "string",
           "imageUrl": "string",
           "difficulty": "beginner" | "intermediate" | "advanced",
           "totalUnits": "number"
         }
       ]
     }ol
     ```

5. **Save List**
   - Descripción: Guarda una lista pública en el perfil del usuario para poder practicarla.
   - Path: `/api/lists/{listId}/save`
   - Method: POST
   - Parameters:
     - listId: string (path parameter)
   - Response 200:
     ```json
     {
       "success": true
     }
     ```

6. **Delete Saved List**
   - Descripción: Elimina una lista guardada del perfil del usuario
   - Path: `/api/lists/{listId}/save`
   - Method: DELETE
   - Parameters:
     - listId: string (path parameter)
   - Response 200:
     ```json
     {
       "success": true
     }
     ```

7. **Create List**
   - Descripción: Crea una nueva lista personalizada. Solo disponible para usuarios Premium. La lista se creará con estado IN_PROGRESS mientras el sistema genera las unidades. La generación se realizará en segundo plano. Cuando finalice la generación, el estado pasará a COMPLETED o a FAILED si ha ocurrido algún error.
   - Path: `/api/lists`
   - Method: POST
   - Parameters (body):
     ```json
     {
       "name": "string",
       "topic": "string",
       "difficulty": "any" | "beginner" | "intermediate" | "advanced",
       "grammarStructures": "string"
     }
     ```
   - Response 200:
     ```json
     {
       "id": "string",
       "name": "string",
       "topic": "string",
       "imageUrl": "string",
       "difficulty": "string",
       "grammarStructures": "string",
       "creationStatus": "IN_PROGRESS" | "COMPLETED" | "FAILED"
     }
     ```

8. **Get List Session**
   - Descripción: Recupera una sesión de práctica para una lista específica. Si el usuario ya tiene una sesión en esa lista, devuelve dicha sesión. Si no, la crea. Devuelve también la primera unidad a practicar.
   - Path: `/api/lists/{listId}/session`
   - Method: GET
   - Parameters:
     - listId: string (path parameter)
   - Response 200:
     ```json
     {
       "sessionId": "string",
       "listId": "string",
       "listName": "string",
       "nextUnit": {
         "id": "string",
         "question": {
           "text": "string",
           "audio": "string" // URL
         },
         "answer": {
           "text": "string",
           "audio": "string" // URL
         },
         "responseTime": "number" // milliseconds
       }
     }
     ```

9. **Evaluate Answer**
   - Descripción: Evalúa la respuesta del usuario para una unidad específica dentro de una sesión. Devuelve una puntuación del 1 al 4.
   - Path: `/api/sessions/{sessionId}/units/{unitId}/evaluate`
   - Method: POST
   - Parameters:
     - sessionId: string (path parameter)
     - unitId: string (path parameter)
     - body: FormData con el archivo de audio
   - Response 200:
     ```json
     {
       "score": "number" // 1-3
     }
     ```

10. **Submit Result**
    - Descripción: Registra el resultado de una unidad practicada y devuelve la siguiente unidad a practicar.
    - Path: `/api/sessions/{sessionId}/units/{unitId}/result`
    - Method: POST
    - Parameters:
      - sessionId: string (path parameter)
      - unitId: string (path parameter)
      - body:
        ```json
        {
          "score": "number" // 1-3
        }
        ```
    - Response 200:
      ```json
      {
        "nextUnit": {
          "id": "string",
          "question": {
            "text": "string",
            "audio": "string" // URL
          },
          "answer": {
            "text": "string",
            "audio": "string" // URL
          },
          "responseTime": "number" // milliseconds
        }
      }
      ```

11. **Get User**
    - Descripción: Obtiene la información del usuario autenticado, incluyendo su estado de suscripción (Free/Premium).
    - Path: `/api/user`
    - Method: GET
    - Parameters: None
    - Response 200:
      ```json
      {
        "id": "string",
        "name": "string",
        "email": "string",
      }
      ```

12. **Retry Create List**
    - Descripción: Reinicia el proceso de creación de una lista que falló. La lista volverá al estado IN_PROGRESS mientras el sistema intenta generar las unidades de nuevo.
    - Path: `/api/lists/{listId}/retry`
    - Method: POST
    - Parameters:
      - listId: string (path parameter)
    - Response 200:
      ```json
      {
        "id": "string",
        "name": "string",
        "topic": "string",
        "imageUrl": "string",
        "difficulty": "string",
        "grammarStructures": ["string"],
        "creationStatus": "IN_PROGRESS"
      }
      ```
