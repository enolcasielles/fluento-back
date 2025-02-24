# Implementación de Suscripciones y Pagos con Stripe

## Descripción General
Este documento detalla la implementación de un sistema de suscripciones premium utilizando Stripe como plataforma de pagos. La aplicación seguirá un modelo freemium donde ciertas funcionalidades estarán restringidas a usuarios premium.

## Componentes Principales

### 1. Gestión de Productos y Suscripciones

#### 1.1 Configuración de Stripe
- **Productos y Precios en Stripe Dashboard**
  - Producto: `Fluento Premium`
  - ID del precio: `price_fluento_premium_monthly`
  - Tipo: Suscripción recurrente
  - Período: Mensual
  - Moneda: EUR

#### 1.2 Tipos y Interfaces
```typescript
// types/subscription.ts
export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  prices: StripePrice[];
}

export interface StripePrice {
  id: string;
  currency: string;
  unit_amount: number;
  recurring: {
    interval: 'month' | 'year';
    interval_count: number;
  };
}

export interface SubscriptionStatus {
  isActive: boolean;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentSheetResult {
  error?: string;
  paymentIntent?: string;
}
```

### 2. Servicios y Contextos

#### 2.1 Servicio de Pagos
```typescript
// services/stripe.service.ts
interface StripeService {
  initialize(): Promise<void>;
  createPaymentSheet(priceId: string): Promise<string>; // Returns client secret
  presentPaymentSheet(clientSecret: string): Promise<PaymentSheetResult>;
  getSubscriptionStatus(): Promise<SubscriptionStatus>;
  cancelSubscription(): Promise<void>;
  getProducts(): Promise<StripeProduct[]>;
}
```

#### 2.2 Contexto de Suscripción
```typescript
// contexts/subscription.context.tsx
interface SubscriptionContext {
  isSubscribed: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  products: StripeProduct[];
  subscribe(priceId: string): Promise<void>;
  cancelSubscription(): Promise<void>;
}
```

### 3. Componentes de UI

#### 3.1 Pantalla de Suscripción
- Componente principal: `screens/SubscriptionScreen.tsx`
- Muestra beneficios de la suscripción premium
- Lista de planes disponibles
- Integración con Stripe Payment Sheet
- Gestión de estados de carga y error

#### 3.2 Indicadores Premium
- Badge o icono para contenido premium
- Modales de upgrade para funciones premium
- Banners promocionales en secciones relevantes

### 4. Backend y API

#### 4.1 Nuevos Endpoints
```typescript
// Crear intento de pago
POST /api/subscriptions/create-payment-intent
Body: {
  priceId: string
}
Response: {
  clientSecret: string
}

// Estado de suscripción
GET /api/subscriptions/status
Response: {
  isActive: boolean,
  currentPeriodEnd: string,
  cancelAtPeriodEnd: boolean
}

// Webhook de Stripe
POST /api/webhooks/stripe
```

#### 4.2 Modelo de Datos
```sql
-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  status VARCHAR(20),
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 5. Funcionalidades Premium

#### 5.1 Características Premium
- Creación ilimitada de listas personalizadas
- Acceso a listas temáticas especiales
- Eliminación de límites de práctica diaria
- Descarga de contenido offline
- Estadísticas detalladas de progreso

#### 5.2 Control de Acceso
- Implementar sistema de verificación de permisos
- Actualizar endpoints relevantes para verificar suscripción
- Añadir lógica de redirección a pantalla de suscripción

## Plan de Implementación

### Fase 1: Preparación
1. Configurar cuenta de Stripe y productos
2. Implementar tipos y interfaces base
3. Crear estructura de base de datos
4. Configurar webhooks de Stripe

### Fase 2: Implementación Base
1. Desarrollar servicio de Stripe
2. Implementar contexto de suscripción
3. Crear pantalla de suscripción básica con Payment Sheet

### Fase 3: Integración Backend
1. Implementar endpoints de pago
2. Desarrollar manejador de webhooks
3. Integrar con base de datos

### Fase 4: UI y UX
1. Diseñar y desarrollar pantalla de suscripción completa
2. Implementar indicadores premium
3. Añadir modales y banners promocionales

### Fase 5: Testing y Refinamiento
1. Pruebas de integración con Stripe
2. Validación de flujos de compra y restauración
3. Pruebas de casos límite y error

## Dependencias Necesarias

```json
{
  "dependencies": {
    "@stripe/stripe-react-native": "^0.35.0",
    "@react-native-async-storage/async-storage": "^1.12.1"
  }
}
```

## Consideraciones de Seguridad

1. **Seguridad de Pagos**
   - Usar Stripe Payment Sheet para manejo seguro de tarjetas
   - Implementar verificación de webhooks con firmas
   - Validar todos los eventos de Stripe

2. **Protección de Datos**
   - No almacenar información de tarjetas
   - Encriptar IDs de cliente y suscripción
   - Implementar timeout en sesiones de pago

3. **Prevención de Fraude**
   - Utilizar Stripe Radar para detección de fraude
   - Implementar rate limiting en endpoints
   - Validar consistencia de datos de suscripción

## Métricas y Monitoreo

1. **KPIs de Negocio**
   - Tasa de conversión a premium
   - Churn rate
   - Lifetime Value (LTV)
   - Monthly Recurring Revenue (MRR)

2. **Métricas Técnicas**
   - Tasa de éxito en transacciones
   - Tiempo de respuesta de Stripe
   - Errores en proceso de pago
   - Uso de características premium
   - Latencia de webhooks

## Siguientes Pasos

1. Crear y configurar cuenta de Stripe
2. Definir precios y planes de suscripción
3. Implementar modo de pruebas de Stripe
4. Configurar webhooks en ambiente de desarrollo
5. Preparar material de marketing y promoción 