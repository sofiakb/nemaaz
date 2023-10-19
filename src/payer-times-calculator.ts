'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:52
 * File /payer-times-calculator
 */

import { Coordinates } from './logic/coordinates';
import { AsrJuristic } from './enums/asr-juristic';
import { HigherLatitudesAdjusting } from './enums/higher-latitudes-adjusting';
import { IshaSelector, MaghribSelector } from './enums/selectors';
import { TimeFormats } from './enums/time-formats';
import { CalculationMethod, IshaCalculation, MaghribCalculation } from './logic/calculation-method';
import { CalculatorParams } from './logic/calculator-params';
import { floatToTime12, floatToTime24, julianDate, timeDiff } from './utils/utils';
import { Portion } from './logic/portion';
import { Trigonometric } from './logic/trigonometric';
import { Calculation } from './logic/calculation';
import { DateTime, Duration } from 'luxon';
import mapValues from 'lodash.mapvalues';

export class PrayerTimesCalculator {
	private timeNames: string[] = [
		'Fajr',
		'Shuruq',
		'Dhuhr',
		'Asr',
		'Sunset',
		'Maghrib',
		'Isha',
		'IshaBefore',
		'FajrAfter',
	];

	private asrJuristic: AsrJuristic = AsrJuristic.SHAFI;
	private dhuhrMinutes: number = 0;
	private coordinates: Coordinates;
	private date: Date;
	private loop: boolean = true;
	private julianDate: number = 0;

	private numIterations: number = 3;
	private timeZone: string;
	private timeZoneOffset: number = 0;
	private adjustHighLats: HigherLatitudesAdjusting = HigherLatitudesAdjusting.ANGLE_BASED;
	private timeFormat: TimeFormats = TimeFormats.TIME24;
	private calculationMethod: CalculationMethod = CalculationMethod.mwl();
	private customCalculationMethod: CalculationMethod = CalculationMethod.custom();

	constructor(params: CalculatorParams, loop: boolean = true) {
		this.coordinates = params.coordinates;
		this.date = params.date;
		this.calculationMethod = params.calculationMethod ?? this.calculationMethod;
		this.asrJuristic = params.asrJuristic ?? this.asrJuristic;
		this.dhuhrMinutes = params.dhuhrMinutes ?? this.dhuhrMinutes;
		this.timeFormat = params.timeFormat ?? this.timeFormat;
		this.loop = loop;

		this.timeZone = params.timeZone ?? 'UTC';
		this.timeZoneOffset = this.baseDate().offset / 60;

		this.prayTime(this.calculationMethod);
	}

	public prayTime(calculationMethod: CalculationMethod): void {
		this.setCalcMethod(calculationMethod);
	}

	//-------------------- Interface Functions --------------------

	// set the calculation method
	private setCalcMethod(calculationMethod: CalculationMethod): void {
		this.calculationMethod = calculationMethod;
	}

	private baseDate(): DateTime {
		return DateTime.fromObject({
			year: this.date.getFullYear(),
			month: this.date.getMonth() + 1,
			day: this.date.getDate(),
			hour: 0,
			minute: 0,
			second: 0,
		}).setZone(this.timeZone);
	}

	public getDatePrayerTimes(coordinates: Coordinates): Record<string, Date> {
		this.coordinates = coordinates;

		this.julianDate =
			julianDate(this.baseDate().year, this.baseDate().month, this.baseDate().day) -
			coordinates.longitude / (15 * 24);

		const daysTmp: string[] = this._computeDayTimes().map((e) => e.toString());

		const days: Record<string, DateTime> = {};

		for (let i = 0; i < daysTmp.length; i++) {
			const d = daysTmp[i];

			if (d !== 'Invalid Time') {
				const timeComponents = d.split(':');
				const hour = parseInt(timeComponents[0]) ?? 0;
				const minute = parseInt(timeComponents[1]) ?? 0;
				const dateTime = this.baseDate().plus(Duration.fromObject({ hour, minute }));
				days[this.timeNames[i].toLowerCase()] = dateTime;
			}
		}

		if (this.loop) {
			days['fajrAfter'] = DateTime.fromJSDate(
				new PrayerTimesCalculator(
					new CalculatorParams({
						coordinates: this.coordinates,
						date: DateTime.fromJSDate(this.date)
							.plus(Duration.fromObject({ days: 1 }))
							.toJSDate(),
						timeZone: this.timeZone,
					}),
					false,
				).getPrayerTimes()['fajr']!,
			).setZone(this.timeZone);
			days['ishaBefore'] = DateTime.fromJSDate(
				new PrayerTimesCalculator(
					new CalculatorParams({
						coordinates: this.coordinates,
						date: DateTime.fromJSDate(this.date)
							.minus(Duration.fromObject({ days: 1 }))
							.toJSDate(),
						timeZone: this.timeZone,
					}),
					false,
				).getPrayerTimes()['isha']!,
			).setZone(this.timeZone);
		}

		return mapValues(days, (item) => item.toJSDate());
	}

