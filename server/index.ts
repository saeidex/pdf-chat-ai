import createApp from "@/server/lib/create-app";
import { authMiddleware } from "@/server/middlewares/auth";
import chats from "@/server/routes/chats";
import posts from "@/server/routes/posts";
import upload from "@/server/routes/upload";
import { clerkMiddleware } from "@hono/clerk-auth";

const app = createApp();

app.use("*", clerkMiddleware(), authMiddleware());

const routes = [chats, posts, upload] as const;

routes.forEach((route) => {
    app.route("/", route);
});

export type AppType = (typeof routes)[number];
export { app };
