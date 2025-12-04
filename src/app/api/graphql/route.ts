// src/app/api/graphql/route.ts
import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

// 👉 adjust these imports to match your project
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';

// Create Apollo server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

// This is the "dual-mode" handler (can handle NextApiRequest or NextRequest)
const apolloHandler = startServerAndCreateNextHandler<NextRequest>(apolloServer);

// 🚨 IMPORTANT: do NOT export apolloHandler directly as GET/POST.
// Wrap it in proper route handlers instead.

export async function GET(request: NextRequest): Promise<Response> {
    // apolloHandler(request) returns a Response-like object, but its type is overloaded.
    const res = await (apolloHandler as any)(request);
    return res as Response;
}

export async function POST(request: NextRequest): Promise<Response> {
    const res = await (apolloHandler as any)(request);
    return res as Response;
}

// ❌ NO default export here
// ❌ NO "export const GET = apolloHandler" or "export { apolloHandler as GET }"
