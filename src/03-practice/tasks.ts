import { delay, switchMap, take, pluck, map, tap, takeLast, first, mapTo, startWith, ignoreElements, endWith, scan, withLatestFrom, mergeMap } from 'rxjs/operators';
import { fromEvent, interval, of, combineLatest, zip, merge, race, timer, forkJoin, iif, from, NEVER, } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { run } from '../04-utils/run';
import { addItem } from '../04-utils/add-item';

// Task 1. concat()
// Пусть есть два потока of(1, 2, 3) и of(4, 5, 6);
// Необходимо объединить эти два потока и получить 1, 2, 3, 4, 5, 6 
// только в том случае, если элемент первого потока четный, 
// иначе получить только элементы первого потока
// Используйте: take, switchMap
(function task1(): void {

    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);

    const result = source1$.pipe(
        first(),
        mergeMap(a => {
            return iif(() => a % 2 === 0, merge(source1$, source2$), source1$)
        })
    )

    // run(stream$);
})();

// Task 2.1 merge()
// Создайте три потока, которые выдают числа: первый - 1,2,3, второй - 4,5,6, третий - 7,8,9
// через случайное время в диапазоне от 2с до 5с. Используйте функцию randomDelay и оператор delay
// Объедините эти потоки используя merge() и получите три элемента потока, которые придут последними
// Используйте: takeLast
(function task21(): void {
    function randomDelay(min: number, max: number) {
        const pause = Math.floor(Math.random() * (max - min)) + min;
        console.log(pause);
        return pause;
    }

    
    const source1$ = of(1, 2, 3).pipe(delay(randomDelay(2000, 5000)));
    const source2$ = of(4, 5, 6).pipe(delay(randomDelay(2000, 5000)));
    const source3$ = of(7, 8, 9).pipe(delay(randomDelay(2000, 5000)));

    const stream$ = merge(source1$, source2$, source3$).pipe(takeLast(3));

    //run(stream$);
})();


// Task 2.2. merge()
// Создайте первый поток, который выдает каждую секунду числа от 1 до 5.
// Создайте второй поток, который выдает каждую секунду числа 100, 103, 106, 109, 112
// Создайте результирующий поток, объединив эти два потока, но второй поток
// должен начать выдавать значения только после того, как появится первое число в первом потоке
// Используйте: map, first, switchMap, take
(function task22(): void {

    const source1$ = interval(2000)
        .pipe(
            map(n => n + 1),
            take(5)
        );

    const source2$ = interval(1000)
        .pipe(
            map(n => 100 + n * 3),
            take(5)
        );

    const stream$ = source1$.pipe(
        take(1),
        switchMap(s => merge(source1$, source2$)
        )
    )

    // const first$ = interval(1000).pipe(
    //     map(i => i + 1),
    //     take(5)
    // )

    // const second$ = interval(1000).pipe(
    //     map(i => i * 3 + 100),
    //     take(5)
    // )

    // const stream$ = merge(first$, first$.pipe(take(1), switchMap(i => second$)))

    // run(stream$);
})();

// Task 3. race()
// Создать поток, который возвращает данные запроса ajax('http://jsonplaceholder.typicode.com/users')
// через 5с. 
// Создать поток, который возвращает поток события клик по кнопке. 
// Преобразовать этот поток к одному элементу - строке 'Request is canceled' 
// Объедините эти потоки используя race.
// Используейте: delay, pluck, mapTo, take
(function task3() { //Ready
    const source1$ = ajax('http://jsonplaceholder.typicode.com/users').pipe(delay(5000));
    const source2$ = fromEvent(document.getElementById("runBtn"), "click").pipe(mapTo("Request is canceled"))
    const stream$ = race(source1$, source2$);

    // run(stream$);
})();

// Task 4. startWith()
// Создайте поток событий клик по кнопке. Каждый клик должен перезапускать поток,
// который выдает числа с периодом в 1с, используя timer.
// Добавьте startWith чтобы запустить выдачу чисел до первого клика на кнопке.
// Используйте: switchMap, fromEvent
(function task4() {

    const source1$ = fromEvent(document.getElementById("runBtn"), "click").pipe(mapTo("click"));
    const source2$ = timer(0, 1000);

    const stream$ = source1$.pipe(
        startWith(""),
        switchMap(i => source2$)
    )

    // run(stream$);
})();


// Task 5. endWith()
// Создайте поток событий клик по кнопке. После третьего клика необходимо добавить 
// в поток 'Finish after 3 clicks' и завершить поток. 
// При этом не нужно выводить в поток события клика. 
// Используйте: take, ignoreElements
(function task5() {
    const source1$ = fromEvent(document.getElementById("runBtn"), "click").pipe(mapTo("click"));

    const stream$ = source1$.pipe(
        take(3),
        ignoreElements(),
        endWith("Finish after 3 clicks")
    )

    // run(stream$);
})();

