// zip(
//  observables: ...Observable[]
// ): Observable

import { timer, fromEvent, zip, range, interval, throwError, NEVER } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { run } from '../04-utils';


export function zipDemo1() {
  const timerOne = timer(1000, 4000).pipe(take(3));
  const timerTwo = timer(2000, 4000).pipe(take(3));
  const timerThree = timer(3000, 4000).pipe(take(3));

  // requires all three elements
  const stream$ = zip(timerOne, timerTwo, timerThree)
  // map them to objects
  .pipe(map(([timerOne, timerTwo, timerThree]) => ({timerOne, timerTwo, timerThree})));

  // run(stream$);
}

// Error
export function zipDemo2() {
  const timerOne = timer(1000, 4000).pipe(take(3));
  const timerTwo = timer(2000, 4000).pipe(take(3));
  const timerThree = throwError('Error in the input Observable');

  // never ends and never outputs the value
  // const timerThree = NEVER;


  // requires all three elements
  const stream$ = zip(timerOne, timerTwo, timerThree);

  // run(stream$);
}

// get X/Y coordinates of drag start/finish (mouse down/up)
export function zipDemo3() {
  const documentEvent = eventName =>
    fromEvent(document, eventName).pipe(
      map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY }))
    );

  const stream$ = zip(documentEvent('mousedown'), documentEvent('mouseup'));

//   run(stream$);
}

// a stream that produces a range of values with an interval.
export function zipDemo4() {
  const start = 3;
  const count = 5;
  const period = 1500;

  const source$ = range(start, count);
  const period$ = interval(period);

  const stream$ = zip(source$, period$).pipe(map(([val1, val2]) => val1));

//   run(stream$);
}