	public getPrayerTimes(): Record<string, Date> {
		return this.getDatePrayerTimes(this.coordinates);
	}

	// Set the juristic method for Asr
	public setAsrMethod(methodID: number): void {
		this.asrJuristic = methodID < 0 || methodID > 1 ? this.asrJuristic : methodID;
	}

	// Set the angle for calculating Fajr
	public setFajrAngle(angle: number): void {
		this.setCustomParams(this.customCalculationMethod.copyWith({ fajrAngle: angle }));
	}

	// Set the angle for calculating Maghrib
	public setMaghribAngle(angle: number): void {
		this.setCustomParams(
			this.customCalculationMethod.copyWith({
				maghribCalculation: new MaghribCalculation({ selector: MaghribSelector.ANGLE, value: angle }),
			}),
		);
	}

	// Set the angle for calculating Isha
	public setIshaAngle(angle: number): void {
		this.setCustomParams(
			this.customCalculationMethod.copyWith({
				ishaCalculation: new IshaCalculation({ selector: IshaSelector.ANGLE, value: angle }),
			}),
		);
	}

	// Set the minutes after mid-day for calculating Dhuhr
	public setDhuhrMinutes(minutes: number): void {
		this.dhuhrMinutes = minutes;
	}

	// Set the minutes after Sunset for calculating Maghrib
	public setMaghribMinutes(minutes: number): void {
		this.setCustomParams(
			this.customCalculationMethod.copyWith({
				maghribCalculation: new MaghribCalculation({
					selector: MaghribSelector.MINUTES_AFTER_SUNSET,
					value: minutes,
				}),
			}),
		);
	}

	// Set the minutes after Maghrib for calculating Isha
	public setIshaMinutes(minutes: number): void {
		this.setCustomParams(
			this.customCalculationMethod.copyWith({
				ishaCalculation: new IshaCalculation({ selector: IshaSelector.MINUTES_AFTER_MAGHRIB, value: minutes }),
			}),
		);
	}

	// Set custom values for calculation parameters
	public setCustomParams(params: CalculationMethod): void {
		this.customCalculationMethod = this.customCalculationMethod.copyWith({
			fajrAngle: params.fajrAngle,
			maghribCalculation: params.maghribCalculation,
			ishaCalculation: params.ishaCalculation,
		});

		this.calculationMethod = this.customCalculationMethod;
	}

	private _computeMidDay(t: number): number {
		return Trigonometric.fixhour(12 - Calculation.equationOfTime(this.julianDate + t));
	}

	private _computeTime(angle: number, time: number): number {
		const D = Calculation.sunDeclination(this.julianDate + time);
		const Z = this._computeMidDay(time);
		const V =
			(1 / 15) *
			Trigonometric.darccos(
				(-Trigonometric.dsin(angle) - Trigonometric.dsin(D) * Trigonometric.dsin(this.coordinates.latitude)) /
					(Trigonometric.dcos(D) * Trigonometric.dcos(this.coordinates.latitude)),
			);
		const result = Z + (angle > 90 ? -V : V);
		return isNaN(result) ? time : result;
	}

	private _computeAsr(angle: number, time: number): number {
		const D = Calculation.sunDeclination(this.julianDate + time);
		const G = -Trigonometric.darccot(angle + Trigonometric.dtan(Math.abs(this.coordinates.latitude - D)));
		return this._computeTime(G, time);
	}

