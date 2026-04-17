import Jszip from "jszip";
import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { SpriteAnimator } from "react-sprite-animator";

// todo add image sequence
const fileTypes = ["ZIP"];

import { createSheetFromImages, getImagesFromZip } from "./utils";

const buttonClass = "border-1 border-gray-400 px-2 rounded-sm hover:bg-gray-400/50";
export const FileImport = ({ onCancel, onImport }) => {
  const spritePrevRef = useRef(null);
  const [newFileName, setNewFileName] = useState("");
  const [draggedFiles, setDraggedFiles] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [fps, setFps] = useState(12);
  const [frame, setFrame] = useState(0);

  const onConfirmDraggedFile = () => {
    onImport(draggedFiles, newFileName);
  };

  const handleDropFile = (inFile) => {
    const reader = new FileReader();
    const fileName = inFile.name.split(".")[0];

    reader.addEventListener("load", () => {
      const zip = new Jszip();
      zip.loadAsync(reader.result.split(",")[1], { base64: true }).then((zipData) => {
        getImagesFromZip(zipData).then(({ imageFrames, maxWidth, maxHeight }) => {
          setNewFileName(fileName);
          if (imageFrames.length === 0) return;
          const spriteSheet = createSheetFromImages(imageFrames);
          setDraggedFiles({ imageFrames, maxWidth, maxHeight, spriteSheet });
          console.log({ imageFrames });
        });
      });
    });
    if (inFile) {
      reader.readAsDataURL(inFile);
    }
  };

  const onWheelZoom = (e) => {
    setZoom((prev) => (e.deltaY > 0 ? prev + 0.1 : prev - 0.1));
  };
  const onWheelFps = (e) => {
    setFps((prev) => {
      return e.deltaY > 0 ? prev + 1 : prev - 1;
    });
    spritePrevRef?.current?.reset();
    console.log({ spritePrevRef });
  };
  return (
    <div
      style={{ maxWidth: "90vw", maxHeight: "80vh", minWidth: 100, minHeight: 100 }}
      className="w-full h-full bg-gray-900/80 hover:bg-gray-900/90 overflow-hidden rounded-md p-2 border-1 border-gray-200"
    >
      {draggedFiles ? (
        <div className="flex flex-col gap-3 relative h-full">
          <div className="flex flex-row gap-3">
            <div>name: </div>
            <input
              className="border-1 border-amber-200 px-3 rounded-sm"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            ></input>
            <div>frames x {draggedFiles?.imageFrames?.length}</div>
          </div>

          <div
            onWheel={onWheelZoom}
            className="overflow-hidden h-full flex-1"
            style={{ imageRendering: "pixelated" }}
            title="Scroll to zoom"
          >
            <SpriteAnimator
              className="mb-5"
              scale={zoom}
              fps={fps}
              key={fps}
              ref={spritePrevRef}
              sprite={draggedFiles?.spriteSheet?.src}
              width={draggedFiles?.maxWidth}
              height={draggedFiles?.maxHeight}
              onEnd={() => console.log("end")}
            />
          </div>
          <div className="flex flex-row gap-3 sticky bottom-0 self-end">
            <div
              onWheel={onWheelZoom}
              className={buttonClass}
              title="Zoom level. Click to reset"
              onClick={() => setZoom(1)}
            >
              zoom: {zoom.toFixed(1)}
            </div>
            <div onWheel={onWheelFps} className={buttonClass} title="Fps. Click to reset" onClick={() => setFps(12)}>
              fps: {fps}
            </div>

            <button className={buttonClass} onClick={onConfirmDraggedFile}>
              Open
            </button>
            <button className={buttonClass} onClick={() => onCancel()}>
              cancel
            </button>
            <button className={buttonClass} onClick={() => setDraggedFiles(null)}>
              back
            </button>
          </div>
        </div>
      ) : (
        <FileUploader
          classes="w-100 min-h-100"
          handleChange={handleDropFile}
          name="file"
          types={fileTypes}
          label="Drop zip with pngs"
          uploadedLabel="Drop zip"
        />
      )}
    </div>
  );
};
export default memo(FileImport);
