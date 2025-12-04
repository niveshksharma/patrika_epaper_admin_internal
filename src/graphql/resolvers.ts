import { v4 as uuidv4 } from 'uuid';
import db from '@/data/db.json';

// In-memory database (for demo purposes)
let database = { ...db };

export const resolvers = {
    Query: {
        me: (_: any, __: any, context: { userId?: string }) => {
            if (!context.userId) return null;
            return database.users.find(u => u.id === context.userId) || null;
        },

        users: () => database.users,

        states: () => database.states,

        cities: (_: any, { stateId }: { stateId?: string }) => {
            if (stateId) {
                return database.cities.filter(c => c.stateId === stateId);
            }
            return database.cities;
        },

        epapers: (_: any, { stateId, cityId, date, search }: {
            stateId?: string;
            cityId?: string;
            date?: string;
            search?: string;
        }) => {
            let filtered = [...database.epapers];

            if (stateId) {
                filtered = filtered.filter(e => e.stateId === stateId);
            }
            if (cityId) {
                filtered = filtered.filter(e => e.cityId === cityId);
            }
            if (date) {
                filtered = filtered.filter(e => e.publicationDate === date);
            }
            if (search) {
                const searchLower = search.toLowerCase();
                filtered = filtered.filter(e =>
                    e.title.toLowerCase().includes(searchLower) ||
                    (e.description && e.description.toLowerCase().includes(searchLower))
                );
            }

            // Sort by publication date descending
            filtered.sort((a, b) =>
                new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
            );

            return filtered;
        },

        epaper: (_: any, { id }: { id: string }) => {
            return database.epapers.find(e => e.id === id) || null;
        },

        downloadLogs: (_: any, { userId }: { userId?: string }) => {
            if (userId) {
                return database.downloadLogs.filter(l => l.userId === userId);
            }
            return database.downloadLogs;
        },
    },

    Mutation: {
        signIn: (_: any, { email, password }: { email: string; password: string }) => {
            const user = database.users.find(
                u => u.email === email && u.password === password
            );

            if (!user) {
                return { user: null, token: null, error: 'Invalid email or password' };
            }

            const token = uuidv4();
            const session = {
                id: uuidv4(),
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
            // database.sessions.push(session);

            return {
                user: { ...user, password: undefined },
                token,
                error: null
            };
        },

        signUp: (_: any, { email, password, username }: {
            email: string;
            password: string;
            username: string;
        }) => {
            // Check if email or username already exists
            const existingUser = database.users.find(
                u => u.email === email || u.username === username
            );

            if (existingUser) {
                return {
                    user: null,
                    token: null,
                    error: 'Email or username already exists'
                };
            }

            const newUser = {
                id: uuidv4(),
                email,
                password,
                username,
                createdAt: new Date().toISOString(),
            };

            database.users.push(newUser);

            const token = uuidv4();
            const session = {
                id: uuidv4(),
                userId: newUser.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
            // database.sessions.push(session);

            return {
                user: { ...newUser, password: undefined },
                token,
                error: null
            };
        },

        signOut: () => {
            return true;
        },

        downloadEPaper: (_: any, { epaperId, username }: {
            epaperId: string;
            username: string;
        }) => {
            const epaper = database.epapers.find(e => e.id === epaperId);

            if (!epaper) {
                return { success: false, url: null, error: 'EPaper not found' };
            }

            // In a real app, this would generate a watermarked PDF
            // For demo, we return a mock URL
            const downloadUrl = `/api/download?id=${epaperId}&user=${username}&timestamp=${Date.now()}`;

            return { success: true, url: downloadUrl, error: null };
        },

        logDownload: (_: any, { userId, epaperId }: { userId: string; epaperId: string }) => {
            const log = {
                id: uuidv4(),
                userId,
                epaperId,
                downloadedAt: new Date().toISOString(),
            };

            database.downloadLogs.push(log);
            return log;
        },
    },

    // Field resolvers
    EPaper: {
        state: (parent: { stateId: string }) => {
            return database.states.find(s => s.id === parent.stateId);
        },
        city: (parent: { cityId: string }) => {
            return database.cities.find(c => c.id === parent.cityId);
        },
    },

    State: {
        cities: (parent: { id: string }) => {
            return database.cities.filter(c => c.stateId === parent.id);
        },
    },

    City: {
        state: (parent: { stateId: string }) => {
            return database.states.find(s => s.id === parent.stateId);
        },
    },

    DownloadLog: {
        user: (parent: { userId: string }) => {
            const user = database.users.find(u => u.id === parent.userId);
            return user ? { ...user, password: undefined } : null;
        },
        epaper: (parent: { epaperId: string }) => {
            return database.epapers.find(e => e.id === parent.epaperId);
        },
    },
};
