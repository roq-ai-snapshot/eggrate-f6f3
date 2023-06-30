const mapping: Record<string, string> = {
  'egg-rates': 'egg_rate',
  suppliers: 'supplier',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
