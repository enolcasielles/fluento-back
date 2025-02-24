# Fluento: Aplicación Móvil para Aprender Inglés

## Resumen
La aplicación permitirá a los usuarios aprender inglés mediante ejercicios de traducción inversa. El usuario recibirá una frase en español y tendrá unos segundos para traducirla al inglés en voz alta. Luego, la aplicación evaluará automáticamente la respuesta y adaptará la frecuencia de las frases según el desempeño del usuario, reforzando aquellas en las que tenga más dificultades.

El modelo de negocio se basará en una versión gratuita limitada y una suscripción Premium que desbloqueará funcionalidades avanzadas.

---

## Funcionalidades Principales

### 1. **Práctica de Frases**
- **Flujo de práctica**:
  1. La app reproduce el audio de la frase en español y muestra el texto en pantalla.
  2. El usuario tiene unos segundos para decir la frase en inglés.
  3. La app recoge el audio, lo convierte a texto mediante un modelo de IA (como Whisper) y lo compara con la respuesta esperada usando otro modelo de IA.
  4. La evaluación se centra en la gramática y el vocabulario (no se evaluará la pronunciación en el MVP).

- **Adaptación de las frases**: 
  - Se usará un algoritmo inspirado en Anki para ajustar la frecuencia de aparición de las frases según el desempeño del usuario. Esto hará que el usuario repita más aquellas frases que tenga más dificultades.

---

### 2. **Gestión de Listas de Frases**
#### **Listas Públicas**
- Generadas automáticamente por la platataforma.
- Rnovación periódica para que siempre haya contenido nuevo.
- Se clasificarán por temática, nivel de dificultad y estructuras gramaticales, de forma que el usuario pueda encontrar listas que se adapten a lo que necesita.
- Visibles para cualquier usuario en la sección que llamaremos "Explora".

#### **Listas Personalizadas (Usuarios Premium)**
- Los usuarios Premium podrán crear sus propias listas configurando parámetros como temática, dificultad y estructuras gramaticales.

---

### 3. **Modelo de Negocio**
- **Versión Gratuita**:
  - Acceso al "Explora", una sección con listas públicas generadas por la plataofrma.
  - Restricciones en el uso diario (número de frases o minutos de práctica, a definir).
- **Versión Premium**:
  - Acceso a la creación de listas personalizadas.
  - Uso ilimitado de cualquier lista.


## Futuras Mejoras (Post-MVP)
1. **Evaluación de pronunciación**.
2. **Configuración manual de listas personalizadas**.
3. **Gamificación**:
   - Logros, niveles y rankings para aumentar la retención.
4. **Expansión del modelo de negocio**:
   - Posible integración de publicidad en la versión gratuita.
5. **Integración de contenido multimedia**:
   - Videos o ejercicios interactivos complementarios.

---

## Conclusión
Este proyecto tiene como objetivo ofrecer una experiencia de aprendizaje inmersiva y personalizada que combine técnicas probadas como la traducción inversa con la potencia de la inteligencia artificial. La implementación inicial se centrará en garantizar una experiencia fluida y efectiva para los usuarios, con una base sólida para futuras expansiones.