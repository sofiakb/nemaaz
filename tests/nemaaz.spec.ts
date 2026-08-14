'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 11:08
 * File /index
 */

import moment from 'moment';

import {
	AsrJuristic,
	CalculationMethod,
	CalculatorParams,
	Coordinates,
	HigherLatitudesAdjusting,
	IshaCalculation,
	IshaSelector,
	Prayer,
	PrayerTimes,
	TimeFormats,
} from '../src';
import { DateTime } from 'luxon';

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
			timeZone: 'Europe/Paris',
			date: DateTime.fromObject({ year: 2023, month: 6, day: 30, hour: 12, minute: 0, second: 0 })
				.setZone('Europe/Paris')
				.toJSDate(),
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

describe('PrayerTimes with a non-default calculation method', () => {
	// UOIF: MWL derived, Fajr and Isha at 12°. Nothing here matches the library defaults,
	// so any parameter dropped along the way shows up as a shifted time.
	const uoif = CalculationMethod.mwl().copyWith({
		fajrAngle: 12,
		ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: 12 }),
	});

	const forDate = (date: Date) =>
		new PrayerTimes(
			new CalculatorParams({
				coordinates: new Coordinates({ latitude: 50.3555, longitude: 3.11127 }),
				calculationMethod: uoif,
				adjustHighLats: HigherLatitudesAdjusting.ANGLE_BASED,
				asrJuristic: AsrJuristic.HANAFI,
				dhuhrMinutes: 0,
				timeFormat: TimeFormats.TIME24,
				timeZone: 'Europe/Paris',
				date,
			}),
		);

	const day = (year: number, month: number, dayOfMonth: number) =>
		DateTime.fromObject({ year, month, day: dayOfMonth, hour: 12 }, { zone: 'Europe/Paris' }).toJSDate();

	test('fajrAfter matches the next day fajr computed with the same method', () => {
		const today = forDate(day(2026, 8, 13));
		const tomorrow = forDate(day(2026, 8, 14));

		// To the minute: fajrAfter is nothing but tomorrow's Fajr.
		expect(Math.round(today.fajrAfter.getTime() / 60000)).toEqual(Math.round(tomorrow.fajr.getTime() / 60000));
	});

	test('ishaBefore matches the previous day isha computed with the same method', () => {
		const today = forDate(day(2026, 8, 13));
		const yesterday = forDate(day(2026, 8, 12));

		expect(Math.round(today.ishaBefore.getTime() / 60000)).toEqual(Math.round(yesterday.isha.getTime() / 60000));
	});
});

describe('Daily prayer resolution', () => {
	const prayerTimes = new PrayerTimes(
		new CalculatorParams({
			coordinates: new Coordinates({ latitude: 50.3555, longitude: 3.11127 }),
			calculationMethod: CalculationMethod.mwl(),
			timeZone: 'Europe/Paris',
			date: DateTime.fromObject({ year: 2026, month: 8, day: 13, hour: 12 }, { zone: 'Europe/Paris' }).toJSDate(),
		}),
	);

	const oneMinuteAfter = (date: Date) => new Date(date.getTime() + 60000);

	test('after isha the next daily prayer is the next day fajr', () => {
		const next = prayerTimes.nextDailyPrayer(oneMinuteAfter(prayerTimes.isha));

		expect(next.prayer).toEqual(Prayer.FAJR);
		expect(next.date.getTime()).toEqual(prayerTimes.fajrAfter.getTime());
	});

	test('between fajr and shuruq the next daily prayer is dhuhr, not shuruq', () => {
		const next = prayerTimes.nextDailyPrayer(oneMinuteAfter(prayerTimes.fajr));

		expect(next.prayer).toEqual(Prayer.DHUHR);
		expect(next.date.getTime()).toEqual(prayerTimes.dhuhr.getTime());
	});

	test('between fajr and shuruq the current daily prayer is fajr, not shuruq', () => {
		const current = prayerTimes.currentDailyPrayer(oneMinuteAfter(prayerTimes.shuruq));

		expect(current.prayer).toEqual(Prayer.FAJR);
		expect(current.date.getTime()).toEqual(prayerTimes.fajr.getTime());
	});

	test('before fajr the current daily prayer is the previous day isha', () => {
		const current = prayerTimes.currentDailyPrayer(new Date(prayerTimes.fajr.getTime() - 60000));

		expect(current.prayer).toEqual(Prayer.ISHA);
		expect(current.date.getTime()).toEqual(prayerTimes.ishaBefore.getTime());
	});

	test('daily resolution never reports a non prayer', () => {
		const daily = [Prayer.FAJR, Prayer.DHUHR, Prayer.ASR, Prayer.MAGHRIB, Prayer.ISHA];

		for (let minutes = 0; minutes < 24 * 60; minutes += 5) {
			const at = new Date(prayerTimes.fajr.getTime() + minutes * 60000);

			expect(daily).toContain(prayerTimes.currentDailyPrayer(at).prayer);
			expect(daily).toContain(prayerTimes.nextDailyPrayer(at).prayer);
		}
	});
});
