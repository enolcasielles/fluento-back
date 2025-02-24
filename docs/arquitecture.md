# Arquitectura de Fluento

## Resumen
La arquitectura de la plataforma Fluento está diseñada para ser escalable, mantenible y flexible, utilizando una combinación de tecnologías modernas que permiten un desarrollo ágil y eficiente. Se basa en una arquitectura que separa las responsabilidades y facilita el desarrollo y la integración de nuevas funcionalidades.

## Componentes principales:

- Aplicación móvil con React Native
- Back office con NextJS
- Endpoints de API para la aplicación móvil también con NextJS
- Sistema de autenticación con Supabase
- Base de datos PostgreSQL alojada en Supabase y gestionada con Prisma
- Sistema de pagos usando los mecanismos nativos de Android y iOS
- Modelos LLM para la IA usando OpenAI


## Justificación:

- Usaremos React Native porque nos permite desarrollar de forma ágil y eficiente la aplicación móvil para iOS y Android con un único código base.
- El back office en NextJS nos permite desarrollar una aplicación web moderna y escalable.
- NextJS nos permite un despliegue rápido, sencillo y económico en Vercel, lo cual nos interesa para un MVP.
- La API que necesita la app la tendremos en el mismo proyecto NextJS, simplificando costes, desarrollo y mantenimiento. Usamos NextJS para la API principalmente por esta razón, simplicidad.
- Supabase nos permite un sistema de autenticación sencillo y económico, lo cual nos interesa para un MVP.
- La base de datos PostgreSQL alojada en Supabase y gestionada con Prisma nos permite desarrollar una aplicación móvil y web con una base de datos común, lo que nos permite mantener la consistencia y la facilidad de desarrollo.

## ¿Por qué usamos NextJS para la API?
Principalmente por simplicidad. Como necesitamos NextJS para el back office, aprovechamos este proyecto para implementar la API. Ahora bien, es esperable que a futuro esta decisión no se mantenga y queramos usar un framework más orientado al desarrollo de APIs. Por eso prestaremos especial atención a que el desarrollo se haga de una forma que nos facilite esta futura migración. Esto implicará separar claramente la cada infraestructura de la capa lógica de negocio, facilitando su migración a futuro a un framework como NestJS o Fastify.

## ¿Por qué usamos Prisma y no directamente la api de Supabase?
Principalmente por la flexibilidad. Si a futuro queremos cambiar de base de datos, Prisma nos permite hacerlo de forma sencilla, mientras que Supabase nos obliga a usar su base de datos. Nos interesa usar Supabase en esta etapa MVP, pero es esperable que en un futuro queramos cambiar de base de datos. Usando Prisma, podremos cambiar de base de datos sin mayores problemas.