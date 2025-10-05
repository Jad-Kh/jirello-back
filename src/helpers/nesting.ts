const prepareNestedList = async(originalData, childData, dataProperty, parentProperty, childListProperty) => {
    await Promise.all(
        childData.map( async(row) => {
            let childRows = originalData.filter(childRow => childRow[parentProperty] === row[dataProperty]);
            if(childRows.length === 0)
                return;
            else
                row[childListProperty] = childRows;
            await prepareNestedList(originalData, row[childListProperty], dataProperty, parentProperty, childListProperty);
        })
    )
};

const prepareNesting = async(originalData, childData, dataProperty, parentProperty, childListProperty) => {
    originalData.forEach(row => row[childListProperty] = []);
    let generatedNestedArray = originalData.filter(row => !row[parentProperty]);
    await prepareNestedList(originalData, generatedNestedArray);
    return generatedNestedArray
};

export {
    prepareNesting
}