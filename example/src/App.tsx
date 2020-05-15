import React from 'react';
import './App.css';

import { useAsync } from 'react-use-async';

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

interface Post {
  id: number;
  title: string;
}

const POSTS = [
  { id: 1, title: 'post_1' },
  { id: 2, title: 'post_2' },
  { id: 3, title: 'post_3' },
  { id: 4, title: 'post_4' },
  { id: 5, title: 'post_5' },
];

const API = {
  getPosts: () => wait(1000).then(() => Promise.resolve(POSTS)),
};

const App = () => {
  const { data: posts, pending, error, onStart, onError, onSuccess, reset } = useAsync<Post[]>({ pending: true });

  const callbacks = [onSuccess, onError] as const;
  const getPosts = () =>
    Promise.resolve()
      .then(onStart)
      .then(API.getPosts)
      .then(...callbacks);
  const refresh = () => API.getPosts().then(...callbacks);

  useWhyDidYouUpdate('App', { posts, error, pending });

  React.useEffect(() => {
    API.getPosts().then(...callbacks);
  }, []);

  return (
    <div className="App">
      <button onClick={getPosts} disabled={pending}>
        Get Posts
      </button>
      <button onClick={refresh} disabled={pending}>
        Refresh
      </button>
      <button onClick={reset}>Reset</button>

      {pending && <div>Loading...</div>}

      {posts && posts.length <= 0 && <div>No Posts</div>}

      {posts &&
        posts.map((post) => (
          <div key={post.id}>
            {post.id}: {post.title}
          </div>
        ))}

      {error && <div>{error.message}</div>}
    </div>
  );
};

export default App;

function useWhyDidYouUpdate(name: string, props: any) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = React.useRef<any>();

  React.useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj: any = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}
