'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:43
 * File /calculation-method
 */

import { MaghribSelector, IshaSelector } from '../enums/selectors';

export class MaghribCalculation {
	readonly selector: MaghribSelector;
	readonly value: number;

	constructor({ selector, value }: { selector: MaghribSelector; value: number }) {
		this.selector = selector;
		this.value = value;
	}

	copyWith({ value, selector }: { value?: number; selector?: MaghribSelector }): MaghribCalculation {
		return new MaghribCalculation({
			value: value ?? this.value,
			selector: selector ?? this.selector,
		});
	}
}

export class IshaCalculation {
	readonly selector: IshaSelector;
	readonly value: number;

	constructor({ selector, value }: { selector: IshaSelector; value: number }) {
		this.selector = selector;
		this.value = value;
	}

	copyWith({ value, selector }: { value?: number; selector?: IshaSelector }): IshaCalculation {
		return new IshaCalculation({
			value: value ?? this.value,
			selector: selector ?? this.selector,
		});
	}
}

export class CalculationMethod {
	readonly fajrAngle: number;
	readonly maghribCalculation: MaghribCalculation;
	readonly ishaCalculation: IshaCalculation;

	constructor({
		fajrAngle,
		maghribCalculation,
		ishaCalculation,
	}: {
		fajrAngle: number;
		maghribCalculation: MaghribCalculation;
		ishaCalculation: IshaCalculation;
	}) {
		this.fajrAngle = fajrAngle;
		this.maghribCalculation = maghribCalculation;
		this.ishaCalculation = ishaCalculation;
	}

	copyWith({
		fajrAngle,
		maghribCalculation,
		ishaCalculation,
	}: {
		fajrAngle?: number;
		maghribCalculation?: MaghribCalculation;
		ishaCalculation?: IshaCalculation;
	}): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: fajrAngle ?? this.fajrAngle,
			maghribCalculation: maghribCalculation ?? this.maghribCalculation,
			ishaCalculation: ishaCalculation ?? this.ishaCalculation,
		});
	}

	static jafari(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 16,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.ANGLE, value: 4 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 14 }),
		});
	}

	static karachi(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 18,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 0 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 18 }),
		});
	}

	static isna(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 15,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 0 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 15 }),
		});
	}

	static mwl(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 18,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 0 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 17 }),
		});
	}

	static makkah(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 18.5,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 0 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.MINUTES_AFTER_MAGHRIB, value: 90 }),
		});
	}

	static egypt(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 19.5,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 0 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 17.5 }),
		});
	}

	static tehran(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 17.7,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.ANGLE, value: 4.5 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 14 }),
		});
	}

	static custom(): CalculationMethod {
		return new CalculationMethod({
			fajrAngle: 12,
			maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.MINUTES_AFTER_SUNSET, value: 5 }),
			ishaCalculation: new IshaCalculation({ selector: IshaSelector.MINUTES_AFTER_MAGHRIB, value: 90 }),
		});
	}
}
