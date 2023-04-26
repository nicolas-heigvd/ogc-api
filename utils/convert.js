function mod(n, m) {
  return ((n % m) + m) % m;
}

const composeGeopose = (row, config) => {
if (row['geojson']) {
    const coordinate = JSON.parse(row['geojson']).coordinates
    return {
      "position": {
        "lon": coordinate[0],
        "lat": coordinate[1],
        "h": coordinate[2]
      },
      "angles": {
        "yaw": config.data.is_azimuth ? mod(360 - row[config.data.yaw_field], 360) : row[config.data.yaw_field],
        "pitch": row[config.data.pitch_field],
        "roll": row[config.data.roll_field]
      }
    }
}
return null;
}

module.exports = composeGeopose;
