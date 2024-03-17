import { useEffect, useState } from "react";
import { type MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "../css/tailwind.css";
import app from "../css/app.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: app },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Birthdate Beasts" },
    { name: "description", content: "Discover your animal alter ego!" },
  ];
};

export default function Index() {
  const [files, setFiles] = useState<any>([]);

  useEffect(() => {
    async function fetchFiles() {
      const response = await fetch("/files");
      const fileList = await response.json();
      setFiles(fileList);
    }

    fetchFiles();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h2
        className="
        text-3xl
        text-center
        font-bold
        my-8
        text-white
      "
      >
        Images
      </h2>
      <div
        className="images-grid grid 
        grid-cols-6
      "
      >
        {files.map((file: any, index: number) => (
          <div key={index} className="image-container">
            <a href={file.url} target="_blank" rel="noreferrer">
              <img
                src={file.url}
                alt={file.name}
                className="image"
                style={{ width: "100%", height: "auto" }}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
