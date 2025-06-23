import { Box, Text, Stack, Badge, Flex, Button, HStack } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

type Exercise = {
    name: string;
    sets: string;
    note?: string;
    weight?: string;
    restBetweenSets?: string;
    restBetweenExercises?: string;
};

type WorkoutCardProps = {
    id: string;
    dateTime: string;
    exercises: Exercise[];
    onEdit: (id: string) => void;
    onDeleted?: () => void; // Optional callback after delete
};

export default function WorkoutCard({ id, dateTime, exercises, onEdit, onDeleted }: WorkoutCardProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this workout?")) return;

        setDeleting(true);
        try {
            await deleteDoc(doc(db, "workouts", id));
            toaster.create({
                title: "Workout deleted",
                type: "success",
                duration: 3000,
                closable: true,
            });
            onDeleted?.();
        } catch (error) {
            toaster.create({
                title: "Failed to delete workout",
                type: "error",
                duration: 3000,

                closable: true,
            });
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="box-shadow 0.2s"
        >
            <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                    {new Date(dateTime).toLocaleString()}
                </Text>

                <HStack gap={2}>
                    <Button size="sm" colorPalette="blue" onClick={() => onEdit(id)}>
                        Edit
                    </Button>
                    <Button size="sm" colorPalette="red" onClick={handleDelete} loading={deleting}>
                        Delete
                    </Button>
                </HStack>
            </Flex>

            <Stack gap={4}>
                {exercises.map((ex, idx) => (
                    <Box key={idx} p={3} bg="gray.100" borderRadius="md">
                        <Flex justify="space-between" align="center" mb={1}>
                            <Text fontWeight="semibold" fontSize="lg" color="gray.700">
                                {ex.name}
                            </Text>

                            {(ex.weight || ex.restBetweenSets) && (
                                <Stack direction="row" gap={2}>
                                    {ex.weight && (
                                        <Badge colorScheme="teal" fontSize="0.75em" px={2} py={2}>
                                            Weight: {ex.weight}kg
                                        </Badge>
                                    )}
                                    {ex.restBetweenSets && (
                                        <Badge colorScheme="orange" fontSize="0.75em" px={2} py={2}>
                                            Rest: {ex.restBetweenSets}
                                        </Badge>
                                    )}
                                </Stack>
                            )}
                        </Flex>

                        <Text fontSize="sm" color="gray.700" mb={ex.note ? 1 : 0}>
                            Sets: {ex.sets}
                        </Text>

                        {ex.note && (
                            <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                Note: {ex.note}
                            </Text>
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
