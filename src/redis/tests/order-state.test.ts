// tests/order-state.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { redis } from '../redis';
import app from '../index';

describe('Order State API', () => {
  const sessionId = '16042106553177877541461';
  
  beforeAll(async () => {
    // Clear any existing test data
    await redis.del(sessionId);
  });

  afterAll(async () => {
    // Cleanup
    await redis.del(sessionId);
    await redis.quit();
  });

  it('should initialize a new session', async () => {
    const response = await fetch('http://localhost:3000/order-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sessionId })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('initialized');
    expect(data.state.currentItems).toHaveLength(2);
    expect(data.state.lastOrder.customerName).toBe('John Smith');
  });

  it('should update quantities', async () => {
    const response = await fetch('http://localhost:3000/order-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        updates: {
          items: [
            { id: '12', quantity: '5' }  // Update Toilet Paper quantity
          ]
        }
      })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('updated');
    expect(data.state.currentItems.find(item => item.id === '12').quantity).toBe('5');
  });

  it('should get current state', async () => {
    const response = await fetch(`http://localhost:3000/order-state/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.state.currentItems.find(item => item.id === '12').quantity).toBe('5');
    expect(data.state.currentItems.find(item => item.id === '21').quantity).toBe('3');
  });

  it('should handle non-existent session', async () => {
    const response = await fetch('http://localhost:3000/order-state/nonexistent', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    expect(response.status).toBe(404);
    expect(data.error).toBe('Session not found');
  });
});