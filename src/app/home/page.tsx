"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
    doc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import { Box, Button, Flex, Heading, Input, Stack, Text, Spinner } from "@chakra-ui/react";

import { auth, db } from "@/lib/firebase";
import WorkoutCard from "@/components/ui/workout-card";

type Exercise = {
    name: string;
    sets: string;
    note?: string;
    weight?: string;
    restBetweenSets?: string;
    restBetweenExercises?: string;
};

type Workout = {
    id: string;
    dateTime: string;
    exercises: Exercise[];
};

export default function HomePage() {
    const router = useRouter();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months 0-based
    const currentYear = currentDate.getFullYear();

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);

    const user = auth.currentUser;

    // Fetch workouts with optional filters and pagination
    const fetchWorkouts = async (reset = false) => {
        if (!user) return;

        setLoading(true);
        try {
            let q;

            // Base query: workouts by this user ordered by dateTime descending
            const baseQuery = collection(db, "workouts");

            if (reset) {
                setLastDoc(null);
                setHasMore(true);
            }

            const filters = [where("userId", "==", user.uid)];

            if (month && year) {
                // Create start and end date range for the filter month
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 1);

                // Filter by dateTime field (string ISO)
                filters.push(
                    where("dateTime", ">=", startDate.toISOString()),
                    where("dateTime", "<", endDate.toISOString())
                );
            }

            q = query(
                baseQuery,
                ...filters,
                orderBy("dateTime", "desc"),
                limit(5),
                ...(lastDoc && !reset ? [startAfter(lastDoc)] : [])
            );

            const snapshot = await getDocs(q);

            if (reset) setWorkouts([]);
            if (snapshot.empty) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const newWorkouts: Workout[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    dateTime: data.dateTime,
                    exercises: data.exercises,
                };
            });

            setWorkouts((prev) => (reset ? newWorkouts : [...prev, ...newWorkouts]));
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

            if (snapshot.docs.length < 5) setHasMore(false);
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Edit workout handler
    const handleEdit = (id: string) => {
        router.push(`/edit/${id}`);
    };

    // Logout handler
    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    // Fetch workouts on mount and filter change
    useEffect(() => {
        fetchWorkouts(true);
    }, [month, year]);

    // Reset filters
    const resetFilters = () => {
        setMonth(currentMonth);
        setYear(currentYear);
        setHasMore(true);
        setLastDoc(null);
        fetchWorkouts(true);
    };

    return (
        <Box maxW="container.md" mx="auto" p={4}>
            <Flex mb={4} justify="space-between" align="center">
                <Heading size="lg">Your Workouts</Heading>
                <Button colorPalette="red" onClick={handleLogout}>
                    Logout
                </Button>
            </Flex>

            <Stack direction={{ base: "column", sm: "row" }} gap={3} mb={6} w="100%" align="stretch">
                <Flex gap={3} w="100%">
                    <Input
                        type="number"
                        placeholder="Month"
                        min={1}
                        max={12}
                        value={month}
                        onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (val < 1) val = 1;
                            else if (val > 12) val = 12;
                            setMonth(val);
                        }}
                        size="sm"
                        flex="1"
                    />
                    <Input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        size="sm"
                        flex="1"
                    />
                </Flex>

                <Flex gap={3} w="100%">
                    <Button onClick={resetFilters} colorScheme="gray" flex="1" size="sm">
                        Reset
                    </Button>
                    <Button colorPalette="teal" onClick={() => router.push("/add")} flex="1" size="sm">
                        Add
                    </Button>
                </Flex>
            </Stack>

            {loading ? (
                <Flex justify="center" align="center" mt={8}>
                    <Spinner size="lg" color="teal.500" />
                </Flex>
            ) : workouts.length === 0 ? (
                <Text textAlign="center" mt={8} color="gray.500">
                    No workouts found.
                </Text>
            ) : (
                <>
                    <Stack gap={4}>
                        {workouts.map((w) => (
                            <WorkoutCard
                                key={w.id}
                                id={w.id}
                                dateTime={w.dateTime}
                                exercises={w.exercises}
                                onEdit={handleEdit}
                                onDeleted={() => fetchWorkouts(true)}
                            />
                        ))}
                    </Stack>

                    {hasMore && (
                        <Button
                            mt={6}
                            loading={loading}
                            onClick={() => fetchWorkouts()}
                            colorScheme="blue"
                            width="100%"
                        >
                            Load More
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
}
