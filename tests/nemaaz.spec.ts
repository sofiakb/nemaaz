'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 11:08
 * File /index
 */

import * as moment from 'moment';

import {
	AsrJuristic,
	CalculationMethod,
	CalculatorParams,
	Coordinates,
	HigherLatitudesAdjusting,
	PrayerTimes,
	TimeFormats,
} from '../src';

describe('PrayerTimes', () => {
	const prayerTimes = new PrayerTimes(
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
			date: moment({ year: 2023, month: 5, day: 30, hour: 12, minute: 0, second: 0 }).toDate(),
		}),
	);

	test('ishaBefore test', () => {
		const expectedTime = moment(1688076720000);
		expect(prayerTimes.ishaBefore.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('fajr test', () => {
		const expectedTime = moment(1688088180000);
		expect(prayerTimes.fajr.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('shuruq test', () => {
		const expectedTime = moment(1688096400000);
		expect(prayerTimes.shuruq.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('sunset test', () => {
		const expectedTime = moment(1688155320000);
		expect(prayerTimes.sunset.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('dhuhr test', () => {
		const expectedTime = moment(1688125860000);
		expect(prayerTimes.dhuhr.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('asr test', () => {
		const expectedTime = moment(1688141460000);
		expect(prayerTimes.asr.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('maghrib test', () => {
		const expectedTime = moment(1688155320000);
		expect(prayerTimes.maghrib.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('isha test', () => {
		const expectedTime = moment(1688163120000);
		expect(prayerTimes.isha.getTime()).toEqual(expectedTime.toDate().getTime());
	});

	test('fajrAfter test', () => {
		const expectedTime = moment(1688174580000);
		expect(prayerTimes.fajrAfter.getTime()).toEqual(expectedTime.toDate().getTime());
	});
});
