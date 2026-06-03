module.exports = [
"[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60e821986d145a9f55c9ada9cd51a55dd38f12c041":{"name":"default"}},"app/getHourlyMeteoData.ts",""] */ __turbopack_context__.s([
    "default",
    ()=>getHourlyMeteoData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
function getCardinalDirection(degrees) {
    const cd = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW"
    ];
    return cd[Math.floor((11.25 + degrees) / 22.5) % 16];
}
async function getHourlyMeteoData(latitude, longitude) {
    let pointData;
    let resp;
    if (isNaN(latitude) || isNaN(longitude)) {
        return null;
    }
    console.log(`******* Fetching data for: ${latitude}, ${longitude}`);
    try {
        const astro = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/geo+json"
            }
        });
        if (astro.ok) {
            resp = (await astro.json()).properties;
            pointData = {
                timeZone: resp.timeZone,
                astronomicalData: {
                    sunrise: resp.astronomicalData.sunrise,
                    sunset: resp.astronomicalData.sunset
                },
                relativeLocation: {
                    city: resp.relativeLocation.properties.city,
                    state: resp.relativeLocation.properties.state,
                    distance: resp.relativeLocation.properties.distance.value * 0.000621371,
                    direction: getCardinalDirection(resp.relativeLocation.properties.bearing.value)
                }
            };
            console.log("******* Fetch point response: ", resp.forecastHourly);
        } else {
            throw new Error(`Fetch response: ${astro.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching point data: ", error);
        throw new Error(`Error fetching point data: ${error}`);
    }
    pointData.astronomicalData.sunrise = new Date(pointData.astronomicalData.sunrise).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone: resp.timeZone,
        timeZoneName: "short"
    });
    pointData.astronomicalData.sunset = new Date(pointData.astronomicalData.sunset).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone: resp.timeZone,
        timeZoneName: "short"
    });
    let meteoData;
    let timeofForecast;
    try {
        const meteo = await fetch(resp.forecastHourly, {
            method: "GET",
            headers: {
                "Content-Type": "application/geo+json",
                "Feature-Flags": "forecast_temperature_qv,forecast_wind_speed_qv"
            }
        });
        if (meteo.ok) {
            timeofForecast = new Date(meteo.headers.get("date")).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                timeZone: resp.timeZone,
                timeZoneName: "short"
            });
            resp = (await meteo.json()).properties;
            meteoData = {
                generatedAt: new Date(resp.generatedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: resp.timeZone,
                    timeZoneName: "short"
                }),
                updateTime: new Date(resp.updateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: resp.timeZone,
                    timeZoneName: "short"
                }),
                elevation: resp.elevation.value * 3.28084,
                periods: resp.periods
            };
            console.log(`******* Fetch meteo: {genetatedAt: ${meteoData.generatedAt}, updateTime: ${meteoData.updateTime}, elevation: ${meteoData.elevation}}`);
        } else {
            throw new Error(`Fetch response: ${meteo.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        throw new Error(`Error fetching weather data: ${error}`);
    }
    const s = `getHourlyMeteoData: Forecast for ${pointData.relativeLocation.distance.toFixed(2)} miles ${pointData.relativeLocation.direction} of ${pointData.relativeLocation.city}, ${pointData.relativeLocation.state} at ${timeofForecast}`;
    console.log(s);
    return {
        pointData,
        meteoData
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getHourlyMeteoData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getHourlyMeteoData, "60e821986d145a9f55c9ada9cd51a55dd38f12c041", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$getHourlyMeteoData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60e821986d145a9f55c9ada9cd51a55dd38f12c041",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$getHourlyMeteoData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$getHourlyMeteoData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$getHourlyMeteoData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/getHourlyMeteoData.ts [app-rsc] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
}
}),
];

//# sourceMappingURL=_0sf3kvd._.js.map