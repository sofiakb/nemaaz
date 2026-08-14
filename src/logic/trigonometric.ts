'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:38
 * File /trigonometric
 */

export class Trigonometric {
	// Trigonometric Functions

	// degree sin
	static dsin(d: number): number {
		return Math.sin(Trigonometric.dtr(d));
	}

	// degree cos
	static dcos(d: number): number {
		return Math.cos(Trigonometric.dtr(d));
	}

	// degree tan
	static dtan(d: number): number {
		return Math.tan(Trigonometric.dtr(d));
	}

	// degree arcsin
	static darcsin(x: number): number {
		return Trigonometric.rtd(Math.asin(x));
	}

	// degree arccos
	static darccos(x: number): number {
		return Trigonometric.rtd(Math.acos(x));
	}

	// degree arctan
	static darctan(x: number): number {
		return Trigonometric.rtd(Math.atan(x));
	}

	// degree arctan2
	static darctan2(y: number, x: number): number {
		return Trigonometric.rtd(Math.atan2(y, x));
	}

	// degree arccot
	static darccot(x: number): number {
		return Trigonometric.rtd(Math.atan(1 / x));
	}

	// degree to radian
	static dtr(degree: number): number {
		return (degree * Math.PI) / 180.0;
	}

	// radian to degree
	static rtd(radian: number): number {
		return (radian * 180.0) / Math.PI;
	}

	// range reduce angle in degrees.
	static fixangle(angle: number): number {
		angle = angle - 360.0 * Math.floor(angle / 360.0);
		angle = angle < 0 ? angle + 360.0 : angle;
		return angle;
	}

	// range reduce hours to 0..23
	static fixhour(hours: number): number {
		hours = hours - 24.0 * Math.floor(hours / 24.0);
		return hours < 0 ? hours + 24.0 : hours;
	}
}
