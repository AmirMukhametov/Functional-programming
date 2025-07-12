import Api from '../tools/api';
import * as R from 'ramda';

const api = new Api();

const isValidNumber = R.allPass([
  R.pipe(R.length, R.gt(R.__, 2)),
  R.pipe(R.length, R.lt(R.__, 10)),
  R.pipe(parseFloat, R.gt(R.__, 0)),
  R.test(/^[0-9.]+$/),
]);

const round = R.pipe(parseFloat, Math.round);

const toBinary = (number) =>
  api.get('https://api.tech/numbers/base')({
    number,
    from: 10,
    to: 2,
  });

const getAnimal = (id) =>
  api.get(`https://animals.tech/${id}`)();

const processSequence = async ({ value, writeLog, handleSuccess, handleError }) => {
  const log = R.tap(writeLog);

  if (!isValidNumber(value)) {
    return handleError('ValidationError');
  }

  try {
    log(value);

    const rounded = round(value);
    log(rounded);

    const binaryResponse = await toBinary(rounded);
    const binary = binaryResponse.result;
    log(binary);

    const length = binary.length;
    log(length);

    const squared = length ** 2;
    log(squared);

    const mod = squared % 3;
    log(mod);

    const animalResponse = await getAnimal(mod);
    const animal = animalResponse.result;

    handleSuccess(animal);
  } catch (error) {
    handleError(error.message || error);
  }
};

export default processSequence;
