function parseRouteStack(route) {
    if (route) {
        let routeJson = {};
        routeJson.path = route.path
        routeJson.method = [];
        let set = new Set();
        route.stack.forEach((i) => {set.add(i.method)});
        set.forEach((i) => {routeJson.method.push(i)});
        return routeJson;
    }
    return null;
}

module.exports = {
    parseRouteStack: parseRouteStack
}