// Firebase configuration and utilities
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: {
    type: 'image' | 'css' | 'code';
    name: string;
    content: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  messages: ChatMessage[];
  resources: {
    images: { id: string; name: string; url: string }[];
    css: { id: string; name: string; content: string }[];
    code: { id: string; name: string; content: string }[];
  };
  createdAt: number;
  updatedAt: number;
}

class FirebaseService {
  private config: FirebaseConfig | null = null;
  private enabled: boolean = false;

  setConfig(config: FirebaseConfig) {
    this.config = config;
    this.enabled = true;
    localStorage.setItem('firebase-config', JSON.stringify(config));
  }

  getConfig(): FirebaseConfig | null {
    if (this.config) return this.config;
    
    const saved = localStorage.getItem('firebase-config');
    if (saved) {
      try {
        this.config = JSON.parse(saved);
        this.enabled = true;
        return this.config;
      } catch (e) {
        console.error('Error loading Firebase config:', e);
      }
    }
    return null;
  }

  isEnabled(): boolean {
    return this.enabled && this.config !== null;
  }

  clearConfig() {
    this.config = null;
    this.enabled = false;
    localStorage.removeItem('firebase-config');
  }

  // Mock implementations - replace with actual Firebase SDK calls
  async saveProject(project: Project): Promise<void> {
    if (!this.isEnabled()) {
      // Fallback to localStorage
      const projects = this.getLocalProjects();
      const index = projects.findIndex(p => p.id === project.id);
      if (index >= 0) {
        projects[index] = project;
      } else {
        projects.push(project);
      }
      localStorage.setItem('projects', JSON.stringify(projects));
      return;
    }

    // TODO: Implement actual Firebase Firestore save
    console.log('Saving project to Firebase:', project.id);
  }

  async getProject(projectId: string): Promise<Project | null> {
    if (!this.isEnabled()) {
      const projects = this.getLocalProjects();
      return projects.find(p => p.id === projectId) || null;
    }

    // TODO: Implement actual Firebase Firestore get
    console.log('Getting project from Firebase:', projectId);
    return null;
  }

  async getProjects(): Promise<Project[]> {
    if (!this.isEnabled()) {
      return this.getLocalProjects();
    }

    // TODO: Implement actual Firebase Firestore query
    console.log('Getting projects from Firebase');
    return [];
  }

  async deleteProject(projectId: string): Promise<void> {
    if (!this.isEnabled()) {
      const projects = this.getLocalProjects();
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem('projects', JSON.stringify(filtered));
      return;
    }

    // TODO: Implement actual Firebase Firestore delete
    console.log('Deleting project from Firebase:', projectId);
  }

  private getLocalProjects(): Project[] {
    const saved = localStorage.getItem('projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    }
    return [];
  }

  async uploadImage(file: File): Promise<string> {
    if (!this.isEnabled()) {
      // Convert to base64 for localStorage
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // TODO: Implement actual Firebase Storage upload
    console.log('Uploading image to Firebase Storage:', file.name);
    return '';
  }
}

export const firebaseService = new FirebaseService();
