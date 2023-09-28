'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:50
 * File /prayer-times
 */

import { CalculatorParams } from './logic/calculator-params';
import { Prayer, prayerFromString } from './enums/prayer';
import { PrayerTimesCalculator } from './payer-times-calculator';
import { map } from 'lodash';

export interface PrayerTimeResult {
	prayer: Prayer;
	date: Date;
}

export class PrayerTimes {
	fajrAfter: Date;
	fajr: Date;
	shuruq: Date;
	sunset: Date;
	dhuhr: Date;
	asr: Date;
	maghrib: Date;
	isha: Date;
	ishaBefore: Date;

	params: CalculatorParams;

	constructor(params: CalculatorParams) {
		this.params = params;

		const result = new PrayerTimesCalculator(params).getPrayerTimes();

		this.fajr = result['fajr']!;
		this.shuruq = result['shuruq']!;
		this.sunset = result['sunset']!;
		this.dhuhr = result['dhuhr']!;
		this.asr = result['asr']!;
		this.maghrib = result['maghrib']!;
		this.isha = result['isha']!;
		this.ishaBefore = result['ishaBefore']!;
		this.fajrAfter = result['fajrAfter']!;
	}

	toJson(): Record<string, Date> {
		return {
			ishaBefore: this.ishaBefore,
			fajr: this.fajr,
			shuruq: this.shuruq,
			sunset: this.sunset,
			dhuhr: this.dhuhr,
			asr: this.asr,
			maghrib: this.maghrib,
			isha: this.isha,
			fajrAfter: this.fajrAfter,
		};
	}

	get values(): PrayerTimeResult[] {
		return map(this.toJson(), (item: Date, key: string) => ({ prayer: prayerFromString(key), date: item }));
	}

	timeForPrayer(prayer: string): Date | null {
		switch (prayer) {
			case Prayer.FAJR:
				return this.fajr;
			case Prayer.SHURUQ:
				return this.shuruq;
			case Prayer.DHUHR:
				return this.dhuhr;
			case Prayer.ASR:
				return this.asr;
			case Prayer.MAGHRIB:
				return this.maghrib;
			case Prayer.ISHA:
				return this.isha;
			case Prayer.ISHA_BEFORE:
				return this.ishaBefore;
			case Prayer.FAJR_AFTER:
				return this.fajrAfter;
			default:
				return null;
		}
	}

	currentPrayer({ date }: { date: Date }): Prayer {
		if (date > this.isha) return Prayer.ISHA;
		if (date > this.maghrib) return Prayer.MAGHRIB;
		if (date > this.asr) return Prayer.ASR;
		if (date > this.dhuhr) return Prayer.DHUHR;
		if (date > this.shuruq) return Prayer.SHURUQ;
		if (date > this.fajr) return Prayer.FAJR;
		return Prayer.ISHA_BEFORE;
	}

	nextPrayer(): Prayer {
		const date = this.params.date;
		if (date > this.isha) return Prayer.FAJR_AFTER;
		if (date > this.maghrib) return Prayer.ISHA;
		if (date > this.asr) return Prayer.MAGHRIB;
		if (date > this.dhuhr) return Prayer.ASR;
		if (date > this.shuruq) return Prayer.DHUHR;
		if (date > this.fajr) return Prayer.SHURUQ;
		return Prayer.FAJR;
	}
}
