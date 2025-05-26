interface User {
    id: number;
    name: string;
    username: string;
    website: string;
    company: {
        catchPhrase: string;
    }
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



const userSelect = document.getElementById('userSelect') as HTMLSelectElement;
const profileName = document.getElementById('profileName')!;
const profileHandle = document.getElementById('profileHandle')!;
const profileWebsite = document.getElementById('profileWebsite')!;
const profileBio = document.getElementById('profileBio')!;
const profileLocation = document.getElementById('profileLocation')!;
const postsContainer = document.getElementById('postsContainer')!;
const commentsContainer = document.getElementById('commentsContainer')!;
const commentsHeader = document.getElementById('commentsHeader')!;

function displayUser(user: User) {
    profileName.textContent = user.name;
    profileHandle.textContent = `@${user.username}`;
    profileWebsite.textContent = `${user.website}`;
    profileBio.textContent = ` ${user.company.catchPhrase}`;
    profileLocation.textContent = `${user.address.city}`;
}

async function displayPosts(posts: Post[], userId:number) {
    const user  = await fetchUser(userId);
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
    })
}

function showComments(comments: Comment[], postId: number) {
    commentsContainer.innerHTML = '';
    commentsHeader.textContent = `post ${postId} comments`;
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('comment');
        div.innerHTML =  `${comment.name}${comment.body}`;
        commentsContainer.appendChild(div);
    })
}
async function fetchUser(userId:number):Promise<User> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return  await res.json();

}
// select users to display in the search container
async function loadUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users:User[]  = await res.json();
    userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
}

// display users by id
async function loadUser(userId: number) {
    const user: User = await  fetchUser(userId);
    displayUser(user);
}

// display posts
async function loadPosts(userId: number) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts: Post[] = await res.json();
    await displayPosts(posts, userId);
}

// comments
async function loadComments(postId: number) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const comments: Comment[] = await res.json();
    console.log('fetched comments',comments);
    showComments(comments, postId);
}


// init the users and posts
async function init() {
    await loadUsers();
    await loadUser(1);
    await loadPosts(1);}

userSelect.addEventListener('change', async (e) => {
    const userId = Number(userSelect.value);
    if (userId) {
        await loadUser(userId);
        await loadPosts(userId);
        commentsContainer.innerHTML = '';
    }
});

init().catch(err => console.error('Error initializing app:', err));