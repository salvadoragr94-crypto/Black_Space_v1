export interface ApiCallOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface GeminiRequestParams {
  apiKey: string;
  prompt: string;
  base64Image?: string;
  imageType?: string;
  temperature?: number;
  maxTokens?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isRateLimited?: boolean,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callGeminiWithRetry(
  params: GeminiRequestParams,
  options: ApiCallOptions = {}
): Promise<string> {
  const {
    maxRetries = 3,
    retryDelay = 2000,
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const parts: any[] = [{ text: params.prompt }];

      if (params.base64Image && params.imageType) {
        parts.push({
          inline_data: {
            mime_type: params.imageType,
            data: params.base64Image,
          },
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${params.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: params.temperature ?? 0.4,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: params.maxTokens ?? 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || 'Error en la API de Gemini';

        // Check for rate limiting
        const isRateLimited = response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit');
        const retryAfter = response.headers.get('Retry-After');

        throw new ApiError(
          errorMessage,
          response.status,
          isRateLimited,
          retryAfter ? parseInt(retryAfter) * 1000 : undefined
        );
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new ApiError('No se recibió respuesta de la API');
      }

      return generatedText;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on non-retryable errors
      if (error instanceof ApiError) {
        if (!error.isRateLimited && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          // Client errors (except rate limiting) shouldn't be retried
          if (error.statusCode !== 429) {
            throw error;
          }
        }
      }

      // If this is not the last attempt, wait and retry
      if (attempt < maxRetries) {
        const waitTime = error instanceof ApiError && error.retryAfter 
          ? error.retryAfter 
          : retryDelay * Math.pow(2, attempt); // Exponential backoff

        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        await delay(waitTime);
        continue;
      }

      // Last attempt failed, throw the error
      throw lastError;
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError || new Error('Error desconocido');
}

export function extractJsonFromResponse(text: string): any {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      // Continue to next method
    }
  }

  // Try to find any JSON object
  const objectMatch = text.match(/\{[\s\S]*"files"[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch (e) {
      // Continue to next method
    }
  }

  // Try to parse the entire text
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
