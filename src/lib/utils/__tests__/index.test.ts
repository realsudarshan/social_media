import { describe, it, expect } from 'vitest';
import { multiFormatDateString } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('multiFormatDateString', () => {
        it('returns "Just now" for very recent dates', () => {
            const now = new Date().toISOString();
            const result = multiFormatDateString(now);
            expect(result).toBe('Just now');
        });

        it('returns minutes ago for recent dates', () => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
            const result = multiFormatDateString(fiveMinutesAgo);
            expect(result).toContain('min');
        });

        it('returns hours ago for dates within 24 hours', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
            const result = multiFormatDateString(twoHoursAgo);
            expect(result).toContain('hour');
        });

        it('returns days ago for dates within a week', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
            const result = multiFormatDateString(threeDaysAgo);
            expect(result).toContain('day');
        });

        it('returns formatted date for older dates', () => {
            const oldDate = new Date('2023-01-15').toISOString();
            const result = multiFormatDateString(oldDate);
            expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
        });
    });
});