	private _computeTimes(times: number[]): number[] {
		const t = Portion.day(times);

		const fajr = this._computeTime(180 - this.calculationMethod.fajrAngle, t[0]);
		const sunrise = this._computeTime(180 - 0.833, t[1]);
		const dhuhr = this._computeMidDay(t[2]);
		const asr = this._computeAsr(1.0 + this.asrJuristic, t[3]);
		const sunset = this._computeTime(0.833, t[4]);
		const maghrib = this._computeTime(this.calculationMethod.maghribCalculation.value, t[5]);
		const isha = this._computeTime(this.calculationMethod.ishaCalculation.value, t[6]);

		return [fajr, sunrise, dhuhr, asr, sunset, maghrib, isha];
	}

	private _computeDayTimes(): number[] | string[] {
		let times: number[] = [5, 6, 12, 13, 18, 18, 20]; // Default times

		for (let i = 1; i <= this.numIterations; i++) {
			times = this._computeTimes(times);
		}

		times = this._adjustTimes(times);
		return this._adjustTimesFormat(times);
	}

	private _adjustTimes(times: number[]): number[] {
		for (let i = 0; i < times.length; i++) {
			times[i] += this.timeZoneOffset - this.coordinates.longitude / 15;
		}

		times[2] += this.dhuhrMinutes / 60; // Dhuhr

		if (this.calculationMethod.maghribCalculation.selector === MaghribSelector.MINUTES_AFTER_SUNSET) {
			// Maghrib
			times[5] = times[4] + this.calculationMethod.maghribCalculation.value / 60;
		}

		if (this.calculationMethod.ishaCalculation.selector === IshaSelector.MINUTES_AFTER_MAGHRIB) {
			// Isha
			times[6] = times[5] + this.calculationMethod.ishaCalculation.value / 60;
		}

		if (this.adjustHighLats !== HigherLatitudesAdjusting.NONE) {
			times = this._adjustHighLatTimes(times);
		}

		return times;
	}

	private _adjustTimesFormat(times: number[]): number[] | string[] {
		const timeResult: string[] = times.map((t) => t.toString());
		// const timeResult: string[] = times.map(t => floatToTime24(t).toString());

		if (this.timeFormat === TimeFormats.FLOAT) {
			return times;
		}

		for (let i = 0; i < times.length; i++) {
			if (this.timeFormat === TimeFormats.TIME12) {
				timeResult[i] = floatToTime12(times[i]);
			} else if (this.timeFormat === TimeFormats.TIME12NS) {
				timeResult[i] = floatToTime12(times[i], true);
			} else {
				timeResult[i] = floatToTime24(times[i]);
			}
		}

		return timeResult;
	}

	private _adjustHighLatTimes(times: number[]): number[] {
		const nightTime = timeDiff(times[4], times[1]); // Sunset to sunrise

		// Adjust Fajr
		const fajrDiff =
			Portion.night({
				angle: this.calculationMethod.fajrAngle,
				adjustHighLats: this.adjustHighLats,
			}) * nightTime;

		if (isNaN(times[0]) || timeDiff(times[0], times[1]) > fajrDiff) {
			times[0] = times[1] - fajrDiff;
		}

		// Adjust Isha
		const ishaAngle =
			this.calculationMethod.ishaCalculation.selector === IshaSelector.ANGLE
				? this.calculationMethod.ishaCalculation.value
				: 18;

		const ishaDiff =
			Portion.night({
				angle: ishaAngle,
				adjustHighLats: this.adjustHighLats,
			}) * nightTime;

		if (isNaN(times[6]) || timeDiff(times[4], times[6]) > ishaDiff) {
			times[6] = times[4] + ishaDiff;
		}

		// Adjust Maghrib
		const maghribAngle =
			this.calculationMethod.maghribCalculation.selector === MaghribSelector.ANGLE
				? this.calculationMethod.maghribCalculation.value
				: 4;

		const maghribDiff =
			Portion.night({
				angle: maghribAngle,
				adjustHighLats: this.adjustHighLats,
			}) * nightTime;

		if (isNaN(times[5]) || timeDiff(times[4], times[5]) > maghribDiff) {
			times[5] = times[4] + maghribDiff;
		}

		return times;
	}
}
