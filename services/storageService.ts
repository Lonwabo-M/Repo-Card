import { ReportCardBatch } from '../types';

const STORAGE_KEY_PREFIX = 'reportCardBatches';

export const getBatches = (userId: string): ReportCardBatch[] => {
    if (!userId) return [];
    try {
        const storedBatches = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${userId}`);
        return storedBatches ? JSON.parse(storedBatches) : [];
    } catch (error) {
// FIX: Added curly braces to the catch block to fix a syntax error and ensure correct error handling.
        console.error("Error retrieving batches from localStorage:", error);
        return [];
    }
};

export const saveBatches = (userId: string, batches: ReportCardBatch[]): void => {
    if (!userId) return;
    try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}_${userId}`, JSON.stringify(batches));
    } catch (error) {
        console.error("Error saving batches to localStorage:", error);
    }
};