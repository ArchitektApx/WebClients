export type APP = "MAIL" | "CALENDAR";

export const DEFAULT_WINDOW_WIDTH = 1200;
export const DEFAULT_WINDOW_HEIGHT = 800;

export const PARTITION = "persist:app";
export const MACOS_PARTITION = "persist:macos";

export const ALLOWED_PERMISSIONS = ["notifications", "clipboard-sanitized-write", "persistent-storage"];

export const ALLOWED_OAUTH_URLS = [
    "https://accounts.google.com/",
    "https://login.microsoftonline.com/",
    "https://login.live.com/",
];

export const STORE_WINDOW_KEY = "WindowsStore";

export const WINDOW_SIZES = {
    DEFAULT_WIDTH: 1024,
    DEFAULT_HEIGHT: 768,
    MIN_WIDTH: 768,
    MIN_HEIGHT: 576,
    NEW_WINDOW_SHIFT: 30,
};
