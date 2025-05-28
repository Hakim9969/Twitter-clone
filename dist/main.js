"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userDropdown = document.getElementById('userSelect');
const profileName = document.getElementById('profileName');
const profileHandle = document.getElementById('profileHandle');
const profileWebsite = document.getElementById('profileWebsite');
const profileBio = document.getElementById('profileBio');
const profileLocation = document.getElementById('profileLocation');
const tweetsFeed = document.getElementById('postsContainer');
const repliesFeed = document.getElementById('commentsContainer');
const commentsHeader = document.getElementById('commentsHeader');
function displayUser(user) {
    profileName.textContent = user.name;
    profileHandle.textContent = `@${user.username}`;
    profileWebsite.textContent = `${user.website}`;
    profileBio.textContent = `${user.company.catchPhrase}`;
    profileLocation.textContent = `${user.address.city}`;
}
function displayPosts(posts, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        tweetsFeed.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.classList.add('post');
            div.innerHTML = `
            <div>
                <img src="images/profile.png" alt="profile"/>
            </div>
            <div class="post-header">
                <div class="top">
                    <h3>${user.name}</h3>
                    <span><img src="images/verify.png" alt="verify"/></span>
                    <span><img src="images/twitter.png" alt="twitter"/></span>
                </div>
                <p>${post.body}</p>
                <div class="post-actions">
                    <span><img src="images/message.png" alt="comment" /> 200</span>
                    <span><img src="images/retweet.png" alt="retweet" /> 200</span>
                    <span><img src="images/heart.png" alt="like" /> 200</span>
                </div>
            </div>
        `;
            div.onclick = () => loadComments(post.id);
            tweetsFeed.appendChild(div);
        });
    });
}
function showComments(comments, postId) {
    repliesFeed.innerHTML = '';
    commentsHeader.textContent = `post ${postId} comments`;
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('comment');
        div.innerHTML = `
            <div>
                <img src="images/profile.png" alt="profile"/>
            </div>
            <div class="post-header">
                <div class="top">
                    <h3>${comment.name}</h3>
                </div>
                <p>${comment.body}</p>
                <div class="post-actions">
                    <span><img src="images/message.png" alt="comment" /> 200</span>
                    <span><img src="images/retweet.png" alt="retweet" /> 200</span>
                    <span><img src="images/heart.png" alt="like" /> 200</span>
                </div>
            </div>
        `;
        repliesFeed.appendChild(div);
    });
}
function fetchUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return yield res.json();
    });
}
function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users = yield res.json();
        userDropdown.innerHTML = users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    });
}
function loadUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        displayUser(user);
    });
}
function loadPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = yield res.json();
        yield displayPosts(posts, userId);
    });
}
function loadComments(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = yield res.json();
        console.log('fetched comments', comments);
        showComments(comments, postId);
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadUsers();
        yield loadUser(1);
        yield loadPosts(1);
        yield loadComments(1);
    });
}
userDropdown.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(userDropdown.value);
    if (userId) {
        yield loadUser(userId);
        yield loadPosts(userId);
        repliesFeed.innerHTML = '';
        yield loadComments(userId);
    }
}));
init().catch(err => console.error('Error initializing app:', err));
