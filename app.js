// Create Dino Constructor
class Creature {
  constructor(height, weight, diet) {
    this.height = height;
    this.weight = weight;
    this.diet = diet;
  }

  static toFeetAndInches(inches) {
    return {feet: Math.floor(inches / 12), inches: inches % 12};
  }

  /**
   * Convert height object to inches
   * @param height in {feet, inches}
   * @returns height in inches
   */
  static toInches(height) {
    if (!height.feet) height.feet = 0;
    if (!height.inches) height.inches = 0;
    return height.feet * 12 + height.inches;
  }
}

class Dino extends Creature {
  constructor(species, height, weight, diet, where, when, fact) {
    super(height, weight, diet);
    this.species = species;
    this.where = where;
    this.when = when;
    this.fact = fact;
  }

  getWhereFact() {
    return `The ${this.species} lived in ${this.where}.`;
  }

  getWhenFact() {
    return `The ${this.species} lived during ${this.when}.`;
  }


  // Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
  compareHeight(creature) {
    if (creature instanceof Human) {
      const diff = this.height - creature.height;
      if (diff === 0)
        return `The ${this.species} is as tall as ${creature.name}.`
      const comp = diff > 0 ? "taller" : "shorter";
      const diffAbs = Math.abs(diff);
      const {feet, inches} = Creature.toFeetAndInches(diffAbs);
      return `The ${this.species} is ${feet} feet and ${inches} inches ${comp} than ${creature.name}.`;
    }
  }

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
  compareWeight(creature) {
    if (creature instanceof Human) {
      const diff = this.weight - creature.weight;
      if (diff === 0)
        return `The ${this.species} is as heavy as ${creature.name}.`
      const comp = diff > 0 ? "heavier" : "lighter";
      const diffAbs = Math.abs(diff);
      return `The ${this.species} is ${diffAbs} lbs ${comp} than ${creature.name}.`;
    }
  }

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
  compareDiet(creature) {
    if (creature instanceof Human) {
      if (this.diet === creature.diet) {
        return `The ${this.species} and ${creature.name} have the same diet.`;
      } else {
        return `The ${this.species} is ${this.diet} while ${creature.name} is ${creature.diet}.`;
      }
    }
  }

}

class Human extends Creature {
  constructor(name, height, weight, diet) {
    super(height, weight, diet);
    this.name = name;
  }
}

// Create Dino Objects
let creatures = [];
fetch("dino.json")
  .then(response => response.json())
  .then(json => {
    const dinos = json["Dinos"];
    return dinos.map(dino => new Dino(dino.species, dino.height, dino.weight, dino.diet,
      dino.where, dino.when, dino.fact))
  })
  .then(dinos => {
    const grid = document.getElementById('grid');
    for (const dino of dinos) {
      creatures.push(dino);
    }
  });


// Create Human Object
function addHuman() {
  const human =
    // Use IIFE to get human data from form
    (() => {
      const getFormValue = id => document.getElementById(id).value;

      const name = getFormValue('name');
      const height = {
        feet: Number(getFormValue('feet')),
        inches: Number(getFormValue('inches'))
      };
      const weight = getFormValue('weight');
      const diet = getFormValue('diet');
      return new Human(name, Creature.toInches(height), weight, diet);
    })();
  creatures.splice(4, 0, human);
  return human;
}

// Generate Tiles for each Dino in Array
function createTile(creature, human) {
  let tile = document.createElement('div');
  tile.className = 'grid-item';

  let info;

  if (creature instanceof Human) {
    info = {
      title: `${creature.name}`,
      image: `./images/human.png`,
    }
  }

  if (creature instanceof Dino) {
    info = {
      title: `${creature.species}`,
      image: `./images/${creature.species}.png`,
    }

    // p - fact
    let factElement = document.createElement('p');

    // Randomly pick a fact
    let fact;
    let rand = Math.floor(Math.random() * 6);
    switch (rand) {
      case 0:
        fact = creature.fact;
        break;
      case 1:
        fact = creature.getWhereFact();
        break;
      case 2:
        fact = creature.getWhenFact();
        break;
      case 3:
        fact = creature.compareWeight(human);
        break;
      case 4:
        fact = creature.compareHeight(human);
        break;
      case 5:
        fact = creature.compareDiet(human);
        break;
      default:
        fact = "Shouldn't be possible: ERROR";
        break;
    }

    factElement.textContent = creature.species === "Pigeon" ? creature.fact : fact;
    tile.appendChild(factElement);
  }

  // h3 - where, when
  let titleElement = document.createElement('h3');
  titleElement.textContent = info.title;
  tile.appendChild(titleElement);

  // img - image
  let imageElement = document.createElement('img');
  imageElement.src = info.image;
  tile.appendChild(imageElement);

  return tile;
}

// Add tiles to DOM
let prepareGrid = () => {
  const human = addHuman();
  const grid = document.getElementById('grid');
  for (const creature of creatures) {
    grid.appendChild(createTile(creature, human));
  }
}

// Remove form from screen
let removeForm = () => {
  document.getElementById('dino-compare').style.display = "none";
}

// On button click, prepare and display info graphic
let myFunction = () => {
  removeForm();
  prepareGrid();
  document.getElementById('grid').style.display = "flex";
}