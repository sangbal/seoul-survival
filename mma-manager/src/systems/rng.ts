export class RNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Simple LCG
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Range [min, max)
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Range [min, max] integer
  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  // Box-Muller transform for Gaussian distribution
  gaussian(mean: number, sd: number): number {
    let u = 0, v = 0;
    while(u === 0) u = this.next(); 
    while(v === 0) v = this.next();
    const num = Math.sqrt( -2.0 * Math.log(u) ) * Math.cos( 2.0 * Math.PI * v );
    return num * sd + mean;
  }

  // Clamp helper
  clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }

  // Pick random item from array
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  // Shuffle array (Fisher-Yates)
  shuffle<T>(arr: T[]): T[] {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  // Triangular distribution
  triangular(min: number, max: number, mode: number): number {
    const u = this.next();
    const f = (mode - min) / (max - min);
    if (u <= f) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
  }
}
