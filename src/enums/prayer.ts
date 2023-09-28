'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:33
 * File /prayer
 */

export enum Prayer {
	FAJR = 'FAJR',
	SHURUQ = 'SHURUQ',
	SUNSET = 'SUNSET',
	DHUHR = 'DHUHR',
	ASR = 'ASR',
	MAGHRIB = 'MAGHRIB',
	ISHA = 'ISHA',
	ISHA_BEFORE = 'ISHA_BEFORE',
	FAJR_AFTER = 'FAJR_AFTER',
	NONE = 'NONE',
}

export const prayerToLabel = (prayer: Prayer): string => {
	switch (prayer) {
		case Prayer.FAJR:
		case Prayer.FAJR_AFTER:
			return 'Fajr';
		case Prayer.SHURUQ:
			return 'Shuruq';
		case Prayer.SUNSET:
			return 'Sunset';
		case Prayer.DHUHR:
			return 'Dhuhr';
		case Prayer.ASR:
			return 'Asr';
		case Prayer.MAGHRIB:
			return 'Maghrib';
		case Prayer.ISHA:
		case Prayer.ISHA_BEFORE:
			return 'Isha';
		default:
			return 'None';
	}
};

export const prayerFromString = (str: string): Prayer => {
	switch (str.toUpperCase()) {
		case 'FAJR':
			return Prayer.FAJR;
		case 'SHURUQ':
			return Prayer.SHURUQ;
		case 'SUNSET':
			return Prayer.SUNSET;
		case 'DHUHR':
			return Prayer.DHUHR;
		case 'ASR':
			return Prayer.ASR;
		case 'MAGHRIB':
			return Prayer.MAGHRIB;
		case 'ISHA':
			return Prayer.ISHA;
		case 'ISHABEFORE':
			return Prayer.ISHA_BEFORE;
		case 'FAJRAFTER':
			return Prayer.FAJR_AFTER;
		default:
			return Prayer.NONE;
	}
};
