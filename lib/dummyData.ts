// Dummy GeoJSON data for La Plata flood zones
export const floodZonesData = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        risk_level: "alta",
        description: "Zona de alto peligro cerca del arroyo",
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
        description: "Zona de peligro medio en área urbana",
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
        description: "Zona de bajo peligro",
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
        description: "Zona de muy bajo a nulo peligro",
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
        description: "Zona de bajo peligro residencial",
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
        description: "Zona de peligro medio en el centro",
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
        description: "Zona de alto peligro residencial",
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
