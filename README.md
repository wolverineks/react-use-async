# React Use Async

## A simple hook to encapsulate async related state

---

## Installation

### npm

`npm install --save react-use-async`

### yarn

`yarn add react-use-async`

---

### Examples

#### Manual Async Execution

```js
const Posts = ({ userId }) => {
  const { onStart, onSuccess, onError, pending, error, data: posts } = useAsync()

  const getPosts = () => {
    onStart()
    PostService.getPosts(userId)
      .then(onSuccess)
      .catch(onError)
  }

  return (
    <div>
      {!posts && (
        <div>
          <button onClick={getPosts} disabled={pending}>
            {pending ? 'Loading' : error ? 'Try again' : 'Get Posts'}
          </button>
        </div>
      )}

      {pending && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      <div>Posts</div>
      {posts && (
        <div>
          {posts.map(post => (
            <div>{post.content}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

#### Automatic Async Execution

```js
const Posts = ({ userId }) => {
  const { onStart, onSuccess, onError, pending, error, data: posts } = useAsync()

  const getPosts = () => {
    onStart()
    PostService.getPosts(userId)
      .then(onSuccess)
      .catch(onError)
  }

  useEffect(() => {
    getPosts()
  }, [userId])

  return (
    <div>
      {pending && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      <div>Posts</div>
      {posts && (
        <div>
          {posts.map(post => (
            <div>{post.content}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

#### Collections

```js
const Posts = ({ postIds }) => {
  return (
    <div>
      <div>Posts</div>
      {postIds.map(id => () => <Post id={id} key={id} />)}
    </div>
  )
}

const Post = ({ id }) => {
  const { onStart, onSuccess, onError, pending, error, data: post } = useAsync()

  const getPost = postId => {
    onStart()
    PostService.getPost(postId)
      .then(onSuccess)
      .catch(onError)
  }

  useEffect(() => {
    getPost(id)
  }, [])

  return (
    <div>
      {post && post.content}
      {pending && 'Loading...'}
      {error && error.message}
    </div>
  )
}
```

---

#### Maybes

```js
const Post = ({ id }: { id: ?string }) => {
  const { onStart, onSuccess, onError, pending, error, data: post } = useAsync()

  const getPost = postId => {
    if (!postId) return
    onStart()
    PostService.getPost(postId)
      .then(onSuccess)
      .catch(onError)
  }

  useEffect(() => {
    if (!id) return
    getPost(id)
  }, [id])

  return (
    <div>
      {post && post.content}
      {pending && 'Loading...'}
      {error && error.message}
    </div>
  )
}
```

#### Custom Hook

```js
const useGetPost = () => {
  const { onStart, onSuccess, onError, pending, data: post } = useAsync()

  const getPost = postId => {
    onStart()
    return PostService.getPost(postId)
      .then(onSuccess)
      .catch(onError)
  }

  return { getPost, pending, error, post }
}

const Post = ({ id }) => {
  const { getPost, pending, error, post } = useGetPost()

  useEffect(() => getPost(id), [id])

  return (
    <div>
      {post && post.content}
      {pending && 'Loading...'}
      {error && error.message}
    </div>
  )
}
```
