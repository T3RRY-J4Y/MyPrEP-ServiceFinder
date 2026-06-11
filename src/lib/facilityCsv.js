// Parses facility CSVs in the browser before inserting into Supabase.
// Handles the real Wits RHI export format:
//   name;description;categoryName;serviceType;telephoneNumber;emailAddress;latitude;longitude;fullAddress
// i.e. semicolon-delimited with decimal-comma coordinates like "-30,17988".

import Papa from "papaparse";
import { VALID_SERVICES } from "../data/serviceTaxonomy";

// Accepted header aliases (case/space-insensitive)
const COL = {
  name:    ["name", "facility", "facility name", "clinic", "clinic name", "title"],
  address: ["address", "full address", "fulladdress", "physical address", "street address", "location", "addr"],
  lat:     ["lat", "latitude", "y"],
  lng:     ["lng", "lon", "long", "longitude", "x"],
  phone:   ["phone", "telephone", "telephone number", "telephonenumber", "tel", "contact", "contact number", "cell"],
  email:   ["email", "email address", "emailaddress", "e mail"],
  type:    ["type", "service type", "servicetype", "facility type"],
  area:    ["area", "suburb", "town", "city", "district", "province"],
  services:["services", "service", "tags"],
};

const norm = (s) => String(s || "").trim().toLowerCase().replace(/[\s_-]+/g, " ");

function mapHeaders(headers) {
  const map = {};
  for (const h of headers) {
    const n = norm(h);
    for (const key of Object.keys(COL)) {
      if (COL[key].includes(n) && !(key in map)) map[key] = h;
    }
  }
  return map;
}

/** Coordinate that may use a decimal comma ("-30,17988") or dot. */
function parseCoord(v) {
  let s = String(v ?? "").trim().replace(/\s/g, "");
  if (/^-?\d+,\d+$/.test(s)) s = s.replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * @param {File} file
 * @returns {Promise<{rows: Array, errors: string[]}>}
 */
export function parseFacilityCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      delimiter: "",          // auto-detect: handles ; , and tab
      transformHeader: (h) => h.replace(/^\uFEFF/, ""), // strip BOM
      complete: (result) => {
        const records = result.data;
        if (!records.length) return reject(new Error("The CSV has no data rows."));

        const map = mapHeaders(Object.keys(records[0]));
        const missing = ["name", "lat", "lng"].filter((k) => !(k in map));
        if (missing.length) {
          return reject(new Error(
            `Could not find required column(s): ${missing.join(", ")}. ` +
            `Headers found: ${Object.keys(records[0]).join(", ")}. ` +
            `Required: name, latitude, longitude (address/phone optional).`
          ));
        }

        const rows = [];
        const errors = [];
        records.forEach((r, i) => {
          const lat = parseCoord(r[map.lat]);
          const lng = parseCoord(r[map.lng]);
          const name = String(r[map.name] || "").trim();
          if (!name) { errors.push(`Row ${i + 2}: missing name`); return; }
          if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
              Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) {
            errors.push(`Row ${i + 2}: invalid coordinates "${r[map.lat]}, ${r[map.lng]}"`);
            return;
          }
          // optional per-row services column, e.g. "oral|pep"
          let rowSvcs = [];
          if (map.services && r[map.services]) {
            rowSvcs = String(r[map.services]).split(/[;,|]/)
              .map((s) => norm(s).replace(/\s/g, ""))
              .filter((s) => VALID_SERVICES.has(s));
          }
          rows.push({
            name,
            address: map.address ? String(r[map.address] || "").trim() : "",
            area:    map.area    ? String(r[map.area]    || "").trim() : "",
            phone:   map.phone   ? String(r[map.phone]   || "").trim() : "",
            email:   map.email   ? String(r[map.email]   || "").trim() : "",
            type:    map.type    ? String(r[map.type]    || "").trim() : "",
            lat, lng, rowSvcs,
          });
        });
        resolve({ rows, errors });
      },
      error: (err) => reject(err),
    });
  });
}
