'use strict';

/*
 * nemaaz
 *
 * (c) Sofiane Akbly <sofiane.akbly@digi-service.fr>
 *
 * File /setup
 */

// The prayer time computation derives its base date from the system zone, so the suite is
// pinned to the zone its expected instants were captured in.
export default async (): Promise<void> => {
	process.env.TZ = 'Europe/Paris';
};
