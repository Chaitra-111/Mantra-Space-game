/**
 * Stars & Meteoroid educational data for the Mantra game.
 */

export const starsData = [
  {
    id: 'sirius',
    name: 'Sirius',
    type: 'Star (Binary System)',
    tagline: 'The Brightest Star in Earth\'s Night Sky',
    orbit: 'Located 8.6 light-years from Earth in the constellation Canis Major.',
    rotation: 'Sirius A rotates at ~16 km/s at its equator.',
    composition: {
      'Hydrogen': 70,
      'Helium': 28,
      'Metals': 2
    },
    atmosphere: 'Surface temperature: ~9,940 K (nearly twice as hot as the Sun). Spectral type A1V (white main-sequence star). Sirius B is a white dwarf companion.',
    moons: [],
    facts: [
      'Sirius is 25 times more luminous than the Sun.',
      'Ancient Egyptians based their calendar on Sirius\'s heliacal rising.',
      'Sirius B is one of the densest objects known — a teaspoon would weigh ~5.5 tons on Earth.',
      'It is gradually moving closer to our Solar System.',
      'Sirius appears to twinkle more than other stars because of its brightness and low position in the sky.'
    ],
    color: '#A8D8FF',
    glowColor: '#E0F0FF',
    gameX: 2000,
    gameY: -800,
    radius: 18
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    type: 'Red Supergiant Star',
    tagline: 'The Dying Giant of Orion',
    orbit: 'Located ~700 light-years from Earth in the constellation Orion (the "left shoulder").',
    rotation: 'Very slow — estimated rotation period of ~36 years.',
    composition: {
      'Hydrogen': 55,
      'Helium': 40,
      'Carbon & Oxygen': 3,
      'Heavier Elements': 2
    },
    atmosphere: 'Surface temperature: ~3,500 K (cool, hence its red color). If placed at the center of our Solar System, it would engulf Mars and nearly reach Jupiter.',
    moons: [],
    facts: [
      'Betelgeuse is one of the largest stars visible to the naked eye — about 900× the Sun\'s radius.',
      'It is expected to explode as a supernova within the next 100,000 years.',
      'When it goes supernova, it could briefly outshine the full Moon.',
      'Betelgeuse visibly dimmed in 2019–2020, exciting astronomers worldwide.',
      'Its name comes from the Arabic "Yad al-Jauzā" — "Hand of the Central One".'
    ],
    color: '#FF6633',
    glowColor: '#FF4400',
    gameX: -1800,
    gameY: -1200,
    radius: 30
  },
  {
    id: 'polaris',
    name: 'Polaris',
    type: 'Cepheid Variable Star',
    tagline: 'The North Star — Navigator of Ages',
    orbit: 'Located ~433 light-years from Earth at the tip of Ursa Minor (Little Bear).',
    rotation: 'Polaris Aa has a slow rotation of ~119 days.',
    composition: {
      'Hydrogen': 65,
      'Helium': 30,
      'Metals (Iron, Calcium)': 5
    },
    atmosphere: 'Surface temperature: ~6,015 K (F-type supergiant). It is a triple star system — Polaris Aa, Ab, and B.',
    moons: [],
    facts: [
      'Polaris is almost exactly aligned with Earth\'s rotational axis, making it appear stationary.',
      'It is a Cepheid variable — its brightness pulsates every ~4 days.',
      'Polaris is about 2,500 times more luminous than the Sun.',
      'Due to axial precession, Polaris won\'t always be the North Star — Vega will take over in ~12,000 years.',
      'Ancient sailors used Polaris for navigation across the oceans.'
    ],
    color: '#FFFFCC',
    glowColor: '#FFF8DC',
    gameX: 500,
    gameY: -1600,
    radius: 15
  },
  {
    id: 'alpha_centauri',
    name: 'Alpha Centauri',
    type: 'Triple Star System',
    tagline: 'Our Nearest Stellar Neighbor',
    orbit: 'Located 4.37 light-years from Earth in the constellation Centaurus — the closest star system to our Sun.',
    rotation: 'Alpha Centauri A: ~22 days. Alpha Centauri B: ~41 days.',
    composition: {
      'Hydrogen': 72,
      'Helium': 26,
      'Metals': 2
    },
    atmosphere: 'Alpha Centauri A is a G2V star (same type as our Sun, slightly larger). B is a K1V (orange dwarf). Proxima Centauri is a red dwarf.',
    moons: [],
    facts: [
      'At 4.37 light-years away, it is the closest star system to our Solar System.',
      'Proxima Centauri (part of the system) hosts an Earth-sized planet in its habitable zone — Proxima b.',
      'Alpha Centauri A and B orbit each other every ~80 years.',
      'With current technology, a spacecraft would take ~6,300 years to reach Alpha Centauri.',
      'The Breakthrough Starshot project aims to send tiny probes there at 20% light speed.'
    ],
    color: '#FFE088',
    glowColor: '#FFCC44',
    gameX: -2200,
    gameY: 600,
    radius: 20
  },
  {
    id: 'vega',
    name: 'Vega',
    type: 'Main-Sequence Star',
    tagline: 'The Summer Star — Future North Star',
    orbit: 'Located 25 light-years from Earth in the constellation Lyra.',
    rotation: 'Extremely fast — rotates every ~12.5 hours (vs Sun\'s 25 days), making it oblate.',
    composition: {
      'Hydrogen': 71,
      'Helium': 27,
      'Metals': 2
    },
    atmosphere: 'Surface temperature: ~9,600 K (A0V spectral type). About 2.1× the mass of the Sun and 40× its luminosity. Surrounded by a debris disk that may contain planets.',
    moons: [],
    facts: [
      'Vega was the first star (other than the Sun) to be photographed (1850).',
      'It was the North Star about 12,000 years ago and will be again in ~12,000 years.',
      'Vega spins so fast it bulges at the equator — 23% wider than tall.',
      'It was the zero-point for the magnitude brightness scale used by astronomers.',
      'The movie "Contact" (1997) featured an alien signal from Vega.'
    ],
    color: '#CCE5FF',
    glowColor: '#99CCFF',
    gameX: 1600,
    gameY: 1400,
    radius: 16
  }
];

