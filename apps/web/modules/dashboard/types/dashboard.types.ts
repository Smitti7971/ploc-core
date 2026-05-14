/**
 * Dashboard Module Types
 */

export interface DashboardSlide {
  id: string;
  title: string;
  color: string;
}

export interface LabMetric {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  span?: number;
}
