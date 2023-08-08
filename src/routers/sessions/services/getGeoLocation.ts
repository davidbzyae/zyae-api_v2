import { ErrorDetail, GeoLocation, NotFoundError } from "@/types";

import geoip from "geoip-lite";

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
