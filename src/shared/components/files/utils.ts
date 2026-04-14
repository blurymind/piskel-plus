export function getFile(data) {
  return fetch(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${data.token}`,
    },
  }).then((res) => res.json());
}

export function setFile(data) {
  //todo this wont work unless adding sha or deleting the file first
  console.log({ setToFile: data.content, data });
  return fetch(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}`, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      message: "upload data from api",
      content: data.content,
      sha: data.sha,
    }),
  }).then((res) => res.json());
}

function uploadImage(data) {
  //todo does it also work for text
  return fetch(`https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.name}`, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      message: "upload image from api",
      content: data.content,
    }),
  }).then((res) => res.json());
}

function insertImage(src) {
  const newImage = document.createElement("img");
  newImage.src = src;

  // document.querySelector(".img").innerHTML = newImage.outerHTML;
}

function getRandomName(type) {
  if (type.endsWith("png")) {
    return [Date.now(), ".png"].join("");
  }
  return [Date.now(), ".jpeg"].join("");
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log({ reader });
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

async function parseClipboardData(callback) {
  const items =
    (await navigator.clipboard.read().catch((err) => {
      console.error(err);
    })) ?? [];
  for (let item of items) {
    for (let type of item.types) {
      if (type.startsWith("image/")) {
        console.log("item-->: ", item);
        item
          .getType(type)
          .then(blobToBase64)
          .then((srcData) => {
            insertImage(srcData);
            callback &&
              callback({
                content: srcData,
                name: getRandomName(type),
                type: type,
              });
          });
        return true;
      }
    }
  }
}

// list repositories of user
export function requestUserRepos(username, token) {
  return fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function requestCommits(repository, token) {
  return fetch(`https://api.github.com/repos/${repository}/commits`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}
// https://codepen.io/blurymind/pen/JjxLGxE
// https://github.com/blurymind/renjs-game-testbed
// list files inside of a user repository
// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
export function requestUserRepoFiles(repository, sha, token) {
  ///repos/{owner}/{repo}/git/trees/{tree_sha}'
  return fetch(`https://api.github.com/repos/${repository}/git/trees/${sha}?recursive=1`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

export function requestUserRepoFileBlob(url, token, isText = false) {
  ////repos/{owner}/{repo}/git/blobs/{file_sha}
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (isText) return res.text();
    return res.blob();
  });
}

//https://github.com/pthm/node-path-list-to-tree/blob/master/src/index.ts
export interface TreeNode {
  name: string;
  children: TreeNode[];
  metadata: any;
}

function createNode(path: string[], file: any, tree: TreeNode[]): void {
  const name = path.shift();
  const idx = tree.findIndex((e: TreeNode) => {
    return e.name == name;
  });
  if (idx < 0) {
    tree.push({
      name,
      children: [],
      metadata: file,
    });
    if (path.length !== 0) {
      createNode(path, file, tree[tree.length - 1].children);
    }
  } else {
    createNode(path, file, tree[idx].children);
  }
}

export const pathListToTree = (data: Array<{ path: string; data: any }>): TreeNode[] => {
  const tree: TreeNode[] = [];
  if(!data) return []
  for (let i = 0; i < data.length; i++) {
    const file = data[i];
    const path: string = file?.path ?? "";
    const split: string[] = path?.split("/");
    createNode(split, file, tree);
  }
  return tree;
};

export const humanFileSize = (size) => {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +(size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
};

export const getType = (extension: string) => {
  if (["jpeg", "png", "webp", "jpg"].includes(extension.toLowerCase())) {
    return "image";
  }
  if (["ogg", "webm", "mp4", "wav"].includes(extension.toLowerCase())) {
    return "media";
  }
  if (extension.toLowerCase() === "json") {
    return "json";
  }
  return "text";
};

export const getExtension = path=>path.slice(path.lastIndexOf(".") + 1)

