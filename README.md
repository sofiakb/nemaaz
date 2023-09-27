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
      A typescript library for axios API calls.
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

- axios
- typescript

### Installation

```shell
npm install --save @sofiakb/nemaaz
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
import { mapValues } from 'lodash';

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

console.log(mapValues(test.toJson(), (item) => DateTime.fromJSDate(item, { zone: 'Europe/Paris' }).toString()));
```

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