import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from '@/graphql/schema';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        // Extract token from Authorization header for authenticated requests
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        // In a real app, validate token and get userId
        // For demo, we'll pass the token as context
        return { token, userId: null };
    },
});

export { handler as GET, handler as POST };
