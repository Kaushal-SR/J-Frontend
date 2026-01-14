import { describe, it, expect, vi } from 'vitest';
import { KatakanaService } from '../katakana.service';

describe('KatakanaService', () => {
	it('should convert Hiragana to Katakana', () => {
		const service = new KatakanaService();
		expect(service.convertHiraganaToKatakana('あ')).toBe('ア');
	});

	it('should return empty string for empty input', () => {
		const service = new KatakanaService();
		expect(service.convertHiraganaToKatakana('')).toBe('');
	});

	it('should handle invalid input gracefully', () => {
		const service = new KatakanaService();
		expect(service.convertHiraganaToKatakana('123')).toBe('');
	});

	it('should mock a dependency if necessary', () => {
		const mockDependency = vi.fn();
		const service = new KatakanaService(mockDependency);
		service.someMethod();
		expect(mockDependency).toHaveBeenCalled();
	});
});