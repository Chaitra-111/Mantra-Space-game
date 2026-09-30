/**
 * Solar System Data — All planet information for the Mantra game.
 * Contains scientific data, visual properties, and game configuration.
 */

export const solarSystem = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'Star',
    tagline: 'The Central Star of Our Solar System',
    orbit: 'Orbits the Galactic Center of the Milky Way once every ~230 million years (a cosmic year) at ~828,000 km/h.',
    rotation: 'Differential rotation: ~25 Earth days at equator, up to ~35 Earth days at poles.',
    composition: {
      'Hydrogen': 73.4,
      'Helium': 25,
      'Oxygen': 0.6,
      'Carbon': 0.3,
      'Neon': 0.2,
      'Iron': 0.2,
      'Nitrogen': 0.1,
      'Silicon': 0.1,
      'Other': 0.1
    },
    moons: [],
    facts: [
      'The Sun contains 99.86% of the mass in the Solar System.',
      'Its core temperature reaches about 15 million °C.',
      'Light from the Sun takes 8 minutes 20 seconds to reach Earth.',
      'The Sun is a G-type main-sequence star (G2V), commonly called a yellow dwarf.',
      'It is roughly 4.6 billion years old and halfway through its life.'
    ],
    // Game rendering properties
    color: '#FDB813',
    glowColor: '#FF6B00',
    surfaceColors: ['#FF4500', '#FF6B00', '#FFA500', '#FFD700', '#FDB813'],
    radius: 70,
    orbitRadius: 0,
    orbitSpeed: 0,
    orbitAngle: 0,
    // Surface scene
    surfaceGradient: ['#FF4500', '#FF6B00', '#FFA500'],
    surfaceFeatures: 'solar_flares',
    canLand: true
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    tagline: 'The Swift Messenger of the Gods',
    orbit: 'Orbits the Sun in 88 Earth days at ~57.9 million km.',
    rotation: '58.6 Earth days (3:2 spin-orbit resonance).',
    composition: {
      'Iron & Nickel (Core)': 70,
      'Silicate Rock': 30
    },
    atmosphere: 'Virtually no atmosphere — thin exosphere of trace Oxygen, Sodium, Hydrogen, Helium, and Potassium.',
    moons: [],
    facts: [
      'Mercury is the smallest planet in our Solar System.',
      'Despite being closest to the Sun, Venus is hotter due to its greenhouse effect.',
      'Mercury has a 3:2 spin-orbit resonance — it rotates 3 times for every 2 orbits.',
      'Temperature ranges from -180°C at night to 430°C during the day.',
      'Mercury has no atmosphere to retain heat, causing extreme temperature swings.'
    ],
    color: '#8C7E6D',
    glowColor: '#A0937D',
    surfaceColors: ['#6B6155', '#8C7E6D', '#A0937D'],
    radius: 12,
    orbitRadius: 160,
    orbitSpeed: 0.04,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#4A4239', '#6B6155', '#8C7E6D'],
    surfaceFeatures: 'craters',
    canLand: true
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    tagline: 'Earth\'s Toxic Twin',
    orbit: 'Orbits the Sun in 224.7 Earth days.',
    rotation: '243 Earth days (retrograde rotation — spins clockwise). A day on Venus is longer than its year.',
    composition: {
      'Iron Core': 32,
      'Silicate Mantle': 68
    },
    atmosphere: 'Dense, toxic: 96.5% Carbon Dioxide, 3.5% Nitrogen, with thick clouds of Sulfuric Acid.',
    moons: [],
    facts: [
      'Venus spins backwards compared to most planets (retrograde rotation).',
      'A day on Venus (243 Earth days) is longer than its year (224.7 Earth days).',
      'Surface temperature is ~465°C — hot enough to melt lead.',
      'Venus is the brightest natural object in Earth\'s night sky after the Moon.',
      'The atmospheric pressure on Venus is 92 times that of Earth.'
    ],
    color: '#E8CDA0',
    glowColor: '#D4A960',
    surfaceColors: ['#C4A06A', '#D4A960', '#E8CDA0'],
    radius: 18,
    orbitRadius: 260,
    orbitSpeed: 0.025,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#8B6914', '#C4A06A', '#E8CDA0'],
    surfaceFeatures: 'volcanic',
    canLand: true
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet',
    tagline: 'The Blue Marble — Our Home',
    orbit: 'Orbits the Sun in 365.25 days (1 year) at ~149.6 million km.',
    rotation: '23 hours, 56 minutes, 4 seconds (~24 hours).',
    composition: {
      'Iron & Nickel (Core)': 32,
      'Silicate Mantle': 45,
      'Water (Surface)': 15,
      'Crust Minerals': 8
    },
    atmosphere: '78% Nitrogen, 21% Oxygen, 0.93% Argon, trace CO₂ and water vapor.',
    moons: [
      {
        name: 'The Moon (Luna)',
        orbit: 'Orbits Earth every 27.3 days (tidally locked).',
        composition: 'Silicate rock, anorthosite crust, rich in Oxygen, Silicon, Magnesium, Iron, Calcium, and Aluminum, with a tiny metallic iron core.'
      }
    ],
    facts: [
      'Earth is the only known planet to support life.',
      '71% of Earth\'s surface is covered by liquid water.',
      'Earth\'s magnetic field protects us from harmful solar radiation.',
      'The Moon stabilizes Earth\'s axial tilt, helping maintain stable seasons.',
      'Earth is the densest planet in the Solar System.'
    ],
    color: '#4A90D9',
    glowColor: '#2E6BB5',
    surfaceColors: ['#1A5E1A', '#2E8B2E', '#4A90D9', '#3672A4'],
    radius: 20,
    orbitRadius: 370,
    orbitSpeed: 0.018,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#1A5E1A', '#2E8B2E', '#87CEEB'],
    surfaceFeatures: 'earth',
    canLand: true
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    tagline: 'The Red Planet',
    orbit: 'Orbits the Sun in 687 Earth days (~1.88 Earth years).',
    rotation: '24 hours, 37 minutes (1 Martian "sol").',
    composition: {
      'Iron-Sulfur Core': 25,
      'Silicate Mantle': 50,
      'Iron Oxide Crust': 25
    },
    atmosphere: 'Thin: 95% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon, traces of Oxygen and water vapor.',
    moons: [
      {
        name: 'Phobos',
        orbit: 'Orbits Mars in 7 hours, 39 minutes (faster than Mars rotates).',
        composition: 'Carbonaceous chondritic rock (carbon-rich rock and ice mixture).'
      },
      {
        name: 'Deimos',
        orbit: 'Orbits Mars in 30.3 hours.',
        composition: 'Carbonaceous asteroid-like material rich in silicates and carbon compounds.'
      }
    ],
    facts: [
      'Mars has the tallest volcano in the Solar System — Olympus Mons (21.9 km).',
      'Mars has a canyon system, Valles Marineris, over 4,000 km long.',
      'Evidence suggests Mars once had flowing liquid water on its surface.',
      'Mars appears red due to iron oxide (rust) on its surface.',
      'A day on Mars (sol) is just 37 minutes longer than an Earth day.'
    ],
    color: '#C1440E',
    glowColor: '#E05A26',
    surfaceColors: ['#8B2500', '#C1440E', '#D4663B'],
    radius: 16,
    orbitRadius: 490,
    orbitSpeed: 0.012,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#6B1A00', '#8B2500', '#C1440E'],
    surfaceFeatures: 'rocky',
    canLand: true
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    tagline: 'King of the Planets',
    orbit: 'Orbits the Sun in 11.86 Earth years.',
    rotation: '9 hours, 55 minutes (fastest rotation in the Solar System).',
    composition: {
      'Hydrogen': 89.8,
      'Helium': 10.2
    },
    atmosphere: '89-90% Molecular Hydrogen (H₂), ~10% Helium, with traces of Methane, Ammonia, Water vapor, and Hydrogen Sulfide. Core: dense metallic hydrogen mixed with rock and ice.',
    moons: [
      {
        name: 'Io',
        orbit: 'Orbits Jupiter in 1.77 days (tidally locked).',
        composition: 'Silicate rock and iron core, surface covered in sulfur and sulfur dioxide from active volcanism.'
      },
      {
        name: 'Europa',
        orbit: 'Orbits Jupiter in 3.55 days (tidally locked).',
        composition: 'Silicate rock core, global liquid water subsurface ocean, shell of water ice (H₂O).'
      },
      {
        name: 'Ganymede',
        orbit: 'Orbits Jupiter in 7.15 days (tidally locked; largest moon in the Solar System).',
        composition: 'Roughly equal parts silicate rock and water ice, with a liquid iron core generating its own magnetic field.'
      },
      {
        name: 'Callisto',
        orbit: 'Orbits Jupiter in 16.69 days (tidally locked).',
        composition: 'Heavily cratered mixture of ~50% water ice and ~50% rocky/organic materials.'
      }
    ],
    extraMoons: '115 recognized moons total (4 major Galilean moons shown above).',
    facts: [
      'Jupiter is the largest planet — over 1,300 Earths could fit inside it.',
      'The Great Red Spot is a storm larger than Earth, raging for over 350 years.',
      'Jupiter has the strongest magnetic field of any planet.',
      'Jupiter rotates faster than any other planet — a day is under 10 hours.',
      'Europa\'s subsurface ocean may harbor conditions suitable for life.'
    ],
    color: '#C88B3A',
    glowColor: '#D4A04A',
    surfaceColors: ['#8B6914', '#C88B3A', '#D4A04A', '#E8C080'],
    radius: 45,
    orbitRadius: 680,
    orbitSpeed: 0.006,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#8B6914', '#C88B3A', '#D4A04A'],
    surfaceFeatures: 'gas_bands',
    canLand: true
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    tagline: 'The Jewel of the Solar System',
    orbit: 'Orbits the Sun in 29.45 Earth years.',
    rotation: '10 hours, 33 minutes.',
    composition: {
      'Hydrogen': 96.3,
      'Helium': 3.25,
      'Methane': 0.45
    },
    atmosphere: '~96% Molecular Hydrogen, ~3% Helium, ~0.4% Methane and Ammonia. Dense inner core of rock, ice, and metallic hydrogen. Rings: 99% pure water ice with trace silicate dust.',
    moons: [
      {
        name: 'Titan',
        orbit: 'Orbits Saturn in 15.95 days (tidally locked). Second-largest moon.',
        composition: 'Water ice and rocky core. Dense atmosphere: 95% Nitrogen, 5% Methane, with liquid methane and ethane lakes.'
      },
      {
        name: 'Enceladus',
        orbit: 'Orbits Saturn in 1.37 days.',
        composition: 'Pure water ice exterior, global subsurface saltwater ocean, rocky core; emits cryovolcanic plumes of H₂O, salts, and organics.'
      },
      {
        name: 'Mimas',
        orbit: 'Orbits Saturn in ~0.9 days.',
        composition: 'Mostly water ice with silicate rock.'
      },
      {
        name: 'Tethys',
        orbit: 'Orbits Saturn in ~1.9 days.',
        composition: 'Mostly water ice with varying fractions of silicate rock.'
      }
    ],
    extraMoons: '293 recognized moons total (major moons shown above). Also includes Dione, Rhea, Iapetus, and many more.',
    facts: [
      'Saturn\'s rings span up to 282,000 km but are only about 10 meters thick.',
      'Saturn is the least dense planet — it would float in water if you had a big enough bathtub.',
      'Titan is the only moon with a thick atmosphere and liquid lakes on its surface.',
      'Enceladus shoots geysers of water ice into space from its south pole.',
      'Saturn\'s hexagonal storm at its north pole is larger than Earth.'
    ],
    color: '#E8D5A3',
    glowColor: '#D4C08A',
    surfaceColors: ['#C4A06A', '#D4C08A', '#E8D5A3'],
    radius: 38,
    orbitRadius: 900,
    orbitSpeed: 0.004,
    orbitAngle: Math.random() * Math.PI * 2,
    hasRings: true,
    ringColor: 'rgba(210, 190, 150, 0.5)',
    ringInnerRadius: 48,
    ringOuterRadius: 72,
    surfaceGradient: ['#C4A06A', '#D4C08A', '#E8D5A3'],
    surfaceFeatures: 'gas_bands',
    canLand: true
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    tagline: 'The Tilted World',
    orbit: 'Orbits the Sun in 84 Earth years.',
    rotation: '17 hours, 14 minutes (retrograde rotation with extreme axial tilt of 97.8° — orbits on its side).',
    composition: {
      'Hydrogen': 83,
      'Helium': 15,
      'Methane': 2
    },
    atmosphere: '83% Hydrogen, 15% Helium, 2% Methane (absorbs red light → pale cyan/aquamarine color). Mantle: dense, hot fluid of Water, Ammonia, and Methane over a small rocky core.',
    moons: [
      {
        name: 'Miranda',
        orbit: 'Orbits Uranus in 1.41 days.',
        composition: 'Highly fractured terrain of ~50% water ice and ~50% silicate rock.'
      },
      {
        name: 'Ariel',
        orbit: 'Orbits Uranus in 2.52 days.',
        composition: 'Deep ice-rock mixture with solid CO₂ on the surface.'
      },
      {
        name: 'Umbriel',
        orbit: 'Orbits Uranus in 4.14 days.',
        composition: 'Darkest major moon; water ice with dark carbonaceous material.'
      },
      {
        name: 'Titania',
        orbit: 'Orbits Uranus in 8.7 days.',
        composition: 'Equal mixtures of water ice, dense silicate rock, and carbonaceous compounds.'
      },
      {
        name: 'Oberon',
        orbit: 'Orbits Uranus in 13.5 days.',
        composition: 'Equal mixtures of water ice, dense silicate rock, and carbonaceous compounds.'
      }
    ],
    extraMoons: '29 recognized moons total.',
    facts: [
      'Uranus rotates on its side with an axial tilt of 97.8°.',
      'Uranus was the first planet discovered with a telescope (by William Herschel in 1781).',
      'Methane in the atmosphere gives Uranus its distinctive blue-green color.',
      'Uranus has 13 known rings, discovered in 1977.',
      'Seasons on Uranus last 21 years each due to its extreme tilt.'
    ],
    color: '#7EC8E3',
    glowColor: '#5BA8C8',
    surfaceColors: ['#4A90A8', '#5BA8C8', '#7EC8E3'],
    radius: 28,
    orbitRadius: 1120,
    orbitSpeed: 0.002,
    orbitAngle: Math.random() * Math.PI * 2,
    hasRings: true,
    ringColor: 'rgba(126, 200, 227, 0.2)',
    ringInnerRadius: 34,
    ringOuterRadius: 44,
    surfaceGradient: ['#4A90A8', '#5BA8C8', '#7EC8E3'],
    surfaceFeatures: 'ice_clouds',
    canLand: true
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    tagline: 'The Windiest World',
    orbit: 'Orbits the Sun in 164.8 Earth years.',
    rotation: '16 hours, 6 minutes.',
    composition: {
      'Hydrogen': 80,
      'Helium': 19,
      'Methane': 1.5
    },
    atmosphere: '80% Hydrogen, 19% Helium, 1.5% Methane (→ intense azure blue). Deep mantle: superheated, high-pressure fluid water, ammonia, and methane ices over an Earth-sized iron/silicate core.',
    moons: [
      {
        name: 'Triton',
        orbit: 'Orbits Neptune in 5.88 days (retrograde orbit — likely a captured Kuiper Belt object).',
        composition: 'Nitrogen ice crust, water-ice mantle, large rocky/metallic core, thin nitrogen atmosphere with active nitrogen cryogeysers.'
      },
      {
        name: 'Proteus',
        orbit: 'Orbits Neptune in 1.12 days.',
        composition: 'Irregular, dark silicate/carbonaceous ice body.'
      },
      {
        name: 'Nereid',
        orbit: 'Highly eccentric orbit taking 360 days.',
        composition: 'Icy/rocky body with one of the most eccentric orbits of any known moon.'
      }
    ],
    extraMoons: '16 recognized moons total.',
    facts: [
      'Neptune has the strongest winds in the Solar System — up to 2,100 km/h.',
      'Neptune was the first planet found by mathematical prediction rather than observation.',
      'Triton orbits Neptune backwards (retrograde), suggesting it was captured from the Kuiper Belt.',
      'Neptune\'s Great Dark Spot was a storm system similar to Jupiter\'s Great Red Spot.',
      'Neptune takes 164.8 Earth years to orbit the Sun — it completed its first observed orbit in 2011.'
    ],
    color: '#3A5FCD',
    glowColor: '#2E4DB5',
    surfaceColors: ['#1C3D8C', '#2E4DB5', '#3A5FCD'],
    radius: 26,
    orbitRadius: 1340,
    orbitSpeed: 0.0012,
    orbitAngle: Math.random() * Math.PI * 2,
    surfaceGradient: ['#1C3D8C', '#2E4DB5', '#3A5FCD'],
    surfaceFeatures: 'ice_storms',
    canLand: true
  }
];

/**
 * Get a planet by ID
 */
export function getPlanetById(id) {
  return solarSystem.find(p => p.id === id);
}

/**
 * Get all landable planets (excluding the Sun)
 */
export function getLandablePlanets() {
  return solarSystem.filter(p => p.canLand);
}
