import { app } from "~/server/hono";

export const GET = ({ request }: { request: Request }) => app.fetch(request);
export const POST = ({ request }: { request: Request }) => app.fetch(request);
