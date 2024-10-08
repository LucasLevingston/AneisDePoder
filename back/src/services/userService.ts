import { where } from 'sequelize';
import { comparePassword, generateToken, hashPassword } from '../utils/authUtils';
import { FastifyError } from 'fastify';
import User from '../models/user';
import { ClientError } from '../errors/client-error';

export const createUserService = async (newUser: {
  username: string;
  password: string;
  email: string;
  class: string;
}): Promise<{ id: string; username: string; email: string; class?: string }> => {
  try {
    const hashedPassword = await hashPassword(newUser.password);
    const result = await User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      class: newUser.class,
    });

    if (!result) {
      throw new ClientError('Error on create user');
    }
    const data = {
      id: result.id,
      username: result.username,
      email: result.email,
      class: result.class,
    };
    return data;
  } catch (error) {
    throw new ClientError('Error creating user');
  }
};

export const loginUserService = async (loginData: {
  email: string;
  password: string;
}): Promise<{
  user: { email: string; id: string; username: string };
  token: string;
} | null> => {
  const user = await getByEmail(loginData.email);

  if (!user) {
    throw new ClientError('User not found');
  }

  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new ClientError('Invalid password');
  }

  const token = generateToken(user.id);
  const loggedUser = {
    user: {
      email: user.email,
      username: user.username,
      id: user.id,
      class: user.class,
    },
    token,
  };

  return loggedUser;
};

export const getByUsername = async (username: string) => {
  return User.findOne({
    where: { username },
  });
};

export const getByEmail = async (email: string) => {
  return await User.findOne({
    where: { email },
  });
};

export const getById = async (id: string) => {
  return await User.findOne({ where: { id } });
};

export const deleteUserService = async (id: string) => {
  return await User.destroy({ where: { id } });
};

export const getUserService = async (id: string) => {
  const data = await getById(id);

  return {
    email: data?.email,
    username: data?.username,
    class: data?.class,
    id: data?.id,
  };
};
