// combineLatest(
//  observables: Observable[]
// ): Observable
import { timer, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { run } from '../04-utils';

export function combineLatestDemo1() {
  // timerOne emits first value at 1s, then once every 4s
  const timerOne = timer(1000, 4000).pipe(take(3));

  // timerTwo emits first value at 2s, then once every 4s
  const timerTwo = timer(20000, 4000).pipe(take(3));

  // timerThree emits first value at 3s, then once every 4s
  const timerThree = timer(30000, 4000).pipe(take(3));

  // when one timer emits, emit the latest values from each timer as an array
  // BUT only after each stream emit a value
  // use default projection function () => [a, b, c]
  const stream$ = combineLatest([timerOne, timerTwo, timerThree]);

//   run(stream$);
}


