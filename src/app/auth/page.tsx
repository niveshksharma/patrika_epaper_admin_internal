'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs/Tabs';
import { Toaster } from '@/components/ui/Toast/Toast';
import { useToast } from '@/components/ui/Toast/useToast';
import { Newspaper, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';
import styles from './page.module.css';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
});

export default function AuthPage() {
    const router = useRouter();
    const { user, loading, signIn, signUp } = useAuth();
    const { toasts, toast, dismiss } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingText}>Loading...</div>
            </div>
        );
    }

    if (user) {
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            loginSchema.parse({ email: loginEmail, password: loginPassword });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                toast({
                    title: 'Validation Error',
                    // description: err?.errors[0].message,
                    variant: 'destructive',
                });
                return;
            }
        }

        setIsSubmitting(true);
        const { error } = await signIn(loginEmail, loginPassword);
        setIsSubmitting(false);

        if (error) {
            toast({
                title: 'Login Failed',
                description: error.message === 'Invalid email or password'
                    ? 'Invalid email or password. Please try again.'
                    : error.message,
                variant: 'destructive',
            });
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            signupSchema.parse({
                email: signupEmail,
                password: signupPassword,
                username: signupUsername,
            });
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast({
                    title: 'Validation Error',
                    // description: err.errors[0].message,
                    variant: 'destructive',
                });
                return;
            }
        }

        setIsSubmitting(true);
        const { error } = await signUp(signupEmail, signupPassword, signupUsername);
        setIsSubmitting(false);

        if (error) {
            let message = error.message;
            if (message.includes('already exists')) {
                message = 'This email or username is already registered.';
            }
            toast({
                title: 'Signup Failed',
                description: message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Account Created',
                description: 'Welcome to ePaper Hub!',
            });
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Logo Section */}
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Newspaper />
                    </div>
                    <h1 className={styles.brandTitle}>ePaper Hub</h1>
                    <p className={styles.brandSubtitle}>Your digital newspaper archive</p>
                </div>

                {/* Auth Card */}
                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                        <CardTitle className={styles.cardTitle}>Welcome</CardTitle>
                        <CardDescription className={styles.cardDescription}>
                            Sign in to access your ePapers
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                        <Tabs defaultValue="login">
                            <TabsList className={styles.tabsList}>
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.inputIcon}><Mail /></span>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className={styles.inputWithIcon}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.inputIcon}><Lock /></span>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className={styles.inputWithIcon}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="editorial"
                                        size="lg"
                                        fullWidth
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <Label htmlFor="signup-username">Username</Label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.inputIcon}><User /></span>
                                            <Input
                                                id="signup-username"
                                                type="text"
                                                placeholder="johndoe"
                                                value={signupUsername}
                                                onChange={(e) => setSignupUsername(e.target.value)}
                                                className={styles.inputWithIcon}
                                                required
                                            />
                                        </div>
                                        <p className={styles.hint}>This will be used as your watermark</p>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.inputIcon}><Mail /></span>
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                className={styles.inputWithIcon}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className={styles.inputWrapper}>
                                            <span className={styles.inputIcon}><Lock /></span>
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                className={styles.inputWithIcon}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="editorial"
                                        size="lg"
                                        fullWidth
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            <Toaster toasts={toasts} onDismiss={dismiss} />
        </div>
    );
}


