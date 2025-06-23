"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Flex, Box, Field, Input, Stack, Button, Text, Link, Center } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

function RegisterCard({
    email,
    setEmail,
    password,
    setPassword,
    onRegister,
    loading,
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onRegister: () => void;
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
                            <Button
                                bg="blue.400"
                                color="white"
                                _hover={{ bg: "blue.500" }}
                                onClick={onRegister}
                                loading={loading}
                                width="100%"
                                size="lg"
                                fontWeight="bold"
                            >
                                Register
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Center>
                                <Text>
                                    Already have an account?{" "}
                                    <Link color="blue.400" href="/login">
                                        Log In
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

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const register = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/home"); // or redirect to login if you prefer
        } catch (error: any) {
            toaster.create({
                title: error.message || "Failed to register.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterCard
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onRegister={register}
            loading={loading}
        />
    );
}
