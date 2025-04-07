import { gsap } from "gsap";
/**
 * Class representing a Grid Item
 */
class Item {
  // DOM elements
  DOM: {
    el: HTMLElement | null;
    image: HTMLImageElement | null;
  } = {
    // main element (.grid__item)
    el: null,
    // image element (.grid__item-img)
    image: null,
  };

  /**
   * Constructor.
   * @param {Element} DOM_el - main element (.grid__item)
   */
  constructor(DOM_el: HTMLElement) {
    this.DOM.el = DOM_el;
    this.DOM.image = this.DOM.el.querySelector(".grid__item-img");
  }
}

const map = (x: number, a: number, b: number, c: number, d: number) =>
  ((x - a) * (d - c)) / (b - a) + c;
/**
 * Calculates how much (x and y) the element1 needs to move away from element2 for a distance of [spread]px
 * @param {Element} element1
 * @param {Element} element2
 * @param {Number} spread - The maximum distance the element1 could have from element2. This will depend on how far the elements are from each other. The closer they are, the higher the returned values. If the distance equals or is higher than [maxDistance] then the return value will be {0,0}
 * @param {Number} maxDistance - The maximum distance between the two elements for a possible translation to occur
 * @returns {JSON} the x,y translation values
 */
const getTranslationDistance = (
  element1: HTMLElement,
  element2: HTMLElement,
  spread = 80,
  maxDistance = 500
) => {
  const elCenter = {
    x: element1.offsetLeft + element1.offsetWidth / 2,
    y: element1.offsetTop + element1.offsetHeight / 2,
  };
  const elCenter2 = {
    x: element2.offsetLeft + element2.offsetWidth / 2,
    y: element2.offsetTop + element2.offsetHeight / 2,
  };

  spread = Math.max(
    map(getDistance(element1, element2), 0, maxDistance, spread, 0),
    0
  );

  const angle = Math.atan2(
    Math.abs(elCenter2.y - elCenter.y),
    Math.abs(elCenter2.x - elCenter.x)
  );

  let x = Math.abs(Math.cos(angle) * spread);
  let y = Math.abs(Math.sin(angle) * spread);

  return {
    x: elCenter.x < elCenter2.x ? x * -1 : x,
    y: elCenter.y < elCenter2.y ? y * -1 : y,
  };
};

/**
 * Gets the distance between two elements (elemen's center)
 * @param {Element} element1
 * @param {Element} element2
 * @returns {Number} The distance value
 */
const getDistance = (element1: HTMLElement, element2: HTMLElement) => {
  const elCenter = {
    x: element1.offsetLeft + element1.offsetWidth / 2,
    y: element1.offsetTop + element1.offsetHeight / 2,
  };
  const elCenter2 = {
    x: element2.offsetLeft + element2.offsetWidth / 2,
    y: element2.offsetTop + element2.offsetHeight / 2,
  };
  return Math.hypot(elCenter.x - elCenter2.x, elCenter.y - elCenter2.y);
};

/**
 * Class representing a Spread Grid
 */
export class SpreadGrid {
  // DOM elements
  DOM: {
    el: HTMLElement | null;
    image: HTMLImageElement | null;
    items: Element[];
  } = {
    // main element (.grid__item)
    el: null,
    // image element (.grid__item-img)
    image: null,
    items: [],
  };
  // Index of the current expanded item
  expanded = -1;
  // Cached index of previous expanded item
  previousExpanded = -1;
  items: Item[];

  options: {
    duration: number;
    ease: string;
    scale: number;
    skew: number;
    maxRotation: number;
    spread: number;
    maxDistance: number;
  };

  tl: gsap.core.Timeline | null = null;

