export const testMonitor = {
  name: 'Test Monitor',
  type: 'metric alert',
  query: 'avg(last_5m):avg:system.cpu.user{*} > 90',
  message: 'CPU usage is too high.',
};

export const testDashboard = {
  title: 'Test Dashboard',
  description: 'Automated test dashboard',
  layout_type: 'ordered',
};

export const credentials = {
  username: process.env.DD_USERNAME || 'admin@totalplay.com',
  password: process.env.DD_PASSWORD || 'AdminPassword123!',
};