// Task6. zip(), combinaLatest(), withLatestFrom(), forkJoin()
// 1. 
// Создайте поток nextColor$ событий click по кнопке btnNextColor, используя fromEvent. 
// При каждом клике поток должен выдавать значение из массива colors. 
// После выдачи всех элементов из массива colors поток должен завершиться.
// Создайте поток nextText$ событий click по кнопке btnNextText. При каждом клике поток должен выдавать
// значение из массива text. После выдачи всех элементов из массива colors поток должен завершиться.
// Используйте: scan, map, take. 
// Запустите потоки, используя функцию run. 
// Для первого потока задайте конфиг объект для функции {next: 'Next color: '}
// Для второго потока задайте конфиг объект для функции {next: 'Next text: '}
// Покликайте на кнопки и понаблюдайте за значениями. 
// 2.
// Используйте zip и объедините элементы потоков. 
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 3.
// Используйте combineLatest и объедините элементы потоков. 
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 4.
// Используйте withLatestFrom и объедините элементы потоков.
// withLatestFrom используйте как оператор преобразования потока.
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом.
// 5. 
// Используйте forkJoin и объедините элементы потоков.
// Выводите с помощью оператора tap и функции AdItem текст текущим цветом
// Подпишитесь на поток, используя subscribe без параметров.
// Понаблюдайте за результатом. Сделайте первый поток бесконечным. Понаблюдайте за результатом. 


(function task7() {
    const colors = ['brown', 'red', 'maroon', 'olive', 'blue', 'lime'];
    const text = ['I am the best', 'I know RxJS', 'I love TypeScript', 'JavaScript Guru', 'Angular Lover'];

    //1:
    //1.1:
    const nextColorClick$ = fromEvent(document.getElementById("btnNextColor"), "click");
    const nextColor$ = nextColorClick$.pipe(
        scan((_acc, _curr, i) => colors[i], ""),
        take(colors.length)
    )

    // const colors$ = from(colors);
    // const nextColor$ = zip(nextColorClick$, colors$).pipe(map(([, c]) => c));
    // run(nextColor$, { next: 'Next color: ' });

    //1.2:
    const nextTextClick$ = fromEvent(document.getElementById("btnNextText"), "click");
    const nextText$ = nextTextClick$.pipe(
        scan((_acc, _curr, i) => text[i], ""),
        take(text.length)
    )

    // const text$ = from(text);
    // const nextText$ = zip(nextTextClick$, text$).pipe(map(([, t]) => t));
    run(nextText$, { next: 'Next text: ' });

    //2:
    const zip$ = zip(nextColor$, nextText$)
        .pipe(
            tap(([color, t]) => addItem(t, { color: color }))
        )
    // zip$.subscribe();

    //3:
    const combineLatest$ = combineLatest([nextColor$, nextText$])
        .pipe(tap(([c, t]) => addItem(t, { color: c })));
    // combineLatest$.subscribe();

    //4:
    const withLatestFromText$ = nextColor$.pipe(withLatestFrom(nextText$))
        .pipe(tap(([c, t]) => addItem(t, { color: c })));
    // withLatestFromText$.subscribe();

    //5:
    const forkJoin$ = forkJoin([nextColor$, nextText$])
        .pipe(tap(([c, t]) => addItem(t, { color: c })));
    // forkJoin$.subscribe();

    const infiniteStream$ = nextColor$.pipe(switchMap(() => NEVER));
    const forkJoinInfinite$ = forkJoin([infiniteStream$, nextText$])
        .pipe(tap(([c, t]) => addItem(t, { color: c })));
    // forkJoinInfinite$.subscribe();
})();

(function additionalTasks() {
    //1:
    //Создать поток с таймером 2 секунды. Coздать 2 потока для событий mousedown и mouseup.
    //При срабатывании события mouseup выводить расстояние между событиями mousedown и mouseup
    //либо по истечению таймера выводить последнее измерение.
    //2:
    //При первом старте приложения в случае когда сработал таймер а мышкой ничего не перетаскивали
    //возвращать сообщение "Nothing was dragged.".  

    const timer$ = timer(0, 2000)
    const mouseDown$ = fromEvent(document, "mousedown");
    const mouseUp$ = fromEvent(document, "mouseup");

    const dragDistance$ = zip(mouseDown$, mouseUp$)
        .pipe(
            map(([begin, end]: [MouseEvent, MouseEvent]) => {
                return Math.round(Math.sqrt(Math.pow(end.clientX - begin.clientX, 2) + Math.pow(end.clientY - begin.clientY, 2)));
            }),
            startWith("Nothing was dragged.")
        )

    const stream$ = combineLatest([dragDistance$, timer$]).pipe(map(([d]) => d));
    run(stream$, { next: 'Drag distance: ' });
})();





export function runner() { }

// примеры в картинках
// https://www.digitalocean.com/community/tutorials/rxjs-operators-for-dummies-forkjoin-zip-combinelatest-withlatestfrom