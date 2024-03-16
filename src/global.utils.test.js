import { expect, test, describe } from 'vitest';
import { Utils } from './global-utils';
import { UtilsB } from './global-utils-b';
const { sum } = Utils;
const { getDistanceFromWrappableRange, sliceWrap } = UtilsB;

describe('utils - sum', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

describe('utils - getDistanceFromWrappableRange', () => {
  test('expected result', () => {
    const f = getDistanceFromWrappableRange;
    // range: 0 <-> 3
    // range: 0 - 1 - 2 - 3
    // range count: 4
    expect(f(3, 0, 0)).toEqual({ l: 0, r: 0 });
    expect(f(3, 0, 1)).toEqual({ l: 3, r: 1 });
    expect(f(3, 0, 2)).toEqual({ l: 2, r: 2 });
    expect(f(3, 0, 3)).toEqual({ l: 1, r: 3 });

    expect(f(3, 1, 0)).toEqual({ l: 1, r: 3 });
    expect(f(3, 1, 1)).toEqual({ l: 0, r: 0 });
    expect(f(3, 1, 2)).toEqual({ l: 3, r: 1 });
    expect(f(3, 1, 3)).toEqual({ l: 2, r: 2 });

    expect(f(3, 2, 0)).toEqual({ l: 2, r: 2 });
    expect(f(3, 2, 1)).toEqual({ l: 1, r: 3 });
    expect(f(3, 2, 2)).toEqual({ l: 0, r: 0 });
    expect(f(3, 2, 3)).toEqual({ l: 3, r: 1 });

    expect(f(3, 3, 0)).toEqual({ l: 3, r: 1 });
    expect(f(3, 3, 1)).toEqual({ l: 2, r: 2 });
    expect(f(3, 3, 2)).toEqual({ l: 1, r: 3 });
    expect(f(3, 3, 3)).toEqual({ l: 0, r: 0 });

  });
});

describe('utils - sliceWrap', () => {
  test('return expected result', () => {
    const s = ['zero', 'one', 'two', 'three', 'four', 'five'];
    const index = 3;
    const distance = 5;
    const expectedRight = ["three", "four", "five", "zero", "one"];
    const expectedLeft = ["three", "two", "one", "zero", "five"];
    expect(sliceWrap(s, index, distance)).toEqual(expectedRight);
    expect(sliceWrap(s, index, -1 * distance)).toEqual(expectedLeft);

  });
});