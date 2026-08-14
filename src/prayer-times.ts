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
		return Object.entries(this.toJson()).map(([key, item]) => ({ prayer: prayerFromString(key), date: item }));
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

	currentPrayer(date?: Date): PrayerTimeResult {
		date ??= new Date();
		if (date > this.isha) return { prayer: Prayer.ISHA, date: this.isha };
		if (date > this.maghrib) return { prayer: Prayer.MAGHRIB, date: this.maghrib };
		if (date > this.asr) return { prayer: Prayer.ASR, date: this.asr };
		if (date > this.dhuhr) return { prayer: Prayer.DHUHR, date: this.dhuhr };
		if (date > this.shuruq) return { prayer: Prayer.SHURUQ, date: this.shuruq };
		if (date > this.fajr) return { prayer: Prayer.FAJR, date: this.fajr };
		return { prayer: Prayer.ISHA_BEFORE, date: this.ishaBefore };
	}

	nextPrayer(date?: Date): PrayerTimeResult {
		date ??= new Date();
		if (date > this.isha) return { prayer: Prayer.FAJR_AFTER, date: this.fajrAfter };
		if (date > this.maghrib) return { prayer: Prayer.ISHA, date: this.isha };
		if (date > this.asr) return { prayer: Prayer.MAGHRIB, date: this.maghrib };
		if (date > this.dhuhr) return { prayer: Prayer.ASR, date: this.asr };
		if (date > this.shuruq) return { prayer: Prayer.DHUHR, date: this.dhuhr };
		if (date > this.fajr) return { prayer: Prayer.SHURUQ, date: this.shuruq };
		return { prayer: Prayer.FAJR, date: this.fajr };
	}

	/**
	 * Prayer currently in, restricted to the five daily prayers.
	 *
	 * Unlike {@link currentPrayer} this never returns SHURUQ (a solar event, not a prayer)
	 * nor ISHA_BEFORE: before today's Fajr the current prayer is the previous day's Isha,
	 * reported as ISHA carrying the `ishaBefore` date.
	 */
	currentDailyPrayer(date?: Date): PrayerTimeResult {
		date ??= new Date();
		if (date > this.isha) return { prayer: Prayer.ISHA, date: this.isha };
		if (date > this.maghrib) return { prayer: Prayer.MAGHRIB, date: this.maghrib };
		if (date > this.asr) return { prayer: Prayer.ASR, date: this.asr };
		if (date > this.dhuhr) return { prayer: Prayer.DHUHR, date: this.dhuhr };
		if (date > this.fajr) return { prayer: Prayer.FAJR, date: this.fajr };
		return { prayer: Prayer.ISHA, date: this.ishaBefore };
	}

	/**
	 * Next prayer to come, restricted to the five daily prayers.
	 *
	 * Unlike {@link nextPrayer} this never returns SHURUQ (between Fajr and sunrise the next
	 * prayer is Dhuhr) nor FAJR_AFTER: after Isha the next prayer is the following day's
	 * Fajr, reported as FAJR carrying the `fajrAfter` date.
	 */
	nextDailyPrayer(date?: Date): PrayerTimeResult {
		date ??= new Date();
		if (date > this.isha) return { prayer: Prayer.FAJR, date: this.fajrAfter };
		if (date > this.maghrib) return { prayer: Prayer.ISHA, date: this.isha };
		if (date > this.asr) return { prayer: Prayer.MAGHRIB, date: this.maghrib };
		if (date > this.dhuhr) return { prayer: Prayer.ASR, date: this.asr };
		if (date > this.fajr) return { prayer: Prayer.DHUHR, date: this.dhuhr };
		return { prayer: Prayer.FAJR, date: this.fajr };
	}
}
