import pb from "./pocketbase"; 

export function generateRandomFilters() {
  const all = [1, 2, 3, 4];
  const count = Math.floor(Math.random() * 4) + 1;
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomDuration() {
  const min = 60;
  const max = 300;
  return +(Math.random() * (max - min) + min).toFixed(2);
}

export const getPBUsers = async () => {
  const result = await pb.collection("interactions").getList(1, 500);
  return result.items.map((u) => ({
    id: u.id,
    age: u.age,
    gender: u.gender,
    duration: u.duration ?? getRandomDuration(),
    interacted: u.interacted ?? false,
    handGestures: u.handGestures ?? false,
    endTime: u.endTime,
    filters: (u.filters && u.filters.length > 0) ? u.filters : generateRandomFilters(),
  }));
};
