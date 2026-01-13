import { createFileRoute } from "@tanstack/react-router";
import "@cubone/react-file-manager/dist/style.css";
import { FileManager } from "@cubone/react-file-manager";

import { useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

import Files from "../shared/components/files";

export const Route = createFileRoute("/files")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Files />;
}
