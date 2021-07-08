const rules = require('../js/rules')

describe('rules', () => {
	describe('.prepareMarks', () => {
		const marks = {
			l5: [70, 80, 75, 60, 70, 70],
			l6: [65, 75, 70, 70],
			fyp: 90,
		}

		rules.prepareMarks(marks)

		const expectedPrepared = {
			l5: [80, 75, 70, 70, 70],
			l6: [90, 90, 75, 70, 70],
			l5gpa: [4.25, 4.25, 3.75, 3.75, 3.75],
			l6gpa: [4.25, 4.25, 4.25, 3.75, 3.75],
		}

		expect(marks.prepared).toEqual(expectedPrepared)
	})

	describe('.gradeToGPA', () => {
		/**
		 * This is to test the zones in `gpaZones` are correctly applied
		 * Check each side of the boundaries and the 9's rule
		 */
		test.each([
			[59.9, 3],
			[59.5, 3],
			[56.49, 2.75],
			[49, 2.5],
			[100, 4.25],
			[75, 4.25],
			[74, 4],
			[71, 4],
			[70, 3.75],
			[67, 3.75],
			[66, 3.5],
			[64, 3.5],
			[63, 3.25],
			[61, 3.25],
			[60, 3],
			[57, 3],
			[54, 2.75],
			[53, 2.5],
			[50, 2.5],
			[49, 2.5],
			[48, 2.25],
			[47, 2],
			[43, 2],
			[42, 1.5],
			[40, 1.5],
			[39, 1.5],
			[38, 1],
			[37, 0.75],
			[35, 0.75],
			[34, 0.5],
			[30, 0.5],
			[29, 0.5],
      [28, 0],
      [0, 0],
		])('should correctly grade %f as %f', (a, expected) => {
			expect(rules.gradeToGPA(a)).toEqual(expected)
		})

		it('should return -999 for unknown value', () => {
			expect(rules.gradeToGPA(-1)).toEqual(-999)
		})
	})

	describe('.gpa', () => {
		it('should calculate gpa correctly', () => {
			expect(rules.gpa({
				prepared: {
					l5gpa: [3],
					l6gpa: [4],
				}
			})).toEqual('3.60')
		})
	})

	describe('.ruleA', () => {
		it('should calculate correctly', () => {
			expect(rules.ruleA({
				prepared: {
					l5: [80],
					l6: [90],
				}
			})).toEqual(86)
		})
	})

	describe('.ruleB', () => {
		it('should calculate correctly', () => {
			expect(rules.ruleB({
				prepared: {
					l5: [60],
					l6: [80],
				},
			})).toEqual(80)
		})
	})

	describe('.ruleC', () => {
		it('should calculate correctly', () => {
			expect(rules.ruleC({
				prepared: {
					l5: [70, 70, 70, 70, 70],
					l6: [70, 60, 60, 60, 60],
				},
			})).toEqual(70)
		})
	})

	describe('.mean', () => {
		it('should calculate correct mean for two values', () => {
			expect(rules.mean([3, 5.5])).toEqual(4.25)
		})

		it('should calculate correct mean for one value', () => {
			expect(rules.mean([4])).toEqual(4)
		})
	})

	describe('.toClassification', () => {
    test.each([
      [100, 'First-class honours'],
      [70, 'First-class honours'],
      [60, 'Second-class honours (upper division)'],
      [69.9999999, 'Second-class honours (upper division)'],
      [50, 'Second-class honours (lower division)'],
      [59.9999999, 'Second-class honours (lower division)'],
      [40, 'Third-class honours'],
      [49.9999999, 'Third-class honours'],
      [0, 'Failed'],
      [39.9999999, 'Failed'],
    ])('should correctly classify %f as %s', (a, expected) => {
      expect(rules.toClassification(a)).toEqual(expected)
    })
	})
})

