# Guía Rápida - Sistema de Agentes y Previsualización

## 🎨 Panel Lateral (NUEVO v1.2.0)

### Nueva Interfaz con Sidebar

La aplicación ahora cuenta con un **panel lateral minimalista** en el lado izquierdo de la pantalla:

#### Características del Sidebar:

- **Icono de Llave 🔑**: Abre el panel de gestión de API Keys
- **Tooltips**: Pasa el mouse sobre los iconos para ver su función
- **Panel Deslizante**: Se desliza suavemente desde la izquierda
- **Diseño Profesional**: Interface limpia y moderna

#### Cómo usar el Sidebar:

1. **Localiza el panel lateral** en el borde izquierdo de la pantalla
2. **Haz clic en el icono de llave** 🔑 para abrir el gestor de API Keys
3. **El panel se deslizará** desde la izquierda mostrando todas las opciones
4. **Cierra el panel** haciendo clic fuera o en la X

---

## 🔑 Gestión de Múltiples API Keys (v1.1.0)

### Cómo gestionar tus API Keys:

#### Agregar una nueva API Key:

1. **Haz clic en "Agregar"** en la sección de API Keys
2. **Ingresa un nombre descriptivo** (ej: "Proyecto Personal", "Trabajo", "Cliente ABC")
3. **Pega tu API Key** de Google AI Studio
4. **Haz clic en "Guardar"** - La key se guardará y activará automáticamente

#### Cambiar entre API Keys:

1. **Abre el selector** (dropdown) de API Keys
2. **Selecciona la key que deseas usar**
3. Listo! La aplicación usará esa key para las siguientes generaciones

#### Eliminar una API Key:

1. **Selecciona la key** que deseas eliminar
2. **Haz clic en el icono de eliminar** (🗑️)
3. **Confirma la eliminación**

#### Ventajas:

- 🔄 Cambia entre proyectos sin copiar/pegar keys
- 📝 Organiza tus keys con nombres claros
- 💾 Las keys se guardan localmente (no se envían a ningún servidor)
- 👁️ Muestra/oculta el valor de la key activa
- ⚡ La key activa se recuerda entre sesiones

---

## 🚀 Nuevas Características

### 1. Sistema de 6 Agentes Especializados

El sistema de agentes divide el proceso de generación en 6 pasos especializados que garantizan mayor calidad:

#### Cómo funciona:

1. **Activa el Sistema de Agentes**
   - En la sección "Configuración", activa el switch "Sistema de agentes IA"
   - Verás el icono de rayo ⚡ indicando que está activo

2. **Proceso de Generación**
   - Cuando generes código, verás una tarjeta de progreso mostrando cada agente
   - Cada agente se ejecuta secuencialmente:
     - 🔍 Agente 1: Analiza visualmente el diseño
     - 🏗️ Agente 2: Crea la estructura del componente
     - 🎨 Agente 3: Aplica estilos inline
     - ✨ Agente 4: Agrega animaciones Motion
     - 🎛️ Agente 5: Define Property Controls
     - ✅ Agente 6: Valida y optimiza

3. **Visualización del Progreso**
   - ⚪ Gris: Pendiente
   - 🔵 Azul (girando): En ejecución
   - 🟢 Verde (✓): Completado
   - 🔴 Rojo: Error

### 2. Vista Previa de Componentes

Ahora puedes ver cómo se verá el componente antes de descargarlo:

#### Cómo usar:

1. **Genera el Código**
   - Sube una imagen y genera el código como siempre

2. **Alterna entre vistas**
   - **Botón "Código"**: Muestra el código fuente con syntax highlighting
   - **Botón "Vista previa"**: Renderiza el componente en tiempo real

3. **Características de la Vista Previa**
   - Renderizado en iframe aislado (seguro)
   - Muestra el componente tal como se vería en Framer
   - Útil para verificar antes de descargar

### 3. Modo Simple vs. Modo Agentes

#### Modo Simple (Switch OFF)
- ✅ Generación rápida con un solo prompt
- ✅ Ideal para diseños simples
- ✅ Menos llamadas a la API

#### Modo Agentes (Switch ON)
- ✅ Mayor precisión y calidad
- ✅ Mejor adherencia al formato Framer
- ✅ Código más optimizado
- ✅ 6 llamadas a la API secuenciales
- ⚠️ Tarda más tiempo

## 💡 Consejos

### Para mejores resultados:

1. **Usa el Sistema de Agentes para:**
   - Diseños complejos con múltiples elementos
   - Componentes que requieren animaciones específicas
   - Cuando necesites código production-ready

2. **Usa el Modo Simple para:**
   - Prototipos rápidos
   - Diseños muy básicos
   - Cuando quieras iterar rápidamente

3. **Vista Previa:**
   - Siempre revisa la vista previa antes de descargar
   - Ten en cuenta que es una aproximación (algunos componentes pueden requerir ajustes)

## 🔧 Resolución de Problemas

### La vista previa no muestra nada
- Verifica que el código generado sea válido
- Algunos componentes muy complejos pueden no renderizar correctamente
- Usa la vista de código para verificar sintaxis

### Los agentes se detienen con error
- Verifica tu API key
- Asegúrate de tener créditos en tu cuenta de Google AI
- Intenta con una imagen más simple

### El código generado no es lo esperado
- Prueba subiendo una imagen más clara
- Asegúrate de que el diseño tenga buena resolución
- Activa el sistema de agentes para mejor precisión

## 📋 Flujo de Trabajo Recomendado

1. **Configura tu API Key** (primera vez o cambia de proyecto)
   - Agrega tu API key con un nombre descriptivo
   - Selecciona la key apropiada para tu proyecto
2. **Prepara tu diseño** en Figma/Sketch
3. **Exporta como PNG/JPG** (alta resolución)
4. **Activa el sistema de agentes** ⚡
5. **Carga la imagen** en la app
6. **Genera el código** y observa el progreso
7. **Revisa la vista previa** 👁️
8. **Copia o descarga** el código
9. **Importa en Framer** y personaliza si es necesario

## 🎯 Características Mantenidas

- ✅ Gestión completa de múltiples API keys
- ✅ Persistencia de keys y selección activa
- ✅ Todos los componentes anteriores funcionan igual
- ✅ Compatibilidad total con gemini-2.0-flash-exp
- ✅ Soporte para múltiples archivos
- ✅ Descarga de código
- ✅ Copia al portapapeles

## 📝 Notas Importantes

- El sistema de agentes hace 6 llamadas a la API (una por agente)
- Cada llamada consume tokens de tu cuota de Gemini
- El modo simple hace solo 1 llamada
- La vista previa es experimental y puede no funcionar para todos los componentes
