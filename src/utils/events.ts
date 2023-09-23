

export function on<T extends Window | Document | HTMLElement | EventTarget>(target:T, ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]) {
  if (target && target.addEventListener) {
    target.addEventListener(...args as Parameters<HTMLElement['addEventListener']>)
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(target: t , ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]) {
  if (target && target.removeEventListener) {
    target.removeEventListener(...args as Parameters<HTMLElement['removeEventListener']>)
  }
}