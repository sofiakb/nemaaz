'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * Created by WebStorm on 27/09/2023 at 10:40
 * File /coordinates
 */

export class Coordinates {
	readonly latitude: number;
	readonly longitude: number;

	constructor({ latitude, longitude }: { latitude: number; longitude: number }) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}
