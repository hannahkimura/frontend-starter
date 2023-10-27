import { ObjectId } from "mongodb";
import { Friend, Post, SkillScore, User, WebSession } from "./app";
import { PostDoc } from "./concepts/post";
import { UserDoc, UserPrefDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { Router, getExpressRouter } from "./framework/router";

import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    const _users = await User.getUsers();
    const _userprof = await User.allProfiles();
    return { users: _users, _userprof: _userprof };
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/users/profile/:profile") async getProfile(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const username = await User.idsToUsernames([user]);
    const newUsername: string = username[0];
    return await User.getUserProfileByUsername(newUsername);
  }

  @Router.get("/users/profileUnique/:username") async getUniqueProfile(username: string) {
    console.log(username);
    return await User.getUserProfileByUsername(username);
  }

  @Router.post("/users")
  async createUser(
    session: WebSessionDoc,
    username: string,
    password: string,
    gender: string,
    sports: Array<string>,
    skill: number,
    location: string,
    genderPref: string,
    sportsPref: Array<string>,
    skillPref: Array<number>,
    locationRange: number,
    goal: string,
    phoneNum: string,
  ) {
    WebSession.isLoggedOut(session);
    const finished = await User.create(username, password, gender, sports, skill, location, genderPref, sportsPref, skillPref, locationRange, goal, phoneNum);
    const userId = finished.user?._id;
    if (userId) {
      await SkillScore.createScore(userId, 1);
    }
    const profile = await Responses.profile(finished.profile);
    return { user: { username, password }, profile: profile, preferences: await Responses.preferences(finished.preference) };
  }

  @Router.patch("/users/:_id")
  async updatePreferences(session: WebSessionDoc, update: Partial<UserPrefDoc>) {
    const user = WebSession.getUser(session);
    return await User.updatePreferences(user, update);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/users/:_id")
  async getUsersThatMatchPref(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const username = await User.idsToUsernames([user]);
    const newUsername: string = username[0];

    const userPref = await User.getUserPreferencesByUsername(newUsername);

    const genderPref = userPref.genderPref;
    console.log("PREFERENCES", userPref);
    const skillPref = userPref.skillPref;
    //const locationRange = userPref.locationRange;
    const sportPref = userPref.sportsPref;
    console.log("OTHER USERS", await User.filterUsers({ genderPref, skillPref, sportPref }));

    //loop thru users that match gender and then look if their sports have ur sports pref
    //const valid_users = [];
    //filter genderPref
    //for sports I want it to be like if there are multiple sports,
    //a user having any of those sports would match
    // I want to filter for sports but I don't know how because it is an array (also skillPref)
    //return { msg: "Filtered Users!", users: await User.filterUsers({ genderPref, skillPref, sportPref }) };
    // console.log("ACTUAL", await User.filterUsers({ gender: genderPref }));
    let matches = await User.filterUsers({ gender: genderPref });

    // matches.filter(function (user) {
    //   console.log(user.username, newUsername);
    //   if (user.username !== newUsername) {
    //     console.log("HERE", user.username, newUsername);
    //     return user;
    //   }
    // });
    matches = matches.filter((userTest) => userTest.username !== newUsername);
    // console.log("GOT HERE", matches);

    for (const possibleMatch of matches) {
      let sportsMatch = false;
      let skillMatch = false;
      for (const sport of sportPref) {
        if (possibleMatch.sports.includes(sport)) {
          sportsMatch = true;
          break;
        }
      }

      for (let i = skillPref[0]; i < skillPref[1] + 1; i++) {
        if (i == possibleMatch.skill) {
          skillMatch = true;
        }
      }

      if (!sportsMatch || !skillMatch) {
        //get rid of this user
        matches = matches.filter((userTest) => userTest.username !== possibleMatch.username);
      }
      const userIdMatch = (await User.getUserByUsername(possibleMatch.username))._id;
      if (await Friend.areFriends(user, userIdMatch)) {
        matches = matches.filter((userTest) => userTest.username !== possibleMatch.username);
      }

      if (await Friend.friendRequestExists(user, userIdMatch)) {
        matches = matches.filter((userTest) => userTest.username !== possibleMatch.username);
      }
    }

    return { msg: "Filtered Users!", users: matches };
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);

    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async gets(session: WebSessionDoc, author?: string) {
    let posts;
    const postsToReturn: Array<PostDoc> = [];
    if (author) {
      const id = (await User.getUserByUsername(author))._id;

      posts = await Post.getByAuthor(id);

      const otherUser = WebSession.getUser(session);
      if (!otherUser) {
        throw new Error("can't find other user");
      }

      const otherId = (await User.getUserById(otherUser))._id;

      if (id.toString() === otherId.toString()) {
        //author is the same as user
        return Responses.posts(posts);
      } else if (await Friend.areFriends(otherId, id)) {
        //this is the case where they are friends
        //show all posts with state of friends
        for (const post of posts) {
          if (post.visibility == "friends" || post.visibility == "public") {
            postsToReturn.push(post);
          }
        }
      } else {
        //users are not friends
        for (const post of posts) {
          if (post.visibility == "public") {
            postsToReturn.push(post);
          }
        }
        //show all posts with state of public
      }
    } else {
      //author doesn't exist
      posts = await Post.getPosts({});
      for (const post of posts) {
        if (post.visibility !== "private") {
          postsToReturn.push(post);
        }
      }
      return Responses.posts(postsToReturn);
      // console.log(posts);
      // console.log(await Responses.posts(postsToReturn));
    }

    return await Responses.posts(postsToReturn);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, result: string, content: string, collaborator?: string, visibility?: string) {
    const user = WebSession.getUser(session);

    const created = await Post.create(result, user, content, collaborator, visibility);
    if (!created.post) {
      throw new Error("post wasn't created");
    }

    //NOTE: when stat is added, expiration is set for that stat
    let won = false;
    if (result === "win") {
      won = true;
    }
    if (collaborator) {
      const updatedCollaborator = await User.getUserByUsername(collaborator);
      const _stat = await SkillScore.createStat(user, result, updatedCollaborator._id); //set expiration for stat
      const new_score = await SkillScore.updateScore(user, won, updatedCollaborator._id);
      console.log("CREATED POST", await Responses.post(created.post));
      return { msg: created.msg, post: await Responses.post(created.post), stat: _stat, UserScore: new_score };
    }
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    //note: in my app, content is stats
    const originalPost = await Post.getPostById(_id);
    await Post.update(_id, update);
    const updatedPost = await Post.getPostById(_id);

    if (originalPost?.result !== updatedPost?.result) {
      const opponent = updatedPost?.collaborator;
      let won;
      if (updatedPost?.result === "win") {
        won = true;
      } else {
        won = false;
      }
      //update users skill score
      if (opponent) {
        const opponentId = (await User.getUserByUsername(opponent))._id;
        await SkillScore.updateScore(user, won, opponentId);
      }
    }

    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    console.log(user, _id);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    console.log("here", to);
    const toId = (await User.getUserByUsername(to))._id;
    console.log("gets here");
    const username = await User.idsToUsernames([user]);
    const newUsername: string = username[0];
    const fromInfo = User.getUserPreferencesByUsername(newUsername);
    await Friend.sendRequest(user, toId);
    return fromInfo;
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    console.log("gets here checking 2", from);
    const fromId = (await User.getUserByUsername(from))._id;
    console.log("gets here checking");
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }
}

export default getExpressRouter(new Routes());
