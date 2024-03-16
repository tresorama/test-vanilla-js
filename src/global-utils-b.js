export const UtilsB = {
  /**
     * 
     * @param {Number} rangeMax 
     * @param {Number} fromValue 
     * @param {Number} toValue 
     */
  getDistanceFromWrappableRange: function (rangeMax, fromValue, toValue) {
    if (fromValue === toValue) return { l: 0, r: 0 };
    return {
      l: fromValue > toValue ? fromValue - toValue : (rangeMax - toValue + fromValue) + 1,
      r: toValue > fromValue ? toValue - fromValue : (rangeMax - fromValue + toValue) + 1,
    };
  },
  // ARRAY
  /**
   * @template T
   * @param {T[]} arr 
   * @param {number} fromIndex - index of the first item of the result array
   * @param {number} distance - If negative "go left", if positive "go right"
   */
  sliceWrap: function (arr, fromIndex, distance) {
    if (distance > 0) {
      return [...arr, ...arr].slice(fromIndex, fromIndex + distance);
    }
    // fromIndex  => 3
    // arr.length => 6
    const last = arr.length + fromIndex + 1;// 10
    const first = last + distance;//5
    const result = [...arr, ...arr].slice(first, last);
    const reversed = [...result].reverse();
    return reversed;
  },
};
