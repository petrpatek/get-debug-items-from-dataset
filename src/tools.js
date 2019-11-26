const Apify = require('apify');

/**
 * Gets set
 * @param setName
 * @return {Promise<Set>}
 */
const getSet = async (setName) => {
    const loadedArray = await Apify.getValue(setName);
    if (loadedArray) return new Set(loadedArray);

    return new Set();
};

/**
 * Persists set in KV store
 * @param setName
 * @param set
 * @return {Promise}
 */
const persistSet = (setName, set) => {
    return Apify.setValue(setName, Array.from(set));
};

module.exports = {
    persistSet,
    getSet,
}
