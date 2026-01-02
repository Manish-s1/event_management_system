	
"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof formSchema>;

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const res = await axios.post("/api/auth/signup", data);
            toast.success(
                "Account created successfully! Let's login to get started."
            );
            form.reset();

            // Navigate to login page after successful registration
            setTimeout(() => {
                router.push("/auth/login");
            }, 500);
        } catch (error: unknown) {
    // Narrow the type
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.error || "Failed to create account. Please try again.");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to create account. Please try again.");
    }
  }finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Header />
        <div className="min-h-screen flex items-center justify-center  p-4">
            <Card className="w-full max-w-md shadow-2xl   backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center ">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=" font-medium">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 " />
                                                <Input
                                                    placeholder="Enter your username"
                                                    className="pl-10 h-11 "
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=" font-medium">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 " />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-10 h-11 "
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=" font-medium">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 " />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a secure password"
                                                    className="pl-10 pr-10 h-11 "
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 " />
                                                    ) : (
                                                        <Eye className="h-4 w-4 " />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11  font-medium "
                                disabled={!form.formState.isValid || loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2  border-t-transparent" />
                                        Creating account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center">
                        <p className="text-sm ">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium  hover:underline text-primary"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Footer />
        </>
    );
}
