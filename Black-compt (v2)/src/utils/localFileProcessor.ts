// Local file processor - processes files without using Gemini API
// This helps avoid saturating the API with file content processing

export interface ProcessedFile {
  name: string;
  content: string;
  summary: string;
  type: string;
}

export class LocalFileProcessor {
  /**
   * Process files locally to extract meaningful context
   * without using the Gemini API
   */
  static processFiles(files: { name: string; content: string; type: string }[]): ProcessedFile[] {
    return files.map(file => this.processFile(file));
  }

  /**
   * Process a single file to create a summary and extract key information
   */
  private static processFile(file: { name: string; content: string; type: string }): ProcessedFile {
    const { name, content, type } = file;

    let summary = '';

    // Handle different file types
    if (this.isCodeFile(name)) {
      summary = this.summarizeCodeFile(content, name);
    } else if (this.isMarkdownFile(name)) {
      summary = this.summarizeMarkdown(content);
    } else if (this.isJsonFile(name)) {
      summary = this.summarizeJson(content);
    } else {
      summary = this.summarizeText(content);
    }

    return {
      name,
      content,
      summary,
      type,
    };
  }

  private static isCodeFile(filename: string): boolean {
    return /\.(tsx|ts|jsx|js)$/i.test(filename);
  }

  private static isMarkdownFile(filename: string): boolean {
    return /\.md$/i.test(filename);
  }

  private static isJsonFile(filename: string): boolean {
    return /\.json$/i.test(filename);
  }

  private static summarizeCodeFile(content: string, filename: string): string {
    const lines = content.split('\n');
    const imports = lines.filter(line => line.trim().startsWith('import'));
    const exports = lines.filter(line => line.includes('export'));
    const functions = this.extractFunctions(content);
    const components = this.extractComponents(content);

    return `Archivo de código: ${filename}
Imports: ${imports.length}
Exports: ${exports.length}
Funciones: ${functions.join(', ') || 'ninguna'}
Componentes: ${components.join(', ') || 'ninguno'}
Líneas: ${lines.length}`;
  }

  private static extractFunctions(content: string): string[] {
    const functionRegex = /(?:function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=:]?\s*(?:\([^)]*\)|function)/g;
    const matches: string[] = [];
    let match;

    while ((match = functionRegex.exec(content)) !== null) {
      if (match[1] && !matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    return matches.slice(0, 10); // Limit to first 10
  }

  private static extractComponents(content: string): string[] {
    const componentRegex = /(?:export\s+)?(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9_]*)/g;
    const matches: string[] = [];
    let match;

    while ((match = componentRegex.exec(content)) !== null) {
      if (match[1] && !matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    return matches.slice(0, 10); // Limit to first 10
  }

  private static summarizeMarkdown(content: string): string {
    const lines = content.split('\n');
    const headings = lines.filter(line => line.trim().startsWith('#'));
    const codeBlocks = (content.match(/```/g) || []).length / 2;

    return `Documento Markdown
Encabezados: ${headings.length}
Bloques de código: ${codeBlocks}
Líneas: ${lines.length}
Primeros encabezados: ${headings.slice(0, 5).map(h => h.replace(/^#+\s*/, '')).join(', ')}`;
  }

  private static summarizeJson(content: string): string {
    try {
      const data = JSON.parse(content);
      const keys = Object.keys(data);
      const type = Array.isArray(data) ? 'Array' : 'Object';

      return `Archivo JSON (${type})
Claves principales: ${keys.slice(0, 10).join(', ')}
Total de claves: ${keys.length}`;
    } catch (e) {
      return `Archivo JSON (formato inválido)`;
    }
  }

  private static summarizeText(content: string): string {
    const lines = content.split('\n');
    const words = content.split(/\s+/).length;
    const firstLines = lines.slice(0, 3).join(' ').substring(0, 200);

    return `Archivo de texto
Líneas: ${lines.length}
Palabras: ${words}
Inicio: ${firstLines}...`;
  }

  /**
   * Create a context string from processed files
   */
  static createContext(processedFiles: ProcessedFile[]): string {
    if (processedFiles.length === 0) {
      return '';
    }

    let context = '\n\n=== CONTEXTO ADICIONAL DE ARCHIVOS ===\n\n';

    processedFiles.forEach(file => {
      context += `Archivo: ${file.name}\n`;
      context += `${file.summary}\n\n`;
      
      // Include full content for small files, or first part for large files
      if (file.content.length < 2000) {
        context += `Contenido completo:\n${file.content}\n\n`;
      } else {
        context += `Extracto del contenido:\n${file.content.substring(0, 1500)}...\n\n`;
      }
      
      context += '---\n\n';
    });

    return context;
  }
}
