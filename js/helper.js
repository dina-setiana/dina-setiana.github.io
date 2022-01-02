export default class Helper {
  static randomInt(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getOpacity(factor, max = 0.7, min = 0.1) {
    const opacityIncrement =
      (max - min) * Math.abs(Math.sin(factor));
    return min + opacityIncrement;
  }
}