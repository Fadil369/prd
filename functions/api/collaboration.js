/**
 * Collaboration API Routes using Durable Objects
 * Handles real-time collaboration for team projects
 */

import { Hono } from 'hono';

const app = new Hono();

// Create or join collaboration room
app.post('/rooms/:roomId/join', async (c) => {
  try {
    const roomId = c.req.param('roomId');
    const userId = c.get('jwtPayload')?.sub;
    const { projectId, projectType } = await c.req.json();

    if (!userId) {
      return c.json({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      }, 401);
    }

    // Get or create Durable Object for this room
    const roomObjectId = c.env.COLLABORATION_ROOMS.idFromName(roomId);
    const roomObject = c.env.COLLABORATION_ROOMS.get(roomObjectId);

    // Join the room
    const response = await roomObject.fetch('https://room/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        projectId,
        projectType,
        joinedAt: Date.now()
      })
    });

    const data = await response.json();

    return c.json({
      success: true,
      data: {
        roomId,
        ...data
      }
    });

  } catch (error) {
    console.error('Join room error:', error);
    return c.json({
      success: false,
      error: { message: 'Failed to join room', code: 'JOIN_ROOM_ERROR' }
    }, 500);
  }
});

// Leave collaboration room
app.post('/rooms/:roomId/leave', async (c) => {
  try {
    const roomId = c.req.param('roomId');
    const userId = c.get('jwtPayload')?.sub;

    if (!userId) {
      return c.json({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      }, 401);
    }

    const roomObjectId = c.env.COLLABORATION_ROOMS.idFromName(roomId);
    const roomObject = c.env.COLLABORATION_ROOMS.get(roomObjectId);

    await roomObject.fetch('https://room/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    return c.json({ success: true });

  } catch (error) {
    console.error('Leave room error:', error);
    return c.json({
      success: false,
      error: { message: 'Failed to leave room', code: 'LEAVE_ROOM_ERROR' }
    }, 500);
  }
});

export { app as collaborationRoutes };

// ===== DURABLE OBJECT CLASS =====

export class CollaborationRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    switch (path) {
      case '/join':
        return this.handleJoin(request);
      case '/leave':
        return this.handleLeave(request);
      case '/websocket':
        return this.handleWebSocket(request);
      default:
        return new Response('Not found', { status: 404 });
    }
  }

  async handleJoin(request) {
    const { userId, projectId, projectType } = await request.json();
    
    const session = {
      userId,
      projectId,
      projectType,
      joinedAt: Date.now(),
      lastActiveAt: Date.now()
    };

    this.sessions.set(userId, session);
    
    // Broadcast user joined to all sessions
    this.broadcast({
      type: 'user_joined',
      userId,
      timestamp: Date.now()
    });

    return Response.json({
      success: true,
      collaborators: Array.from(this.sessions.values()),
      totalUsers: this.sessions.size
    });
  }

  async handleLeave(request) {
    const { userId } = await request.json();
    
    this.sessions.delete(userId);
    
    // Broadcast user left to all sessions
    this.broadcast({
      type: 'user_left',
      userId,
      timestamp: Date.now()
    });

    return Response.json({ success: true });
  }

  async handleWebSocket(request) {
    // WebSocket upgrade for real-time collaboration
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    // Handle WebSocket messages
    server.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      
      // Broadcast to all other clients
      this.broadcast(data, server);
    });

    server.addEventListener('close', event => {
      // Clean up session when WebSocket closes
      // Implementation depends on how you track WebSocket connections
    });

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  broadcast(message, excludeSocket = null) {
    // Broadcast message to all connected WebSocket clients
    // This would require maintaining a list of active WebSocket connections
    // Implementation would depend on your specific needs
  }
}