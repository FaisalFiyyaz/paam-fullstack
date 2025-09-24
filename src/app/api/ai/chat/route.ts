/**
 * AI Chat API endpoint
 * @fileoverview Handles AI chat completions with multiple providers
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createChatCompletion } from '@/lib/ai/openai'
import { db } from '@/lib/db'
import { aiConversations, aiMessages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { ApiResponse } from '@/types'

/**
 * Chat request interface
 * @interface ChatRequest
 */
interface ChatRequest {
  message: string
  conversationId?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

/**
 * POST /api/ai/chat
 * @description Creates a new chat completion
 * @param request - Chat request data
 * @returns Promise<NextResponse<ApiResponse>>
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: ChatRequest = await request.json()
    const { message, conversationId, model = 'gpt-3.5-turbo', temperature = 0.7, maxTokens = 1000 } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    let conversation
    
    // Get or create conversation
    if (conversationId) {
      conversation = await db.query.aiConversations.findFirst({
        where: eq(aiConversations.id, conversationId),
        with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      })
      
      if (!conversation || conversation.userId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Conversation not found' },
          { status: 404 }
        )
      }
    } else {
      // Create new conversation
      const [newConversation] = await db.insert(aiConversations).values({
        userId,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        provider: 'openai',
        model,
      }).returning()
      
      conversation = newConversation
    }

    // Prepare messages for API call
    const messages = conversation.messages?.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    })) || []

    // Add user message
    messages.push({
      role: 'user',
      content: message,
    })

    // Call OpenAI API
    const completion = await createChatCompletion({
      messages,
      model,
      temperature,
      maxTokens,
    })

    // Save user message to database
    await db.insert(aiMessages).values({
      conversationId: conversation.id,
      role: 'user',
      content: message,
      tokens: 0, // Would need to calculate actual tokens
      cost: 0,
    })

    // Save AI response to database
    await db.insert(aiMessages).values({
      conversationId: conversation.id,
      role: 'assistant',
      content: completion.content,
      tokens: completion.usage.totalTokens,
      cost: 0, // Would need to calculate actual cost
      metadata: {
        model: completion.model,
        temperature,
        maxTokens,
        finishReason: completion.finishReason,
      },
    })

    // Update conversation totals
    await db.update(aiConversations)
      .set({
        totalTokens: (conversation.totalTokens || 0) + completion.usage.totalTokens,
        totalCost: (conversation.totalCost || 0) + 0, // Would need to calculate actual cost
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversation.id))

    const response = {
      conversationId: conversation.id,
      message: completion.content,
      usage: completion.usage,
      model: completion.model,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/chat
 * @description Retrieves chat conversations for the authenticated user
 * @param request - Request object with query parameters
 * @returns Promise<NextResponse<ApiResponse>>
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await db.query.aiConversations.findFirst({
        where: eq(aiConversations.id, conversationId),
        with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      })

      if (!conversation || conversation.userId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Conversation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: conversation,
      })
    } else {
      // Get user's conversations with pagination
      const offset = (page - 1) * limit
      
      const conversations = await db.query.aiConversations.findMany({
        where: eq(aiConversations.userId, userId),
        orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
        limit,
        offset,
      })

      const total = await db
        .select({ count: aiConversations.id })
        .from(aiConversations)
        .where(eq(aiConversations.userId, userId))

      return NextResponse.json({
        success: true,
        data: conversations,
        metadata: {
          total: total.length,
          page,
          limit,
        },
      })
    }
  } catch (error) {
    console.error('Get conversations error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
