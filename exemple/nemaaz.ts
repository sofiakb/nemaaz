'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 17:22
 * File /nemaaz
 */

import {
	AsrJuristic,
	CalculationMethod,
	CalculatorParams,
	Coordinates,
	HigherLatitudesAdjusting,
	PrayerTimes,
	TimeFormats,
} from '../src';

import { DateTime } from 'luxon';
import { mapValues } from 'lodash';

const date = DateTime.now().setZone('Europe/Paris');

const test = new PrayerTimes(
	new CalculatorParams({
		coordinates: new Coordinates({
			latitude: 50.3555,
			longitude: 3.11127,
		}),
		calculationMethod: CalculationMethod.mwl(),
		adjustHighLats: HigherLatitudesAdjusting.ANGLE_BASED,
		asrJuristic: AsrJuristic.SHAFI,
		dhuhrMinutes: 0,
		numIterations: 1,
		timeFormat: TimeFormats.TIME24,
		timeZone: 'Europe/Paris',
		date: date.toJSDate(),
	}),
);

console.log(mapValues(test.toJson(), (item) => DateTime.fromJSDate(item, { zone: 'Europe/Paris' }).toString()));
console.log(test.values);
