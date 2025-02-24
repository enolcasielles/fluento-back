# Guías de UX/UI para Fluento

## Análisis del Público Objetivo

### Perfil Principal
- **Edad**: 18-45 años
- **Nivel de inglés**: Principiante a intermedio
- **Dispositivo**: Principalmente móvil
- **Contexto de uso**: Momentos libres durante el día, transporte público, casa
- **Motivación**: Mejorar inglés de forma práctica y efectiva
- **Familiaridad tecnológica**: Media-alta

### Necesidades Específicas
- Interfaz intuitiva que no distraiga del aprendizaje
- Feedback visual y auditivo claro
- Experiencia fluida y sin fricciones
- Diseño moderno pero profesional

## Guía de Estilos

### 1. Paleta de Colores

#### Colores Principales
- **Primary**: `#2563EB` (Azul Royal)
  - Uso: CTAs principales, elementos destacados
- **Secondary**: `#10B981` (Verde Esmeralda)
  - Uso: Indicadores de éxito, progreso

#### Colores Neutros
- **Background**: `#FFFFFF`
- **Surface**: `#F8FAFC`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`

#### Colores de Feedback
- **Success**: `#10B981`
- **Error**: `#EF4444`
- **Warning**: `#F59E0B`
- **Info**: `#3B82F6`

### 2. Tipografía

#### Familia Principal
- **Título**: Inter
  - Weights: 600 (semibold), 700 (bold)
  - Tamaños:
    - H1: 24px
    - H2: 20px
    - H3: 18px

#### Texto Regular
- **Cuerpo**: Inter
  - Weight: 400 (regular), 500 (medium)
  - Tamaños:
    - Body Large: 16px
    - Body: 14px
    - Body Small: 12px

### 3. Espaciado y Layout

#### Sistema de Espaciado
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

#### Layout
- **Border Radius**:
  - Small: 4px
  - Medium: 8px
  - Large: 12px
- **Container Padding**: 16px
- **Content Max Width**: 480px (móvil)

### 4. Componentes UI

#### Botones
- **Height**: 48px
- **Padding**: 16px horizontal
- **Border Radius**: 8px
- **Estados**:
  - Normal: Color primario
  - Hover: Oscurecer 10%
  - Active: Oscurecer 20%
  - Disabled: Opacidad 50%

#### Inputs
- **Height**: 48px
- **Padding**: 12px
- **Border**: 1px solid
- **Border Radius**: 8px
- **Estados**:
  - Focus: Borde primario 2px
  - Error: Borde error
  - Disabled: Background gris claro

#### Cards
- **Padding**: 16px
- **Border Radius**: 12px
- **Shadow**: 0 2px 4px rgba(0,0,0,0.1)
- **Background**: Blanco

### 5. Principios de Diseño

#### Jerarquía Visual
1. Elementos de práctica principal (frases)
2. Controles de interacción
3. Información secundaria
4. Elementos de navegación

#### Feedback
- Feedback visual inmediato para cada interacción
- Animaciones suaves y sutiles
- Indicadores claros de estado (grabando, evaluando, etc.)

#### Accesibilidad
- Contraste mínimo 4.5:1 para texto
- Tamaño mínimo de touch targets: 44px
- Soporte para lectores de pantalla
- Indicadores visuales claros para estados activos

### 6. Animaciones

#### Transiciones
- **Duración**: 200ms
- **Timing**: ease-in-out
- **Uso**: Cambios de estado, navegación, aparición de elementos

#### Micro-interacciones
- Feedback táctil en botones
- Indicadores de progreso
- Transiciones entre estados de ejercicios

### 7. Iconografía

#### Sistema de Iconos
- **Estilo**: Outline con 2px stroke
- **Tamaño**: 24x24px
- **Padding interno**: 2px
- **Color**: Heredado del contexto

## Implementación

Este sistema de diseño debe implementarse de manera consistente en toda la aplicación, priorizando:

1. Claridad en la jerarquía de información
2. Facilidad de uso y navegación
3. Feedback claro y directo
4. Consistencia visual en todos los elementos
5. Rendimiento y optimización móvil 