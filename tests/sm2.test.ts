import { describe, it, expect } from 'vitest'
import { updateSm2 } from '../lib/sm2'

describe('SM-2 Algorithm', () => {
  it('should handle first review correctly', () => {
    const result = updateSm2({
      quality: 4,
      prevEase: 2.5,
      prevInterval: 0,
      prevReps: 0,
    })
    
    expect(result.reps).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.ease).toBeGreaterThan(2.5)
    expect(result.nextDue).toBeInstanceOf(Date)
  })

  it('should handle second review correctly', () => {
    const result = updateSm2({
      quality: 4,
      prevEase: 2.6,
      prevInterval: 1,
      prevReps: 1,
    })
    
    expect(result.reps).toBe(2)
    expect(result.interval).toBe(6)
    expect(result.ease).toBeGreaterThan(2.6)
  })

  it('should handle failed review (quality < 3)', () => {
    const result = updateSm2({
      quality: 2,
      prevEase: 2.5,
      prevInterval: 6,
      prevReps: 2,
    })
    
    expect(result.reps).toBe(0)
    expect(result.interval).toBe(1)
    expect(result.ease).toBe(2.5)
  })

  it('should maintain minimum ease factor', () => {
    const result = updateSm2({
      quality: 0,
      prevEase: 1.3,
      prevInterval: 1,
      prevReps: 0,
    })
    
    expect(result.ease).toBeGreaterThanOrEqual(1.3)
  })

  it('should handle all quality ratings', () => {
    for (let quality = 0; quality <= 5; quality++) {
      const result = updateSm2({
        quality: quality as 0 | 1 | 2 | 3 | 4 | 5,
        prevEase: 2.5,
        prevInterval: 1,
        prevReps: 1,
      })
      
      expect(result.ease).toBeGreaterThanOrEqual(1.3)
      expect(result.interval).toBeGreaterThanOrEqual(1)
      expect(result.reps).toBeGreaterThanOrEqual(0)
      expect(result.nextDue).toBeInstanceOf(Date)
    }
  })
})
