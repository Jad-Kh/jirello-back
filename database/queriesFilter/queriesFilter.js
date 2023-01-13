const applyActiveFilters = (isActive) => {
    let query = {};
    if (isActive != null) {
        query = {
            active: (isActive === 'true') ? true : false,
        }
    }
    return query;
};

const applyCountryCodesFilters = (countryCodes) => {
    let query = {}
    if (countryCodes != null) {
        query = {
            countryCode: {
                $in: countryCodes.split(','),
            }
        }
    }
    return query
}

export {
    applyActiveFilters,
    applyCountryCodesFilters,
};