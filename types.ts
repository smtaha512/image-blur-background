export interface Concrete {
  PIXEL_RATIO?: number;
  viewports?: ConcreteViewport[];
  Viewport?: ConcreteViewport;
  Scene?: ConcreteScene;
  Hit?: ConcreteHit;
  Layer?: ConcreteLayer;
}

export interface ConcreteViewportConfig {
  width?: number;
  height?: number;
  container?: HTMLElement;
}

export interface ConcreteViewport {
  (config: ConcreteViewportConfig): void;
  layers?: [];
  setSize?: (width: number, height: number) => void;
  prototype: ConcreteViewportPrototype;
}

interface ConcreteViewportPrototype {
  add: (layer: ConcreteLayer) => ConcreteLayer;
  setSize?: (width: number, height: number) => void;
  getIntersection?: (x: number, y: number) => number;
  getIndex?: () => number | null;
  destroy: () => void;
  render: () => void;
}

interface ConcreteLayer {
  (config: ConcreteLayerConfig): void;
  setSize?: (width: number, height: number) => void;
  width?: number;
  height?: number;
  viewport?: ConcreteLayer;
  prototype: ConcreteLayerPrototype;
}
export interface ConcreteLayerConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  contextType?: ContextType;
}

export interface ConcreteLayerPrototype {
  setPosition: (x: number, y: number) => ThisType<ConcreteLayer>;
  setSize: (width: number, height: number) => ThisType<ConcreteLayer>;
  moveUp: () => ThisType<ConcreteLayer>;
  moveDown: () => ThisType<ConcreteLayer>;
  moveToTop: () => void;
  moveToBottom: () => ThisType<ConcreteLayer>;
  getIndex: () => number | null;
  destroy: () => void;
}

export interface ConcreteScene {
  (config?: ConcreteSceneConfig): void;
}

export interface ConcreteSceneConfig {
  contextType?: ContextType;
  width?: number;
  height?: number;
}

export interface ConcreteHit {
  (config: ConcreteHitConfig): void;
}

export interface ConcreteHitConfig {
  width?: number;
  height?: number;
  contextType?: ContextType;
}

type ContextType = '2d' | 'bitmaprenderer' | 'webgl' | 'webgl2' | string;
