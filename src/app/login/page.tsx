"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Flex, Box, Field, Input, Stack, Button, Text, Link, Center } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

function SimpleCard({
    email,
    setEmail,
    password,
    setPassword,
    onLogin,
    loading,
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onLogin: () => void;
    loading: boolean;
}) {
    return (
        <Flex minH="100vh" align="center" justify="center" px={4}>
            <Stack
                gap={8}
                w="100%"
                maxW={{ base: "90vw", sm: "400px", md: "lg" }}
                py={{ base: 8, md: 12 }}
                px={{ base: 4, md: 6 }}
            >
                <Box rounded="lg" boxShadow="lg" p={{ base: 6, md: 8 }}>
                    <Stack gap={4}>
                        <Field.Root id="email">
                            <Field.Label>Email address</Field.Label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} width="100%" />
                        </Field.Root>
                        <Field.Root id="password">
                            <Field.Label>Password</Field.Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                width="100%"
                            />
                        </Field.Root>
                        <Toaster />
                        <Stack gap={10}>
                            <Stack direction={{ base: "column", sm: "row" }} align="start" justify="space-between">
                                <Text color="blue.400" fontSize={{ base: "sm", sm: "md" }}>
                                    Forgot password?
                                </Text>
                            </Stack>
                            <Button
                                bg="blue.400"
                                color="white"
                                _hover={{ bg: "blue.500" }}
                                onClick={onLogin}
                                loading={loading}
                                width="100%"
                                size="lg"
                                fontWeight="bold"
                            >
                                Sign in
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Center>
                                <Text>
                                    Don't have an account?{" "}
                                    <Link color="blue.400" href="/register">
                                        Sign Up
                                    </Link>
                                </Text>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/home");
        } catch (error: any) {
            toaster.create({
                title: `Incorrect password or username.`,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SimpleCard
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLogin={login}
            loading={loading}
        />
    );
}
