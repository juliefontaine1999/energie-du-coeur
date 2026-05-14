import { describe, it, expect } from 'vitest'
import { validateEmail, validateRequired, validateLength, validateCheckboxRequired } from './forms.js'

describe('Frontend Validation Functions', () => {
    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true)
            expect(validateEmail('user.name@domain.org')).toBe(true)
            expect(validateEmail('user+tag@example.co.uk')).toBe(true)
        })

        it('should return false for invalid emails', () => {
            expect(validateEmail('')).toBe(false)
            expect(validateEmail('invalid')).toBe(false)
            expect(validateEmail('invalid@')).toBe(false)
            expect(validateEmail('@domain.com')).toBe(false)
            expect(validateEmail('test@domain')).toBe(false)
        })
    })

    describe('validateRequired', () => {
        it('should return true for non-empty strings', () => {
            expect(validateRequired('hello')).toBe(true)
            expect(validateRequired('a')).toBe(true)
        })

        it('should return false for empty or whitespace strings', () => {
            expect(validateRequired('')).toBe(false)
            expect(validateRequired('   ')).toBe(false)
        })
    })

    describe('validateLength', () => {
        it('should return true for valid lengths', () => {
            expect(validateLength('hello', 2, 10)).toBe(true)
            expect(validateLength('ab', 2, 10)).toBe(true)
            expect(validateLength('abcdefghij', 2, 10)).toBe(true)
        })

        it('should respect min length', () => {
            expect(validateLength('a', 2, undefined)).toBe(false)
            expect(validateLength('ab', 2, undefined)).toBe(true)
        })

        it('should respect max length', () => {
            expect(validateLength('abcdefghijk', undefined, 10)).toBe(false)
            expect(validateLength('abcdefghij', undefined, 10)).toBe(true)
        })

        it('should validate both min and max', () => {
            expect(validateLength('abc', 2, 5)).toBe(true)
            expect(validateLength('a', 2, 5)).toBe(false)
            expect(validateLength('abcdef', 2, 5)).toBe(false)
        })

        it('should trim whitespace', () => {
            expect(validateLength('  hello  ', 2, 10)).toBe(true)
        })
    })

    describe('validateCheckboxRequired', () => {
        it('should return true if at least one checkbox is checked', () => {
            const checkboxes = [
                { checked: false } as HTMLInputElement,
                { checked: true } as HTMLInputElement,
                { checked: false } as HTMLInputElement
            ]
            expect(validateCheckboxRequired(checkboxes)).toBe(true)
        })

        it('should return false if no checkbox is checked', () => {
            const checkboxes = [
                { checked: false } as HTMLInputElement,
                { checked: false } as HTMLInputElement
            ]
            expect(validateCheckboxRequired(checkboxes)).toBe(false)
        })

        it('should return false for empty array', () => {
            expect(validateCheckboxRequired([])).toBe(false)
        })
    })
})