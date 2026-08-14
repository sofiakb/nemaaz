[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[comment]: <> ([![LinkedIn][linkedin-shield]][linkedin-url])

[![Create release](https://github.com/sofiakb/nemaaz/actions/workflows/create_release.yml/badge.svg)](https://github.com/sofiakb/nemaaz/actions/workflows/create_release.yml)



<!-- PROJECT LOGO -->

<p align="center">
  <img height="100px" src="./assets/images/logo.png">
</p>

<br />
<p align="center">

  <h1 align="center">nemaaz</h1>

  <p align="center">
      A typescript library to compute Islamic prayer times.
      <br />
      <!--<a href="https://github.com/sofiakb/nemaaz"><strong>Explore the docs »</strong></a>-->
      <br />
      <br />
      <a href="https://github.com/sofiakb/nemaaz/issues">Report Bug</a>
      ·
      <a href="https://github.com/sofiakb/nemaaz/issues">Request Feature</a>
  </p>

</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the library</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Library

The library gives you prayer times in a given position.

### Built With

* [Javascript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
* [Typescript](https://www.typescriptlang.org/)

<!-- GETTING STARTED -->

### Prerequisites

- node >= 24
- typescript

### Installation

```shell
pnpm add @sofiakb/nemaaz
```

<!-- USAGE EXAMPLES -->

## Usage

```typescript
import {
	AsrJuristic,
	CalculationMethod,
	CalculatorParams,
	Coordinates,
	HigherLatitudesAdjusting,
	PrayerTimes,
	TimeFormats,
} from '@sofiakb/nemaaz';

import { DateTime } from 'luxon';

const date = DateTime.now().setZone('Europe/Paris');

const test = new PrayerTimes(
		new CalculatorParams({
			coordinates: new Coordinates({
				latitude: 50.3555,
				longitude: 3.11127,
			}),
			calculationMethod: CalculationMethod.mwl(),
			adjustHighLats: HigherLatitudesAdjusting.ANGLE_BASED,
			asrJuristic: AsrJuristic.SHAFI,
			dhuhrMinutes: 0,
			numIterations: 1,
			timeFormat: TimeFormats.TIME24,
			date: date.toJSDate(),
		}),
);

console.log(
	Object.fromEntries(
		Object.entries(test.toJson()).map(([name, item]) => [
			name,
			DateTime.fromJSDate(item, { zone: 'Europe/Paris' }).toString(),
		]),
	),
);
```

### The nine times returned

A `PrayerTimes` instance is built for **one** day, and exposes nine times. Only five of them are
actual prayers:

| Field        | Prayer?           | Meaning                                                                     |
|--------------|-------------------|-----------------------------------------------------------------------------|
| `fajr`       | ✅ Fajr            | Dawn prayer, on the requested day.                                          |
| `shuruq`     | ❌                 | Sunrise. Marks the end of the Fajr window, it is **not** a prayer.          |
| `dhuhr`      | ✅ Dhuhr           | Midday prayer.                                                              |
| `asr`        | ✅ Asr             | Afternoon prayer.                                                           |
| `sunset`     | ❌                 | Sunset, exposed for reference. Usually equal to `maghrib`.                  |
| `maghrib`    | ✅ Maghrib         | Sunset prayer.                                                              |
| `isha`       | ✅ Isha            | Night prayer, on the requested day.                                         |
| `ishaBefore` | ✅ Isha (D‑1)      | **Misleading name**: this is not a distinct prayer. It is the *previous* day's Isha, i.e. the Isha still running during the small hours of the requested day. |
| `fajrAfter`  | ✅ Fajr (D+1)      | **Misleading name**: this is not a distinct prayer. It is the *next* day's Fajr, i.e. the Fajr that follows the requested day's Isha. |

`ishaBefore` and `fajrAfter` exist purely so that a single instance can answer "what is running
right now?" and "what comes next?" across the day boundary, without the caller having to build a
second instance for the neighbouring day. They are computed with **the same parameters** as the
rest of the day — calculation method, Asr school, high latitude adjustment and time zone all
carry over.

The `Prayer` enum mirrors that layout, so `Prayer.ISHA_BEFORE` really means *Isha* and
`Prayer.FAJR_AFTER` really means *Fajr*. `prayerToLabel()` and `prayerToArabic()` already collapse
them accordingly (both `FAJR` and `FAJR_AFTER` render as `Fajr`).

### Knowing the current and next prayer

Two families of accessors are available:

```typescript
// Raw timeline: every time above is a candidate, including SHURUQ, ISHA_BEFORE and FAJR_AFTER.
test.currentPrayer(); // may return SHURUQ or ISHA_BEFORE
test.nextPrayer();    // may return SHURUQ or FAJR_AFTER

// Prayer-only timeline: restricted to the five daily prayers.
test.currentDailyPrayer(); // always one of FAJR, DHUHR, ASR, MAGHRIB, ISHA
test.nextDailyPrayer();    // always one of FAJR, DHUHR, ASR, MAGHRIB, ISHA
```

`currentDailyPrayer()` and `nextDailyPrayer()` resolve the day overflow for you and never report a
non-prayer:

- after Isha, `nextDailyPrayer()` returns `FAJR` carrying the `fajrAfter` date (instead of `FAJR_AFTER`);
- before Fajr, `currentDailyPrayer()` returns `ISHA` carrying the `ishaBefore` date (instead of `ISHA_BEFORE`);
- between Fajr and sunrise, `nextDailyPrayer()` returns `DHUHR` (instead of `SHURUQ`), and
  `currentDailyPrayer()` stays on `FAJR`.

Prefer them for display; use `currentPrayer()` / `nextPrayer()` only when you genuinely need
sunrise in the timeline. Both accept an optional `Date` and default to now.

### Time zones

Times are anchored on the `timeZone` passed in `CalculatorParams`, but the base date is read from
the host's local calendar day. Pass a `date` that lands on the intended day in the host's own zone,
and pin `TZ` in CI so results stay reproducible across machines.

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/sofiakb/nemaaz/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/sofiakb/nemaaz.svg?style=for-the-badge

[contributors-url]: https://github.com/sofiakb/nemaaz/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/sofiakb/nemaaz.svg?style=for-the-badge

[forks-url]: https://github.com/sofiakb/nemaaz/network/members

[stars-shield]: https://img.shields.io/github/stars/sofiakb/nemaaz.svg?style=for-the-badge

[stars-url]: https://github.com/sofiakb/nemaaz/stargazers

[issues-shield]: https://img.shields.io/github/issues/sofiakb/nemaaz.svg?style=for-the-badge

[issues-url]: https://github.com/sofiakb/nemaaz/issues

[license-shield]: https://img.shields.io/github/license/sofiakb/nemaaz.svg?style=for-the-badge

[license-url]: https://github.com/sofiakb/nemaaz/blob/main/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/sofiane-akbly/