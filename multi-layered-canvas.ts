export type Renderer = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => void;

export class CanvasLayer {
  constructor(
    private readonly _id: string,
    private readonly _renderer: Renderer
  ) {}

  get id() {
    return this._id;
  }

  get renderer() {
    return Object.freeze(this._renderer);
  }
}

class ElementNotFound extends Error {
  constructor(selectors: string) {
    super(`Can not find element "${selectors}"`);
  }
}

export class MultiLayeredCanvas {
  private layers: Array<CanvasLayer> = [];
  private readonly canvas: HTMLCanvasElement;
  private readonly canvas2dContext: CanvasRenderingContext2D;

  constructor(selectors: string | HTMLCanvasElement) {
    this.canvas = this.assertCanvas(selectors);
    this.canvas2dContext = this.canvas.getContext('2d');
  }

  push(...layers: CanvasLayer[]): MultiLayeredCanvas {
    layers.forEach((layer) => {
      if (this.getLayer(layer.id)) {
        throw new CanvasLayerAlreadyExists(layer.id);
      }
    });
    this.layers.push(...layers);
    return this;
  }

  getLayer(id: string): CanvasLayer | null {
    const layer = this.layers.find((l) => l.id === id);
    return layer ?? null;
  }

  at(index: number): CanvasLayer {
    return this.layers[index];
  }

  findIndex(id: string): number {
    return this.layers.findIndex((l) => l.id === id);
  }

  updateLayer(id: string, update: CanvasLayer): MultiLayeredCanvas {
    let layer = this.getLayer(id);
    const layerIndex = this.findIndex(id);
    if (layerIndex === -1) {
      throw new CanvasLayerNotFound(layer.id);
    }

    this.layers.splice(layerIndex, 1, update);
    return this;
  }

  removeLayer(id: string): MultiLayeredCanvas {
    const layer = this.getLayer(id);
    if (!layer) {
      return null;
    }
    this.layers = this.layers.filter((l) => l.id !== id);

    return this;
  }

  render() {
    const canvas = this.canvas;
    const context = this.canvas2dContext;
    context.clearRect(0, 0, canvas.width, canvas.height);

    this.layers.forEach((layer) => {
      layer.renderer(canvas, context);
    });
  }

  private assertCanvas(
    selectors: string | HTMLCanvasElement
  ): HTMLCanvasElement {
    if (typeof selectors !== 'string' && typeof selectors !== 'object') {
      throw new TypeError(
        `Expected string or HTMLCanvasElement got typeof ${typeof selectors}`
      );
    }

    let canvas: HTMLCanvasElement = null;
    if (typeof selectors === 'string') {
      canvas = document.querySelector(selectors);
    }
    if (typeof selectors === 'object') {
      canvas = selectors;
    }
    if (canvas?.tagName !== 'CANVAS') {
      throw new TypeError(
        `Expected HTMLCanvasElement got typeof ${canvas?.tagName}`
      );
    }
    return canvas;
  }
}

class CanvasLayerAlreadyExists extends Error {
  constructor(id?: string) {
    super(`Layer with id ${id} already exists`);
  }
}

class CanvasLayerNotFound extends Error {
  constructor(id?: string) {
    super(`Layer with id ${id} does not exists`);
  }
}
