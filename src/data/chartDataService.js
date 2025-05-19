// src/data/chartDataService.js
import { getPBUsers, generateRandomFilters, getRandomDuration  } from "./pbDataService";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-CA"); // e.g., 2025-05-07
}

export async function fetchRawData() {
  try {
    const rawData = await getPBUsers();
    return rawData.map((entry) => ({
      ...entry,
      date: formatDate(entry.endTime),
      filters: generateRandomFilters(), // Always assign random filters
      duration: entry.duration ?? getRandomDuration(),
    }));
  } catch (error) {
    console.error("Error fetching PocketBase chart data:", error);
    return [];
  }
}

export const getAllUsers = async () => await fetchRawData();

export const getBarChartData = (data) => {
  const interacted = data.filter(
    (d) => d.interacted && d.age && d.gender
  );
  const dates = [...new Set(interacted.map((d) => d.date))].sort();

  const grouped = dates.map((date) => {
    const dayGroup = interacted.filter((entry) => entry.date === date);

    let Over25M = 0,
      Under25M = 0,
      Over25F = 0,
      Under25F = 0;

    dayGroup.forEach((entry) => {
      const age = Number(entry.age);
      const gender = entry.gender?.toLowerCase();
      if (!gender || isNaN(age)) return;

      const isOver25 = age > 25;

      if (gender === "male") {
        if (isOver25) Over25M++;
        else Under25M++;
      } else if (gender === "female") {
        if (isOver25) Over25F++;
        else Under25F++;
      }
    });

    return { day: date, Over25M, Under25M, Over25F, Under25F };
  });

  return grouped;
};

export const getPieChartData = (data) => {
  const interacted = data.filter((d) => d.interacted && d.filters);

  const filterCounts = [1, 2, 3, 4].map((filter) => ({
    name: `Filter ${filter}`,
    value: interacted.filter((entry) => entry.filters.includes(filter)).length,
  }));

  return filterCounts;
};

export const getAreaChartData = (data) => {
  const filtered = data.filter((d) => d.gender && d.age);
  const dates = [...new Set(filtered.map((d) => d.date))].sort();

  const grouped = dates.map((date) => {
    const dayGroup = filtered.filter((entry) => entry.date === date);

    let interacted = 0;
    let notInteracted = 0;

    dayGroup.forEach((entry) => {
      if (entry.interacted) interacted++;
      else notInteracted++;
    });

    return {
      day: date,
      Interacted: interacted,
      NotInteracted: notInteracted,
    };
  });

  return grouped;
};
