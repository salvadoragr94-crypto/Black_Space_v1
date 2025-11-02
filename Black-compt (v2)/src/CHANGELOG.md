# Changelog - Design to Framer Code

## Versión 1.2.0 - Panel Lateral con Iconos 🎨

### Nuevas Características

**Panel Lateral Minimalista** - Nueva interfaz con sidebar de iconos:

- 📐 **Diseño Limpio**: Panel lateral fijo de 64px con iconos grandes y claros
- 🔑 **Gestión de API Keys**: Accede al gestor de API keys desde el icono en el sidebar
- 🎯 **Tooltips Informativos**: Cada icono muestra su función al hacer hover
- 📱 **Sheet Deslizante**: Panel de 440px que se desliza desde la izquierda
- 💡 **Consejos Integrados**: Tips útiles dentro del panel de API Keys
- ✨ **Animaciones Suaves**: Transiciones fluidas al abrir/cerrar paneles

#### Ventajas del Sidebar:

- ✅ Más espacio para el contenido principal
- ✅ Acceso rápido a configuraciones importantes
- ✅ Interface moderna y profesional
- ✅ Preparado para agregar más herramientas en el futuro
- ✅ UX mejorada con tooltips y animaciones

---

## Versión 1.1.0 - Gestión de Múltiples API Keys 🔑

### Nuevas Características

**Sistema de Gestión de API Keys** - Ahora puedes guardar y administrar múltiples API keys de Gemini:

- 📝 **Guardar Múltiples Keys**: Agrega varias API keys con nombres descriptivos (ej: "Proyecto Personal", "Trabajo", "Desarrollo")
- 🔄 **Cambiar Fácilmente**: Selecciona rápidamente qué API key usar desde un dropdown
- 💾 **Persistencia**: Las API keys se guardan en localStorage de forma segura
- 🗑️ **Eliminar Keys**: Remueve API keys que ya no necesitas
- 👁️ **Mostrar/Ocultar**: Toggle para ver u ocultar el valor de la API key activa
- ✨ **Primera Vez**: Interface amigable cuando no hay keys guardadas

#### Cómo usar la gestión de API Keys:

1. **Agregar primera API key**: Haz clic en "Agregar" o "Agregar primera API key"
2. **Ingresar datos**: Proporciona un nombre descriptivo y pega tu API key
3. **Seleccionar**: Elige qué API key usar desde el selector
4. **Eliminar**: Usa el botón de eliminar (🗑️) para remover keys no deseadas

#### Ventajas:

- ✅ Trabaja con múltiples proyectos sin cambiar keys manualmente
- ✅ Organiza tus API keys con nombres claros
- ✅ Cambia entre keys con un solo clic
- ✅ No pierdas tu API key al cerrar el navegador

---

## Versión 1.0.0 - Lanzamiento Inicial

## Nuevas Características Implementadas

### Sistema de 6 Agentes Especializados ⚡

Se ha implementado un sistema de múltiples agentes IA que trabajan secuencialmente para generar código de mayor calidad y precisión:

#### Los 6 Agentes:

1. **Agente de Análisis Visual**
   - Analiza elementos visuales, colores, espaciado y tipografía
   - Genera una descripción estructurada en JSON del diseño

2. **Agente de Estructura de Componentes**
   - Crea la jerarquía y organización del componente React
   - Define interfaces TypeScript y estructura JSX básica

3. **Agente de Estilos y Diseño**
   - Implementa estilos inline siguiendo el análisis
   - Garantiza que NO se use Tailwind (solo estilos inline)

4. **Agente de Animaciones Motion**
   - Agrega animaciones con Framer Motion
   - Implementa initial, animate y transition apropiados

5. **Agente de Property Controls**
   - Define controles de Framer para propiedades personalizables
   - Crea el bloque addPropertyControls completo

6. **Agente de Validación y Optimización**
   - Verifica sintaxis y funcionamiento
   - Optimiza y limpia el código final

#### Ventajas del Sistema de Agentes:

- ✅ Mayor precisión en la generación de código
- ✅ Mejor adherencia al formato de Framer
- ✅ Código más limpio y optimizado
- ✅ Proceso transparente con visualización de progreso
- ✅ Cada agente se especializa en un aspecto específico

### Funcionalidad de Previsualización 👁️

Se ha agregado la capacidad de previsualizar el componente generado:

#### Características:

- **Vista de Código**: Muestra el código con syntax highlighting
- **Vista Previa**: Renderiza el componente en tiempo real
- **Tabs Múltiples**: Soporta múltiples archivos generados
- **Renderizado Seguro**: Usa iframe sandbox para seguridad
- **Copia Rápida**: Botón para copiar código al portapapeles

### Mejoras en la Interfaz

- **Switch de Modo**: Permite alternar entre generación simple y sistema de agentes
- **Progreso Visual**: Muestra el progreso de cada agente en tiempo real
- **Animaciones Mejoradas**: Indicadores de estado para cada agente
- **Mejor UX**: Mensajes claros sobre qué está haciendo la IA

### Modo de Uso

1. **Activar Sistema de Agentes**: Usa el switch "Sistema de agentes IA"
2. **Cargar Diseño**: Sube una imagen de tu diseño
3. **Generar**: Haz clic en "Generar código React"
4. **Observar Progreso**: Ve cómo cada agente procesa el diseño
5. **Vista Previa**: Alterna entre código y previsualización
6. **Descargar**: Descarga los archivos generados

### Compatibilidad

- ✅ Mantiene toda la funcionalidad anterior
- ✅ No afecta la API key guardada
- ✅ Compatible con el modo de generación simple
- ✅ Funciona con gemini-2.0-flash-exp

## Correcciones de Bugs

- Resuelto error de React con LoaderCircle
- Mejorado manejo de errores en generación
- Reset correcto de estados al limpiar imagen
