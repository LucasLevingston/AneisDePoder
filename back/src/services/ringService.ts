import Ring from '../models/ring';

export const createRingService = async (newRing: {
  name: string;
  power: string;
  bearer: string;
  forgedBy: string;
  image?: string;
}) => {
  return await Ring.create(newRing);
};

export const updateRingService = async (updatedRing: {
  id: number;
  name: string;
  power: string;
  bearer: string;
  image?: string;
}) => {
  await Ring.update(
    {
      name: updatedRing.name,
      power: updatedRing.power,
      bearer: updatedRing.bearer,
      image: updatedRing.image,
    },
    { where: { id: updatedRing.id } }
  );

  return await getRingService(updatedRing.id);
};

export const deleteRingService = async (id: number) => {
  return await Ring.destroy({ where: { id } });
};

export const getRingService = async (id: number) => {
  return await Ring.findOne({ where: { id } });
};

export const getAllRingsService = async () => {
  return await Ring.findAll();
};

export const getAllRingsByBearerId = async (bearerId: string) => {
  return await Ring.findAll({
    where: {
      bearer: bearerId,
    },
  });
};
