const USER = require("../model/User.Model");
const uuid = require("uuid");
const STATUSCODES_MESSAGE = require("../constant");
exports.createUser = async (req, res) => {

  try {
   
    if (validate_User_Input(req)) {
      let user_exist = await USER.findOne({ username: req.body.username });
  
      if (!user_exist) {
        const newuser = new USER({
          id: uuid.v4(),
          username: req.body.username,
          age: req.body.age,
          hobbies: req.body.hobbies,
        });
        
        const data=await newuser.save();
        await res.status(STATUSCODES_MESSAGE.STATUSCODES.NEW_REOCRD_INSERT).json({
          message: STATUSCODES_MESSAGE.STATUSMESSAGES.NEW_RECORD_INSERT,
          date: data,
        });
      } else {
        res.status(STATUSCODES_MESSAGE.STATUSCODES.INVALID_INPUT).json({
          message:
            STATUSCODES_MESSAGE.STATUSMESSAGES.USER_ALREADY_CREATED +
            "WITH USERNAME " +
            req.body.username,
        });
      }
    } else {
      res
        .status(STATUSCODES_MESSAGE.STATUSCODES.INVALID_INPUT)
        .json({ message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_SIGNUP });
    }
  } catch (error) {


    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {

    let users = await USER.find();

    await res.status(STATUSCODES_MESSAGE.STATUSCODES.SUCEESS).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.GET_ALL_USERS,
      allUserData: users,
    });
  } catch (error) {

    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {

    let users = await USER.findOne({ id: req.params.userId });
    if (users) {
      await res.status(STATUSCODES_MESSAGE.STATUSCODES.SUCEESS).json({
        message: STATUSCODES_MESSAGE.STATUSMESSAGES.GET_ALL_USERS,
        allUserData: users,
      });
    } else {
      res
        .status(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND)
        .json({ message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_lOGIN });
    }
  } catch (error) {
    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

exports.upadteUserById = async (req, res) => {
  try {

    let users = await USER.findOne({ id: req.params.userId });
    if (users) {
      await USER.updateOne({ id: req.params.userId }, { $set: req.body });
      let updatedata = await USER.findOne({ id: req.params.userId });
      await res.status(STATUSCODES_MESSAGE.STATUSCODES.SUCEESS).json({
        message: STATUSCODES_MESSAGE.STATUSMESSAGES.USER_UPDATE,
        allUserData: updatedata,
      });
    } else {
      res
        .status(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND)
        .json({ message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_ID });
    }
  } catch (error) {
    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    let users = await USER.findOne({ id: req.params.userId });
  
    if (users) {

      await USER.deleteOne({ id: req.params.userId });
      await res.status(STATUSCODES_MESSAGE.STATUSCODES.DELETE_CODE).json({
        message: STATUSCODES_MESSAGE.STATUSMESSAGES.USER_DATA_DELETED,
      });
    } else {
      res
        .status(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND)
        .json({ message: STATUSCODES_MESSAGE.STATUSMESSAGES.INVALID_lOGIN });
    }
  } catch (error) {
    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

exports.nonHandleRequest = async (req, res) => {
  try {
    res
      .status(STATUSCODES_MESSAGE.STATUSCODES.NOT_FOUND)
      .json({ message: STATUSCODES_MESSAGE.STATUSMESSAGES.NOT_FOUND });
  } catch (error) {
    res.status(STATUSCODES_MESSAGE.STATUSCODES.INTERNAL_SERVER_ERROR).json({
      message: STATUSCODES_MESSAGE.STATUSMESSAGES.INTERNAL_SERVER,
      Error: error,
    });
  }
};

function validate_User_Input(req) {
  try {
    if (req.body.username && req.body.age && req.body.hobbies) {

      if (STATUSCODES_MESSAGE.emailRegex.test(req.body.username)) {

        return true;
      }
;
      return false;
    } else {

      return false;
    }
  } catch (error) {
  
    return false;
  }
}
