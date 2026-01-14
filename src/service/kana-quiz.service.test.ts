import { describe, it, expect } from 'vitest';
import { KanaQuizService } from '../kana-quiz.service';

describe('KanaQuizService', () => {
	it('should create a new quiz', () => {
		const service = new KanaQuizService();
		const quiz = service.createQuiz(['あ', 'い', 'う']);
		expect(quiz).toEqual(expect.objectContaining({ characters: ['あ', 'い', 'う'] }));
	});

	it('should return the correct answer', () => {
		const service = new KanaQuizService();
		const answer = service.checkAnswer('あ', 'あ');
		expect(answer).toBe(true);
	});

	it('should return false for incorrect answer', () => {
		const service = new KanaQuizService();
		const answer = service.checkAnswer('あ', 'い');
		expect(answer).toBe(false);
	});
});