import pb from "./pocketbase"; 

export const getPBUsers = async () => {
    const result = await pb.collection("interactions").getList(1, 500);
    return result.items.map((u) => ({
      id: u.id,
      age: u.age,
      gender: u.gender,
      duration: u.duration ?? 0,
      interacted: u.interacted ?? false,
      handGestures: u.handGestures ?? false,
      endTime: u.endTime,
      filters: u.filters ?? [], // assuming filters is an array
    }));
  };