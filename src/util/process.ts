import { Frame } from '../types';

export const processData = (data: Frame[], flat_area: { [key: string]: number }) => {
  let num_stats: { [key: string]: number } = {},
    duration_stats: { [key: string]: number } = {};

  data.map(category => {
    if (!category.name) return;

    if (category.name.startsWith('num')) num_stats[category.name.split('num')[1]] = category.fields[0].values.buffer[0];
    else duration_stats[category.name] = category.fields[0].values.buffer[0];
  });

  const final: Array<{ x: string; y: number }> = [];
  Object.keys(num_stats).map(store => {
    if (duration_stats[store] && flat_area[store]) {
      final.push({ x: store, y: num_stats[store] / (duration_stats[store] / 60) / flat_area[store] });
    }
  });

  return final;
};
