import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import Ring from '../../models/ring';
import {
  createRingService,
  updateRingService,
  deleteRingService,
  getRingService,
  getAllRingsService,
  getAllRingsByBearerId,
} from '../../services/ringService';
import { ClientError } from '../../errors/client-error';

vi.mock('../../models/ring', () => ({
  __esModule: true,
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    findAll: vi.fn(),
  },
}));

describe('Ring Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a ring', async () => {
    const mockRing = {
      id: 1,
      name: 'Test Ring',
      power: 'Invisibility',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      forgedBy: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      image: undefined,
    };

    (Ring.create as Mock).mockResolvedValue(mockRing);

    const result = await createRingService({
      name: 'Test Ring',
      power: 'Invisibility',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      forgedBy: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
    });

    expect(result).toEqual(mockRing);
    expect(Ring.create).toHaveBeenCalledWith({
      name: 'Test Ring',
      power: 'Invisibility',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      forgedBy: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      image: undefined,
    });
  });

  it('should throw an error when creating a ring fails', async () => {
    (Ring.create as Mock).mockRejectedValue(new ClientError('Database error'));

    await expect(
      createRingService({
        name: 'Test Ring',
        power: 'Invisibility',
        bearer: 'user-uuid',
        forgedBy: 'user-uuid',
      })
    ).rejects.toThrow('Database error');
  });

  it('should update a ring', async () => {
    (Ring.findOne as Mock).mockResolvedValue({
      id: 1,
      name: 'Old Ring',
      power: 'Old Power',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      image: undefined,
    });
    (Ring.update as Mock).mockResolvedValue({
      id: 1,
      name: 'Old Ring',
      power: 'Old Power',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      image: undefined,
    });

    const result = await updateRingService({
      id: 1,
      name: 'New Ring',
      power: 'New Power',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
    });

    expect(result).toEqual({
      id: 1,
      name: 'Old Ring',
      power: 'Old Power',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
      image: undefined,
    });
    expect(Ring.update).toHaveBeenCalledWith(
      {
        name: 'New Ring',
        power: 'New Power',
        bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
        image: undefined,
      },
      { where: { id: 1 } }
    );
  });

  it('should delete a ring', async () => {
    const mockRing = {
      id: 1,
      name: 'Test Ring',
      power: 'Invisibility',
      bearer: '6e6a460b-dd38-4cb5-b93d-103a7239149c',
    };
    (Ring.findOne as Mock).mockResolvedValue(mockRing);
    (Ring.destroy as Mock).mockResolvedValue(1);

    await deleteRingService(1);

    expect(Ring.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return 0 if the ring to delete is not found', async () => {
    (Ring.destroy as Mock).mockResolvedValue(0);

    const result = await deleteRingService(1);

    expect(result).toBe(0);
  });

  it('should get a ring by ID', async () => {
    const mockRing = {
      id: 1,
      name: 'Test Ring',
      power: 'Invisibility',
      bearer: 'user-uuid',
      forgedBy: 'user-uuid',
    };
    (Ring.findOne as Mock).mockResolvedValue(mockRing);

    const result = await getRingService(1);
    expect(result).toEqual(mockRing);
  });

  it('should throw an error when getting a ring fails', async () => {
    (Ring.findOne as Mock).mockRejectedValue(new ClientError('Database error'));

    await expect(getRingService(1)).rejects.toThrow('Database error');
  });

  it('should get all rings', async () => {
    const mockRings = [
      {
        id: 1,
        name: 'Ring 1',
        power: 'Power 1',
        bearer: 'user-uuid',
        forgedBy: 'user-uuid',
      },
      {
        id: 2,
        name: 'Ring 2',
        power: 'Power 2',
        bearer: 'user-uuid',
        forgedBy: 'user-uuid',
      },
    ];

    (Ring.findAll as Mock).mockResolvedValue(mockRings);

    const result = await getAllRingsService();
    expect(result).toEqual(mockRings);
  });

  it('should get all rings by bearer ID', async () => {
    const mockRings = [
      {
        id: 1,
        name: 'Ring 1',
        power: 'Power 1',
        bearer: 'user-uuid',
        forgedBy: 'user-uuid',
      },
      {
        id: 2,
        name: 'Ring 2',
        power: 'Power 2',
        bearer: 'user-uuid',
        forgedBy: 'user-uuid',
      },
    ];

    (Ring.findAll as Mock).mockResolvedValue(mockRings);

    const result = await getAllRingsByBearerId('user-uuid');
    expect(result).toEqual(mockRings);
    expect(Ring.findAll).toHaveBeenCalledWith({
      where: {
        bearer: 'user-uuid',
      },
    });
  });
});
