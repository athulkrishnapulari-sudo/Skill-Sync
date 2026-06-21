const counters = document.querySelectorAll('.trustno');
const speed = 1000; // total animation duration in ms

function animateCounter(counter) {
  if (counter.dataset.animated) return;
  counter.dataset.animated = 'true';

  const target = parseFloat(counter.getAttribute('data-target')) || 0;
  const decimals = (target % 1 !== 0) ? 1 : 0;

  const childSpan = counter.querySelector('span');
  let suffix = '';
  if (childSpan) {
    if (!counter.firstChild || counter.firstChild.nodeType !== Node.TEXT_NODE) {
      counter.insertBefore(document.createTextNode('0'), childSpan);
    }
    counter.firstChild.nodeValue = '0';
  } else {
    const txt = counter.innerText.trim();
    const m = txt.match(/[^0-9.]+$/);
    suffix = m ? m[0] : '';
    counter.innerText = '0' + suffix;
  }

  let count = 0;
  const stepMs = 20;
  const steps = Math.max(Math.floor(speed / stepMs), 1);
  const inc = target / steps;

  const update = () => {
    count += inc;
    let display;
    if (count < target) {
      display = decimals ? count.toFixed(decimals) : Math.ceil(count).toString();
    } else {
      display = decimals ? target.toFixed(decimals) : target.toString();
    }

    if (childSpan) {
      counter.firstChild.nodeValue = display;
    } else {
      counter.innerText = display + suffix;
    }

    if (count < target) {
      setTimeout(update, stepMs);
    }
  };

  update();
}

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));