  /**
   * Constructor.
   * @param {Element} DOM_el - main element (.grid)
   */
  constructor(DOM_el: HTMLElement | Element) {
    this.DOM.el = DOM_el as HTMLElement;
    this.DOM.items = [...this.DOM?.el?.querySelectorAll(".grid__item")];
    this.items = [];
    this.DOM.items.forEach((item) => this.items.push(new Item(item as HTMLElement)));

    // Options passed in data attributes and defaults.
    this.options = {
      duration: Number(this.DOM.el.dataset.duration) || 0.8,
      ease: this.DOM.el.dataset.ease || "power4",
      scale: Number(this.DOM.el.dataset.scale) || 2,
      skew: Number(this.DOM.el.dataset.skew) || 0,
      maxRotation: Number(this.DOM.el.dataset.maxRotation) || 0,
      spread: Number(this.DOM.el.dataset.spread) || 80,
      maxDistance: Number(this.DOM.el.dataset.maxDistance) || 500,
    };
    // this.options.duration = Number(this.DOM.el.dataset.duration) || 0.8;
    // this.options.ease = this.DOM.el.dataset.ease || "power4";
    // this.options.scale = Number(this.DOM.el.dataset.scale) || 2;
    // this.options.skew = Number(this.DOM.el.dataset.skew) || 0;
    // this.options.maxRotation = Number(this.DOM.el.dataset.maxRotation) || 0;
    // this.options.spread = Number(this.DOM.el.dataset.spread) || 80;
    // this.options.maxDistance = Number(this.DOM.el.dataset.maxDistance) || 500;

    this.initEvents();
  }
  /**
   * Initialize events.
   */
  initEvents() {
    for (const item of this.items) {
      item.DOM.el?.addEventListener("click", () => this.expand(item));
    }
  }
  /**
   * Expands clicked item.
   * @param {Item} item - the clicked item.
   */
  expand(item: Item) {
    if (this.tl) {
      this.tl.kill();
    }

    const itemIdx = this.items.indexOf(item);

    this.previousExpanded =
      this.expanded !== -1 && this.expanded !== itemIdx ? this.expanded : -1;
    this.expanded = this.expanded === itemIdx ? -1 : itemIdx;

    this.tl = gsap
      .timeline({
        defaults: {
          duration: this.options.duration,
          ease: this.options.ease,
        },
      })
      .addLabel("start", 0)
      .addLabel("end", this.options.duration)
      .set(
        item.DOM.el,
        {
          zIndex: this.expanded === -1 ? 1 : 999,
        },
        this.expanded === -1 ? "end" : "start"
      );

    if (this.options.skew) {
      this.tl
        .to(
          item.DOM.el,
          {
            duration: this.options.duration * 0.4,
            ease: "sine.in",
            scale: 1 + (this.options.scale - 1) / 2,
            skewX:
              this.expanded === -1 ? -1 * this.options.skew : this.options.skew,
            skewY:
              this.expanded === -1 ? -1 * this.options.skew : this.options.skew,
            x: 0,
            y: 0,
            rotation: 0,
          },
          "start"
        )
        .to(
          item.DOM.el,
          {
            duration: this.options.duration * 0.6,
            ease: "power4",
            scale: this.expanded === -1 ? 1 : this.options.scale,
            skewX: 0,
            skewY: 0,
          },
          `start+=${this.options.duration * 0.4}`
        );
    } else {
      this.tl.to(
        item.DOM.el,
        {
          scale: this.expanded === -1 ? 1 : this.options.scale,
          x: 0,
          y: 0,
          rotation: 0,
        },
        "start"
      );
    }

    // Close previous one
    if (this.previousExpanded !== -1) {
      const prevItem = this.items[this.previousExpanded];
      const delay = 0; //map(getDistance(prevItem.DOM.el, item.DOM.el), 0, 1500, 0, 0.2);

      this.tl
        .set(
          prevItem.DOM.el,
          {
            zIndex: 1,
            delay: delay,
          },
          "start"
        )
        .to(
          prevItem.DOM.el,
          {
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0,
            delay: delay,
          },
          "start"
        );
    }

    // All items except the clicked one
    const filteredArray = this.items.filter((otherItem) => otherItem != item);

    for (let otherItem of filteredArray) {
      const { x, y } =
        this.expanded === -1
          ? { x: 0, y: 0 }
          : getTranslationDistance(
              otherItem.DOM.el!,
              item.DOM.el!,
              this.options.spread,
              this.options.maxDistance
            );
      const delay = 0; //this.expanded === -1 ? 0 : map(getDistance(otherItem.DOM.el, item.DOM.el), 0, 1500, 0, 0.2);

      const zIndex = Math.round(
        map(getDistance(otherItem.DOM.el!, item.DOM.el!), 0, 100000, 998, 1)
      );

      const rotationInterval = this.options.maxRotation
        ? Math.max(
            Math.round(
              map(
                getDistance(otherItem.DOM.el!, item.DOM.el!),
                0,
                500,
                this.options.maxRotation,
                0
              )
            ),
            0
          )
        : 0;

      this.tl
        .set(
          otherItem.DOM.el,
          {
            zIndex: this.expanded === -1 ? 1 : zIndex,
            delay: delay,
          },
          this.expanded === -1 ? "end" : "start"
        )
        .to(
          otherItem.DOM.el,
          {
            x: x,
            y: y,
            rotation:
              this.expanded === -1
                ? 0
                : gsap.utils.random(rotationInterval * -1, rotationInterval),
            delay: delay,
          },
          "start"
        );
    }
  }
}
