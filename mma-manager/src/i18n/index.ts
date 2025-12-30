import { ko } from './ko';

export const t = (key: string): string => {
  return ko[key] ?? key;
};
