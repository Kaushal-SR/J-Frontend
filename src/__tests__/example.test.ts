import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Example Test Suite', () => {
	let value;

	beforeEach(() => {
		value = 0;
	});

	afterEach(() => {
		value = null;
	});

	it('should increment value', () => {
		value++;
		expect(value).toBe(1);
	});

	it('should reset value', () => {
		expect(value).toBe(0);
	});
});