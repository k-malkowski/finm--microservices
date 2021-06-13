const dateMock = new Date('2020-01-02');

export const createUserData = (
  username = 'johndoe',
  email = 'john@doe.com',
  password = 'Qwedcxzas!23',
  firstName = 'John',
  lastName = 'Doe',
) => {
  return {
    username,
    email,
    password,
    firstName,
    lastName,
  };
};

export const createdUserData = (
  uuid = 'mocked',
  username = 'johndoe',
  email = 'john@doe.com',
  password = 'Qwedcxzas!23',
  firstName = 'John',
  lastName = 'Doe',
  createdAt = dateMock,
  updatedAt = dateMock,
) => {
  return {
    uuid,
    username,
    email,
    password,
    firstName,
    lastName,
    createdAt,
    updatedAt,
  };
};
