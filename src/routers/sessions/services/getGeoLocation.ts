import geoip from "geoip-lite";

import { ErrorDetail, GeoLocation, NotFoundError } from "@/types";

// return geolocation or null here but not in assign const in append client gn
export const getGeoLocation = (
  process: string,
  ip: string
): void | GeoLocation => {
  process = process + ".GetGeoLocation";
  var geo = geoip.lookup(ip);
  if (!geo) return;
  else
    return {
      latitude: geo.ll[0],
      longitude: geo.ll[1],
      city: geo.city,
      country: geo.country,
    };
};
