/**
 * OpenAI API integration
 * @fileoverview Handles OpenAI API calls for chat completions and other AI features
 */

import OpenAI from 'openai'
import type { AIModel, AIProvider } from '@/types'

/**
 * OpenAI client instance
 * @description Configured OpenAI client with API key
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Available OpenAI models
 * @description List of supported OpenAI models with their configurations
 */
export const OPENAI_MODELS: AIModel[] = [
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai' as AIProvider,
    description: 'Most capable GPT-4 model with improved instruction following and code generation',
    maxTokens: 128000,
    costPerToken: 0.00001, // $0.01 per 1K tokens
    isAvailable: true,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai' as AIProvider,
    description: 'Most capable GPT-4 model for complex reasoning tasks',
    maxTokens: 8192,
    costPerToken: 0.00003, // $0.03 per 1K tokens
    isAvailable: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as AIProvider,
    description: 'Fast and efficient model for most tasks',
    maxTokens: 4096,
    costPerToken: 0.000002, // $0.002 per 1K tokens
    isAvailable: true,
  },
]

/**
 * Chat completion request interface
 * @interface ChatCompletionRequest
 */
export interface ChatCompletionRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

/**
 * Chat completion response interface
 * @interface ChatCompletionResponse
 */
export interface ChatCompletionResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason: string
}

/**
 * Generates a chat completion using OpenAI API
 * @description Creates a chat completion with the specified messages and parameters
 * @param request - Chat completion request parameters
 * @returns Promise<ChatCompletionResponse>
 */
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  try {
    const {
      messages,
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 1000,
      stream = false,
    } = request

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream,
    })

    if (stream) {
      // Handle streaming response
      throw new Error('Streaming not implemented in this example')
    }

    const choice = completion.choices[0]
    if (!choice?.message?.content) {
      throw new Error('No content in completion response')
    }

    return {
      content: choice.message.content,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      model: completion.model,
      finishReason: choice.finish_reason || 'unknown',
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generates embeddings using OpenAI API
 * @description Creates embeddings for the given text
 * @param text - Text to generate embeddings for
 * @param model - Embedding model to use
 * @returns Promise<number[]>
 */
export async function createEmbeddings(
  text: string,
  model: string = 'text-embedding-ada-002'
): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model,
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('OpenAI embeddings error:', error)
    throw new Error(`OpenAI embeddings error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculates the cost of a completion based on token usage
 * @description Estimates the cost of an API call
 * @param promptTokens - Number of prompt tokens
 * @param completionTokens - Number of completion tokens
 * @param model - Model used for the completion
 * @returns Cost in cents
 */
export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const modelConfig = OPENAI_MODELS.find(m => m.id === model)
  if (!modelConfig) {
    return 0
  }

  // Simplified cost calculation (actual rates may vary)
  const totalTokens = promptTokens + completionTokens
  return Math.round(totalTokens * modelConfig.costPerToken * 100) // Convert to cents
}

/**
 * Validates OpenAI API key
 * @description Checks if the API key is valid and has access
 * @returns Promise<boolean>
 */
export async function validateApiKey(): Promise<boolean> {
  try {
    await openai.models.list()
    return true
  } catch (error) {
    console.error('OpenAI API key validation failed:', error)
    return false
  }
}
