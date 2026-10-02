export type Theme = "light" | "dark";

export const THEME_KEY = "skyra-theme";
const EVENT = "skyra-themechange";
const META_COLOR: Record<Theme, string> = {
  light: "#f3f7fb",
  dark: "#070b12",
};

/** Runs inline in <head> before paint so there is no wrong-theme flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_KEY}",t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var d=document.documentElement;d.setAttribute("data-theme",t);d.style.colorScheme=t;var m=${JSON.stringify(META_COLOR)};var f=function(){var e=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<e.length;i++)e[i].setAttribute("content",m[t])};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()}catch(e){}})();`;

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function getServerTheme(): Theme {
  return "dark";
}

export function setTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-anim");
  root.setAttribute("data-theme", next);
  root.style.colorScheme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.setAttribute("content", META_COLOR[next]));
  window.dispatchEvent(new Event(EVENT));
  window.setTimeout(() => root.classList.remove("theme-anim"), 300);
}

export function subscribeTheme(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
