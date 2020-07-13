/**
 * example of a hook using context menu
 */

import { MenuItemConstructorOptions } from "electron";

import React from "react";

const { Menu, MenuItem, getCurrentWindow } = remote;

export type MenuMode = "menu" | "append" | "prepend";
export type TargetType =
  | string
  | React.MutableRefObject<HTMLElement | null>
  | HTMLElement;

export interface UseContextMenuOptions {
  items?: MenuItemConstructorOptions[];
  showInspectElement?: boolean;
}
export default function useContextMenu(
  targetSelectorOrRef:
    | string
    | React.MutableRefObject<HTMLElement | null>
    | HTMLElement,
  options: UseContextMenuOptions,
  dependencies: any[] = []
) {
  React.useEffect(() => {
    const element = getElement(targetSelectorOrRef);
    if (!element) return () => null;

    const browserWindow = getCurrentWindow();

    const handleContextMenu = (event: MouseEvent) => {
      if (event.defaultPrevented || !isTargetElement(event, element)) {
        return;
      }
      event.preventDefault();

      const menu = new Menu();
      if (options.items) {
        options.items.forEach((item) => menu.append(new MenuItem(item)));
      }
      if (options.showInspectElement) {
        menu.append(createInspectMenuItem(event, browserWindow.webContents));
      }
      if (menu.items.length > 0) {
        menu.popup({ window: browserWindow });
      }
    };
    (element as any).addEventListener("contextmenu", handleContextMenu);
    return () =>
      (element as any).removeEventListener("contextmenu", handleContextMenu);
  }, dependencies);
}

function getElement(target: TargetType): HTMLElement | null {
  return typeof target === "string"
    ? document.querySelector(target)
    : (target instanceof HTMLElement && target) || target.current;
}

function isTargetElement(event: MouseEvent, element: HTMLElement) {
  return (
    event.target === element || element.contains(event.target as HTMLElement)
  );
}

function createInspectMenuItem(
  event: MouseEvent,
  webContents: Electron.WebContents
) {
  return new MenuItem({
    id: "inspect",
    label: "Inspect Element",
    enabled: true,
    click() {
      webContents.inspectElement(event.clientX, event.clientY);

      if (webContents.isDevToolsOpened()) {
        webContents.devToolsWebContents.focus();
      }
    },
  });
}
