export const isFocusable(element): boolean {
    if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }

    if (element.disabled) {
        return false;
    }

    switch (element.nodeName) {
        case 'A':
            return !!element.href && element.ref != 'ignore';
        case 'INPUT':
            return element.type != 'hidden';
          case 'BUTTON':
          case 'SELECT':
          case 'TEXTAREA':
            return true;
        default:
            return false;
            break;
    }
}