export const meteoroidInfo = {
  id: 'meteoroid',
  name: 'Meteoroid',
  type: 'Space Rock / Debris',
  tagline: 'Tiny Travelers of the Cosmic Void',
  orbit: 'Meteoroids orbit the Sun at speeds of 11–72 km/s. They originate from asteroid collisions, comet debris trails, and even lunar/Martian ejecta.',
  rotation: 'Tumble chaotically — no fixed rotation axis. Rotation periods range from seconds to hours.',
  composition: {
    'Silicates (Olivine, Pyroxene)': 40,
    'Iron & Nickel': 30,
    'Carbon Compounds': 15,
    'Water Ice (some)': 10,
    'Trace Minerals': 5
  },
  atmosphere: 'No atmosphere. When a meteoroid enters a planet\'s atmosphere, friction heats it to ~1,650°C, creating a luminous streak called a meteor ("shooting star"). Surviving fragments that reach the surface are called meteorites.',
  moons: [],
  facts: [
    'About 48.5 tons of meteoritic material falls on Earth every day — mostly as dust.',
    'Meteoroids smaller than 1mm are called micrometeoroids or cosmic dust.',
    'The Chelyabinsk meteor (2013) exploded over Russia with 30× the energy of the Hiroshima bomb.',
    'There are three main types: stony (most common, 94%), iron (5%), and stony-iron (1%).',
    'Meteor showers occur when Earth passes through a comet\'s debris trail (e.g., Perseids from Comet Swift-Tuttle).',
    'The fastest meteoroids enter Earth\'s atmosphere at ~72 km/s (259,200 km/h).'
  ],
  color: '#8B7355',
  glowColor: '#6B5A42'
};
