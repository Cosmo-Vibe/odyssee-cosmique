export const CONFIG = {
  camera: {
    position: [0, 0, 50] as [number, number, number],
    fov: 75,
    near: 0.1,
    far: 1000,
  },
  cards: {
    spacing: {
      base: 150,
      vertical: 30,
      exponentialFactor: 0.3
    },
    scale: {
      active: [1.2, 1.2, 1] as [number, number, number],
      inactive: [0.8, 0.8, 1] as [number, number, number]
    },
    position: {
      activeOffset: [0, 0, 10] as [number, number, number],
      inactiveOffset: [0, -5, 0] as [number, number, number]
    }
  },
  transition: {
    duration: 2000,
    easing: {
      in: (t: number) => t * t * t,
      out: (t: number) => 1 - Math.pow(1 - t, 3)
    }
  }
};
