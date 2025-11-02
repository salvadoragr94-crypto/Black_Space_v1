# Framer Code Generator 🎨✨

Aplicación web robusta que convierte diseños UI/UX en componentes de Framer Motion utilizando IA de Google Gemini con un sistema de 6 agentes especializados.

## ✨ Características Principales

### 🤖 Sistema Multi-Agente
- **6 Agentes Especializados** que trabajan en secuencia:
  1. **Análisis Visual** - Examina estructura y elementos del diseño
  2. **Estructura de Componentes** - Define jerarquía JSX
  3. **Estilos y Diseño** - Genera estilos inline (sin Tailwind)
  4. **Animaciones Motion** - Implementa Framer Motion
  5. **Property Controls** - Crea controles personalizables
  6. **Validación y Optimización** - Verifica y optimiza el código

### 🎛️ Configuración Avanzada
- **Personalización por Agente**: Ajusta temperatura, tokens máximos y prompts
- **Agentes Habilitables**: Activa/desactiva agentes según necesidad
- **Presets Guardados**: Guarda configuraciones en localStorage
- **Modo Single Prompt**: Opción de generación directa sin agentes

### 📁 Gestión de Contexto
- **File Manager**: Carga archivos de referencia (MD, JSON, TS, TSX)
- **Procesamiento Local**: Los archivos se procesan sin saturar la API
- **Código de Framer Plugin**: Pega código del plugin oficial como referencia
- **Contexto Combinado**: Integra toda la información en los prompts

### 🔐 Gestión de API Keys
- **Multi-Proyecto**: Guarda múltiples API keys con nombres descriptivos
- **Selector Rápido**: Cambia entre proyectos fácilmente
- **Almacenamiento Seguro**: Keys guardadas en localStorage

### 🛡️ Manejo Robusto de Errores
- **Reintentos Automáticos**: Hasta 3 intentos con backoff exponencial
- **Detección de Rate Limiting**: Identifica y maneja sobrecarga de API
- **Mensajes Informativos**: Toasts claros sobre el estado de operaciones
- **Recuperación de Errores**: Reset automático de agentes en caso de fallo

### 🎨 Interfaz Profesional
- **Tema Oscuro**: Diseño moderno y profesional
- **Código con Scroll**: Visualización mejorada con scroll vertical
- **Syntax Highlighting**: Código legible y formateado
- **Vista Previa**: Renderizado en tiempo real del componente
- **Drag & Drop**: Carga de imágenes y archivos intuitiva

## 🚀 Uso Rápido

### 1. Configurar API Key
- Click en el icono de llave 🔑 en la sidebar
- Agrega tu API key de [Google AI Studio](https://makersuite.google.com/app/apikey)
- Dale un nombre descriptivo (ej: "Proyecto Personal")

### 2. Cargar Diseño
- Arrastra una imagen de tu diseño UI/UX
- Formatos soportados: PNG, JPG, SVG

### 3. (Opcional) Agregar Contexto
- **Archivos**: Click en 📁 para cargar documentos de referencia
- **Código Framer**: Pega código del plugin oficial de Framer en Figma

### 4. Configurar Agentes (Opcional)
- Click en ⚙️ para personalizar agentes
- Ajusta temperatura (creatividad) y tokens (longitud)
- Habilita/deshabilita agentes según necesidad

### 5. Generar Código
- Click en "Generar" ✨
- Observa el progreso de cada agente
- Revisa el código generado

### 6. Usar el Código
- Copia el código con el botón de copiar
- O descarga el archivo .tsx
- Importa en tu proyecto de Framer

## 📋 Formato de Salida

El código generado siempre incluye:
- ✅ Imports de `framer-motion` y `framer`
- ✅ Interface TypeScript completa
- ✅ Estilos inline (NO Tailwind)
- ✅ Animaciones con motion components
- ✅ `addPropertyControls` al final
- ✅ Valores por defecto en props
- ✅ Comentarios descriptivos

## 🔧 Tecnologías

- **React + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (Motion)
- **Lucide Icons**
- **Shadcn/ui Components**
- **Google Gemini 2.0 Flash**
- **Sonner** (Toasts)

## 💡 Tips

1. **Mejor calidad**: Usa imágenes de alta resolución y bien definidas
2. **Contexto útil**: Carga guías de estilo o documentación relevante
3. **Ajusta temperatura**: 0.3-0.5 para resultados más consistentes
4. **Reintentos**: Si la API falla, el sistema reintenta automáticamente
5. **Modo simple**: Desactiva el sistema multi-agente para generación más rápida

## 📝 Notas Importantes

- La aplicación **NO** recopila información personal
- Las API keys se guardan solo en tu navegador (localStorage)
- Los archivos se procesan localmente para optimizar uso de API
- El sistema detecta y maneja automáticamente rate limits

## 🎯 Casos de Uso

- Convertir diseños de Figma/Sketch a código
- Crear prototipos interactivos rápidamente
- Generar componentes con animaciones profesionales
- Aprender mejores prácticas de Framer Motion
- Iterar diseños con IA

---

**Desarrollado con ❤️ usando IA y Framer Motion**
