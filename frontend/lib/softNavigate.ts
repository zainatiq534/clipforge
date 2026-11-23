import { startTransition } from "react";

type NavRouter = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

/** Non-blocking route change — keeps UI responsive while the next page opens. */
export function softPush(router: NavRouter, href: string) {
  startTransition(() => {
    router.push(href);
  });
}

export function softReplace(router: NavRouter, href: string) {
  startTransition(() => {
    router.replace(href);
  });
}
