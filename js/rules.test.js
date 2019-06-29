const rules = require('./rules')

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
		it('should round .9 up', () => {
			expect(rules.gradeToGPA(59.9)).toEqual(3)
		})

		it('should round .5 up', () => {
			expect(rules.gradeToGPA(59.5)).toEqual(3)
		})

		it('should round .49 down', () => {
			expect(rules.gradeToGPA(56.49)).toEqual(2.75)
		})

		it('should round 9s up', () => {
			expect(rules.gradeToGPA(49)).toEqual(2.5)
		})

		it('should return correct grade for 100', () => {
			expect(rules.gradeToGPA(100)).toEqual(4.25)
		})

		it('should return correct grade for 75', () => {
			expect(rules.gradeToGPA(75)).toEqual(4.25)
		})

		it('should return correct grade for 74', () => {
			expect(rules.gradeToGPA(74)).toEqual(4)
		})

		it('should return correct grade for 71', () => {
			expect(rules.gradeToGPA(71)).toEqual(4)
		})

		it('should return correct grade for 70', () => {
			expect(rules.gradeToGPA(70)).toEqual(3.75)
		})

		it('should return correct grade for 67', () => {
			expect(rules.gradeToGPA(67)).toEqual(3.75)
		})

		it('should return correct grade for 66', () => {
			expect(rules.gradeToGPA(66)).toEqual(3.5)
		})

		it('should return correct grade for 64', () => {
			expect(rules.gradeToGPA(64)).toEqual(3.5)
		})

		it('should return correct grade for 63', () => {
			expect(rules.gradeToGPA(63)).toEqual(3.25)
		})

		it('should return correct grade for 61', () => {
			expect(rules.gradeToGPA(61)).toEqual(3.25)
		})

		it('should return correct grade for 60', () => {
			expect(rules.gradeToGPA(60)).toEqual(3)
		})

		it('should return correct grade for 57', () => {
			expect(rules.gradeToGPA(57)).toEqual(3)
		})

		it('should return correct grade for 56', () => {
			expect(rules.gradeToGPA(56)).toEqual(2.75)
		})

		it('should return correct grade for 54', () => {
			expect(rules.gradeToGPA(54)).toEqual(2.75)
		})

		it('should return correct grade for 53', () => {
			expect(rules.gradeToGPA(53)).toEqual(2.5)
		})

		it('should return correct grade for 50', () => {
			expect(rules.gradeToGPA(50)).toEqual(2.5)
		})

		it('should return correct grade for 49', () => {
			expect(rules.gradeToGPA(49)).toEqual(2.5)
		})

		it('should return correct grade for 48', () => {
			expect(rules.gradeToGPA(48)).toEqual(2.25)
		})

		it('should return correct grade for 47', () => {
			expect(rules.gradeToGPA(47)).toEqual(2)
		})

		it('should return correct grade for 43', () => {
			expect(rules.gradeToGPA(43)).toEqual(2)
		})

		it('should return correct grade for 42', () => {
			expect(rules.gradeToGPA(42)).toEqual(1.5)
		})

		it('should return correct grade for 40', () => {
			expect(rules.gradeToGPA(40)).toEqual(1.5)
		})

		it('should return correct grade for 39', () => {
			expect(rules.gradeToGPA(39)).toEqual(1.5)
		})

		it('should return correct grade for 38', () => {
			expect(rules.gradeToGPA(38)).toEqual(1)
		})

		it('should return correct grade for 37', () => {
			expect(rules.gradeToGPA(37)).toEqual(0.75)
		})

		it('should return correct grade for 35', () => {
			expect(rules.gradeToGPA(35)).toEqual(0.75)
		})

		it('should return correct grade for 34', () => {
			expect(rules.gradeToGPA(34)).toEqual(0.5)
		})

		it('should return correct grade for 30', () => {
			expect(rules.gradeToGPA(30)).toEqual(0.5)
		})

		it('should return correct grade for 29', () => {
			expect(rules.gradeToGPA(29)).toEqual(0.5)
		})

		it('should return correct grade for 28', () => {
			expect(rules.gradeToGPA(28)).toEqual(0)
		})

		it('should return correct grade for 0', () => {
			expect(rules.gradeToGPA(0)).toEqual(0)
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

	describe('.rawmean', () => {
		it('should calculate correct mean for two values', () => {
			expect(rules.rawmean([3, 5.5])).toEqual(4.25)
		})

		it('should calculate correct mean for one value', () => {
			expect(rules.rawmean([4])).toEqual(4)
		})

		it('should return 0 for array length of 0', () => {
			expect(rules.rawmean([])).toEqual(0)
		})
	})

	describe('.mean', () => {
		it('should round down', () => {
			expect(rules.mean([4.49])).toEqual(4)
		})

		it('should round up', () => {
			expect(rules.mean([4.5])).toEqual(5)
		})
	})

	describe('.toClassification', () => {
		it('should return first for 70', () => {
			expect(rules.toClassification(80)).toEqual('First-class honours')
		})

		it('should return first for 70', () => {
			expect(rules.toClassification(80)).toEqual('First-class honours')
		})

		it('should return first for > 70', () => {
			expect(rules.toClassification(80)).toEqual('First-class honours')
		})

		it('should return 2:1 for 60', () => {
			expect(rules.toClassification(60)).toEqual('Second-class honours (upper division)')
		})

		it('should return 2:1 for 69.9999999', () => {
			expect(rules.toClassification(69.9999999)).toEqual('Second-class honours (upper division)')
		})

		it('should return 2:2 for 50', () => {
			expect(rules.toClassification(50)).toEqual('Second-class honours (lower division)')
		})

		it('should return 2:2 for 59.9999999', () => {
			expect(rules.toClassification(59.9999999)).toEqual('Second-class honours (lower division)')
		})

		it('should return third for 40', () => {
			expect(rules.toClassification(40)).toEqual('Third-class honours')
		})

		it('should return third for 49.9999999', () => {
			expect(rules.toClassification(49.9999999)).toEqual('Third-class honours')
		})

		it('should return failed for 39.9999999', () => {
			expect(rules.toClassification(39.9999999)).toEqual('Failed')
		})

		it('should return failed for <39.9999999', () => {
			expect(rules.toClassification(30)).toEqual('Failed')
		})
	})
})

