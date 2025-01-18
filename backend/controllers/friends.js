import SignupUser from "../models/login.js"; // Adjust the path as necessary

//all users
export const allusers = async (req, res, next) => {
  try {
    const { userid } = req.params;

    // Retrieve all users without email and password fields
    const allUsers = await SignupUser.find({}, { email: 0, password: 0 });
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Retrieve the user making the request to get their friends list
    const userWithFriends = await SignupUser.findById(userid, {
      email: 0,
      password: 0,
    });
    if (!userWithFriends) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    // Ensure friends array exists or default to an empty array
    const alreadyFriends = Array.isArray(userWithFriends.friends)
      ? userWithFriends.friends
      : [];

    // Filter out users who are already friends or the requesting user
    const remainingUsers = allUsers.filter(
      (user) =>
        user._id.toString() !== userid &&
        !alreadyFriends.includes(user._id.toString())
    );

    return res.status(200).json(remainingUsers);
  } catch (error) {
    next(error);
  }
};

// Controller function to get friends of a user
export const getUserFriends = async (req, res) => {
  try {
    const user = await SignupUser.findById(req.params.userId).populate(
      "friends",
      "name bio profileImage"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller function to get friend requests of a user
export const getUserFriendRequests = async (req, res) => {
  try {
    const user = await SignupUser.findById(req.params.userId)
      .populate("friendRequestsReceived", "name email profileImage")
      .populate("friendRequestsSent", "name email profileImage");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      received: user.friendRequestsReceived,
      sent: user.friendRequestsSent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller function to send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    // Find both users
    const user = await SignupUser.findById(userId);
    const targetUser = await SignupUser.findById(targetUserId);

    if (!user || !targetUser)
      return res.status(404).json({ message: "User not found" });

    // Check if request already sent or already friends
    if (
      user.friendRequestsSent.includes(targetUserId) ||
      user.friends.includes(targetUserId)
    ) {
      return res.status(400).json({
        message: "Friend request already sent or you are already friends",
      });
    }

    // Update friend request lists
    user.friendRequestsSent.push(targetUserId);
    targetUser.friendRequestsReceived.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller function to accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, requesterId } = req.params;
    console.log(userId);
    console.log(requesterId);

    // Find both users
    const user = await SignupUser.findById(userId);
    const requester = await SignupUser.findById(requesterId);

    if (!user || !requester)
      return res.status(404).json({ message: "User not found" });

    // Check if there is a friend request
    if (!user.friendRequestsReceived.includes(requesterId)) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Add each other to friends list
    user.friends.push(requesterId);
    requester.friends.push(userId);

    // Remove from friend requests lists
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== requesterId
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller function to decline a friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const { userId, requesterId } = req.params;

    const user = await SignupUser.findById(userId);
    const requester = await SignupUser.findById(requesterId);

    if (!user || !requester)
      return res.status(404).json({ message: "User not found" });

    // Remove from friend requests lists
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== requesterId
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
