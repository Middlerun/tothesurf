import React from 'react';

import { routeDistance, pDistance, nearestSegment, distanceAlongSegment } from '../src/routeMath'

import renderer from 'react-test-renderer';

describe('pDistance', () => {
  it('finds the distance between a point and a line segment', () => {
    expect(pDistance(3, 2, 1, 1, 2, 2)).toBeCloseTo(111127.18798166409, 5)
    expect(pDistance(1, 0, 1, 1, 2, 2)).toBeCloseTo(111194.92664455874, 5)
    expect(pDistance(2, 1, 1, 1, 2, 2)).toBeCloseTo(78617.20677100743, 5)
  })
})

describe('nearestSegment', () => {
  it('finds the nearest route segment for a point', () => {
    expect(nearestSegment({ latitude: -33.875387, longitude: 151.246449 })).toBe(42)
  })
})

describe('distanceAlongSegment', () => {
  it('finds a point\'s distance along a segment', () => {
    expect(distanceAlongSegment(1, 0, 1, 1, 2, 2)).toBe(0)
    expect(distanceAlongSegment(3, 2, 1, 1, 2, 2)).toBeCloseTo(157225.4320380729, 5)
    expect(distanceAlongSegment(1.5, 1, 1, 1, 2, 2)).toBeCloseTo(39309.5388913241, 5)
  })
})
