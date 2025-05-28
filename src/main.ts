interface User {
    id: number;
    name: string;
    username: string;
    website: string;
    company: {
        catchPhrase: string;
    };
    address: {
        city: string;
    };
}

interface Post {
    userId: number;
    id: number;
    body: string;
}

interface Comment {
    postId: number;
    id: number;
    name: string;
    body: string;
}


const userDropdown = document.getElementById('userSelect') as HTMLSelectElement;
const profileName = document.getElementById('profileName')!;
const profileHandle = document.getElementById('profileHandle')!;
const profileWebsite = document.getElementById('profileWebsite')!;
const profileBio = document.getElementById('profileBio')!;
const profileLocation = document.getElementById('profileLocation')!;
const tweetsFeed = document.getElementById('postsContainer')!;
const repliesFeed = document.getElementById('commentsContainer')!;
const commentsHeader = document.getElementById('commentsHeader')!;

function displayUser(user: User) {
    profileName.textContent = user.name;
    profileHandle.textContent = `@${user.username}`;
    profileWebsite.textContent = `${user.website}`;
    profileBio.textContent = `${user.company.catchPhrase}`;
    profileLocation.textContent = `${user.address.city}`;
}

async function displayPosts(posts: Post[], userId: number) {
    const user = await fetchUser(userId);
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
}

function showComments(comments: Comment[], postId: number) {
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

async function fetchUser(userId: number): Promise<User> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return await res.json();
}

async function loadUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users: User[] = await res.json();
    userDropdown.innerHTML = users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
}

async function loadUser(userId: number) {
    const user: User = await fetchUser(userId);
    displayUser(user);
}

async function loadPosts(userId: number) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts: Post[] = await res.json();
    await displayPosts(posts, userId);
}

async function loadComments(postId: number) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const comments: Comment[] = await res.json();
    console.log('fetched comments', comments);
    showComments(comments, postId);
}

async function init() {
    await loadUsers();
    await loadUser(1);
    await loadPosts(1);
    await loadComments(1);
}

userDropdown.addEventListener('change', async () => {
    const userId = Number(userDropdown.value);
    if (userId) {
        await loadUser(userId);
        await loadPosts(userId);
        repliesFeed.innerHTML = '';
        await loadComments(userId);
    }
});

init().catch(err => console.error('Error initializing app:', err));
