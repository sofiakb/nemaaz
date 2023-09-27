'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:36
 * File /utils
 */

import { Trigonometric } from '../logic/trigonometric';
import { invalidTime } from './constants';

export const timeDiff = (time1: number, time2: number): number => Trigonometric.fixhour(time2 - time1);

export const twoDigitsFormat = (num: number): string => (num < 10 ? '0' + num : num.toString());

export const floatToTime24 = (time: number): string => {
	if (isNaN(time)) return invalidTime;
	const isNextDay = time >= 24;
	time = Trigonometric.fixhour(time + 0.5 / 60);
	const hours = Math.floor(time);
	const minutes = Math.floor((time - hours) * 60);
	return `${twoDigitsFormat(isNextDay ? hours + 24 : hours)}:${twoDigitsFormat(minutes)}`;
};

export const floatToTime12 = (time: number, noSuffix: boolean = false): string => {
	if (isNaN(time)) return invalidTime;
	time = Trigonometric.fixhour(time + 0.5 / 60);
	let hours = Math.floor(time);
	const minutes = Math.floor((time - hours) * 60);
	const suffix = hours >= 12 ? ' pm' : ' am';
	hours = ((hours + 12 - 1) % 12) + 1;
	return `${hours}:${twoDigitsFormat(minutes)}${noSuffix ? '' : suffix}`;
};

export const julianDate = (year: number, month: number, day: number): number => {
	if (month <= 2) {
		year -= 1;
		month += 12;
	}
	const A = Math.floor(year / 100);
	const B = 2 - A + Math.floor(A / 4);

	const julianDate = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
	return julianDate;
};
