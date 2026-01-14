import { describe, it, expect } from 'vitest';
import { HiraganaService } from '../hiragana.service';

describe('HiraganaService', () => {
	it('should convert romaji to hiragana', () => {
		expect(HiraganaService.convertToHiragana('ka')).toBe('か');
	});

	it('should handle edge case for empty input', () => {
		expect(HiraganaService.convertToHiragana('')).toBe('');
	});

	it('should return undefined for invalid input', () => {
		expect(HiraganaService.convertToHiragana(null)).toBeUndefined();
	});

	it('should convert multiple romaji to hiragana', () => {
		expect(HiraganaService.convertToHiragana('konnichiwa')).toBe('こんにちは');
	});
});