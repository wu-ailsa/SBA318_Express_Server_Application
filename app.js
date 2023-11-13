//running the application, caching return as 'app'
const express = require("express")
const app = express()
const port = 3000

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`)
})

// logging middleware 
const logCapture = (req,res,next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

// authentication middleware
const userAuth = (req, res, next) => {
    if (req.user) {
        req.user = { id: req.user.id, username: req.user.username };
    } else {
        req.user = { id: 1, username: 'defaultUsername' };
    }
    next();
};


// error handling middleware
const errorHandler = (err, req,res,next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something went wrong.');
}

app.use(logCapture)
app.use(userAuth)
app.use('/public', express.static('public'))
app.use(errorHandler)

  //-------------------------------------------------//
 //         user, posts, comments data             //
//-----------------------------------------------//
const users = [
    { id: 1, username: 'JazzPanda' },
    { id: 2, username: 'VelvetVoyager' },
    { id: 3, username: 'SynthwaveSurfer' },
    { id: 4, username: 'SwiftSilicon' },
    { id: 5, username: 'CodeHarmony' },
]

const posts = [
    { id: 1, title: 'First Post: Creating RESTful APIs with Express.js: A Beginner\'s Guide ', content: 'In this beginner\'s guide, we\'ll embark on a journey to demystify the process of creating RESTful APIs using the powerful Node.js framework, Express.js. We\'ll start by laying down the foundational concepts of REST architecture and understanding how Express.js facilitates the development of robust and scalable APIs. From setting up your development environment to crafting endpoints that handle various HTTP methods, this guide will provide hands-on examples and practical tips to help you grasp the essentials. By the end, you\'ll have the confidence to kickstart your own RESTful API projects using Express.js, opening the door to seamless communication between your applications.' },
    { id: 2, title: 'Second Post: Mastering Express.js: A Comprehensive Guide for Node.js Developers', content: 'For Node.js developers aiming to elevate their skills, this comprehensive guide dives deep into the intricacies of Express.js, the popular web application framework. We\'ll cover advanced topics, such as routing, middleware, templating engines, and error handling, providing a holistic understanding of Express.js\'s capabilities. From structuring your application for scalability to integrating with databases and third-party APIs, this guide will equip you with the expertise needed to master Express.js. Whether you\'re building APIs, web applications, or real-time systems, this comprehensive guide will empower you to harness the full potential of Express.js for your Node.js projects.' },
    { id: 3, title: "Third Post: Building Scalable APIs with Node.js and Express: Best Practices", content: "Scalability is a critical aspect of any successful API, and in this blog post, we\'ll explore the best practices for building scalable APIs using Node.js and Express. From optimizing route handlers to implementing caching strategies and load balancing, we\'ll delve into techniques that ensure your API can handle increased demand while maintaining performance. Whether you\'re a seasoned developer or just getting started, these best practices will guide you in architecting APIs that can grow seamlessly with the demands of your application and user base." },
    { id: 4, title: 'Fourth Post: Real-time Applications with Node.js and Express: A Step-by-Step Tutorial', content: 'Embark on a hands-on journey to build real-time applications using Node.js and Express with our step-by-step tutorial. We\'ll guide you through the process of setting up a real-time server, handling WebSocket connections, and integrating with client-side frameworks for dynamic updates. By the end of this tutorial, you\'ll have the knowledge to create interactive and responsive real-time applications, opening doors to a new realm of possibilities for engaging user experiences.' },
    { id: 5, title: 'Fifth Post: Deep Dive into Middleware in Express.js: A Practical Guide', content: 'Middleware plays a pivotal role in Express.js, and in this practical guide, we\'ll take a deep dive into its intricacies. From understanding the middleware stack to creating custom middleware functions, you\'ll gain insights into how middleware enhances the functionality and flexibility of your Express.js applications. Practical examples and real-world scenarios will illustrate how to use middleware for tasks such as authentication, logging, and error handling. Whether you\'re a novice or an experienced developer, this guide will sharpen your understanding of middleware and empower you to leverage it effectively in your Express.js projects.' },
]

const comments = [
    { id: 1, postId: 1, userId: 5, text: 'This beginner\'s guide on creating RESTful APIs with Express.js is a lifesaver!  The step-by-step approach really helped me understand the fundamentals. Excited to start building my own APIs now. Kudos to the author!' },
    { id: 2, postId: 1, userId: 4, text: 'Just finished reading \'Mastering Express.js,\' and wow, what a ride!  The depth of coverage on advanced topics like routing and middleware is exactly what I needed. Feeling more confident in my Express.js skills now. Highly recommend!' },
    { id: 3, postId: 1, userId: 3, text: 'As someone who\'s always been curious about scalability, this blog post on building scalable APIs with Node.js and Express is gold! The best practices shared are practical and easy to implement. Can\'t wait to optimize my own APIs now! ' },
    { id: 4, postId: 1, userId: 2, text: 'Trying to add real-time functionality to my apps was always a challenge, but this step-by-step tutorial on real-time applications with Node.js and Express changed the game for me! Clear instructions and great insights. Thank you!' },
    { id: 5, postId: 1, userId: 1, text: 'I\'ve always been a bit intimidated by middleware, but this practical guide on the deep dive into middleware in Express.js made it so much clearer!  The examples and explanations are spot-on. Time to level up my Express.js projects!' },
]

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ejs setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// routes for blogpost view
app.get('/posts/:postId', (req, res, next) => {
    const postId = parseInt(req.params.postId);
    const post = posts.find(post => post.id === postId);
    const postComments = comments.filter(comment => comment.postId === postId);
  
    // error simulation
    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      
      return next(err)
    }
    const loadError = req.query.imageError === 'true';

    res.render('post', { post, comments: postComments, user: req.user,  loadError: loadError });
  })
  