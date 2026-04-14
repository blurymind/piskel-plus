import "@cubone/react-file-manager/dist/style.css";
import { FileManager } from "@cubone/react-file-manager";

import { useMemo, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import Select, { components } from "react-select";

import TreeView from "./TreeView";
import Viewer from "./Viewer";
import {
  blobToBase64,
  getExtension, getType,
  requestCommits,
  requestUserRepoFileBlob,
  requestUserRepoFiles,
  requestUserRepos
} from "./utils";
const Option = (props: any) => {
  // const CComponent = props.data.icon;
  // console.log({props})
  return (
    <div className="flex rounded-sm" style={{ color: "black" }}>
      {/*<CComponent />*/}
      <components.Option {...props} />
    </div>
  );
};
export const Index = () => {
  const [gitRepos, setGitRepos] = useLocalStorage<Array<any>>("gitRepos", []);
  const [gitRepo, setGitRepo] = useLocalStorage("gitRepo", {});
  const [gitRepoCommits, setGitRepoCommits] = useLocalStorage("gitRepoCommits", []);

  const [gitOwner, setGitOwner] = useLocalStorage("gitOwner", "");
  const [gitToken, setGitToken] = useLocalStorage("gitToken", "");

  const [gitRepoFiles, setGitRepoFiles] = useLocalStorage("gitRepoFiles", {});
  const [selectedGitFile, setSelectedGitFile] = useLocalStorage("selectedGitFile", {});
  const [selectedGitFileBlob, setSelectedGitFileBlob] = useState(null);
  const [selectedGitFileBase64, setSelectedGitFileBase64] = useState(null);
  console.log({ gitRepos });
  const options = gitRepos.status ? []:gitRepos.map((r) => ({ label: r.full_name, value: r }));
  const onChangeEventTarget = (setState) => (ev) => setState(ev.target.value);
  const isValidRepo = gitRepoFiles?.status !== '401' && gitRepos
 
  return (
    <div className="w-full h-full bg-gray-800">
      <div>
        <div className="flex flex-1 gap-3 px-3 py-1">
          <Select
            className="react-select-container w-100"
            classNamePrefix="react-select"
            value={gitRepo}
            options={options}
            isSearchable
            onChange={(next) => {
              setGitRepo(next);
              requestCommits(next.label, gitToken).then((commits) => {
                setGitRepoCommits(commits);
                requestUserRepoFiles(next.label, commits[0]?.sha, gitToken).then((fileTree) => {
                  console.log({ fileTree });
                  setGitRepoFiles(fileTree);
                });
              });
              // requestUserRepoFiles(gitOwner, next.label, next.value.default_branch).then((fileTree) => {
              //   console.log({ fileTree, next });
              // });
              // setGitRepoFiles()
            }}
            components={{ Option }}
            theme="dark"
          />
          <button
            onClick={() => {
              requestUserRepos(gitOwner, gitToken).then((repos) => {
                console.log({repos})
                setGitRepos(repos);
              });
            }}
          >
            --get
          </button>
          {/*Branch:*/}
          {/*<input value={gitRepoBranch} onChange={onChangeEventTarget(setGitRepoBranch)} title="branch:" />*/}
          Owner
          <input value={gitOwner} onChange={onChangeEventTarget(setGitOwner)} title="owner:" />
          Token
          <input value={gitToken} onChange={onChangeEventTarget(setGitToken)} title="access token:" />
        </div>
        <button
          onClick={() => {
            window.open("https://github.com/settings/tokens/new?description=Git%20Token", "_blank", "resizable=yes");
          }}
        >
          Get token
        </button>
        {/*<div className="flex flex-1 flex-col p-4 bg-gray-800">*/}
        {/*  {gitRepoFiles?.tree?.map((item) => (*/}
        {/*    <div key={item.path} title={item.sha}>*/}
        {/*      {item.path}*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
      {isValidRepo ? (
      <TreeView
        gitRepoFiles={gitRepoFiles}
        selectedGitFile={selectedGitFile}
        onSelectFile={(selectedFile) => {
          setSelectedGitFile(selectedFile);
          console.log({ selectedFile });
          const type = getType(getExtension(selectedFile.path))
          requestUserRepoFileBlob(selectedFile.url, gitToken, type==="text").then((blob) => {
            console.log({ blob, type});
            if(type==="text"){
                setSelectedGitFileBlob(blob);
            }else {
              blobToBase64(blob).then((b64) => {
                setSelectedGitFileBase64(b64);
              });
            }
          });
        }}
      />
      ): <div>{gitRepoFiles.status}</div>}

      <Viewer
        path={selectedGitFile.path}
        size={selectedGitFile.size}
        base64={selectedGitFileBase64}
        text={selectedGitFileBlob}
      />
      {/*<FileManager className="w-full h-full bg-gray-800" style={{ color: "black" }} files={files} />*/}
    </div>
  );
};

export default Index;
