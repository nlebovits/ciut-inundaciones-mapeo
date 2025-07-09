// Dummy GeoJSON data for La Plata flood zones and buildings
export const floodZonesData = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        risk_level: "alta",
        description: "Zona de alto riesgo cerca del arroyo",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9644, -34.9114],
            [-57.9544, -34.9114],
            [-57.9544, -34.9164],
            [-57.9644, -34.9164],
            [-57.9644, -34.9114],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        risk_level: "media",
        description: "Zona de riesgo medio en área urbana",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9544, -34.9114],
            [-57.9444, -34.9114],
            [-57.9444, -34.9164],
            [-57.9544, -34.9164],
            [-57.9544, -34.9114],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        risk_level: "baja",
        description: "Zona de bajo riesgo",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9444, -34.9114],
            [-57.9344, -34.9114],
            [-57.9344, -34.9164],
            [-57.9444, -34.9164],
            [-57.9444, -34.9114],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        risk_level: "muy_baja",
        description: "Zona de muy bajo a nulo riesgo",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9644, -34.9164],
            [-57.9544, -34.9164],
            [-57.9544, -34.9214],
            [-57.9644, -34.9214],
            [-57.9644, -34.9164],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        risk_level: "baja",
        description: "Zona de bajo riesgo residencial",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9544, -34.9164],
            [-57.9444, -34.9164],
            [-57.9444, -34.9214],
            [-57.9544, -34.9214],
            [-57.9544, -34.9164],
          ],
        ],
      },
    },
    // Additional zones for more coverage
    {
      type: "Feature" as const,
      properties: {
        risk_level: "media",
        description: "Zona de riesgo medio en el centro",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9594, -34.9214],
            [-57.9494, -34.9214],
            [-57.9494, -34.9264],
            [-57.9594, -34.9264],
            [-57.9594, -34.9214],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        risk_level: "alta",
        description: "Zona de alto riesgo residencial",
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9494, -34.9214],
            [-57.9394, -34.9214],
            [-57.9394, -34.9264],
            [-57.9494, -34.9264],
            [-57.9494, -34.9214],
          ],
        ],
      },
    },
  ],
}

export const buildingsData = {
  type: "FeatureCollection" as const,
  features: [
    // Buildings in high-risk zone
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 2,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9624, -34.9124],
            [-57.9614, -34.9124],
            [-57.9614, -34.9134],
            [-57.9624, -34.9134],
            [-57.9624, -34.9124],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 1,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9604, -34.9124],
            [-57.9594, -34.9124],
            [-57.9594, -34.9134],
            [-57.9604, -34.9134],
            [-57.9604, -34.9124],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 2,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9584, -34.9124],
            [-57.9574, -34.9124],
            [-57.9574, -34.9134],
            [-57.9584, -34.9134],
            [-57.9584, -34.9124],
          ],
        ],
      },
    },
    // Buildings in medium-risk zone
    {
      type: "Feature" as const,
      properties: {
        type: "commercial",
        height: 3,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9424, -34.9124],
            [-57.9404, -34.9124],
            [-57.9404, -34.9144],
            [-57.9424, -34.9144],
            [-57.9424, -34.9124],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 2,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9384, -34.9124],
            [-57.9374, -34.9124],
            [-57.9374, -34.9134],
            [-57.9384, -34.9134],
            [-57.9384, -34.9124],
          ],
        ],
      },
    },
    // Buildings in low-risk zone
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 2,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9624, -34.9174],
            [-57.9614, -34.9174],
            [-57.9614, -34.9184],
            [-57.9624, -34.9184],
            [-57.9624, -34.9174],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 1,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9604, -34.9174],
            [-57.9594, -34.9174],
            [-57.9594, -34.9184],
            [-57.9604, -34.9184],
            [-57.9604, -34.9174],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "public",
        height: 4,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9584, -34.9174],
            [-57.9564, -34.9174],
            [-57.9564, -34.9194],
            [-57.9584, -34.9194],
            [-57.9584, -34.9174],
          ],
        ],
      },
    },
    // More buildings scattered across the map
    {
      type: "Feature" as const,
      properties: {
        type: "residential",
        height: 2,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9524, -34.9174],
            [-57.9514, -34.9174],
            [-57.9514, -34.9184],
            [-57.9524, -34.9184],
            [-57.9524, -34.9174],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        type: "commercial",
        height: 3,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-57.9504, -34.9224],
            [-57.9484, -34.9224],
            [-57.9484, -34.9244],
            [-57.9504, -34.9244],
            [-57.9504, -34.9224],
          ],
        ],
      },
    },
  ],
}
