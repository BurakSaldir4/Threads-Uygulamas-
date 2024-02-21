const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken")

mongoose.connect("mongodb://localhost:27017/threads1")
  .then(() => {
    console.log("MongoDb ile bağlantı kuruldu!");
  })
  .catch((err) => {
    console.log("MongoDb ile bağlantı kurulamadı!");
  });

app.listen(port, () => {
  console.log("Uygulama " + port + " portunda çalıştırıldı!")
})

const User = require("./models/user");
const Post = require("./models/post");
const { log } = require("console");

//kullancıyı kaydetmek için backend kısmı


//sınavv!!!!!
app.post("/register", async (req, res) => {
  console.log("register post");
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already registired" })
    }
    //yeni kullanıcı oluşturma
    const newUser = new User({ name, email, password });
    //doğrulama
    newUser.verificationToken = crypto.randomBytes(20).toString("hex")
    //kullanıcıyı veritabanına kaydetme
    await newUser.save();
    //kullanıcya doğrulama maili gönderme
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    return res.status(200).json({ message: "Registration succesful" })
  } catch (error) {
    console.log("error registering user", error);
    return res.status(500).json({ message: "error registering user" });
  }
})

const sendVerificationEmail = async (email, verificationToken) => {
  //bir nodemailer taşıyıcısı oluştur
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akyelgulsum15@gmail.com",
      pass: "glsmakyel01"
    }
  })
  //e-posta mesajini oluştur
  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`
  }
  try {
    await transporter.sendMail(mailOptions)
  }
  catch (error) {
    console.log("error sending email", error)
  }
}

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalıde token" })
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" })
  }
  catch (error) {
    console.log("error getting token", error)
    res.status(500).json({ message: "Email verification failed" })
  }
})

//sınavvv
app.post("/login", async (req, res) => {//kullanıcı girişi
  try {
    const { email, password } = req.body; //email ve parolayı istek gövdesinden al 
    const user = await User.findOne({ email });//email'e göre kullanıcıyı al 
    if (!user) {//bu email'e ait bir kullanıcı yoksa 
      return res.json({ success: false, message: "Invalid email" })
    }
    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid password" })
    }
    //jwt token oluştur
    const token = jwt.sign({ userId: user._id }, "secretKey")
    return res.json({ success: true, token })

  } catch (error) {
    return res.json({ success: false, message: error.message, status: 500 });
  }
})

//Oturum açmış kullanıcı dışındaki tüm kullanıcılara erişim sağlayan uç nokta
app.get("/user/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    const users = await User.find({ _id: { $ne: loggedInUserId } });

    return res.json({ success: true, status: 200, users });
  } catch (error) {
    console.error("Error:", error);
    return res.json({ success: false, status: 500, message: "Sunucu hatası" });
  }
});

//belirli bir kullanıcıyı takip etmeyi amaçlayın
app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });
    return res.json({ sendStatus: 200 })
  } catch (error) {
    console.log(error);
    return res.json({ message: "error in following a user", status: 500 })
  }
})

//belirli bir kullanıcıyı takip etmeyi bırakmak için 
app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;


  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId }
    })
    return res.json({ status: 200, message: "Unfollowed succesfully" })
  } catch (error) {
    return res.json({ status: 500, message: "Error unfollowing user" })
  }
})
// yeni post oluşturmak için 
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const newPostData = {
      user: userId,
    }
    if (content) {
      newPostData.content = content;
    }
    const newPost = new Post(newPostData);

    await newPost.save();
    return res.json({ status: 200, message: "Post saved succesfully", success: false })
  } catch (error) {
    return res.json({ status: 500, message: "post creation failed", success: true })
  }
})

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.params.userId

    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.json({ status: 404, message: "post not found" });
    }
    updatedPost.user = post.user
    return res.json(updatedPost)
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, message: "an error occurred while liking" })
  }
})

//like butonunu iptal etme
app.put("/posts/:postId/:userId/unlike", async (req, res) => {

  const postId = req.params.postId
  const userId = req.params.userId
  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.json({ status: 404, message: "Post not found" })
    }
    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.json({ status: 500, message: "An error occurred while unliking the post" })
  }
})

//Tüm gönderiyi almak 
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name").sort({ createdAt: -1 })
    return res.json({ posts, status: 200, success: true });
  } catch (error) {
    return res.json({ status: 500, message: "An error occured while getting the posts" })
  }
})