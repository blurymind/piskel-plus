import { useMemo } from "react";
import { getExtension, getType, humanFileSize } from "./utils.ts";

const Viewer = ({ path, base64, text, size }) => {
  const { name, extension } = useMemo(
    () => ({ name: path.replace(/^.*[\\/]/, ""), extension: getExtension(path) }),
    [path],
  );
  const type = getType(extension);
  console.log({ base64, text });
  return (
    <div>
      <div>{path}</div>
      <div>{name}</div>
      <div>{extension}</div>
      <div>{type}</div>
      <div>{humanFileSize(size)}</div>
      {base64 && type === "image" && <img src={base64} />}
      { type === "text" && <textarea  name="Text1" cols="40" rows="5" defaultValue={text}/> }
    </div>
  );
};

export default Viewer;
