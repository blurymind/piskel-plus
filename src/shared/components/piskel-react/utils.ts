import { useCallback } from "react";

export const usePiskel = ({piskelRef}) => {
    const getPiskel = () => piskelRef.current?.contentWindow?.pskl;

    const loadSprite = useCallback((sprite) => {
    const pskl = getPiskel();
    if (!pskl || !sprite) return;
    const app = pskl.app;
    const fps = sprite.piskel.fps;
    const piskel = sprite.piskel;
    const descriptor = new pskl.model.piskel.Descriptor(piskel.name, piskel.description, true);
    pskl.utils.serialization.Deserializer.deserialize(sprite, function (piskel) {
        piskel.setDescriptor(descriptor);
    
        app.piskelController.setPiskel(piskel);
        // app.previewController.previewActionsController.piskelController.setFPS(fps);
    });
   
    // setCurrentName(sprite.piskel.name)
    // console.log({ app, fps });
    // }, [setCurrentName]);
    return {}
}