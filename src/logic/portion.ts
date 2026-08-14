'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:39
 * File /portion
 */

import { HigherLatitudesAdjusting } from '../enums/higher-latitudes-adjusting';

export class Portion {
	// The night portion used for adjusting times in higher latitudes
	static night({ angle, adjustHighLats }: { angle: number; adjustHighLats: HigherLatitudesAdjusting }): number {
		if (adjustHighLats === HigherLatitudesAdjusting.ANGLE_BASED) {
			return (1 / 60) * angle;
		}
		if (adjustHighLats === HigherLatitudesAdjusting.MIDNIGHT) {
			return 1 / 2;
		}
		if (adjustHighLats === HigherLatitudesAdjusting.ONE_SEVENTH) {
			return 1 / 7;
		}
		return NaN;
	}

	// Convert hours to day portions
	static day(times: number[]): number[] {
		return times.map((time) => time / 24);
	}
}
