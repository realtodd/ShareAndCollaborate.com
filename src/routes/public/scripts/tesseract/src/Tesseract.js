const createWorker = require('./createWorker');

//const recognize = async (image, langs, options) => {
//  const worker = await createWorker(options);
//  await worker.loadLanguage(langs);
//  await worker.initialize(langs);
//  return worker.recognize(image)
//    .finally(async () => {
//      await worker.terminate();
//    });
//};

// Todd modified 10-21-2023.
const recognize = async (image, langs, options) => {
    const worker = await createWorker(options);
    await worker.loadLanguage(langs);
    await worker.initialize(langs);

    var x = worker.recognize(image)
        .finally(async () => {
            await worker.terminate();
        });

    var result = {
        results: x,
        ImageUrl: image
    }

    return result;


    //return {
    //    results: worker.recognize(image)
    //        .finally(async () => {
    //            await worker.terminate();
    //        }),
    //    ImageUrl: image
    //};
};

const detect = async (image, options) => {
  const worker = await createWorker(options);
  await worker.loadLanguage('osd');
  await worker.initialize('osd');
  return worker.detect(image)
    .finally(async () => {
      await worker.terminate();
    });
};

module.exports = {
  recognize,
  detect,
};
