import { createHandler, StartServer } from "@solidjs/start/server";

const SITE_URL = "https://robert.nemzilla.net";
const SITE_TITLE = "Robert Nemzek | Portfolio";
const SITE_DESCRIPTION =
  "Robert Nemzek — full-stack engineer. Portfolio hub for the nemzilla.net ecosystem: live project metrics, StreamZilla, and more.";

// schema.org professional profile (ProfilePage wrapping a Person)
const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Robert Nemzek",
    url: SITE_URL,
    jobTitle: "Full-Stack Engineer",
    knowsAbout: ["SolidJS", "TypeScript", "Go", "PostgreSQL", "Hono"],
    sameAs: ["https://github.com/rnemzek", "https://nemzilla.net"],
  },
});

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{SITE_TITLE}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta name="theme-color" content="#060609" />
          <link rel="canonical" href={`${SITE_URL}/`} />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

          {/* OpenGraph */}
          <meta property="og:type" content="profile" />
          <meta property="og:site_name" content="nemzilla.net" />
          <meta property="og:title" content={SITE_TITLE} />
          <meta property="og:description" content={SITE_DESCRIPTION} />
          <meta property="og:url" content={`${SITE_URL}/`} />
          <meta property="og:image" content={`${SITE_URL}/og.png`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={SITE_TITLE} />
          <meta name="twitter:description" content={SITE_DESCRIPTION} />
          <meta name="twitter:image" content={`${SITE_URL}/og.png`} />

          {/* Structured data — professional profile */}
          <script type="application/ld+json" innerHTML={JSON_LD} />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
