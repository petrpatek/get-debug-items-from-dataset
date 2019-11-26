const Apify = require('apify');
const { getSet, persistSet } = require('./tools');

Apify.main(async () => {
    // Get input of the actor (here only for demonstration purposes).
    const { datasetId, setName = 'UNIQUE' } = await Apify.getInput();

    const dataset = await Apify.openDataset(datasetId);

    const messageSet = await getSet(setName);

    Apify.events.on('persistState', async () => {
        await persistSet(setName, messageSet);
    });


    await dataset.forEach(async (item) => {
        if (item['#debug']) {
            const debug = item['#debug'];
            if (debug.errorMessages && debug.errorMessages.length >= 1) {
                debug.errorMessages.forEach(message => messageSet.add(message));
            }
            await Apify.pushData(item['#debug']);
        }
    }, { fields: ['#debug'] });

    console.log(messageSet.size, ' Unique Errors');

    await persistSet(setName, messageSet);

    if (messageSet.size < 30) {
        console.log(messageSet);
    }
});
