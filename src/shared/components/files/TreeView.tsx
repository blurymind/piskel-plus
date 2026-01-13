// import React from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { useMemo } from "react";
import "./tree.css";
import { pathListToTree } from "./utils.ts";
import { useLocalStorage } from "@uidotdev/usehooks";

const DTreeView = ({ gitRepoFiles, onSelectFile = () => {}, selectedGitFile }) => {
  const data = useMemo(() => {
    const converted = pathListToTree(gitRepoFiles.tree);
    const data = flattenTree({ name: "", children: converted });
    return data;
  }, [gitRepoFiles]);
  const [expandedIds, setexpandedIds] = useLocalStorage("expandedIdsTree", []);

  return (
    <div>
      <div className="directory">
        <TreeView
          data={data}
          expandedIds={expandedIds}
          onExpand={(el)=> {
            setexpandedIds(Array.from(el.treeState.expandedIds));
          }}
          aria-label="directory tree"
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
            <div
              {...getNodeProps()}
              style={{ paddingLeft: 20 * (level - 1) }}
              className={`flex flex-1 items-center ${selectedGitFile.path === element.metadata.path ? "bg-yellow-400 text-black" : ""}`}
            >
              <div>{isBranch ? <FolderIcon isOpen={isExpanded} /> : <FileIcon filename={element.name} />}</div>
              <div
                onClick={() => {
                  if (!isBranch && onSelectFile) {
                    onSelectFile(element.metadata);
                  }
                }}
                className={`flex flex-1`}
              >
                <div>{element.name}</div>
                {element.metadata.size && <div>({element.metadata.size})</div>}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

const FolderIcon = ({ isOpen }) =>
  isOpen ? <FaRegFolderOpen color="e8a87c" className="icon" /> : <FaRegFolder color="e8a87c" className="icon" />;

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    default:
      return null;
  }
};

export default DTreeView;
