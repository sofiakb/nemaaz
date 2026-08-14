'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:47
 * File /calculation
 */

import { Trigonometric } from './trigonometric';

export class Calculation {
	// Compute declination angle of sun and equation of time
	static sunPosition(jd: number): [number, number] {
		const D = jd - 2451545.0;
		const g = Trigonometric.fixangle(357.529 + 0.98560028 * D);
		const q = Trigonometric.fixangle(280.459 + 0.98564736 * D);
		const L = Trigonometric.fixangle(q + 1.915 * Trigonometric.dsin(g) + 0.02 * Trigonometric.dsin(2 * g));

		const e = 23.439 - 0.00000036 * D;

		const d = Trigonometric.darcsin(Trigonometric.dsin(e) * Trigonometric.dsin(L));
		let RA = Trigonometric.darctan2(Trigonometric.dcos(e) * Trigonometric.dsin(L), Trigonometric.dcos(L)) / 15;
		RA = Trigonometric.fixhour(RA);
		const EqT = q / 15 - RA;

		return [d, EqT];
	}

	// Compute equation of time
	static equationOfTime(jd: number): number {
		const sp = Calculation.sunPosition(jd);
		return sp[1];
	}

	// Compute declination angle of sun
	static sunDeclination(jd: number): number {
		const sp = Calculation.sunPosition(jd);
		return sp[0];
	}
}
