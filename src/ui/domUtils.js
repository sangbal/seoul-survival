export function safeText(element, text) {
  if (element && element.textContent !== undefined) {
    element.textContent = text;
  }
}

export function safeHTML(element, html) {
  if (element && element.innerHTML !== undefined) {
    element.innerHTML = html;
  }
}

export function safeClass(element, className, add = true) {
  if (element && element.classList) {
    if (add) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
}


