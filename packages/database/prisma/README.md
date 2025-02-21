# Crear una nueva migración
npx prisma migrate dev --create-only

# Aplicar migraciones pendientes en producción
npx prisma migrate deploy

# Ver el estado de las migraciones
npx prisma migrate status

# Restablecer la base de datos (¡cuidado! borra todos los datos)
npx prisma migrate reset

# Regenerar el cliente de Prisma
npx prisma generate
