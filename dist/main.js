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
const userSelect = document.getElementById('userSelect');
const profileName = document.getElementById('profileName');
const profileHandle = document.getElementById('profileHandle');
const profileWebsite = document.getElementById('profileWebsite');
const profileBio = document.getElementById('profileBio');
const profileLocation = document.getElementById('profileLocation');
const postsContainer = document.getElementById('postsContainer');
const commentsContainer = document.getElementById('commentsContainer');
const commentsHeader = document.getElementById('commentsHeader');
function displayUser(user) {
    profileName.textContent = user.name;
    profileHandle.textContent = `@${user.username}`;
    profileWebsite.textContent = `${user.website}`;
    profileBio.textContent = ` ${user.company.catchPhrase}`;
    profileLocation.textContent = `${user.address.city}`;
}
function displayPosts(posts, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.classList.add('post');
            div.innerHTML = `
            <div>
            <img src="images/profile.png" alt="profile" />
        </div>
        <div>
            <h3> ${user.name}</h3>
            <p> ${post.body}</p>
        </div>
            `;
            div.onclick = () => loadComments(post.id);
            postsContainer.appendChild(div);
        });
    });
}
function showComments(comments, postId) {
    commentsContainer.innerHTML = '';
    commentsHeader.textContent = `post ${postId} comments`;
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('comment');
        div.innerHTML = `${comment.name}${comment.body}`;
        commentsContainer.appendChild(div);
    });
}
function fetchUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return yield res.json();
    });
}
// select users to display in the search container
function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('https://jsonplaceholder.typicode.com/users');
        const users = yield res.json();
        userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    });
}
// display users by id
function loadUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield fetchUser(userId);
        displayUser(user);
    });
}
// display posts
function loadPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = yield res.json();
        yield displayPosts(posts, userId);
    });
}
// comments
function loadComments(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = yield res.json();
        console.log('fetched comments', comments);
        showComments(comments, postId);
    });
}
// init the users and posts
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadUsers();
        yield loadUser(1);
        yield loadPosts(1);
        yield loadComments(1);
    });
}
userSelect.addEventListener('change', (e) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(userSelect.value);
    if (userId) {
        yield loadUser(userId);
        yield loadPosts(userId);
        commentsContainer.innerHTML = '';
    }
}));
init().catch(err => console.error('Error initializing app:', err));
