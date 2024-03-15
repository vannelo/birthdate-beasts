import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "./css/tailwind.css";
import app from "./css/app.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: app },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover your animal alter-ego" />
        <meta
          property="og:image"
          content="https://birthdate-beasts-ai.vercel.app/img/meta.jpg"
        />
        <meta property="og:title" content="Birthdate Beasts AI" />
        <meta
          property="og:description"
          content="Discover your animal alter-ego"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content="https://birthdate-beasts-ai.vercel.app/img/meta.jpg"
        />
        <meta property="twitter:title" content="Birthdate Beasts AI" />
        <meta
          property="twitter:description"
          content="Discover your animal alter-ego"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
