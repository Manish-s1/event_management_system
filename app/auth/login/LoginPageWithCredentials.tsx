"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPageWithCredentials() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            setError("");

            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (res?.error) {
                setError("Invalid email or password.");
                toast.error("Invalid credentials");
            } else if (res?.ok) {
                // Successful login
                toast.success("Logged in successfully!");
                
                // Fetch session to get user role
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                
                // Redirect based on role
                if (session?.user?.role === 'ADMIN') {
                    window.location.href = "/admin";
                } else if (session?.user?.role === 'ORGANIZER') {
                    window.location.href = "/organizer";
                } else {
                    window.location.href = "/";
                }
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to login";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen  px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email</Label>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Password</Label>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11  font-medium "
                                disabled={!form.formState.isValid || loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2  border-t-transparent" />
                                        Loging in...
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center">
                        <p className="text-sm ">
                            {"Don't have an account? "}
                            <Link
                                href="/auth/signup"
                                className="font-medium  hover:underline text-primary"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                    <button
                        className='cursor-pointer bg-black px-4 py-2 w-full rounded-md text-white'
                        onClick={() => signIn("google")}
                    >
                        Login with Google
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
