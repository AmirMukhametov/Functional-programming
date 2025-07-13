import Api from '../tools/api';
import * as R from 'ramda';

const api = new Api();

const isLengthInRange = R.curry((min, max, str) =>
  R.both(
    R.pipe(R.length, R.gt(R.__, min)),
    R.pipe(R.length, R.lt(R.__, max))
  )(str)
);

const isPositiveNumber = R.pipe(
  parseFloat,
  R.gt(R.__, 0)
);

const matchesPattern = R.curry((pattern, str) => pattern.test(str));

const validate = R.allPass([
  isLengthInRange(2, 10),
  isPositiveNumber,
  matchesPattern(/^\d+\.?\d*$/),
  R.complement(R.pipe(R.toString, R.endsWith('.')))
]);

const roundNumber = R.pipe(
  parseFloat,
  Math.round
);

const logValue = R.curry((writeLog, value) => {
  writeLog(value);
  return value;
});

const toBinary = R.curry((apiInstance, number) =>
  apiInstance.get('https://api.tech/numbers/base')({
    from: 10,
    to: 2,
    number
  })
);

const getAnimal = R.curry((apiInstance, id) =>
  apiInstance.get(`https://animals.tech/${id}`, {})
);

const processApiResult = R.prop('result');

const calculateSequence = log => R.pipe(
  result => {
    const length = result.length;
    log(length);

    const squared = length * length;
    log(squared);

    const mod = squared % 3;
    log(mod);

    return mod;
  }
);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = logValue(writeLog);

  log(value); 

  if (!validate(value)) {
    handleError('ValidationError');
    return;
  }

  return R.pipe(
    roundNumber,
    log, 
    toBinary(api),
    R.andThen(response => {
      const binary = processApiResult(response);
      log(binary); 
      return binary;
    }),
    R.andThen(binary => {
      const length = binary.length;
      log(length); 

      const squared = length ** 2;
      log(squared); 

      const mod = squared % 3;
      log(mod); 

      return mod; 
    }),
    R.andThen(id => getAnimal(api, id)), 
    R.andThen(response => {
      const animal = processApiResult(response);
      log(animal); 
      return animal;
    }),
    R.andThen(handleSuccess),
    R.otherwise(error => handleError(error.message || 'API Error'))
  )(value);
};

export default processSequence;
