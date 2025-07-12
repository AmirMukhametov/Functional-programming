import * as R from 'ramda';

const countByColor = color => R.pipe(
  R.values,
  R.filter(R.equals(color)),
  R.length
);

const isColor = R.curry((color, val) => val === color);

const isNotColor = R.curry((color, val) => val !== color);

const shapeColorEquals = R.curry((shape, color, obj) => obj[shape] === color);

// 1. Красная звезда, зеленый квадрат, остальные белые
export const validateFieldN1 = R.allPass([
  shapeColorEquals('star', 'red'),
  shapeColorEquals('square', 'green'),
  shapeColorEquals('circle', 'white'),
  shapeColorEquals('triangle', 'white')
]);

// 2. Как минимум две фигуры зеленые
export const validateFieldN2 = R.pipe(
  R.values,
  R.filter(R.equals('green')),
  R.length,
  R.gte(R.__, 2)
);

// 3. Количество красных фигур равно кол-ву синих
export const validateFieldN3 = R.converge(R.equals, [
  countByColor('red'),
  countByColor('blue')
]);

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = R.allPass([
  shapeColorEquals('circle', 'blue'),
  shapeColorEquals('star', 'red'),
  shapeColorEquals('square', 'orange')
]);

// 5. Три фигуры одного любого цвета кроме белого (4 тоже ок)
export const validateFieldN5 = R.pipe(
  R.values,
  R.countBy(R.identity),
  R.toPairs,
  R.filter(([color]) => color !== 'white'),
  R.map(([_, count]) => count),
  R.any(R.gte(R.__, 3))
);

// 6. Ровно две зелёные (одна из них — треугольник), одна красная, одна любая
export const validateFieldN6 = R.allPass([
  R.pipe(countByColor('green'), R.equals(2)),
  R.pipe(countByColor('red'), R.equals(1)),
  R.propEq('triangle', 'green')
]);

// 7. Все фигуры оранжевые
export const validateFieldN7 = R.pipe(
  R.values,
  R.all(R.equals('orange'))
);

// 8. Не красная и не белая звезда
export const validateFieldN8 = R.pipe(
  R.prop('star'),
  R.allPass([
    R.complement(R.equals('red')),
    R.complement(R.equals('white'))
  ])
);

// 9. Все фигуры зеленые
export const validateFieldN9 = R.pipe(
  R.values,
  R.all(R.equals('green'))
);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({triangle, square}) =>
  triangle === square && triangle !== 'white';
