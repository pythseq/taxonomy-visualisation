const removeFocus = node => (node.inPath = node.focused = false);

const setFocusPath = node => (node.inPath = true);

const setFocus = node => {
  node.focused = true;
  node.ancestors().forEach(setFocusPath);
  node.descendants().forEach(setFocusPath);
};

const dispatchFocus = ({ selection, instance, focused: { data } }) => {
  // Emit event for the DOM nodes
  for (const sel of Object.values(selection)) {
    if (!sel) continue;
    const node = sel.node();
    node.dispatchEvent(new CustomEvent('focus', { detail: data }));
  }
  // Emit event from the instance registrations
  for (const listeners of instance._listenersPerType.get('focus').values()) {
    listeners(new CustomEvent('focus', { detail: data }));
  }
};

export default (global, node) => {
  if (!node) return;
  global.all.forEach(removeFocus);
  setFocus(node);
  global.focused = node;
  dispatchFocus(global);
};
