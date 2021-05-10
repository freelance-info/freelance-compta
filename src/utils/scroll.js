export function scrollToBottom(scrollableSelector) {
  // Scroll to bottom of the div
  const scrollable = document.querySelector(scrollableSelector);
  scrollable.scrollTop = scrollable.scrollHeight;
  window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
}

export function scrollTo(selectorDivScrollable, itemSelector) {
  const item = document.querySelector(itemSelector);
  const scrollable = document.querySelector(selectorDivScrollable);
  scrollable.scrollTop = item.offsetTop;
}
