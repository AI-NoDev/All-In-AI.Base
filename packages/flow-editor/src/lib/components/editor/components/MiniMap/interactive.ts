import { XYMinimap, type PanZoomInstance, type XYMinimapUpdate } from '@xyflow/system';

interface StoreViewport {
  viewport: { x: number; y: number; zoom: number };
}

export type UseInteractiveParams = {
  panZoom: PanZoomInstance;
  store: StoreViewport;
  getViewScale: () => number;
} & XYMinimapUpdate;

export default function interactive(domNode: Element, params: UseInteractiveParams) {
  const minimap = XYMinimap({
    domNode,
    panZoom: params.panZoom,
    getTransform: () => {
      const { viewport } = params.store;
      return [viewport.x, viewport.y, viewport.zoom];
    },
    getViewScale: params.getViewScale
  });

  minimap.update({
    translateExtent: params.translateExtent,
    width: params.width,
    height: params.height,
    inversePan: params.inversePan,
    zoomStep: params.zoomStep,
    pannable: params.pannable,
    zoomable: params.zoomable
  });

  function update(params: UseInteractiveParams) {
    minimap.update({
      translateExtent: params.translateExtent,
      width: params.width,
      height: params.height,
      inversePan: params.inversePan,
      zoomStep: params.zoomStep,
      pannable: params.pannable,
      zoomable: params.zoomable
    });
  }

  return {
    update,
    destroy() {
      minimap.destroy();
    }
  };
}
