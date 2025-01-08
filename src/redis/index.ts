// index.ts
import { Hono } from 'hono';
import { redis } from './redis';
import type { OrderState } from './types';

const app = new Hono();

//=============================================================================
app.post('/order-state', async (c) => {
  try {
    const body = await c.req.json();
    const sessionId = `session:${COMPANY.companyPhone.replace('+', '')}${LAST_ORDER.customerCell.replace('+', '')}`;

    // Check if session exists
    const existingState = await redis.get(sessionId);
    
    if (!existingState) {
      // Initialize new state
      const initialState: OrderState = {
        lastOrder: LAST_ORDER,
        company: COMPANY,
        currentItems: [...LAST_ORDER.items] // Deep copy items
      };
      
      // Store in Redis with 1 hour expiry
      await redis.setEx(sessionId, 3600, JSON.stringify(initialState));
      
      return c.json({
        status: 'initialized',
        state: initialState
      });
    }

    // Return existing state
    return c.json({
      status: 'existing',
      state: JSON.parse(existingState)
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

//=============================================================================
// Update state endpoint
app.put('/order-state', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, updates } = body;
    
    const existingState = await redis.get(sessionId);
    if (!existingState) {
      return c.json({ error: 'Session not found' }, 404);
    }

    const currentState: OrderState = JSON.parse(existingState);
    
    // Update quantities
    if (updates.items) {
      currentState.currentItems = currentState.currentItems.map(item => {
        const updateItem = updates.items.find(u => u.id === item.id);
        return updateItem ? { ...item, quantity: updateItem.quantity } : item;
      });
    }

    // Store updated state
    await redis.setEx(sessionId, 3600, JSON.stringify(currentState));

    return c.json({
      status: 'updated',
      state: currentState
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

//=============================================================================
// Get current state
app.get('/order-state/:sessionId', async (c) => {
  try {
    const { sessionId } = c.req.param();
    const state = await redis.get(sessionId);
    
    if (!state) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json({
      status: 'success',
      state: JSON.parse(state)
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;