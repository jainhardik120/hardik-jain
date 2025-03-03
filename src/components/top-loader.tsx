'use client';

import * as React from 'react';
import NProgress from 'nprogress';

const NextTopLoader = ({ showForHashAnchor = true }): JSX.Element => {
  const styles = (
    <style>
      {/* eslint-disable-next-line max-len, quotes */}
      {`#nprogress{pointer-events:none}#nprogress .bar{background:hsl(var(--foreground));position:fixed;z-index:1600;top: 0;left:0;width:100%;height:3px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,`}
    </style>
  );

  const toAbsoluteURL = (url: string): string => {
    return new URL(url, window.location.href).href;
  };

  const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split('#')[0] === next.href.split('#')[0];
  };

  const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.hostname.replace(/^www\./, '') === next.hostname.replace(/^www\./, '');
  };

  React.useEffect((): ReturnType<React.EffectCallback> => {
    NProgress.configure({
      showSpinner: false,
      trickle: true,
      trickleSpeed: 200,
      minimum: 0.08,
      easing: 'ease',
      speed: 200,
      template: '<div class="bar" role="bar"><div class="peg"></div></div>',
    });

    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash &&
          currentUrlObj.href.replace(currentHash, '') === newUrlObj.href.replace(newHash, '')
        );
      }
      return false;
    }

    // eslint-disable-next-line no-var
    var nProgressClass: NodeListOf<HTMLHtmlElement> = document.querySelectorAll('html');

    const removeNProgressClass = (): void =>
      nProgressClass.forEach((el: Element) => el.classList.remove('nprogress-busy'));

    function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== 'a') {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }

    function handleClick(event: MouseEvent): void {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl !== undefined) {
          const currentUrl = window.location.href;
          const isExternalLink = (anchor as HTMLAnchorElement).target === '_blank';
          const isSpecialScheme = ['tel:', 'mailto:', 'sms:', 'blob:', 'download:'].some((scheme) =>
            newUrl.startsWith(scheme),
          );
          const notSameHost = !isSameHostName(window.location.href, anchor?.href ?? '');
          if (notSameHost) {
            return;
          }
          const isAnchorOrHashAnchor =
            isAnchorOfCurrentUrl(currentUrl, newUrl) ||
            isHashAnchor(window.location.href, anchor?.href ?? '');
          if (!showForHashAnchor && isAnchorOrHashAnchor) {
            return;
          }
          if (
            newUrl === currentUrl ||
            isExternalLink ||
            isSpecialScheme ||
            isAnchorOrHashAnchor ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            !toAbsoluteURL(anchor?.href ?? '').startsWith('http')
          ) {
            NProgress.start();
            NProgress.done();
            removeNProgressClass();
          } else {
            NProgress.start();
          }
        }
      } catch {
        NProgress.start();
        NProgress.done();
      }
    }

    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return pushState.apply(history, args);
      };
    })((window as Window).history);

    ((history: History): void => {
      const replaceState = history.replaceState;
      history.replaceState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return replaceState.apply(history, args);
      };
    })((window as Window).history);

    function handlePageHide(): void {
      NProgress.done();
      removeNProgressClass();
    }

    function handleBackAndForth(): void {
      NProgress.done();
    }

    window.addEventListener('popstate', handleBackAndForth);
    document.addEventListener('click', handleClick);
    window.addEventListener('pagehide', handlePageHide);

    return (): void => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('popstate', handleBackAndForth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return styles;
};
export default NextTopLoader;
