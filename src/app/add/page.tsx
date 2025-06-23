"use client";

import { useState } from "react";
import { Box, Button, Flex, Field, Heading, Input, Stack, Textarea, Text, VStack } from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { IoChevronBack } from "react-icons/io5";

type Exercise = {
    name: string;
    weight?: string;
    sets: string; // comma separated reps, e.g. "40,14,12"
    restBetweenSets: string; // e.g. "30s"
    note?: string;
};

export default function WorkoutForm() {
    const { user } = useAuth();
    const router = useRouter();

    const [dateTime, setDateTime] = useState("");
    const [restBetweenExercises, setRestBetweenExercises] = useState("");
    const [exercises, setExercises] = useState<Exercise[]>([
        { name: "", weight: "", sets: "", restBetweenSets: "", note: "" },
    ]);
    const [loading, setLoading] = useState(false);

    const updateExercise = (index: number, field: keyof Exercise, value: string) => {
        setExercises((prev) => {
            const newExercises = [...prev];
            newExercises[index] = { ...newExercises[index], [field]: value };
            return newExercises;
        });
    };

    const addExercise = () => {
        setExercises((prev) => [...prev, { name: "", weight: "", sets: "", restBetweenSets: "", note: "" }]);
    };

    const removeExercise = (index: number) => {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user) return;

        if (!dateTime.trim()) {
            alert("Please enter workout date/time");
            return;
        }

        if (exercises.length === 0 || exercises.some((ex) => !ex.name.trim())) {
            alert("Please fill in all exercise names");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "workouts"), {
                userId: user.uid,
                dateTime,
                restBetweenExercises,
                exercises,
                createdAt: serverTimestamp(),
            });
            alert("Workout saved!");
            router.refresh();
            setDateTime("");
            setRestBetweenExercises("");
            setExercises([{ name: "", weight: "", sets: "", restBetweenSets: "", note: "" }]);
        } catch (error) {
            alert("Error saving workout: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="700px" mx="auto" p={4}>
            <Flex align="center" gap={2} mb={6}>
                <Button variant="ghost" onClick={() => router.back()} p={0}>
                    <IoChevronBack size={20} />
                </Button>
                <Heading size="md">Log a Workout</Heading>
            </Flex>

            <Field.Root mb={4}>
                <Field.Label>Date & Time of workout</Field.Label>
                <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </Field.Root>

            <Stack gap={6}>
                {exercises.map((exercise, i) => (
                    <Box
                        key={i}
                        p={4}
                        boxShadow="md"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        position="relative"
                    >
                        <Flex justify="space-between" align="center" mb={2}>
                            <Text fontWeight="bold">Exercise #{i + 1}</Text>
                            {exercises.length > 1 && (
                                <Button size="sm" colorScheme="red" onClick={() => removeExercise(i)}>
                                    Remove
                                </Button>
                            )}
                        </Flex>

                        <Field.Root mb={2} required>
                            <Field.Label>Name</Field.Label>
                            <Input
                                placeholder="Exercise name"
                                value={exercise.name}
                                onChange={(e) => updateExercise(i, "name", e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root mb={2}>
                            <Field.Label>Weight (optional)</Field.Label>
                            <Input
                                placeholder="e.g. 13kg"
                                value={exercise.weight}
                                onChange={(e) => updateExercise(i, "weight", e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root mb={2} required>
                            <Field.Label>Sets (comma separated reps)</Field.Label>
                            <Input
                                placeholder="e.g. 40,14,12,10,10"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(i, "sets", e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root mb={2} required>
                            <Field.Label>Rest between sets</Field.Label>
                            <Input
                                placeholder="e.g. 30s"
                                value={exercise.restBetweenSets}
                                onChange={(e) => updateExercise(i, "restBetweenSets", e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root mb={0}>
                            <Field.Label>Note (optional)</Field.Label>
                            <Textarea
                                placeholder="e.g. Push up - hold"
                                value={exercise.note}
                                onChange={(e) => updateExercise(i, "note", e.target.value)}
                            />
                        </Field.Root>
                    </Box>
                ))}

                <Button onClick={addExercise} colorScheme="green" size="sm" alignSelf="start">
                    + Add Exercise
                </Button>
            </Stack>

            <Field.Root mt={6} mb={6}>
                <Field.Label>Rest time between exercises</Field.Label>
                <Input
                    placeholder="e.g. 2 min"
                    value={restBetweenExercises}
                    onChange={(e) => setRestBetweenExercises(e.target.value)}
                />
            </Field.Root>

            <Button colorScheme="blue" onClick={handleSubmit} loading={loading}>
                Save Workout
            </Button>
        </Box>
    );
}
