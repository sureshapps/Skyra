import { SITE } from "@/lib/seo/site";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        <nav className="site-footer-nav" aria-label="Project links">
          <a href={SITE.repository} rel="me external noopener" target="_blank">
            Source on GitHub
          </a>
          <a
            href={SITE.licenseUrl}
            rel="license external noopener"
            target="_blank"
          >
            {SITE.license}
          </a>
          <a href="/humans.txt" rel="author">
            humans.txt
          </a>
        </nav>
        <p>
          Maintained by{" "}
          <a href={SITE.maintainerUrl} rel="author external noopener" target="_blank">
            {SITE.maintainer}
          </a>
          . Weather data from Open-Meteo
        </p>
        <p>
          Images and media may belong to their respective owners. Alerts are
          forecast tips, not official government warnings.
        </p>
      </div>
    </footer>
  );
}
