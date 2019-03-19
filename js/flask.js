console.clear();
var tl = new TimelineMax();
tl.staggerTo('.bubbles circle', 3, {
  attr: {
    cy: 40,
    r: 2.5 },

  ease: Power2.easeIn,
  repeat: -1 },
-0.17);