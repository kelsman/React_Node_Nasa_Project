

const DEFAULT_PAGE_LIMIT = 0;   // providing  0 as default  page limit , mongo returns all documents;

function getPagination(query) {

    const page = Math.abs(query.page) || 1;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}