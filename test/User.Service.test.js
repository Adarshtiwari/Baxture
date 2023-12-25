// userController.test.js

const userController = require('../services/User.Service');
const user = require('../model/User.Model');
const STATUSCODES_MESSAGE = require('../constant');

jest.mock('../model/user.model');

describe('createUser', () => {
  test('creates a new user when input is valid and user does not exist', async () => {
  
    const req = {
      body: {
        username: 'testuser@gmail.com',
        age: 25,
        hobbies: ['reading', 'coding'],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne that the user is not present
    user.findOne.mockResolvedValue(null);

    // Mocking user.save successful user creation
    user.prototype.save.mockResolvedValue({
      id: 'someId',
      username: 'testuser@gmail.com',
      age: 25,
      hobbies: ['reading', 'coding'],
    });


    await userController.createUser(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.NEW_REOCRD_INSERT);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.NEW_RECORD_INSERT,
      date: expect.any(Object),
    });
  });

  test('returns status 400 when user already exists', async () => {

    const req = {
      body: {
        username: 'testuser@gmail.com',
        age: 30,
        hobbies: ['traveling', 'photography'],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne that the user already exists
    user.findOne.mockResolvedValue({
      id: 'existingUserId',
      username: 'testuser@gmail.com',
      age: 30,
      hobbies: ['traveling', 'photography'],
    });


    await userController.createUser(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.INVALID_INPUT);
    expect(res.json).toHaveBeenCalledWith({
      message: `${STATUSCODES_MESSAGE.STATUSMESSAGES.USER_ALREADY_CREATED}WITH USERNAME ${req.body.username}`,
    });
  });

});


describe('getAllUsers', () => {
  test('returns all users successfully', async () => {
  
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.find  a successful database query
    const mockUsers = [
      { id: '1', username: 'testuser@gmail.com', age: 25, hobbies: ['reading'] },
      { id: '2', username: 'testuser@gmail.com', age: 30, hobbies: ['coding'] },
    ];
    user.find.mockResolvedValue(mockUsers);


    await userController.getAllUsers(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.SUCEESS);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.GET_ALL_USERS,
      allUserData: mockUsers,
    });
  });

  test('handles internal server error', async () => {
    // Arrange
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.find to simulate an error during the database query
    user.find.mockRejectedValue(new Error('Database error'));

    // Act
    await userController.getAllUsers(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: expect.any(Error),
    });
  });
});


describe('get_User_By_id', () => {
  test('returns user by ID successfully', async () => {

    const req = {
      params: {
        userId: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne a successful database query
    const mockUser = {
      id: '123',
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    user.findOne.mockResolvedValue(mockUser);


    await userController.getUserById(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.SUCEESS);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.GET_ALL_USERS,
      allUserData: mockUser,
    });
  });

  test('handles user not found', async () => {

    const req = {
      params: {
        userId: 'nonexistentId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne  that the user is not found
    user.findOne.mockResolvedValue(null);


    await userController.getUserById(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_lOGIN,
    });
  });

  test('handles internal server error during database query', async () => {

    const req = {
      params: {
        userId: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne error during the database query
    user.findOne.mockRejectedValue(new Error('Database error'));

   
    await userController.getUserById(req, res);

  
    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: expect.any(Error),
    });
  });
});


describe('delete_User_By_id', () => {
  test('deletes user by ID successfully', async () => {

    const req = {
      params: {
        userId: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne  a successful database query
    const mockUser = {
      id: '123',
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    user.findOne.mockResolvedValue(mockUser);

    // Mocking user.deleteOne successful user deletion
    user.deleteOne.mockResolvedValue({ n: 1 }); 


    await userController.deleteUserById(req, res);

  
    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.DELETE_CODE);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.USER_DATA_DELETED,
    });
  });

  test('handles user not found during deletion', async () => {

    const req = {
      params: {
        userId: 'nonexistentId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne that the user is not found
    user.findOne.mockResolvedValue(null);

    
    await userController.deleteUserById(req, res);


    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_lOGIN,
    });
  });

  test('handles internal server error during database query', async () => {

    const req = {
      params: {
        userId: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne error during the database query
    user.findOne.mockRejectedValue(new Error('Database error'));


    await userController.deleteUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: expect.any(Error),
    });
  });

  test('handles internal server error during user deletion', async () => {
 
    const req = {
      params: {
        userId: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking user.findOne  a successful database query
    const mockUser = {
      id: '123',
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };
    user.findOne.mockResolvedValue(mockUser);

    // Mocking user.deleteOne an error during user deletion
    user.deleteOne.mockRejectedValue(new Error('Database error'));

    
    await userController.deleteUserById(req, res);

 
    expect(res.status).toHaveBeenCalledWith(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: expect.any(Error),
    });
  });
});