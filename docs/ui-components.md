# Componentes UI Base de Fluento

Este documento detalla todos los componentes base necesarios para construir las diferentes pantallas de la aplicación de manera consistente.

## Componentes de Navegación

### TabBar
- **Uso**: Navegación principal entre Explora, Listas Guardadas y Mis Listas
- **Propiedades**:
  - `activeTab`: string
  - `onTabChange`: función
- **Estilo**:
  - Altura: 56px
  - Iconos: 24x24px
  - Indicador activo: 2px solid primary
  - Background: Surface

### Header
- **Uso**: Barra superior de navegación
- **Propiedades**:
  - `title`: string
  - `leftAction?`: componente (opcional)
  - `rightAction?`: componente (opcional)
- **Estilo**:
  - Altura: 56px
  - Título: H2
  - Padding horizontal: md

### BackButton
- **Uso**: Navegación hacia atrás
- **Propiedades**:
  - `onPress`: función
- **Estilo**:
  - Icono: 24x24px
  - Touch target: 44x44px

## Componentes de Entrada

### TextField
- **Uso**: Campos de formulario
- **Propiedades**:
  - `label`: string
  - `value`: string
  - `onChange`: función
  - `error?`: string
  - `placeholder?`: string
  - `type`: 'text' | 'email' | 'password'
- **Estilo**: Según guía de estilos

### Checkbox
- **Uso**: Selección booleana (términos y condiciones)
- **Propiedades**:
  - `checked`: boolean
  - `onChange`: función
  - `label`: string
- **Estilo**:
  - Tamaño: 20x20px
  - Border radius: small

### Select
- **Uso**: Selección de opciones (dificultad, temática)
- **Propiedades**:
  - `options`: array
  - `value`: string
  - `onChange`: función
  - `label`: string
- **Estilo**:
  - Altura: 48px
  - Border radius: medium

## Componentes de Feedback

### LoadingSpinner
- **Uso**: Indicador de carga
- **Propiedades**:
  - `size`: 'small' | 'medium' | 'large'
  - `color?`: string
- **Estilo**:
  - Animación: Rotación continua
  - Duración: 1s

### ErrorMessage
- **Uso**: Mostrar errores en formularios
- **Propiedades**:
  - `message`: string
- **Estilo**:
  - Color: Error
  - Tamaño texto: Body Small

### Toast
- **Uso**: Feedback temporal
- **Propiedades**:
  - `message`: string
  - `type`: 'success' | 'error' | 'info'
  - `duration?`: number
- **Estilo**:
  - Border radius: medium
  - Padding: md
  - Animación: Fade

### Modal
- **Uso**: Diálogos y confirmaciones
- **Propiedades**:
  - `visible`: boolean
  - `onClose`: función
  - `title`: string
  - `content`: componente
  - `actions`: array de botones
- **Estilo**:
  - Background overlay: rgba(0,0,0,0.5)
  - Border radius: large
  - Padding: lg

## Componentes de Lista

### ListCard
- **Uso**: Tarjeta de lista en Explora y Listas Guardadas
- **Propiedades**:
  - `title`: string
  - `description`: string
  - `image`: string
  - `difficulty`: string
  - `status?`: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  - `onPress`: función
- **Estilo**:
  - Border radius: large
  - Shadow: según guía
  - Padding: md

### CategorySection
- **Uso**: Sección de categoría en Explora
- **Propiedades**:
  - `title`: string
  - `lists`: array de ListCard
- **Estilo**:
  - Padding vertical: lg
  - Título: H2

### EmptyState
- **Uso**: Estado vacío en listas
- **Propiedades**:
  - `title`: string
  - `description`: string
  - `action?`: componente
- **Estilo**:
  - Padding: xl
  - Alineación: centro

## Componentes de Práctica

### AudioPlayer
- **Uso**: Reproducción de audio en práctica
- **Propiedades**:
  - `url`: string
  - `onComplete`: función
  - `autoPlay`: boolean
- **Estilo**:
  - Controles: minimal
  - Progress bar: 2px height

### RecordingIndicator
- **Uso**: Indicador de grabación
- **Propiedades**:
  - `isRecording`: boolean
  - `duration`: number
- **Estilo**:
  - Animación: Pulso
  - Color: Error

### ScoreIndicator
- **Uso**: Mostrar puntuación
- **Propiedades**:
  - `score`: 1 | 2 | 3
  - `animate`: boolean
- **Estilo**:
  - Tamaño: lg
  - Animación: Scale

### PracticePhrase
- **Uso**: Mostrar frase en práctica
- **Propiedades**:
  - `text`: string
  - `type`: 'question' | 'answer'
- **Estilo**:
  - Tamaño texto: H2
  - Padding: lg

## Componentes de Estado

### StatusBadge
- **Uso**: Indicador de estado
- **Propiedades**:
  - `status`: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
- **Estilo**:
  - Border radius: full
  - Padding: xs

### ProgressBar
- **Uso**: Indicador de progreso
- **Propiedades**:
  - `progress`: number
  - `total`: number
- **Estilo**:
  - Altura: 4px
  - Border radius: full

### PremiumBadge
- **Uso**: Indicador de contenido premium
- **Propiedades**:
  - `variant`: 'small' | 'large'
- **Estilo**:
  - Color: Warning
  - Icon: crown

## Botones

### Button
- **Uso**: Acciones principales
- **Variantes**:
  - `primary`: Acción principal
  - `secondary`: Acción secundaria
  - `outline`: Acción terciaria
  - `text`: Acción de bajo énfasis
- **Propiedades**:
  - `variant`: string
  - `label`: string
  - `onPress`: función
  - `disabled?`: boolean
  - `loading?`: boolean
  - `icon?`: componente
- **Estilo**: Según guía de estilos

### IconButton
- **Uso**: Acciones con icono
- **Propiedades**:
  - `icon`: componente
  - `onPress`: función
  - `size`: 'small' | 'medium' | 'large'
  - `color?`: string
- **Estilo**:
  - Touch target: 44x44px mínimo
  - Padding: sm 