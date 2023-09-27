'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:41
 * File /calculator-params
 */

import { HigherLatitudesAdjusting } from '../enums/higher-latitudes-adjusting';
import { TimeFormats } from '../enums/time-formats';
import { CalculationMethod } from './calculation-method';
import { Coordinates } from './coordinates';
import { AsrJuristic } from '../enums/asr-juristic';

export class CalculatorParams {
	asrJuristic?: AsrJuristic; // Juristic method for Asr
	dhuhrMinutes?: number; // minutes after midday for Dhuhr
	readonly coordinates: Coordinates;
	readonly date: Date;
	numIterations?: number; // number of iterations needed to compute times
	adjustHighLats?: HigherLatitudesAdjusting; // adjusting method for higher latitudes
	timeFormat?: TimeFormats; // time format
	calculationMethod?: CalculationMethod;

	constructor({
		coordinates,
		date,
		asrJuristic,
		dhuhrMinutes = 0,
		numIterations,
		adjustHighLats,
		timeFormat,
		calculationMethod,
	}: {
		coordinates: Coordinates;
		date: Date;
		asrJuristic?: AsrJuristic;
		dhuhrMinutes?: number;
		numIterations?: number;
		adjustHighLats?: HigherLatitudesAdjusting;
		timeFormat?: TimeFormats;
		calculationMethod?: CalculationMethod;
	}) {
		this.coordinates = coordinates;
		this.date = date;
		this.asrJuristic = asrJuristic;
		this.dhuhrMinutes = dhuhrMinutes;
		this.numIterations = numIterations;
		this.adjustHighLats = adjustHighLats;
		this.timeFormat = timeFormat;
		this.calculationMethod = calculationMethod;
	}
}
